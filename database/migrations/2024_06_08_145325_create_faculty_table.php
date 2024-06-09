<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultyTable extends Migration
{
    public function up()
    {
        Schema::create('faculty', function (Blueprint $table) {
            $table->increments('id');
            $table->string('school_id', 20)->unique();
            $table->string('id_number', 20)->unique();
            $table->string('f_name', 50);
            $table->string('m_name', 50);
            $table->string('l_name', 50);
            $table->string('email', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculty');
    }
}