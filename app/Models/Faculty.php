<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;
    protected $table = 'faculty'; 

    protected $fillable = [
        'school_id', 'id_number', 'f_name', 'm_name', 'l_name', 'email'
    ];
}