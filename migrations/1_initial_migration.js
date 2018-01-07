const Migrations = artifacts.require("./Migrations.sol")
const RegistryApp = artifacts.require("./RegistryApp.sol")

module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(RegistryApp)
}
