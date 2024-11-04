<?php


// Start a new session or resume the existing session
session_start();

// Include the database connection file to establish a connection with the database
include '../../db/connection.php';

// Initialize a variable to store the response message that will be sent back to the client
$response = '';

// Check if the request method is POST, ensuring that only POST requests are processed
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve the raw input data from the request (usually JSON) and decode it into a PHP object
    $input = file_get_contents('php://input');
    $payload = json_decode($input);

    // Extract the email and password from the decoded JSON payload
    $email = $payload->email;
    $password = $payload->password;

    // Prepare a SQL query to retrieve the user_id and hashed password for the user with the specified email
    $query = "SELECT user_id, password FROM users WHERE email = ?";
    $get = $db_connection->prepare($query);
    $get->bind_param('s', $email);
    $get->execute();
    $results = $get->get_result();

    // Check if any rows were returned, meaning a user with the provided email exists
    if ($results->num_rows > 0) {
        // Fetch the associative array of data for the matching user
        $data = $results->fetch_assoc();
        $hashed_password = $data['password'];

        // Verify the provided password against the hashed password stored in the database
        if (password_verify($password, $hashed_password)) {
            $user_id = $data['user_id'];
            $_SESSION['user_id'] = $user_id;
            $response = 'success';
        } else
            $response = 'wrong password';
    } else
        $response = 'no user';

    $get->close();
}


echo json_encode($response);
