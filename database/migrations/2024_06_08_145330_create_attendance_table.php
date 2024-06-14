<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAttendanceTable extends Migration
{
    public function up()
    {
        Schema::create('attendance', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('timestamp');
            $table->string('id_number', 20)->nullable();
            $table->string('school_id', 20)->nullable();
            $table->string('role', 20);
            $table->string('program', 50);
            $table->timestamps();
            
            // Indexes for performance and integrity checks at application level
            $table->index('id_number');
            $table->index('school_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendance');
    }
}