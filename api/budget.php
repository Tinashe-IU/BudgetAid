<?php

// Summary: This code manages CRUD operations (Create, Read, Update) on budget entries
// for a user based on the HTTP request method (POST, GET, PUT). It checks the request 
// method to determine the action, retrieves or updates data in the database, and 
// returns JSON-encoded responses to the client with relevant messages.

session_start(); // Start or resume the user's session

include '../db/connection.php'; // Include database connection

// Retrieve the user ID from the session for identifying the logged-in user
$user_id = $_SESSION['user_id'];

// Initialize a response array to store messages and data for JSON output
$response = [
    'message' => '',
    'data' => '',
];

// Handle budget entry creation (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and decode JSON payload to get budget details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;

    // Check if a budget entry already exists for the same month and year
    $query = "SELECT * FROM budgets WHERE user_id = ? AND month = ? AND year = ?";
    $get = $db_connection->prepare($query);
    $get->bind_param('iii', $user_id, $month, $year);
    $get->execute();
    $results = $get->get_result();
    $get->close();

    // If a duplicate entry is found, set message to 'duplicate'; otherwise, insert new entry
    if ($results->num_rows > 0) {
        $response['message'] = 'duplicate';
    } else {
        // Insert a new budget record
        $query = "INSERT INTO budgets(user_id, amount, month, year) VALUES(?, ?, ?, ?)";
        $insert = $db_connection->prepare($query);
        $insert->bind_param('iiii', $user_id, $amount, $month, $year);
        $insert->execute();
        $inserted = $insert->affected_rows > 0;

        // Set response message to indicate success or failure of the insertion
        $response['message'] = $inserted ? 'success' : 'failed';
        $insert->close();
    }
}

// Handle retrieving all budget entries (GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Query to retrieve all budget entries for the user, sorted by month
    $query = "SELECT * FROM budgets WHERE user_id = ? ORDER BY month ASC";
    $get = $db_connection->prepare($query);
    $get->bind_param('i', $user_id);
    $get->execute();
    $results = $get->get_result();

    // If entries are found, include them in the response data; otherwise, set message to 'not found'
    if ($results->num_rows > 0) {
        $response = [
            'message' => 'success',
            'data' => $results->fetch_all(MYSQLI_ASSOC), // Fetch data as associative array
        ];
    } else {
        $response['message'] = 'not found';
    }

    $get->close();
}

// Handle updating an existing budget entry (PUT request)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Retrieve and decode JSON payload to get updated budget details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;
    $budget_id = $payload->budget_id;

    // Update the specified budget entry with new values
    $query = "UPDATE budgets SET amount = ?, month = ?, year = ? WHERE budget_id = ?";
    $update = $db_connection->prepare($query);
    $update->bind_param('iiii', $amount, $month, $year, $budget_id);
    $update->execute();
    $updated = $update->errno === 0;

    // Set response message based on whether the update was successful
    $response['message'] = $updated ? 'success' : 'failed';

    $update->close();
}

// Send the response as a JSON-encoded string to the client
echo json_encode($response);
