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
        Schema::create('challenges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('creator_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('challenge_type');
            $table->integer('target_value');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->integer('reward_xp');
            $table->uuid('reward_badge_id')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('creator_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reward_badge_id')->references('id')->on('badges')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('challenges');
    }
};
