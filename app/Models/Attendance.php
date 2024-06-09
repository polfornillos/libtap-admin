<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;
    protected $table = 'attendance'; 

    protected $fillable = [
        'timestamp', 'id_number', 'school_id', 'role', 'program'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_number', 'id_number');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'id_number', 'id_number');
    }
}