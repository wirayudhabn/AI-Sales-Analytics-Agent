<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

class JwtMiddleware
{
  public function handle(Request $request, Closure $next): Response
  {
    try {
      // Validasi signature, expiration, blacklist, dan ambil user
      $user = JWTAuth::parseToken()->authenticate();

      if (!$user) {
        return response()->json([
          'success' => false,
          'message' => 'Unauthorized, token tidak valid atau sudah kedaluwarsa',
        ], 401);
      }
    } catch (JWTException $e) {
      return response()->json([
        'success' => false,
        'message' => 'Unauthorized, token tidak valid atau sudah kedaluwarsa',
      ], 401);
    }

    return $next($request);
  }
}
