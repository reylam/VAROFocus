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
        Schema::create('task_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('task_id');
            $table->uuid('user_id');
            $table->uuid('parent_comment_id')->nullable();
            $table->text('comment');
            $table->boolean('is_edited')->default(false);
            $table->timestamps();
        });

        Schema::table('task_comments', function (Blueprint $table) {
            $table->foreign('task_id')
                ->references('id')
                ->on('tasks')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('parent_comment_id')
                ->references('id')
                ->on('task_comments')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_comments');
    }
};
