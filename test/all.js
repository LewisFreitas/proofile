var Base = artifacts.require("./Base.sol");
var LicenseManager = artifacts.require("./LicenseManager.sol");

/**
  I mashed all the tests in this test script.
  Explanation:
  1. Simple deed creation. This should create a NFT/ERC-721 of an uploaded file
  2. This transfers the ownership of the token created on test 1) from account 1 to account 2.
  3. Create a new deed and update name and descritpion.
  4. Allow an account that does not own a deed to transfer it. Useful for Marketplaces, for example...
  5. Create three new deeds and check a balance of 3.
  6. Start a license sale.
  7. Start a new license sale and a user buy a license with ETH.
  8. Start a new license and stop the license.
  9. Start a license sale and update the sale.
  10. Transfer a owned deed and the new owner starts a license sale of this deed.
*/


contract('Base and LicenseManager tests', function(accounts) {

  it("...should create a deed", function() {
    return Base.deployed().then(function(instance) {
      baseInstance = instance;

      return baseInstance.createDeed(
        'QmaMbq3ntHW69Lfswm3vosRE82oJtzAngPiNc1tjikrG6b',
        'test',
        'testtesttest',
        'test',
        'test',
        'https://teste.test',
        {from: accounts[0]}
      );
    }).then(function() {
      return baseInstance.deeds(1);
    }).then(function(result) {
      assert.equal(result[0], 'QmaMbq3ntHW69Lfswm3vosRE82oJtzAngPiNc1tjikrG6b', "The IPFS hash 'aaa' was not stored.");
      assert.equal(result[1], 'test', "The name was not stored.");
      assert.equal(result[2], 'testtesttest', "The description was not stored.");
      assert.equal(result[3], 'test', "The tag1 was not stored.");
      assert.equal(result[4], 'test', "The tag2 was not stored.");
      assert.equal(result[5], accounts[0], "The creator is wrong.");
    }).then(function(){
      return baseInstance.tokenURI(1);
    }).then(function(result){
      assert.equal(result, 'https://teste.test', "The uri was not stored.");
    })
  });

  it("...should be able to tranfer token ownership from accounts[0] to accounts[1]", async () => {
    let baseInstance = await Base.deployed()

    let originalOwner = accounts[0]
    let newOwner = accounts[1]

    let deedOwner = await baseInstance.ownerOf(1)
    assert.equal(deedOwner, originalOwner, "original owner is not correct.")

    let transfer = await baseInstance.transferFrom(originalOwner, newOwner, 1)


    deedOwner = await baseInstance.ownerOf(1)
    assert.equal(deedOwner, newOwner, "new owner is not correct.")
  })

  it("...should be able to update a token's name and description.", async () => {
    let baseInstance = await Base.deployed()

    let hash = 'a'

    let createNewDeed = await baseInstance.createDeed(hash, 'a', 'a',
                                                      'a', 'a', 'a',
                                                      {from: accounts[0]})

    let deedId = await baseInstance.getTokenIdByDocumentHash(hash)
    let deed = await baseInstance.deeds(deedId)

    assert.equal(deed[1], hash, "original name is not correct.")
    assert.equal(deed[2], 'a', "original description is not correct.")

    let updateDeed = await baseInstance.update(2, 'newName', 'newDescription', {from: accounts[0]})

    deed = await baseInstance.deeds(2)

    assert.equal(deed[1], 'newName', "original name is not correct.")
    assert.equal(deed[2], 'newDescription', "original description is not correct.")
  })

  it("...should be able to allow an account to transfer a not owned deed.", async () => {
    let baseInstance = await Base.deployed()

    let createNewDeed = await baseInstance.createDeed('b', 'b',
                                                      'b', 'b',
                                                      'b', 'b',
                                                      {from: accounts[0]})

    let lastIndex = await baseInstance.tokenSupply()
    let deed = await baseInstance.deeds(lastIndex)

    let approveTransfer = await baseInstance.approve(accounts[1], lastIndex, {from: accounts[0]})

    let approvedAccount = await baseInstance.getApproved(lastIndex)
    assert.equal(accounts[1], approvedAccount, 'approved account does not match')

    let transfer = await baseInstance.transferFrom(accounts[0], accounts[2], lastIndex, {from: accounts[1]})

    let owner = await baseInstance.ownerOf(lastIndex)
    assert.equal(owner, accounts[2], "new owner is not correct.")
  })

  it("...should be able to create 3 deeds and the owner have a balance of 3.", async () => {
    let baseInstance = await Base.deployed()

    let creator = accounts[4]

    let createNewDeed1 = await baseInstance.createDeed('c', 'c','c', 'c', 'c', 'c', {from: creator})
    let createNewDeed2 = await baseInstance.createDeed('d', 'd', 'd', 'd', 'd', 'd', {from: creator})
    let createNewDeed3 = await baseInstance.createDeed('e', 'e', 'e', 'e', 'e', 'e', {from: creator})

    let balanceOf = await baseInstance.balanceOf(creator)

    assert.equal(3, balanceOf, 'balance of is not correct.')
  })

  it("...should be able to start a license sale.", async () => {
    let baseInstance = await Base.deployed()

    let licenseInstance = await LicenseManager.new(baseInstance.address)

    let owner = await baseInstance.ownerOf(1)

    let startSale = await licenseInstance.startLicenseSale(1, 1000000000000, accounts[9], 10, {from: owner})

    let licenseSelling = await licenseInstance.isLicenseSellingByTokenId(1)

    assert(true, licenseSelling, "boolean isLicenseSelling is not correct")

  })

  it("...should be able to start a license sale and a user buy it", async () => {
    let baseInstance = await Base.deployed()

    let licenseInstance = await LicenseManager.new(baseInstance.address)

    let owner = await baseInstance.ownerOf(1)

    let startSale = await licenseInstance.startLicenseSale(1, 1000000000000, accounts[9], 10, {from: owner})

    let licenseSelling = await licenseInstance.isLicenseSellingByTokenId(1)

    assert(true, licenseSelling, "boolean isLicenseSelling is not correct")

    let txCounter = await licenseInstance.getTxCounterByTokenId(1)

    let purchaseLicenseETH = await licenseInstance.purchaseLicenseETH(1, txCounter, {from: accounts[8], value: 1000000000000})

    let isHolder = await licenseInstance.isLicenseHolder(accounts[8])

    assert(true, isHolder, "is not holder.")

  })

  it("...should be able to start a license sale and stop a license", async () => {
    let baseInstance = await Base.deployed()

    let licenseInstance = await LicenseManager.new(baseInstance.address)

    let owner = await baseInstance.ownerOf(1)

    let startSale = await licenseInstance.startLicenseSale(1, 1000000000000, accounts[9], 10, {from: owner})

    let licenseSelling = await licenseInstance.isLicenseSellingByTokenId(1)

    assert(true, licenseSelling, "boolean isLicenseSelling is not correct")

    let stopSale = await licenseInstance.stopLicenseSale(1, {from: owner})

    let licenseSellingAfterStop = await licenseInstance.isLicenseSellingByTokenId(1)

    assert.equal(false, licenseSellingAfterStop, "boolean isLicenseSelling is not correct")

  })

  it("...should be able to start a license sale and update it", async () => {

    let price = 1000000000000

    let baseInstance = await Base.deployed()

    let licenseInstance = await LicenseManager.new(baseInstance.address)

    let owner = await baseInstance.ownerOf(1)

    let startSale = await licenseInstance.startLicenseSale(1, price, accounts[9], 10, {from: owner})

    let licenseSelling = await licenseInstance.isLicenseSellingByTokenId(1)
    assert(true, licenseSelling, "boolean isLicenseSelling is not correct")

    let license = await licenseInstance.getLicense(1)
    let licensePrice = await license[3]

    assert.equal(price, licensePrice, "boolean isLicenseSelling is not correct")

    let newLicensePrice = 10000000000000

    let updateLicenseSale = await licenseInstance.updateLicenseSale(1, newLicensePrice, accounts[9], 10, {from: owner})

    let updatedLicense = await licenseInstance.getLicense(1)
    let updatedLicensePrice = await updatedLicense[3]

    assert.equal(newLicensePrice, updatedLicensePrice, "boolean isLicenseSelling is not correct")

  })

  it("...should be able to allow to transfer a owned deed and start a license sale.", async () => {
    let baseInstance = await Base.deployed()
    let licenseInstance = await LicenseManager.new(baseInstance.address)

    let firstOwner = await baseInstance.ownerOf(1)

    let transfer = await baseInstance.transferFrom(firstOwner, accounts[2], 1, {from: firstOwner})

    let newOwner = await baseInstance.ownerOf(1)
    assert.equal(newOwner, accounts[2], "new owner is not correct.")


    let startSale = await licenseInstance.startLicenseSale(1, 10000000000000, accounts[9], 10, {from: newOwner})
    let startLicenseSelling = await licenseInstance.isLicenseSellingByTokenId(1)
    assert(true, startLicenseSelling, "boolean isLicenseSelling is not correct")

  })


});
