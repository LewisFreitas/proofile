var Base = artifacts.require("./Base.sol");
var LicenseManager = artifacts.require("./LicenseManager.sol");

module.exports = function(deployer) {
  deployer.deploy(Base).then(function(){
    deployer.deploy(LicenseManager, Base.address)
  });
}
