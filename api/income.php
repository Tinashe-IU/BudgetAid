<?php

// Summary: This code manages CRUD operations (Create, Read, Update, Delete) for income sources in a budgeting application.
// It detects the HTTP request type (POST, GET, PUT, DELETE) and performs the corresponding operation:
//  - POST: Adds a new income record to the database.
//  - GET: Retrieves income records either for all months or for a specific month and year, or calculates total income for a month and year.
//  - PUT: Updates an existing income record with new details.
//  - DELETE: Removes a specific income record from the database.
// Each operation's result is returned as a JSON response with a message indicating success or failure.

session_start(); // Start or resume the user's session

include '../db/connection.php'; // Include the database connection file

$user_id = $_SESSION['user_id']; // Retrieve user ID from session

// Initialize the response array for JSON output, with placeholders for message and data
$response = [
    'message' => '',
    'data' => [],
];

// Handle adding a new income source (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and decode JSON payload to get income details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $source = $payload->source;
    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;

    // Insert new income record into the database
    $query = "INSERT INTO income_sources(user_id, source, amount, month, year) VALUES(?, ?, ?, ?, ?)";
    $insert = $db_connection->prepare($query);
    $insert->bind_param('isiii', $user_id, $source, $amount, $month, $year);
    $insert->execute();
    $inserted = $insert->affected_rows > 0;

    // Set response message based on the result of the insertion
    $response['message'] = $inserted ? 'success' : 'failed';

    $insert->close();
}

// Handle retrieving income sources (GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get = $_GET['get'];

    // Retrieve all income sources for the user, ordered by month
    if ($get === 'all') {
        $query = "SELECT * FROM income_sources WHERE user_id = ? ORDER BY month ASC";
        $get = $db_connection->prepare($query);
        $get->bind_param('i', $user_id);
        $get->execute();
        $results = $get->get_result();

        // If income sources are found, set them in response data; otherwise, set message to 'not found'
        if ($results->num_rows > 0) {
            $response = [
                'message' => 'success',
                'data' => $results->fetch_all(MYSQLI_ASSOC),
            ];
        } else $response['message'] = 'not found';

        $get->close();
    }

    // Retrieve income sources for a specific month and year
    if ($get === 'month') {
        $month = $_GET['month'];
        $year = $_GET['year'];

        $query = "SELECT * FROM income_sources WHERE user_id = ? AND month = ? AND year = ? ORDER BY month ASC";
        $get = $db_connection->prepare($query);
        $get->bind_param('iii', $user_id, $month, $year);
        $get->execute();
        $results = $get->get_result();

        // If income sources are found, set them in response data; otherwise, set message to 'not found'
        if ($results->num_rows > 0) {
            $response = [
                'message' => 'success',
                'data' => $results->fetch_all(MYSQLI_ASSOC),
            ];
        } else $response['message'] = 'not found';

        $get->close();
    }

    // Retrieve the total income for a specific month and year
    if ($get === 'total') {
        $month = $_GET['month'];
        $year = $_GET['year'];

        $query = "SELECT SUM(amount) AS total_income FROM income_sources WHERE user_id = ? AND month = ? AND year = ?";
        $get = $db_connection->prepare($query);
        $get->bind_param('iii', $user_id, $month, $year);
        $get->execute();
        $results = $get->get_result();

        // If a total is found, set it in response data; otherwise, set message to 'not found'
        if ($results->num_rows > 0) {
            $response = [
                'message' => 'success',
                'data' => $results->fetch_assoc(),
            ];
        } else $response['message'] = 'not found';

        $get->close();
    }
}

// Handle updating an existing income source (PUT request)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Retrieve and decode JSON payload to get updated income details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $source = $payload->source;
    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;
    $source_id = $payload->source_id;

    // Update the specified income record with new values
    $query = "UPDATE income_sources SET source = ?, amount = ?, month = ?, year = ? WHERE source_id = ?";
    $update = $db_connection->prepare($query);
    $update->bind_param('siiii', $source, $amount, $month, $year, $source_id);
    $update->execute();
    $updated = $update->errno === 0;

    // Set response message based on whether the update was successful
    $response['message'] = $updated ? 'success' : 'failed';

    $update->close();
}

// Handle deleting an income source (DELETE request)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve and decode JSON payload to get the source ID to delete
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $source_id = $payload->source_id;

    // Delete the specified income record from the database
    $query = "DELETE FROM income_sources WHERE source_id = ?";
    $delete = $db_connection->prepare($query);
    $delete->bind_param('i', $source_id);
    $delete->execute();
    $deleted = $delete->affected_rows > 0;

    // Set response message based on whether the deletion was successful
    $response['message'] = $deleted ? 'success' : 'failed';

    $delete->close();
}

// Output the response as a JSON-encoded string to the client
echo json_encode($response);
