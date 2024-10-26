// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error InsufficientBalance(uint256 available, uint256 required, bytes32 name);
error SubscriptionNotFound(bytes32 name);
error Unauthorized();

contract SubscriptionManager {
    struct Subscription {
        address recipientAddress;
        uint256 amount;
        uint256 interval;
        uint256 nextSchedule;
        bool isActive;
    }

    address public owner;
    uint256 public feePercentage;

    mapping(address => mapping(bytes32 => Subscription)) private subscriptions;
    mapping(address => bytes32[]) private subscriptionNames; // Track user subscription names
    mapping(address => uint256) private balances;

    event SubscriptionAdded(
        address indexed user,
        bytes32 name,
        address recipient,
        uint256 amount
    );
    event PaymentExecuted(
        address indexed user,
        address recipient,
        uint256 amount,
        uint256 fee
    );
    event SubscriptionModified(
        address indexed user,
        bytes32 name,
        uint256 amount,
        uint256 interval
    );
    event BalanceFunded(address indexed user, uint256 amount);
    event SubscriptionDeleted(address indexed user, bytes32 name);
    event FeeUpdated(uint256 newFee);

    constructor(uint256 _feePercentage) {
        require(_feePercentage <= 100, "Invalid fee percentage");
        owner = msg.sender;
        feePercentage = _feePercentage;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert Unauthorized();
        _;
    }

    // Add a new subscription
    function addSubscription(
        bytes32 name,
        address recipientAddress,
        uint256 amount,
        uint256 interval
    ) external {
        require(recipientAddress != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(interval > 0, "Interval must be greater than 0");

        Subscription storage sub = subscriptions[msg.sender][name];
        require(
            sub.recipientAddress == address(0),
            "Subscription already exists"
        );

        subscriptions[msg.sender][name] = Subscription({
            recipientAddress: recipientAddress,
            amount: amount,
            interval: interval,
            nextSchedule: block.timestamp + interval,
            isActive: true
        });

        subscriptionNames[msg.sender].push(name); // Track subscription name
        emit SubscriptionAdded(msg.sender, name, recipientAddress, amount);
    }

    // Execute all due payments for a user
    function executePayments(address user) external {
        bytes32[] storage names = subscriptionNames[user];

        for (uint256 i = 0; i < names.length; i++) {
            Subscription storage sub = subscriptions[user][names[i]];
            if (!sub.isActive || block.timestamp < sub.nextSchedule) continue;

            uint256 fee = (sub.amount * feePercentage) / 100;
            uint256 totalAmount = sub.amount + fee;

            if (balances[user] < totalAmount) {
                revert InsufficientBalance(
                    balances[user],
                    totalAmount,
                    names[i]
                );
            }

            balances[user] -= totalAmount;

            (bool success, ) = sub.recipientAddress.call{value: sub.amount}("");
            if (success) {
                payable(owner).transfer(fee);
                sub.nextSchedule += sub.interval;
                emit PaymentExecuted(
                    user,
                    sub.recipientAddress,
                    sub.amount,
                    fee
                );
            } else {
                balances[user] += totalAmount; // Refund on failure
            }
        }
    }

    // Delete a subscription
    function deleteSubscription(bytes32 name) external {
        Subscription storage sub = _getSubscription(msg.sender, name);
        delete subscriptions[msg.sender][name];

        // Remove name from tracking array
        _removeSubscriptionName(msg.sender, name);

        emit SubscriptionDeleted(msg.sender, name);
    }

    // Helper to remove subscription name from the tracking array
    function _removeSubscriptionName(address user, bytes32 name) internal {
        bytes32[] storage names = subscriptionNames[user];
        for (uint256 i = 0; i < names.length; i++) {
            if (names[i] == name) {
                names[i] = names[names.length - 1]; // Replace with last element
                names.pop(); // Remove last element
                break;
            }
        }
    }

    // Retrieve a subscription
    function _getSubscription(
        address user,
        bytes32 name
    ) internal view returns (Subscription storage) {
        Subscription storage sub = subscriptions[user][name];
        if (sub.recipientAddress == address(0))
            revert SubscriptionNotFound(name);
        return sub;
    }

    // Update the fee percentage (only owner)
    function updateFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Invalid fee percentage");
        feePercentage = newFee;
        emit FeeUpdated(newFee);
    }

    // View user balance
    function viewUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    // Fund user balance
    receive() external payable {
        balances[msg.sender] += msg.value;
        emit BalanceFunded(msg.sender, msg.value);
    }
}
