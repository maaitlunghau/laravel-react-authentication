<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:55',
            'email' => 'required|email|unique:users,email,' . $this->user_id . ',user_id',
            'password' => [
                Password::min(8)
                    ->letters()
                    ->numbers()
                    ->symbols()
            ],
            'status' => 'required|string|in:active,pending',
            'google_id' => 'nullable|string|unique:users,google_id',
            'email_verified_at' => 'nullable|date',
        ];
    }
}
