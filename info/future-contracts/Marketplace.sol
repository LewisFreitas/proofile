pragma solidity ^0.4.24;

import "./utils/ERC721.sol";
import "./Administrable.sol";
import "./AuctionInterface.sol";

contract Marketplace is Administrable{
    using SafeMath for uint256;

    /*the public registry for the products we are selling in this Marketplace*/
    ERC721 public nonFungibleRegistry;

    struct Store {
        string  name;
        string description;
        address owner;
        uint256 balance;
        bool isOpen;
        uint64 dateCreation;
    }

    struct Sale {
      uint256 storeId;
      address dealerContract;
      address seller;
      bool isEnded;
      uint64 dateCreation;
    }

    Store[] public stores;
    Sale[] public sales;

    mapping(uint256 => Store) storeIdToStore;

    mapping(uint256 => address) public tokenIdToAuctionAddress;

    mapping(uint256 => uint256) public tokenIdToStoreId;


    event NewStore();
    event NewSale();
    event CancelSale();
    event ChangeStoreName();

    event Buy();

    event ProductBought();
    event ProductStopSale();
    event ProductStartSale();
    event ProductChangePrice();


    modifier onlyStoreOwner(uint256 storeId){
        if(msg.sender != storeIdToStore[storeId].owner) revert();
        _;
    }

    modifier isOpenStore(uint256 storeId){
      if(stores[storeId].isOpen == false) revert();
      _;
    }

    constructor() public {
        stores.push(Store("genesis", msg.sender, 0));
    }

    function createStore(address newOwner, string name, string description) public onlyAdmins {
      uint256 index = stores.push(Store(name, description, newOwner, 0, true)) - 1;

      emit NewStore();
    }

    /**
      * @dev Start an auction for a specific store
      * @param storeId - ID of the store
      * @param productId - ID of the product
      * @param priceInWei - Price in Wei
      * @param expiracyDate - date of expiracy
      */
    function startSale(uint256 _productId, uint256 _storeId, uint256 _startingPrice, uint256 _endingPrice, uint64 _expiracyDate, address _auctionAdress)
      public
      onlyStoreOwner(_storeId)
      isOpenStore(_storeId)
      whenNotPaused
    {
      require(_auctionAdress != address(0));
      AuctionInterface candidateContract = AuctionInterface(_auctionAdress);
      require(candidateContract.isAuctionInterface());

      address assetOwner = nonFungibleRegistry.ownerOf(_productId);
      require(msg.sender == assetOwner);

      require(nonFungibleRegistry.getApproved(_productId) == _auctionAdress);

      bool res = candidateContract.startSale(_storeId, assetOwner, _productId, _startingPrice, _endingPrice, _expiracyDate, address(this));
      require(res == true);

      tokenIdToAuctionAddress[_productId] = _auctionAdress;
      tokenIdToStoreId[_productId] = _storeId;

      emit NewSale();
    }

    function stopSale(uint256 _productId, uint256 _storeId) public onlyStoreOwner(storeId) isOpenStore(storeId) {
      address auctionAddress = tokenIdToAuctionAddress[_productId];
      require(auctionAddress != address(0));
      AuctionInterface auctionContract = AuctionInterface(auctionAddress);
      require(auctionContract.isAuctionInterface());

      bool res = auctionContract.stopSale(_productId, address(this));
      require(res == true);

      tokenIdToAuctionAddress[_productId] = address(0);

      emit CancelSale();
    }

    function buy(uint256 _productId, uint256 _storeId) public payable isOpenStore(_storeId) whenNotPaused{
      address auctionAddress = tokenIdToAuctionAddress[_productId];
      require(auctionAddress != address(0));
      AuctionInterface auctionContract = AuctionInterface(auctionAddress);
      require(auctionContract.isAuctionInterface());

      bool res = auctionContract.buy(_productId, msg.sender, msg.value, address(this));
      require(res == true);

      /*TODO: research if this is a source for problems. re-entrancy*/
      storeIdToStore[storeId].balance.add(msg.value);

      tokenIdToAuctionAddress[_productId] = address(0);

      emit Buy();
    }


    /* The main idea for this withdraw function was taken from OpenZeppelin's PullPayment
    *  The key difference is that each store's balance is separate. A owner of different stores
    *  can collect money separately.
    */
    function withdrawStoreBalance(uint256 storeId) public onlyStoreOwner(storeId) whenNotPaused{
      address payee = msg.sender;
      uint256 payment = storeIdToStore[storeId].balance;

      require(payment != 0);
      require(address(this).balance >= payment);
      require(storeIdToStore[storeId].balance >= payment);

      totalPayments = totalPayments.sub(payment);

      storeIdToStore[storeId].balance = 0;

      payee.transfer(payment);
    }


    function setStoreName(uint256 storeId, string name) public onlyStoreOwner(storeId) {
      storeIdToStore[storeId].name = name;
    }

    function setERC721Address(address _newAddress) public onlyAdmins {
      require(_newAddress != address(0));
      ERC721 _newAddressContract = ERC721(_newAddress);
      nonFungibleRegistry = _newAddressContract
    }

    function setStoreOwnership(uint256 storeId, address newOwner) public onlyStoreOwner(storeId) whenNotPaused{
      require(newOwner != 0);
      stores[storeId].owner = newOwner;
    }


    /*DO NOT CALL THESE FUNCTIONS WITH A CONTRACT*/

    function getListOfStoresIdByOwner(address storeOwner) external view returns(uint256[]){
        uint256[] memory toReturnStoreIds = new uint256[](ownerAddressToStoreIds[storeOwner].length);
        for(uint256 i = 0; i < ownerAddressToStoreIds[storeOwner].length; i++){
            toReturnStoreIds[i] = i;
        }
        return toReturnStoreIds;
    }

    function getStore(uint256 storeId) public view
      returns
      (
        bool isOpen,
        string name,
        string description,
        address owner,
        uint256 balance,
        uint64 dateCreation
      )
      {
        Store memory store = stores[storeId];
        returns(
            store.isOpen,
            store.name,
            store.description,
            store.owner,
            store.balance,
            store.dateCreation
        );
      }

}
