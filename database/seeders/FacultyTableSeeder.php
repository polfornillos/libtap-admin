<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultyTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('faculty')->insert([
            [
                'school_id' => '201601302',
                'id_number' => '2010493812',
                'f_name' => 'Alice',
                'm_name' => 'C',
                'l_name' => 'Johnson',
                'email' => 'alice.johnson@example.com',
            ],
            [
                'school_id' => '201701532',
                'id_number' => '2042679183',
                'f_name' => 'Bob',
                'm_name' => 'D',
                'l_name' => 'Brown',
                'email' => 'bob.brown@example.com',
            ],
            [
                'school_id' => '201802457',
                'id_number' => '2023849021',
                'f_name' => 'Charlie',
                'm_name' => 'E',
                'l_name' => 'Davis',
                'email' => 'charlie.davis@example.com',
            ],
            [
                'school_id' => '201902348',
                'id_number' => '2039481204',
                'f_name' => 'Dana',
                'm_name' => 'F',
                'l_name' => 'Miller',
                'email' => 'dana.miller@example.com',
            ],
        ]);
    }
}