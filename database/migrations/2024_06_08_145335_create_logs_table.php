<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogsTable extends Migration
{
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamp('timestamp');
            $table->string('action', 255);
            $table->text('description');
            $table->boolean('error')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('logs');
    }
}