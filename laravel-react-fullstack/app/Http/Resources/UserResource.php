<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id'           => $this->user_id,
            'name'              => $this->name,
            'email'             => $this->email,
            'password'          => $this->password,
            'status'            => $this->status,
            'google_id'         => $this->google_id,
            'email_verified_at' => $this->email_verified_at
                ? $this->email_verified_at->format('Y-m-d H:i:s')
                : null,
            'created_at'        => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
