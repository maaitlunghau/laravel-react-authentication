<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, $id)
    {
        // check signed URL
        if (!$request->hasValidSignature()) {
            return redirect(
                env('FRONTEND_URL') . '/verification-failed?message=Verification link expired or invalid'
            );
        }

        $user = User::findOrFail($id);

        // check if the hash is valid
        if (!hash_equals(
            sha1($user->getEmailForVerification()),
            (string) $request->hash
        )) {
            return redirect(
                env('FRONTEND_URL') . '/verification-failed?message=Invalid verification link'
            );
        }

        // check if already verified
        if ($user->hasVerifiedEmail()) {
            return redirect(
                env('FRONTEND_URL') . '/verification-failed?message=Email already verified'
            );
        }

        // mark as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));

            // update status to active
            $user->update([
                'status' => 'active'
            ]);
        }

        return redirect(
            env('FRONTEND_URL') . '/verification-success'
        );
    }

    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 409);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification link sent'
        ]);
    }
}
