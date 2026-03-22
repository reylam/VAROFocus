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
        Schema::create('tasks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('category_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('difficulty')->default('easy');
            $table->integer('hp')->default(100);
            $table->integer('current_hp')->default(100);
            $table->integer('xp_reward')->default(10);
            $table->timestamp('due_date')->nullable();
            $table->integer('estimated_minutes')->nullable();
            $table->string('status')->default('pending');
            $table->boolean('is_public')->default(false);
            $table->integer('priority')->default(1);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
