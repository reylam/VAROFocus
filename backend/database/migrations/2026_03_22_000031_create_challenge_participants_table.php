<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('challenge_participants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('challenge_id');
            $table->uuid('user_id');
            $table->integer('progress')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('joined_at')->useCurrent();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('challenge_id')->references('id')->on('challenges')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenge_participants');
    }
};
