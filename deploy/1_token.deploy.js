// deploy/00_deploy_my_contract.js
const expandTo18Decimals =
  require("../test/shared/utilities").expandTo18Decimals;
 module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, execute } = deployments;
  const { deployer } = await getNamedAccounts();
  const name = "BXHWORLD";
   const symbol = "BBB";
   const adminWallet = "0xD6eAb4eDF092D5767C05589696F0B09Bd4679F52";
  const cap = 7777777777;
  const CAP = expandTo18Decimals(cap);
  const INIT_CAP = expandTo18Decimals(3333333333);
  await deploy("BXHWorldToken", {
    from: deployer,
    args: [name, symbol, CAP, adminWallet],
    log: true,
  });
  // await execute(
  //   "BXHWorldToken",
  //   { from: deployer },
  //   "mint",
  //   deployer,
  //   INIT_CAP
  // );
};

module.exports.tags = ["BXHWorldToken"];
