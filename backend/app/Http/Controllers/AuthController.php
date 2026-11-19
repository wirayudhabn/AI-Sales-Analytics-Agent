<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    // Validasi input sesuai format ErrorResponse di OpenAPI
    $validator = Validator::make($request->all(), [
      'email'    => 'required|email',
      'password' => 'required|string',
    ]);

    if ($validator->fails()) {
      $errors = collect($validator->errors()->messages())->map(function ($messages, $field) {
        return [
          'field'   => $field,
          'message' => $messages[0],
        ];
      })->values();

      return response()->json([
        'success' => false,
        'message' => 'Validasi gagal',
        'errors'  => $errors,
      ], 422);
    }

    // Cari user berdasarkan email
    $user = User::where('email', $request->email)->first();

    // Cek email dan password
    if (!$user || !Hash::check($request->password, $user->password)) {
      return response()->json([
        'success' => false,
        'message' => 'Unauthorized, email atau password salah',
      ], 401);
    }

    // Cek status akun (hanya tolak jika field is_active ada dan bernilai false)
    if ($user->is_active === false) {
      return response()->json([
        'success' => false,
        'message' => 'Akun tidak aktif',
      ], 403);
    }

    // Atur TTL sesuai role di OpenAPI: owner = 86400s (1440m), cashier = 28800s (480m)
    $ttlMinutes = $user->role === 'owner' ? 1440 : 480;
    JWTFactory::setTTL($ttlMinutes);

    // Langsung return string token JWT (custom claims 'role' otomatis diambil dari model User)
    $token = JWTAuth::fromUser($user);

    return response()->json([
      'token'      => $token,
      'token_type' => 'Bearer',
      'expires_in' => $ttlMinutes * 60,
      'user'       => [
        '_id'       => (string) $user->_id,
        'name'      => $user->name,
        'email'     => $user->email,
        'role'      => $user->role,
        'createdAt' => $user->createdAt?->utc()->format('Y-m-d\TH:i:s.v\Z'),
        'updatedAt' => $user->updatedAt?->utc()->format('Y-m-d\TH:i:s.v\Z'),
      ],
    ], 200);
  }

  public function logout()
  {
    try {
      // Memaksa jwt-auth memvalidasi signature, exp, sekaligus mengecek blacklist
      JWTAuth::parseToken()->authenticate();

      // Masukkan token ke blacklist
      JWTAuth::invalidate(JWTAuth::getToken());

      return response()->json([
        'success' => true,
        'message' => 'Logout berhasil',
      ], 200);
    } catch (JWTException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Unauthorized, token tidak valid atau sudah kedaluwarsa',
      ], 401);
    }
  }
}
