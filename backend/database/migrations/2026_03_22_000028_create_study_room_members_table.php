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
        Schema::create('study_room_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('room_id');
            $table->uuid('user_id');
            $table->string('role')->default('member');
            $table->timestamp('joined_at');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('room_id')->references('id')->on('study_rooms')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('study_room_members');
    }
};
