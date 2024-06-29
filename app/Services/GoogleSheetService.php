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
        // Initialize the Google Client
        $this->client = new Google_Client();
        
        // Set the path to the service account credentials file
        $this->client->setAuthConfig(storage_path('app/service-account-credentials.json'));
        
        // Set the required scopes for Google Sheets API
        $this->client->setScopes([Google_Service_Sheets::SPREADSHEETS]);
        
        // Use application default credentials
        $this->client->useApplicationDefaultCredentials();

        // Initialize the Google Sheets service
        $this->service = new Google_Service_Sheets($this->client);
    }

    // Function to export data to a specific range in the spreadsheet
    public function exportData($spreadsheetId, $data)
    {
        $range = 'Attendance!A1'; // Define the range where data will be exported
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $data
        ]);
        $params = [
            'valueInputOption' => 'RAW' // Specify how the input data should be interpreted
        ];

        // Update the values in the specified range
        return $this->service->spreadsheets_values->update($spreadsheetId, $range, $body, $params);
    }

    // Function to append data to a specified range in the spreadsheet
    public function appendData($spreadsheetId, $range, $data)
    {
        $body = new \Google_Service_Sheets_ValueRange([
            'values' => $data
        ]);
        $params = [
            'valueInputOption' => 'RAW',
            'insertDataOption' => 'INSERT_ROWS' // Specify how the data should be inserted
        ];

        // Append the values to the specified range
        return $this->service->spreadsheets_values->append($spreadsheetId, $range, $body, $params);
    }

    // Function to clear data from a specified range in the spreadsheet
    public function clearData($spreadsheetId, $range)
    {
        $clearRange = new \Google_Service_Sheets_ClearValuesRequest();

        // Clear the values in the specified range
        return $this->service->spreadsheets_values->clear($spreadsheetId, $range, $clearRange);
    }

    // Function to read data from a specified range in the spreadsheet
    public function readData($spreadsheetId, $range)
    {
        try {
            // Get the values from the specified range
            $response = $this->service->spreadsheets_values->get($spreadsheetId, $range);
            return $response->getValues() ?: []; // Return the values or an empty array if no values found
        } catch (\Exception $e) {
            // Handle exceptions (e.g., range is empty or sheet does not exist)
            return [];
        }
    }
}