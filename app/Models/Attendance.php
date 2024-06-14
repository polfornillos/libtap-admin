<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendance';

    protected $fillable = [
        'timestamp', 'school_id', 'id_number', 'role', 'program',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'school_id', 'school_id');
    }

    public function faculty()
    {
        return $this->belongsTo(Faculty::class, 'school_id', 'school_id');
    }
}