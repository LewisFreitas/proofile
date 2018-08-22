interface MarketInterface {

    modifier isAllowedMarketplace(address allowedMarketplace){
      if(msg.sender != address(allowedMarketplace)) revert();
      _;
    }

    function isMarketInterface() public pure returns (bool);

    function startSale(uint256 storeId, address owner, uint256 productId, uint256 startPrice, uint256 endPrice, uint64 expiracyDate, address allowedMarketplace) public isAllowedMarketplace(allowedMarketplace) returns (bool);

    function stopAuction(uint256 productId, address allowedMarketplace) public isAllowedMarketplace(allowedMarketplace) returns (bool);

    function buy(uint256 productId, address buyer, uint256 value, address allowedMarketplace) public isAllowedMarketplace(allowedMarketplace) returns (bool);

    function buy(uint256 productId, address buyer, address ERC20contract, uint256 tokenAmount) public returns(bool);

}
