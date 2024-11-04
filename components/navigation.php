<?php
// Initialize user details with default null values
$user =
    [
        'user_id' => null,
        'firstname' => null,
        'initials' => null,
    ];

// If user session exists, fetch user details from the database
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    include 'db/connection.php';
    // Query to retrieve user first and last names
    $query = "SELECT firstname, lastname FROM users WHERE user_id = ?";
    $get = $db_connection->prepare($query);
    $get->bind_param('i', $user_id);
    $get->execute();
    $results = $get->get_result();
    $data = $results->fetch_assoc();

    $firstname = $data['firstname'];
    $lastname = $data['lastname'];

    $initials = $firstname[0] . $lastname[0];
    // Update user details with fetched data
    $user =
        [
            'user_id' => $user_id,
            'firstname' => $firstname,
            'initials' => $initials,
        ];
}
// Function to mark active tab based on current URL
function markActiveTab($tab)
{
    $current_url = $_SERVER['REQUEST_URI'];
    if (strpos($current_url, $tab) !== false) echo 'active';
}

?>

<div class="main-navigation">

    <div class="tab nav flex-left" data-page="income">
        <div class="icon flex-left">
            <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" stroke-width="2">
                <path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5"></path>
                <path d="M3 10h18"></path>
                <path d="M7 15h.01"></path>
                <path d="M11 15h2"></path>
                <path d="M16 19h6"></path>
                <path d="M19 16l-3 3l3 3"></path>
            </svg>
        </div>
        <p>Income</p>
    </div>
    <div class="tab nav flex-left" data-page="expenses">
        <div class="icon flex-left">
            <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" stroke-width="2">
                <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
                <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
            </svg>
        </div>
        <p>Expenses</p>
    </div>
    <div class="tab nav flex-left" data-page="budget">
        <div class="icon flex-left">
            <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="26" height="26" stroke-width="2">
                <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"></path>
                <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4"></path>
            </svg>
        </div>
        <p>Budget</p>
    </div>

</div>

<hr>

<div class="other-tabs">
    <?php
    // Display different content based on user's login status
    if ($user['user_id'] === null) { ?>

        <div class="user flex-left" onclick="display('show', 'loginModal')">
            <div class="initials round flex-center">
                <p>X</p>
            </div>
            <div class="details">
                <p>Welcome</p>
                <h5>Please sign in</h5>
            </div>
        </div>

    <?php
    } else { ?>

        <div class="user flex-left">
            <div class="initials round flex-center">
                <p><?php echo $user['initials'] ?></p>
            </div>
            <div class="details">
                <p>Welcome</p>
                <h5><?php echo $user['firstname'] ?></h5>
            </div>
        </div>


        <div class="tab flex-left" onclick="toggleTheme()">
            <div class="icon flex-left">
                <svg svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                    <path d="M12 3l0 18"></path>
                    <path d="M12 9l4.65 -4.65"></path>
                    <path d="M12 14.3l7.37 -7.37"></path>
                    <path d="M12 19.6l8.85 -8.85"></path>
                </svg>
            </div>
            <p>Theme</p>
        </div>


        <div class="tab flex-left" onclick="goTo('logout')">
            <div class="icon flex-left">
                <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                    <path d="M9 12h12l-3 -3"></path>
                    <path d="M18 15l3 -3"></path>
                </svg>
            </div>
            <p>Logout</p>
        </div>

    <?php
    }

    ?>
</div>