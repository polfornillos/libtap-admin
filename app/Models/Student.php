<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id', 'id_number', 'f_name', 'm_name', 'l_name', 'email', 'program'
    ];
}