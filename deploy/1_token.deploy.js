// deploy/00_deploy_my_contract.js
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
  let name = "BXHWORLD", symbol = "BBB", cap = 7777777777;
     
  await deploy('BXHWorldToken', {
      from: deployer,
    args: [name, symbol, cap,deployer],
      log: true,
    });
  };
module.exports.tags = ['BXHWorldToken'];