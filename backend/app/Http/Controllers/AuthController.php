<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTFactory;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $request->validate([
      'email'    => 'required|email',
      'password' => 'required',
    ]);

    // Cari user berdasarkan email
    $user = User::where('email', $request->email)->first();

    // Cek email dan password
    if (!$user || !Hash::check($request->password, $user->password)) {
      return response()->json([
        'success' => false,
        'message' => 'Unauthorized, email atau password salah',
      ], 401);
    }

    // Cek status akun
    if (!$user->is_active) {
      return response()->json([
        'success' => false,
        'message' => 'Akun tidak aktif',
      ], 403);
    }

    // Generate JWT Token
    $token = JWTAuth::fromUser($user);

    return response()->json([
      'token'      => $token,
      'token_type' => 'Bearer',
      'expires_in' => JWTFactory::getTTL() * 60,
      'user'       => [
        '_id'       => (string) $user->_id,
        'name'      => $user->name,
        'email'     => $user->email,
        'role'      => $user->role,
        'createdAt' => $user->createdAt,
        'updatedAt' => $user->updatedAt,
      ],
    ], 200);
  }
}
