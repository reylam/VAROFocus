<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Request::macro('validate', function (array $rules, ...$params) {
            $validation = Validator::make($this->all(), $rules, ...$params);

            if ($validation->fails()) {
                throw new ValidationException(
                    $validation,
                    response()->json([
                        'message' => 'Invalid field',
                        'errors' => $validation->errors(),
                    ], 422)
                );
            }

            return $validation->validated();
        });
    }
}
