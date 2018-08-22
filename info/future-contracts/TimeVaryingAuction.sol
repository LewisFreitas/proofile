
contract TimeVaryingAuction {

  ERC721 public nonFungibleRegistry;

  struct Auction {
    uint256 tokenId;
    address seller;
    uint256 storeId;

    uint128 startingPrice;
    uint128 endingPrice;
    uint64 expiracyDate;
  }

  mapping (uint256 => Auction) public tokenIdToAuction;

  event StartSale();
  event StopSale();
  event Buy();

  function isMarketInterface() public pure returns (bool){
    /*TODO: Change this for a proper details.*/
    return true;
  }

  constructor(address _nonFungibleRegistry, ) public {
    nonFungibleRegistry = ERC721(_nonFungibleRegistry);
  }

  function startSale(uint256 storeId, address owner, uint256 productId, uint256 startPrice, uint256 endPrice, uint64 expiracyDate, address _allowedMarketplace) external returns (uint256){
    /*TODO: Double checking this here. What is the alternative?*/
    address assetOwner = nonFungibleRegistry.ownerOf(_productId);

    /*check if it's the marketplace we allowed to interact*/
    require(msg.sender == _allowedMarketplace);

    require(nonFungibleRegistry.getApproved(_productId) == address(this));

    require(expiracyDate > block.timestamp.add(1 minutes));

  }

  function stopSale(uint256 productId, address _allowedMarketplace) external returns (uint256){
    address assetOwner = nonFungibleRegistry.ownerOf(_productId);
    require(msg.sender == _allowedMarketplace);
    require(nonFungibleRegistry.getApproved(_productId) == address(this));

    uint256 auctionId = tokenIdToAuction[productId].tokenId;
    address auctionSeller = tokenIdToAuction[productId].seller;
    delete tokenIdToAuction[productId];

    emit StopSale();

  }

  function buy(uint256 productId, address buyer, uint256 value, address _allowedMarketplace) external returns (uint256){
    address assetOwner = nonFungibleRegistry.ownerOf(_productId);
    require(msg.sender == _allowedMarketplace);
    require(nonFungibleRegistry.getApproved(_productId) == address(this));

    // Transfer asset owner
    nonFungibleRegistry.safeTransferFrom(
      assetOwner,
      buyer,
      productId
    );

    delete auctionByAssetId[productId];

    emit Buy();

  }

}
