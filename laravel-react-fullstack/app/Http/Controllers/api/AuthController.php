<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'status'    => 'pending'
        ]);

        // send email verification notification
        $user->sendEmailVerificationNotification();

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user'    => $user,
            'token'   => $token,
            'message' => 'Please check your email to verify your account'
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credential = $request->validated();

        if (!Auth::attempt($credential)) {
            return response([
                'message' => 'Provided email address or password is incorrect'
            ], 422);
        }

        /** @var User $user */
        $user = Auth::user();

        // check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response([
                'message'        => 'Please verify your email address before logging in',
                'email_verified' => false
            ], 403);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        /** @var PersonalAccessToken $token */
        $token = $user->currentAccessToken();
        $token->delete();

        return response()->noContent();
    }
}
