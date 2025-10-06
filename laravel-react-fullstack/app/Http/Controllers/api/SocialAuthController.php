<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Google_Client as GoogleClient;

class SocialAuthController extends Controller
{
    public function loginWithGoogle(Request $request)
    {
        $idToken = $request->credential;

        $client = new GoogleClient([
            'client_id' => config('services.google.client_id')
        ]);

        // verify id token
        $payload = $client->verifyIdToken($idToken);

        if (!$payload) {
            return response()->json([
                'message' => 'Invalid Google Token'
            ]);
        }

        $email = $payload['email'];
        $name = $payload['name'];
        $googleId = $payload['sub'];

        if ($payload['email_verified']) {
            $status = 'active';
            $emailVerifiedAt = now();
        } else {
            $status = 'pending';
            $emailVerifiedAt = null;
        }

        // $user = User::updateOrCreate(
        //     ['email' => $email],
        //     [
        //         'google_id' => $googleId,
        //         'name'      => $name,
        //         'status'    => $status,
        //         'email_verified_at' => $emailVerifiedAt,
        //         'password'  => bcrypt(Str::password(32)),
        //     ]
        // );

        $user = User::where('email', $email)->first();

        if ($user) {
            if (!$user->google_id) {
                $user->status = $status;
                $user->google_id = $googleId;
                $user->email_verified_at = $emailVerifiedAt;

                $user->save();
            }
        } else {
            $user = User::create([
                'name'              => $name,
                'email'             => $email,
                'password'          => bcrypt(Str::password(32)),
                'status'            => $status,
                'google_id'         => $googleId,
                'email_verified_at' => $emailVerifiedAt,
            ]);
        }

        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }
}
