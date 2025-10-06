<?php

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\EmailVerificationController;
use App\Http\Controllers\api\SocialAuthController;
use App\Http\Controllers\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // users
    Route::apiResource('/users', UserController::class);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// socialite (google)
Route::post('auth/google-login', [SocialAuthController::class, 'loginWithGoogle']);

// email verification & resend
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->name('verification.verify');
Route::middleware('throttle:3,1')->group(function () {
    Route::post('/email/resend', [EmailVerificationController::class, 'resend']);
});


Route::get('/users', [UserController::class, 'index']);
