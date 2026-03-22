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
        Schema::create('room_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('room_id');
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('room_id')->references('id')->on('study_rooms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_sessions');
    }
};
