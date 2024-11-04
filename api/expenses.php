<?php

// Summary: This code manages CRUD operations (Create, Read, Update, Delete) for expense entries in a budgeting application.
// It determines the HTTP request method (POST, GET, PUT, DELETE) and performs the corresponding operation:
//  - POST: Adds a new expense record to the database.
//  - GET: Retrieves either all expense records or the total sum of expenses for the user.
//  - PUT: Updates an existing expense record with new values.
//  - DELETE: Deletes a specified expense record.
// Each operation's result is returned as a JSON response with a message indicating success or failure.

session_start(); // Start or resume session for the user

include '../db/connection.php'; // Include the database connection file

$user_id = $_SESSION['user_id']; // Retrieve user ID from session

// Initialize the response array for JSON output, with placeholders for message and data
$response = [
    'message' => '',
    'data' => [],
];

// Handle adding a new expense (POST request)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and decode JSON payload to get expense details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $expense = $payload->expense;
    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;

    // Insert new expense record into the database
    $query = "INSERT INTO expenses(user_id, expense, amount, month, year) VALUES(?, ?, ?, ?, ?)";
    $insert = $db_connection->prepare($query);
    $insert->bind_param('isiii', $user_id, $expense, $amount, $month, $year);
    $insert->execute();
    $inserted = $insert->affected_rows > 0;

    // Set response message based on the result of the insertion
    $response['message'] = $inserted ? 'success' : 'failed';

    $insert->close();
}

// Handle retrieving expenses (GET request)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $get = $_GET['get'];

    // Retrieve all expenses for the user, ordered by month
    if ($get === 'all') {
        $query = "SELECT * FROM expenses WHERE user_id = ? ORDER BY month ASC";
        $get = $db_connection->prepare($query);
        $get->bind_param('i', $user_id);
        $get->execute();
        $results = $get->get_result();

        // If expenses are found, set them in response data; otherwise, set message to 'not found'
        if ($results->num_rows > 0) {
            $response = [
                'message' => 'success',
                'data' => $results->fetch_all(MYSQLI_ASSOC),
            ];
        } else $response['message'] = 'not found';

        $get->close();
    }

    // Retrieve the total sum of expenses for the user
    if ($get === 'total') {
        $query = "SELECT SUM(amount) AS total_expenses FROM expenses WHERE user_id = ?";
        $get = $db_connection->prepare($query);
        $get->bind_param('i', $user_id);
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

// Handle updating an existing expense (PUT request)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Retrieve and decode JSON payload to get updated expense details
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $expense = $payload->expense;
    $amount = $payload->amount;
    $month = $payload->month;
    $year = $payload->year;
    $expense_id = $payload->expense_id;

    // Update the specified expense record with new values
    $query = "UPDATE expenses SET expense = ?, amount = ?, month = ?, year = ? WHERE expense_id = ?";
    $update = $db_connection->prepare($query);
    $update->bind_param('siiii', $expense, $amount, $month, $year, $expense_id);
    $update->execute();
    $updated = $update->errno === 0;

    // Set response message based on whether the update was successful
    $response['message'] = $updated ? 'success' : 'failed';

    $update->close();
}

// Handle deleting an expense (DELETE request)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Retrieve and decode JSON payload to get the expense ID to delete
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    $expense_id = $payload->expense_id;

    // Delete the specified expense record from the database
    $query = "DELETE FROM expenses WHERE expense_id = ?";
    $delete = $db_connection->prepare($query);
    $delete->bind_param('i', $expense_id);
    $delete->execute();
    $deleted = $delete->affected_rows > 0;

    // Set response message based on whether the deletion was successful
    $response['message'] = $deleted ? 'success' : 'failed';

    $delete->close();
}

// Output the response as a JSON-encoded string to the client
echo json_encode($response);
