<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use MongoDB\BSON\UTCDateTime;
use Throwable;

class AnalyticsController extends Controller
{
  private const CATEGORIES = ['Kopi', 'Minuman', 'Makanan', 'Snack', 'Dessert'];
  private const INTERVALS = ['daily', 'weekly', 'monthly'];

  public function summary(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');
      $data = $this->fetchSummaryData($startDate, $endDate);

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'total_omzet' => (int) ($data['total_omzet'] ?? 0),
        'total_transactions' => (int) ($data['total_transactions'] ?? 0),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics summary error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function bestSelling(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
      'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
      'limit.integer' => 'limit harus berupa bilangan bulat',
      'limit.min' => 'limit minimal 1',
      'limit.max' => 'limit maksimal 100',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');
      $limit = $request->filled('limit') ? (int) $request->query('limit') : 5;

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'limit' => $limit,
        'data' => $this->fetchBestSellingData($startDate, $endDate, $limit),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics best-selling error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function lowMargin(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
      'threshold' => ['nullable', 'numeric', 'min:0', 'max:1'],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
      'threshold.numeric' => 'threshold harus berupa angka desimal',
      'threshold.min' => 'threshold minimal 0',
      'threshold.max' => 'threshold maksimal 1',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');
      $threshold = $request->filled('threshold') ? (float) $request->query('threshold') : 0.15;

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'threshold' => $threshold,
        'data' => $this->fetchLowMarginData($startDate, $endDate, $threshold),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics low-margin error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function salesByCategory(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');
      $rows = $this->fetchSalesByCategoryData($startDate, $endDate);

      $totalQty = array_sum(array_map(fn(array $r) => (int) ($r['total_qty'] ?? 0), $rows));
      $totalRevenue = array_sum(array_map(fn(array $r) => (int) ($r['total_revenue'] ?? 0), $rows));

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'data' => $rows,
        'totals' => [
          'total_qty' => $totalQty,
          'total_revenue' => $totalRevenue,
        ],
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics sales-by-category error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function trend(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $allowedCategories = implode(',', self::CATEGORIES);
    $allowedIntervals = implode(',', self::INTERVALS);

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
      'interval' => ['nullable', 'string', 'in:' . $allowedIntervals],
      'product_id' => ['nullable', 'string'],
      'category' => ['nullable', 'string', 'in:' . $allowedCategories],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
      'interval.in' => 'interval harus salah satu dari daily, weekly, monthly',
      'category.in' => 'category harus salah satu dari Kopi, Minuman, Makanan, Snack, Dessert',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');
      $interval = $request->filled('interval') ? (string) $request->query('interval') : 'weekly';
      $productId = $request->filled('product_id') ? (string) $request->query('product_id') : null;
      $category = $request->filled('category') ? (string) $request->query('category') : null;

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'interval' => $interval,
        'filters' => [
          'product_id' => $productId,
          'category' => $category,
        ],
        'data' => $this->fetchTrendData($startDate, $endDate, $interval, $productId, $category),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics trend error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function peakHours(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'start_date' => ['required', 'date_format:Y-m-d'],
      'end_date' => ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'],
    ], [
      'start_date.required' => 'start_date wajib diisi',
      'start_date.date_format' => 'start_date harus berformat YYYY-MM-DD',
      'end_date.required' => 'end_date wajib diisi',
      'end_date.date_format' => 'end_date harus berformat YYYY-MM-DD',
      'end_date.after_or_equal' => 'end_date tidak boleh lebih awal dari start_date',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $startDate = (string) $request->query('start_date');
      $endDate = (string) $request->query('end_date');

      return response()->json([
        'start_date' => $startDate,
        'end_date' => $endDate,
        'data' => $this->fetchPeakHoursData($startDate, $endDate),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics peak-hours error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function compare(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    $validator = Validator::make($request->all(), [
      'period1_start' => ['required', 'date_format:Y-m-d'],
      'period1_end' => ['required', 'date_format:Y-m-d', 'after_or_equal:period1_start'],
      'period2_start' => ['required', 'date_format:Y-m-d'],
      'period2_end' => ['required', 'date_format:Y-m-d', 'after_or_equal:period2_start'],
    ], [
      'period1_start.required' => 'period1_start wajib diisi',
      'period1_start.date_format' => 'period1_start harus berformat YYYY-MM-DD',
      'period1_end.required' => 'period1_end wajib diisi',
      'period1_end.date_format' => 'period1_end harus berformat YYYY-MM-DD',
      'period1_end.after_or_equal' => 'period1_end tidak boleh lebih awal dari period1_start',
      'period2_start.required' => 'period2_start wajib diisi',
      'period2_start.date_format' => 'period2_start harus berformat YYYY-MM-DD',
      'period2_end.required' => 'period2_end wajib diisi',
      'period2_end.date_format' => 'period2_end harus berformat YYYY-MM-DD',
      'period2_end.after_or_equal' => 'period2_end tidak boleh lebih awal dari period2_start',
    ]);

    if ($validator->fails()) {
      return $this->validationErrorResponse($validator);
    }

    try {
      $p1Start = (string) $request->query('period1_start');
      $p1End = (string) $request->query('period1_end');
      $p2Start = (string) $request->query('period2_start');
      $p2End = (string) $request->query('period2_end');

      $p1Metrics = $this->fetchPeriodComparisonMetrics($p1Start, $p1End);
      $p2Metrics = $this->fetchPeriodComparisonMetrics($p2Start, $p2End);

      return response()->json([
        'period1' => [
          'start_date' => $p1Start,
          'end_date' => $p1End,
          'total_omzet' => (int) ($p1Metrics['total_omzet'] ?? 0),
          'total_transactions' => (int) ($p1Metrics['total_transactions'] ?? 0),
          'total_qty' => (int) ($p1Metrics['total_qty'] ?? 0),
        ],
        'period2' => [
          'start_date' => $p2Start,
          'end_date' => $p2End,
          'total_omzet' => (int) ($p2Metrics['total_omzet'] ?? 0),
          'total_transactions' => (int) ($p2Metrics['total_transactions'] ?? 0),
          'total_qty' => (int) ($p2Metrics['total_qty'] ?? 0),
        ],
        'changes' => [
          'omzet_percentage' => $this->calcPercentageChange(
            (float) ($p1Metrics['total_omzet'] ?? 0),
            (float) ($p2Metrics['total_omzet'] ?? 0)
          ),
          'transactions_percentage' => $this->calcPercentageChange(
            (float) ($p1Metrics['total_transactions'] ?? 0),
            (float) ($p2Metrics['total_transactions'] ?? 0)
          ),
          'qty_percentage' => $this->calcPercentageChange(
            (float) ($p1Metrics['total_qty'] ?? 0),
            (float) ($p2Metrics['total_qty'] ?? 0)
          ),
        ],
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics compare error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  public function anomalies(Request $request): JsonResponse
  {
    if ($forbidden = $this->ensureAdminRole($request)) {
      return $forbidden;
    }

    try {
      // Window 4 minggu terakhir (28 hari hingga kemarin agar pekan terbaru lengkap)
      $endCarbon = Carbon::now()->subDay()->endOfDay();
      $startCarbon = (clone $endCarbon)->subDays(27)->startOfDay();

      return response()->json([
        'analysis_window' => [
          'start_date' => $startCarbon->toDateString(),
          'end_date' => $endCarbon->toDateString(),
          'weeks' => 4,
        ],
        'generated_at' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        'data' => $this->fetchAnomaliesData($startCarbon, $endCarbon),
      ], 200);
    } catch (Throwable $e) {
      Log::error('Analytics anomalies error', ['message' => $e->getMessage()]);

      return $this->serverErrorResponse();
    }
  }

  // --- Helper Auth & Error ---

  private function ensureAdminRole(Request $request): ?JsonResponse
  {
    $user = $request->attributes->get('jwt_user') ?? $request->user();
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

  private function serverErrorResponse(): JsonResponse
  {
    return response()->json([
      'success' => false,
      'message' => 'Terjadi kesalahan internal pada server',
    ], 500);
  }

  private function calcPercentageChange(float $previous, float $current): float
  {
    if ($previous == 0.0) {
      return $current > 0.0 ? 100.0 : 0.0;
    }

    return round((($current - $previous) / $previous) * 100, 2);
  }

  protected function dateRangeToUtc(string $startDate, string $endDate): array
  {
    $start = Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay()->utc();
    $end = Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay()->utc();

    return [
      new UTCDateTime($start->getTimestampMs()),
      new UTCDateTime($end->getTimestampMs()),
    ];
  }

  // --- Query Placeholders (Hubungkan ke koleksi transaksi & produk MongoDB kamu) ---

  protected function fetchSummaryData(string $startDate, string $endDate): array
  {
    return [
      'total_omzet' => 0,
      'total_transactions' => 0,
    ];
  }

  protected function fetchBestSellingData(string $startDate, string $endDate, int $limit): array
  {
    return [];
  }

  protected function fetchLowMarginData(string $startDate, string $endDate, float $threshold): array
  {
    return [];
  }

  protected function fetchSalesByCategoryData(string $startDate, string $endDate): array
  {
    return [];
  }

  protected function fetchTrendData(
    string $startDate,
    string $endDate,
    string $interval,
    ?string $productId,
    ?string $category
  ): array {
    return [];
  }

  protected function fetchPeakHoursData(string $startDate, string $endDate): array
  {
    return [];
  }

  protected function fetchPeriodComparisonMetrics(string $startDate, string $endDate): array
  {
    return [
      'total_omzet' => 0,
      'total_transactions' => 0,
      'total_qty' => 0,
    ];
  }

  protected function fetchAnomaliesData(Carbon $startCarbon, Carbon $endCarbon): array
  {
    return [];
  }
}
