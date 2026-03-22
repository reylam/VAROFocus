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
        Schema::create('task_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->uuid('default_category_id')->nullable();
            $table->integer('default_estimated_minutes')->nullable();
            $table->string('difficulty')->default('easy');
            $table->boolean('is_system')->default(false);
            $table->uuid('created_by')->nullable();
            $table->timestamps();

            $table->foreign('default_category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_templates');
    }
};
