// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error InsufficientBalance(uint256 available, uint256 required, string name);

contract SubscriptionManager {
    struct Subscription {
        string name;
        address recipientAddress;
        uint256 amount;
        uint256 interval; // In seconds
        uint256 nextSchedule;
    }

    mapping(address => Subscription[]) private subscriptions;
    mapping(address => uint256) private balance;

    event SubscriptionAdded(
        address indexed user,
        string name,
        address recipient,
        uint256 amount
    );

    event PaymentExecuted(
        address indexed user,
        address recipient,
        uint256 amount
    );

    event SubscriptionModified(
        address indexed user,
        string name,
        uint256 amount,
        uint256 interval
    );

    event BalanceFunded(address indexed user, uint256 amount);

    // Add a new subscription
    function addSubscription(
        string memory _name,
        address _recipientAddress,
        uint256 _amount,
        uint256 _interval
    ) external {
        require(_recipientAddress != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");

        Subscription memory newSubscription = Subscription({
            name: _name,
            recipientAddress: _recipientAddress,
            amount: _amount,
            interval: _interval,
            nextSchedule: block.timestamp + _interval
        });

        subscriptions[msg.sender].push(newSubscription);
        emit SubscriptionAdded(msg.sender, _name, _recipientAddress, _amount);
    }

    function executePayments(address user) external {
        Subscription[] storage userSubs = subscriptions[user];

        for (uint256 i = 0; i < userSubs.length; i++) {
            Subscription storage sub = userSubs[i];

            // Require that the payment is due
            require(block.timestamp >= sub.nextSchedule, "Payment not due yet");

            // Require sufficient balance
            require(balance[user] >= sub.amount, "Insufficient balance");

            balance[user] -= sub.amount;

            // Attempt to send payment
            (bool success, ) = sub.recipientAddress.call{value: sub.amount}("");
            if (success) {
                // Update the next payment schedule
                sub.nextSchedule += sub.interval;
                emit PaymentExecuted(user, sub.recipientAddress, sub.amount);
            } else {
                // Refund if payment fails
                balance[user] += sub.amount;
            }
        }
    }

    // Modify subscription amount (only owner can modify their subscription)
    function modifyAmount(string memory _name, uint256 _amount) external {
        _modifySubscription(msg.sender, _name, _amount, 0, true);
    }

    // Modify subscription interval (only owner can modify)
    function modifyInterval(string memory _name, uint256 _interval) external {
        _modifySubscription(msg.sender, _name, 0, _interval, false);
    }

    // Internal function to modify subscription details
    function _modifySubscription(
        address user,
        string memory _name,
        uint256 _amount,
        uint256 _interval,
        bool isAmount
    ) internal {
        Subscription[] storage userSubscriptions = subscriptions[user];

        for (uint256 i = 0; i < userSubscriptions.length; i++) {
            Subscription storage subs = userSubscriptions[i];

            if (
                keccak256(abi.encodePacked(subs.name)) ==
                keccak256(abi.encodePacked(_name))
            ) {
                if (isAmount) {
                    subs.amount = _amount;
                } else {
                    subs.interval = _interval;
                }

                emit SubscriptionModified(
                    user,
                    subs.name,
                    subs.amount,
                    subs.interval
                );
                return;
            }
        }
        revert("Subscription not found");
    }

    // View user balance
    function viewUserBalance(address user) external view returns (uint256) {
        return balance[user];
    }

    // Allow users to fund their balance
    receive() external payable {
        balance[msg.sender] += msg.value;
        emit BalanceFunded(msg.sender, msg.value);
    }
}
