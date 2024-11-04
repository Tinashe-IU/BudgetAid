<?php

// Start the session to manage user authentication state across requests
session_start();

// Include the database connection file to enable access to the database
include '../../db/connection.php';

// Initialize a response variable to store the status of the registration process
$response = '';

// Check if the request method is POST, ensuring that only POST requests are handled
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and decode JSON payload from the request body to extract user input
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    // Extract user details (firstname, surname, email, and password) from the JSON payload
    $firstname = $payload->firstname;
    $surname = $payload->surname;
    $email = $payload->email;
    $password = $payload->password;

    // Hash the user's password for secure storage
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check if the email is already registered by querying the database
    $query = "SELECT user_id FROM users WHERE email = ?";
    $get = $db_connection->prepare($query);
    $get->bind_param('s', $email);
    $get->execute();
    $results = $get->get_result();
    $email_exists = $results->num_rows > 0; // Determine if a user with this email already exists
    $get->close();

    // If the email is already in use, set the response to 'email exists'
    if ($email_exists) $response = 'email exists';
    else {
        // If email is not in use, insert the new user into the database with provided details
        $query = "INSERT INTO users(firstname, lastname, email, password) VALUES(?, ?, ?, ?)";
        $insert = $db_connection->prepare($query);
        $insert->bind_param('ssss', $firstname, $surname, $email, $hashed_password);
        $insert->execute();
        $inserted = $insert->affected_rows > 0; // Check if the insert operation was successful

        // If insertion was successful, store the user ID in session and set response to 'success'
        if ($inserted) {
            $user_id = $insert->insert_id;
            $_SESSION['user_id'] = $user_id;
            $response = 'success';
        } else
            $response = 'failed'; // Set response to 'failed' if user creation was unsuccessful

        $insert->close();
    }
}

// Send the JSON-encoded response back to the client
echo json_encode($response);
