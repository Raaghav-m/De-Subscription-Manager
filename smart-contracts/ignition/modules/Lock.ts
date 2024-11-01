const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const SubscriptionManagerModule = buildModule("SubscriptionManager", (m: any) => {
  const subscriptionManager = m.contract("SubscriptionManager");

  return { subscriptionManager };
});

export default SubscriptionManagerModule;
