<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->renderable(function (\Illuminate\Validation\ValidationException $e, $request) {
            return response()->json([
                'message' => 'Invalid field',
                'errors' => $e->errors(),
            ], 422);
        });

        $exceptions->renderable(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, $request) {
            return response()->json([
                'message' => 'Resource not found',
            ], 404);
        });

        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, $request) {
            return response()->json([
                'message' => 'Endpoint not found',
            ], 404);
        });

        $exceptions->renderable(function (\Symfony\Component\HttpKernel\Exception\BadRequestHttpException $e, $request) {
            return response()->json([
                'message' => 'Bad request',
            ], 400);
        });

        $exceptions->renderable(function (\Throwable $e, $request) {
            $response = [
                'message' => config('app.debug') ? $e->getMessage() : 'Server error',
                'status' => 500,
            ];

            if (config('app.debug')) {
                $response['exception'] = get_class($e);
                $response['file'] = $e->getFile();
                $response['line'] = $e->getLine();
            }

            return response()->json($response, 500);
        });
    })->create();
