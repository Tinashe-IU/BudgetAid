-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 02, 2024 at 04:30 PM
-- Server version: 10.5.26-MariaDB-cll-lve-log
-- PHP Version: 8.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `suggeole_budget`
--

-- --------------------------------------------------------

--
-- Table structure for table `budgets`
--

CREATE TABLE `budgets` (
  `budget_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `budgets`
--

INSERT INTO `budgets` (`budget_id`, `user_id`, `amount`, `month`, `year`) VALUES
(3, 3, 5000, 10, 2024),
(4, 4, 5000, 11, 2024),
(5, 5, 8000, 11, 2024),
(6, 3, 5000, 11, 2024),
(7, 5, 8000, 10, 2024);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `expense_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expense` varchar(200) NOT NULL,
  `amount` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`expense_id`, `user_id`, `expense`, `amount`, `month`, `year`) VALUES
(19, 3, 'Wardrobe', 1300, 10, 2024),
(22, 3, 'Test 1', 1234, 9, 2024),
(23, 4, 'wardrobe', 1300, 11, 2024),
(24, 5, 'Rent', 3000, 11, 2024),
(26, 5, 'Rent', 3000, 10, 2024),
(27, 5, 'Food', 500, 10, 2024);

-- --------------------------------------------------------

--
-- Table structure for table `income_sources`
--

CREATE TABLE `income_sources` (
  `source_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `source` varchar(200) NOT NULL,
  `amount` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `income_sources`
--

INSERT INTO `income_sources` (`source_id`, `user_id`, `source`, `amount`, `month`, `year`) VALUES
(23, 3, 'Ulink salary', 15000, 10, 2024),
(24, 3, 'Ulink salary', 15000, 9, 2024),
(25, 3, 'Ulink salary', 13000, 8, 2024),
(26, 3, 'Infodocs salary', 20000, 3, 2024),
(27, 3, 'Ulink salary', 15000, 5, 2024),
(28, 3, 'student24', 11000, 10, 2024),
(29, 4, 'Ulink salary', 15000, 11, 2024),
(30, 5, 'Salary', 8000, 11, 2024),
(31, 5, 'Allowance', 4000, 11, 2024),
(32, 5, 'Adhoc Job', 2500, 10, 2024);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `email`, `password`) VALUES
(3, 'Thokozani', 'Kubheka', 'thokozani@gmail.com', '$2y$10$OPK7VQ54rCfgYmpSqClrzuglnXn6iop3V3tvUQKumr2Dw8lxW/i0.'),
(4, 'nokwanda', 'mazibuko', 'nokwanda@gmail.com', '$2y$10$tEALec/lG9VqmEfVgJwPxekr24vHRqB5PE/6Lfk3DpS1GkLVM6AEy'),
(5, 'Tinashe', 'Mavhurume', 'ashenine2000@gmail.com', '$2y$10$FI10t1JAoC6SC6FDPfaOUOeqp5Iuc2zr8YjLH164JPOHEoDQCphgG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `budgets`
--
ALTER TABLE `budgets`
  ADD PRIMARY KEY (`budget_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`expense_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `income_sources`
--
ALTER TABLE `income_sources`
  ADD PRIMARY KEY (`source_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `budgets`
--
ALTER TABLE `budgets`
  MODIFY `budget_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `expense_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `income_sources`
--
ALTER TABLE `income_sources`
  MODIFY `source_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `budgets`
--
ALTER TABLE `budgets`
  ADD CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `income_sources`
--
ALTER TABLE `income_sources`
  ADD CONSTRAINT `income_sources_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
