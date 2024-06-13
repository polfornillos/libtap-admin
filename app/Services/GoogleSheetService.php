<?php

namespace App\Services;

use Google_Client;
use Google_Service_Sheets;

class GoogleSheetService
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setAuthConfig(storage_path('app/service-account-credentials.json'));
        $this->client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
        $this->client->useApplicationDefaultCredentials();

        $this->service = new Google_Service_Sheets($this->client);
    }

    public function exportData($spreadsheetId, $data)
    {
        $range = 'Attendance!A1'; // Adjust the range according to your sheet
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $data
        ]);
        $params = [
            'valueInputOption' => 'RAW'
        ];

        return $this->service->spreadsheets_values->update($spreadsheetId, $range, $body, $params);
    }
}