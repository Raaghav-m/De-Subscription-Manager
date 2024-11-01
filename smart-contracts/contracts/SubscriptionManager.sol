// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionManager {
    struct PaymentSchedule {
        address recipient;
        uint256 amount;
        uint256 frequency; // seconds (weekly: 1 week, monthly: 1 month, yearly: 1 year)
        uint256 totalLimit;
        uint256 nextPaymentTime;
        uint256 totalPaid;
    }

    mapping(address => PaymentSchedule[]) public userSchedules;

    event PaymentScheduled(
        address indexed user,
        address indexed recipient,
        uint256 amount,
        uint256 frequency,
        uint256 totalLimit
    );
    
    event PaymentExecuted(
        address indexed user,
        address indexed recipient,
        uint256 amount
    );

    function createPaymentSchedule(
        address _recipient,
        uint256 _amount,
        string memory _frequency,
        uint256 _totalLimit
    ) external payable {
        require(msg.value >= _totalLimit, "Insufficient funds sent.");
        
        uint256 frequencyInSeconds;
        if (keccak256(abi.encodePacked(_frequency)) == keccak256("weekly")) {
            frequencyInSeconds = 7 * 24 * 60 * 60; // 1 week in seconds
        } else if (keccak256(abi.encodePacked(_frequency)) == keccak256("monthly")) {
            frequencyInSeconds = 30 * 24 * 60 * 60; // 1 month in seconds (approx)
        } else if (keccak256(abi.encodePacked(_frequency)) == keccak256("yearly")) {
            frequencyInSeconds = 365 * 24 * 60 * 60; // 1 year in seconds (approx)
        } else {
            revert("Invalid frequency. Choose 'weekly', 'monthly', or 'yearly'.");
        }

        // Calculate next payment time based on current block timestamp
        uint256 nextPaymentTime = block.timestamp + frequencyInSeconds;

        PaymentSchedule memory newSchedule = PaymentSchedule({
            recipient: _recipient,
            amount: _amount,
            frequency: frequencyInSeconds,
            totalLimit: _totalLimit,
            nextPaymentTime: nextPaymentTime,
            totalPaid: 0
        });

        userSchedules[msg.sender].push(newSchedule);

        emit PaymentScheduled(msg.sender, _recipient, _amount, frequencyInSeconds, _totalLimit);
    }

    function executePayments() external {
        PaymentSchedule[] storage schedules = userSchedules[msg.sender];
        for (uint256 i = 0; i < schedules.length; i++) {
            PaymentSchedule storage schedule = schedules[i];
            // Check if the current block timestamp is past the next payment time
            if (
                block.timestamp >= schedule.nextPaymentTime &&
                schedule.totalPaid + schedule.amount <= schedule.totalLimit
            ) {
                // Update next payment time for the next interval
                schedule.nextPaymentTime += schedule.frequency;
                schedule.totalPaid += schedule.amount;

                (bool success, ) = schedule.recipient.call{value: schedule.amount}("");
                require(success, "Payment failed"); // Throws if payment fails

                emit PaymentExecuted(msg.sender, schedule.recipient, schedule.amount);
            } 
        }
    }

    function getUserSchedules(address _user) external view returns (PaymentSchedule[] memory) {
        return userSchedules[_user];
    }

    // Add function for user to withdraw unused funds from the contract
    function withdrawUnusedFunds() external {
        uint256 totalBalance = address(this).balance;
        uint256 usedFunds = 0;
        
        PaymentSchedule[] storage schedules = userSchedules[msg.sender];
        for (uint256 i = 0; i < schedules.length; i++) {
            usedFunds += schedules[i].totalPaid;
        }

        uint256 withdrawableAmount = totalBalance - usedFunds;
        require(withdrawableAmount > 0, "No funds available for withdrawal");

        (bool success, ) = msg.sender.call{value: withdrawableAmount}("");
        require(success, "Withdrawal failed");
    }
}
