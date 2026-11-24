<?php

namespace App\Http\Controllers;

use App\Models\AgentConversation;
use Carbon\Carbon;
use Gemini\Data\Content;
use Gemini\Data\FunctionCall;
use Gemini\Data\FunctionDeclaration;
use Gemini\Data\FunctionResponse;
use Gemini\Data\Part;
use Gemini\Data\Schema;
use Gemini\Data\Tool;
use Gemini\Enums\DataType;
use Gemini\Enums\Role;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use MongoDB\BSON\ObjectId;
use Throwable;

class AgentController extends Controller
{
  private const MODEL_NAME = 'gemini-2.5-flash';
  private const CATEGORIES = ['Kopi', 'Minuman', 'Makanan', 'Snack', 'Dessert'];
  private const INTERVALS = ['daily', 'weekly', 'monthly'];

  /**
   * POST /api/v1/agent/chat
   */
  public function chat(Request $request): JsonResponse
  {
    $user = $request->attributes->get('jwt_user') ?? $request->user();

    if ($forbidden = $this->ensureAdminRole($user)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'message' => ['required', 'string', 'min:1'],
      'session_id' => ['nullable', 'string', 'max:100'],
    ], [
      'message.required' => 'message wajib diisi',
      'message.string' => 'message harus berupa teks',
      'session_id.string' => 'session_id harus berupa string',
      'session_id.max' => 'session_id maksimal 100 karakter',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $userId = (string) ($user['id'] ?? $user['_id'] ?? $user->id ?? '');
      $messageText = trim((string) $request->input('message'));
      $sessionId = $request->filled('session_id')
        ? (string) $request->input('session_id')
        : 'sess-' . Str::lower(Str::random(12));

      $conversation = AgentConversation::firstOrCreate(
        [
          'session_id' => $sessionId,
          'user_id' => $userId,
        ],
        [
          'messages' => [],
        ]
      );

      $existingMessages = is_array($conversation->messages) ? $conversation->messages : [];

      $existingMessages[] = [
        '_id' => (string) new ObjectId(),
        'sender' => 'user',
        'text' => $messageText,
        'function_call' => null,
        'timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
      ];

      $geminiHistory = $this->buildGeminiContents($existingMessages);
      $today = now()->toDateString();

      $model = Gemini::generativeModel(model: self::MODEL_NAME)
        ->withTool($this->buildAnalyticsTool())
        ->withSystemInstruction(
          Content::parse(
            "Kamu adalah asisten AI analitik penjualan untuk pemilik usaha (admin). " .
              "Tanggal hari ini adalah {$today}. " .
              "Jawab pertanyaan seputar omzet, transaksi, produk terlaris, margin produk, kategori, tren, jam sibuk, perbandingan periode, dan anomali penjualan dalam Bahasa Indonesia yang jelas dan ringkas. " .
              "Selalu gunakan function tool yang tersedia bila membutuhkan data penjualan aktual; jangan mengarang angka."
          )
        );

      $response = $model->generateContent(...$geminiHistory);

      $functionCall = $this->extractFunctionCall($response);
      $executedPayload = null;
      $finalReplyText = '';

      if ($functionCall instanceof FunctionCall) {
        $args = is_array($functionCall->args) ? $functionCall->args : [];
        $toolResult = $this->executeAnalyticsFunction($functionCall->name, $args);

        $executedPayload = [
          'name' => $functionCall->name,
          'arguments' => $args,
          'result' => $toolResult,
        ];

        $followUpContents = $this->buildGeminiContents($existingMessages);
        $followUpContents[] = new Content(
          parts: [new Part(functionCall: $functionCall)],
          role: Role::MODEL,
        );
        $followUpContents[] = new Content(
          parts: [
            new Part(
              functionResponse: new FunctionResponse(
                name: $functionCall->name,
                response: $toolResult,
              )
            ),
          ],
          role: Role::USER,
        );

        $secondResponse = $model->generateContent(...$followUpContents);
        $extractedSecondText = $this->extractText($secondResponse);
        $finalReplyText = $extractedSecondText !== ''
          ? $extractedSecondText
          : $this->formatFallbackSummary($functionCall->name, $toolResult);

        $existingMessages[] = [
          '_id' => (string) new ObjectId(),
          'sender' => 'agent',
          'text' => $finalReplyText,
          'function_call' => [
            'name' => $functionCall->name,
            'arguments' => $args,
          ],
          'timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ];
      } else {
        $finalReplyText = $this->extractText($response);

        if ($finalReplyText === '') {
          $finalReplyText = 'Maaf, saya belum dapat menghasilkan jawaban untuk pertanyaan tersebut.';
        }

        $existingMessages[] = [
          '_id' => (string) new ObjectId(),
          'sender' => 'agent',
          'text' => $finalReplyText,
          'function_call' => null,
          'timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ];
      }

      $conversation->messages = $existingMessages;
      $conversation->save();

      return response()->json([
        'reply' => $finalReplyText,
        'session_id' => $sessionId,
        'function_call_executed' => $executedPayload,
      ], 200);
    } catch (Throwable $e) {
      Log::error('Agent chat error', [
        'message' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Terjadi kesalahan internal pada server',
      ], 500);
    }
  }

  /**
   * GET /api/v1/agent/history?session_id=...
   */
  public function history(Request $request): JsonResponse
  {
    $user = $request->attributes->get('jwt_user') ?? $request->user();

    if ($forbidden = $this->ensureAdminRole($user)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'session_id' => ['required', 'string', 'max:100'],
    ], [
      'session_id.required' => 'session_id wajib diisi',
      'session_id.string' => 'session_id harus berupa string',
      'session_id.max' => 'session_id maksimal 100 karakter',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $userId = (string) ($user['id'] ?? $user['_id'] ?? $user->id ?? '');
      $sessionId = (string) $request->query('session_id');

      $conversation = AgentConversation::where('session_id', $sessionId)
        ->where('user_id', $userId)
        ->first();

      if (! $conversation) {
        return response()->json([
          'success' => false,
          'message' => "Sesi percakapan dengan session_id {$sessionId} tidak ditemukan",
        ], 404);
      }

      $messages = collect(is_array($conversation->messages) ? $conversation->messages : [])
        ->map(fn(array $msg) => [
          '_id' => (string) ($msg['_id'] ?? new ObjectId()),
          'sender' => $msg['sender'] ?? 'user',
          'text' => $msg['text'] ?? '',
          'function_call' => $msg['function_call'] ?? null,
          'timestamp' => $msg['timestamp'] ?? now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ])
        ->values()
        ->all();

      return response()->json([
        'session_id' => $conversation->session_id,
        'messages' => $messages,
      ], 200);
    } catch (Throwable $e) {
      Log::error('Agent history error', [
        'message' => $e->getMessage(),
      ]);

      return response()->json([
        'success' => false,
        'message' => 'Terjadi kesalahan internal pada server',
      ], 500);
    }
  }

  /**
   * Pastikan hanya role `admin` yang diizinkan.
   */
  private function ensureAdminRole(mixed $user): ?JsonResponse
  {
    $role = is_array($user)
      ? ($user['role'] ?? null)
      : (is_object($user) ? ($user->role ?? null) : null);

    if ($role !== 'admin') {
      return response()->json([
        'success' => false,
        'message' => 'Forbidden, endpoint ini hanya dapat diakses oleh admin',
      ], 403);
    }

    return null;
  }

  /**
   * Format error validasi agar sesuai skema 422 pada Swagger.
   */
  private function validationErrorResponse($validator): JsonResponse
  {
    $errors = [];

    foreach ($validator->errors()->messages() as $field => $messages) {
      foreach ($messages as $message) {
        $errors[] = [
          'field' => $field,
          'message' => $message,
        ];
      }
    }

    return response()->json([
      'success' => false,
      'message' => 'Validasi gagal',
      'errors' => $errors,
    ], 422);
  }

  /**
   * Susun riwayat percakapan menjadi objek Content untuk Gemini.
   *
   * @param  array<int, array<string, mixed>>  $messages
   * @return array<int, Content>
   */
  private function buildGeminiContents(array $messages): array
  {
    $contents = [];

    foreach ($messages as $msg) {
      $sender = $msg['sender'] ?? 'user';
      $text = (string) ($msg['text'] ?? '');

      if ($text === '') {
        continue;
      }

      $role = $sender === 'user' ? Role::USER : Role::MODEL;
      $contents[] = new Content(
        parts: [new Part(text: $text)],
        role: $role,
      );
    }

    return $contents;
  }

  /**
   * Ambil teks dari seluruh part di candidates[0]->content->parts secara aman.
   */
  private function extractText($response): string
  {
    $texts = [];
    $candidates = $response->candidates ?? [];

    foreach ($candidates as $candidate) {
      $parts = $candidate->content->parts ?? [];

      foreach ($parts as $part) {
        if (isset($part->text) && is_string($part->text) && $part->text !== '') {
          $texts[] = $part->text;
        }
      }
    }

    return trim(implode("\n", $texts));
  }

  /**
   * Deklarasi seluruh fungsi analitik untuk Gemini Function Calling.
   */
  private function buildAnalyticsTool(): Tool
  {
    $dateRangeProperties = [
      'start_date' => new Schema(
        type: DataType::STRING,
        description: 'Tanggal awal periode format YYYY-MM-DD'
      ),
      'end_date' => new Schema(
        type: DataType::STRING,
        description: 'Tanggal akhir periode format YYYY-MM-DD'
      ),
    ];

    $declarations = [
      new FunctionDeclaration(
        name: 'get_sales_summary',
        description: 'Mengambil ringkasan total omzet dan jumlah transaksi pada rentang tanggal.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties,
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'get_best_selling_products',
        description: 'Mengambil daftar produk terlaris berdasarkan jumlah terjual dan pendapatan pada rentang tanggal.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties + [
            'limit' => new Schema(
              type: DataType::INTEGER,
              description: 'Jumlah produk teratas yang dikembalikan (default 5)'
            ),
          ],
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'get_low_margin_products',
        description: 'Mengambil daftar produk dengan margin rendah atau negatif berdasarkan item yang memiliki cost_at_sale.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties + [
            'threshold' => new Schema(
              type: DataType::NUMBER,
              description: 'Ambang batas margin dalam bentuk desimal, contoh 0.15 untuk 15 persen (default 0.15)'
            ),
          ],
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'get_sales_by_category',
        description: 'Mengambil total pendapatan dan kuantitas terjual untuk setiap kategori produk pada rentang tanggal.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties,
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'get_sales_trend',
        description: 'Mengambil tren penjualan berdasarkan interval daily, weekly, atau monthly dengan filter opsional product_id atau category.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties + [
            'interval' => new Schema(
              type: DataType::STRING,
              description: 'Interval agregasi: daily, weekly, atau monthly (default weekly)'
            ),
            'product_id' => new Schema(
              type: DataType::STRING,
              description: 'Filter berdasarkan ID produk (opsional)'
            ),
            'category' => new Schema(
              type: DataType::STRING,
              description: 'Filter kategori: Kopi, Minuman, Makanan, Snack, Dessert (opsional)'
            ),
          ],
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'get_peak_hours',
        description: 'Mengambil distribusi jumlah transaksi dan omzet per jam (00-23) dalam rentang tanggal.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: $dateRangeProperties,
          required: ['start_date', 'end_date']
        )
      ),
      new FunctionDeclaration(
        name: 'compare_periods',
        description: 'Membandingkan omzet, jumlah transaksi, dan kuantitas antara dua periode tanggal beserta persentase perubahannya.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: [
            'period1_start' => new Schema(type: DataType::STRING, description: 'Tanggal awal periode 1 (YYYY-MM-DD)'),
            'period1_end' => new Schema(type: DataType::STRING, description: 'Tanggal akhir periode 1 (YYYY-MM-DD)'),
            'period2_start' => new Schema(type: DataType::STRING, description: 'Tanggal awal periode 2 (YYYY-MM-DD)'),
            'period2_end' => new Schema(type: DataType::STRING, description: 'Tanggal akhir periode 2 (YYYY-MM-DD)'),
          ],
          required: ['period1_start', 'period1_end', 'period2_start', 'period2_end']
        )
      ),
      new FunctionDeclaration(
        name: 'detect_sales_anomalies',
        description: 'Mendeteksi produk dengan penjualan jauh di atas atau di bawah rata-rata 4 minggu terakhir.',
        parameters: new Schema(
          type: DataType::OBJECT,
          properties: [],
        )
      ),
    ];

    return new Tool(functionDeclarations: $declarations);
  }

  /**
   * Eksekusi fungsi analitik sesuai nama fungsi dan argumen dari Gemini.
   *
   * @param  array<string, mixed>  $args
   * @return array<string, mixed>
   */
  private function executeAnalyticsFunction(string $name, array $args): array
  {
    $defaultStart = now()->subDays(7)->toDateString();
    $defaultEnd = now()->toDateString();

    $startDate = $this->normalizeDate($args['start_date'] ?? null, $defaultStart);
    $endDate = $this->normalizeDate($args['end_date'] ?? null, $defaultEnd);

    return match ($name) {
      'get_sales_summary' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'total_omzet' => 0,
        'total_transactions' => 0,
      ],
      'get_best_selling_products' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'limit' => max(1, min(100, (int) ($args['limit'] ?? 5))),
        'data' => [],
      ],
      'get_low_margin_products' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'threshold' => isset($args['threshold']) ? (float) $args['threshold'] : 0.15,
        'data' => [],
      ],
      'get_sales_by_category' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'data' => [],
        'totals' => [
          'total_qty' => 0,
          'total_revenue' => 0,
        ],
      ],
      'get_sales_trend' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'interval' => in_array($args['interval'] ?? 'weekly', self::INTERVALS, true)
          ? (string) $args['interval']
          : 'weekly',
        'filters' => [
          'product_id' => isset($args['product_id']) && $args['product_id'] !== ''
            ? (string) $args['product_id']
            : null,
          'category' => isset($args['category']) && in_array($args['category'], self::CATEGORIES, true)
            ? (string) $args['category']
            : null,
        ],
        'data' => [],
      ],
      'get_peak_hours' => [
        'start_date' => $startDate,
        'end_date' => $endDate,
        'data' => [],
      ],
      'compare_periods' => $this->buildComparisonPayload($args),
      'detect_sales_anomalies' => $this->buildAnomaliesPayload(),
      default => [
        'error' => "Fungsi {$name} tidak dikenal",
      ],
    };
  }

  /**
   * @param  array<string, mixed>  $args
   * @return array<string, mixed>
   */
  private function buildComparisonPayload(array $args): array
  {
    $p1Start = $this->normalizeDate($args['period1_start'] ?? null, now()->subDays(14)->toDateString());
    $p1End = $this->normalizeDate($args['period1_end'] ?? null, now()->subDays(8)->toDateString());
    $p2Start = $this->normalizeDate($args['period2_start'] ?? null, now()->subDays(7)->toDateString());
    $p2End = $this->normalizeDate($args['period2_end'] ?? null, now()->toDateString());

    return [
      'period1' => [
        'start_date' => $p1Start,
        'end_date' => $p1End,
        'total_omzet' => 0,
        'total_transactions' => 0,
        'total_qty' => 0,
      ],
      'period2' => [
        'start_date' => $p2Start,
        'end_date' => $p2End,
        'total_omzet' => 0,
        'total_transactions' => 0,
        'total_qty' => 0,
      ],
      'changes' => [
        'omzet_percentage' => 0.0,
        'transactions_percentage' => 0.0,
        'qty_percentage' => 0.0,
      ],
    ];
  }

  /**
   * @return array<string, mixed>
   */
  private function buildAnomaliesPayload(): array
  {
    $endCarbon = Carbon::now()->subDay()->endOfDay();
    $startCarbon = (clone $endCarbon)->subDays(27)->startOfDay();

    return [
      'analysis_window' => [
        'start_date' => $startCarbon->toDateString(),
        'end_date' => $endCarbon->toDateString(),
        'weeks' => 4,
      ],
      'generated_at' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
      'data' => [],
    ];
  }

  private function normalizeDate(mixed $value, string $fallback): string
  {
    if (! is_string($value) || trim($value) === '') {
      return $fallback;
    }

    try {
      return Carbon::createFromFormat('Y-m-d', trim($value))->toDateString();
    } catch (Throwable) {
      return $fallback;
    }
  }

  /**
   * Fallback ringkasan jika respons kedua Gemini kosong.
   *
   * @param  array<string, mixed>  $data
   */
  private function formatFallbackSummary(string $functionName, array $data): string
  {
    if ($functionName === 'get_sales_summary') {
      $omzet = number_format((float) ($data['total_omzet'] ?? 0), 0, ',', '.');
      $trx = (int) ($data['total_transactions'] ?? 0);

      return "Ringkasan penjualan: total omzet Rp{$omzet} dari {$trx} transaksi.";
    }

    return 'Data analitik berhasil diambil, namun ringkasan teks otomatis tidak tersedia.';
  }

  private function extractFunctionCall($response): ?FunctionCall
  {
    $candidates = $response->candidates ?? [];

    foreach ($candidates as $candidate) {
      $parts = $candidate->content->parts ?? [];

      foreach ($parts as $part) {
        if (($part->functionCall ?? null) instanceof FunctionCall) {
          return $part->functionCall;
        }
      }
    }

    return null;
  }
}
