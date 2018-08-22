pragma solidity 0.4.24;

import "./utils/SafeMath.sol";
import "./utils/ERC721.sol";
import "./utils/ERC20.sol";
import "./utils/Ownable.sol";
import "./utils/Pausable.sol";
import "./utils/PullPayment.sol";


/**
* @title LicenseManager
* @dev Contract that allows to create a license sale, as well as stop or update the license.
* It also allows users to buy a license with Ether or any ERC20 token.
*/
contract LicenseManager is PullPayment, Pausable{

  /**
  * @dev Implementation of SafeMath library
  */
  using SafeMath for uint256;

  /**
  * @dev Modifier that reverts if license is not selling
  * @param _tokenId The license identifier
  */
  modifier isLicenseSelling(uint256 _tokenId){
    if(tokenIdToLicense[_tokenId].isSelling == false) revert();
    _;
  }

  /**
  * @dev Modifier that reverts is license is selling
  * @param _tokenId The license identifier
  */
  modifier isNotLicenseSelling(uint256 _tokenId){
    if(tokenIdToLicense[_tokenId].isSelling == true) revert();
    _;
  }

  /**
  * @dev Event emmitted when license is up for sale
  * @param tokenId License identifier, token id
  * @param seller Seller address
  * @param priceInWei License sale price in wei
  * @param ERC20Contract Address of accepted ERC20 tokens
  * @param numberOfERC20Tokens Number of accepted ERC20 tokens
  */
  event StartLicenseSale(uint256 tokenId, address seller, uint256 priceInWei, address ERC20Contract, uint256 numberOfERC20Tokens);

  /**
  * @dev Event emmitted when license is updated
  * @param tokenId License identifier, token id
  * @param seller Seller address
  * @param price License sale price in wei
  * @param ERC20Contract Address of accepted ERC20 tokens
  * @param numberOfERC20Tokens Number of accepted ERC20 tokens
  */
  event UpdateLicense(uint256 tokenId, address seller, uint256 price, address ERC20Contract, uint256 numberOfERC20Tokens);

  /**
  * @dev Event emmitted when license sale is stopped
  * @param tokenId License identifier, token id
  * @param seller Seller address
  */
  event StopLicenseSale(uint256 tokenId, address seller);

  /**
  * @dev Event emmitted when a license is bought with ETH
  * @param tokenId License identifier, token id
  * @param seller Seller address
  * @param buyer License buyer address
  * @param price Price paid for the license in ETH
  */
  event PurchasedLicenseETH(uint256 tokenId, address seller, address buyer, uint256 price);

  /**
  * @dev Event emmitted when a license is bought with a ERC20 accepted token
  * @param tokenId License identifier, token id
  * @param seller Seller address
  * @param buyer License buyer address
  * @param erc20address Address of accepted ERC20 tokens
  * @param tokenAmount Number of accepted ERC20 tokens
  */
  event PurchasedLicenseERC20(uint256 tokenId, address seller, address buyer, address erc20address, uint256 tokenAmount);

  /**
  * @dev License structure.
  */
  struct License{
    uint256 tokenId;
    uint256 price;
    address ERC20Contract;
    uint256 numberOfERC20Tokens;
    bool isSelling;
  }

  /**
  * @dev Mapping from token id to License structure.
  */
  mapping(uint256 => License) tokenIdToLicense;

  /**
  * @dev Mapping from token id to license holder addresses.
  */
  mapping(uint256 => address[]) tokenIdToLicenseHolders;

  /**
  * @dev Mapping from address to licenses held.
  */
  mapping(address => uint256[]) addressToLicensesHeld;

  /**
  * @dev Mapping from token id to transaction counter.
  */
  mapping(uint256 => uint256) tokenIdToTxCounter;

  /**
   * @dev Accepted ERC721 NFT contract.
   */
  ERC721 public nonFungibleRegistry;

  /**
   * @dev Contract constructor.
   * @param _nonFungibleRegistry Address of the accepted ERC721 token.
   */
  constructor(address _nonFungibleRegistry) public {
    nonFungibleRegistry = ERC721(_nonFungibleRegistry);
  }

  /**
  * @dev Called by the owner of a deed or NFT to start a license sale. Throws if license is not selling
  * or if the execution was paused. requires the caller to be the deed owner.
  * @param _tokenId The token ID for the license sale.
  * @param _price The license price in wei.
  * @param _ERC20Contract The contract address for the ERC20 token accepted as exchange.
  * @param _numberOfERC20Tokens The number of ERC20 tokens accepted for the sale.
  */
  function startLicenseSale(uint256 _tokenId, uint256 _price, address _ERC20Contract, uint256 _numberOfERC20Tokens)
    public
    isNotLicenseSelling(_tokenId)
    whenNotPaused
  {
    require(_ERC20Contract != address(0) && _numberOfERC20Tokens > 0);

    address assetOwner = nonFungibleRegistry.ownerOf(_tokenId);
    require(msg.sender == assetOwner);

    tokenIdToLicense[_tokenId] = License({
      tokenId : _tokenId,
      price : _price,
      ERC20Contract : _ERC20Contract,
      numberOfERC20Tokens : _numberOfERC20Tokens,
      isSelling : true
    });

    tokenIdToTxCounter[_tokenId] = SafeMath.add(tokenIdToTxCounter[_tokenId], 1);

    emit StartLicenseSale(_tokenId, msg.sender, _price, _ERC20Contract, _numberOfERC20Tokens);
  }

  /**
  * @dev Called by the deed or NFT owner to update a current licese sale.
  * @param _tokenId The token ID for the license sale.
  * @param _price The license price in wei.
  * @param _ERC20Contract The contract address for the ERC20 token accepted as exchange.
  * @param _numberOfERC20Tokens The number of ERC20 tokens accepted for the sale.
  */
  function updateLicenseSale(uint256 _tokenId, uint256 _price, address _ERC20Contract, uint256 _numberOfERC20Tokens)
    public
    whenNotPaused
  {

    address assetOwner = nonFungibleRegistry.ownerOf(_tokenId);
    require(msg.sender == assetOwner);

    tokenIdToLicense[_tokenId].tokenId = _tokenId;
    tokenIdToLicense[_tokenId].price = _price;
    tokenIdToLicense[_tokenId].ERC20Contract = _ERC20Contract;
    tokenIdToLicense[_tokenId].numberOfERC20Tokens = _numberOfERC20Tokens;

    tokenIdToTxCounter[_tokenId] = SafeMath.add(tokenIdToTxCounter[_tokenId], 1);

    emit UpdateLicense(_tokenId, msg.sender, _price, _ERC20Contract, _numberOfERC20Tokens);
  }

  /**
  * @dev Called by the deed or NFT owner to stop a current licese sale.
  * @param _tokenId The token ID for the license sale.
  */
  function stopLicenseSale(uint256 _tokenId)
    public
    isLicenseSelling(_tokenId)
    whenNotPaused
  {
    address assetOwner = nonFungibleRegistry.ownerOf(_tokenId);
    require(msg.sender == assetOwner);

    tokenIdToLicense[_tokenId].isSelling = false;

    emit StopLicenseSale(_tokenId, msg.sender);
  }

  /**
  * @dev Called by the payer to buy a license with ETH.
  * @param _tokenId The token ID for the license sale.
  * @param _txCounter The tx counter for a specific _tokenId to prevent Transaction-Ordering Attacks
  */
  function purchaseLicenseETH(uint256 _tokenId, uint256 _txCounter)
    public
    payable
    isLicenseSelling(_tokenId)
  {
    require(tokenIdToTxCounter[_tokenId] == _txCounter);

    address assetOwner = nonFungibleRegistry.ownerOf(_tokenId);
    require(msg.sender != assetOwner);

    require(msg.value == tokenIdToLicense[_tokenId].price);

    asyncSend(assetOwner, msg.value);

    tokenIdToLicenseHolders[_tokenId].push(msg.sender);
    addressToLicensesHeld[msg.sender].push(_tokenId);


    emit PurchasedLicenseETH(_tokenId, assetOwner, msg.sender, msg.value);
  }


  /**
  * @dev Called by the payer to buy a license with an accepted ERC20 token.
  * @param _tokenId The token ID for the license sale.
  * @param _ERC20Contract The accepted ERC20 token contract address.
  * @param _numberOfERC20Tokens The amount of ERC20 tokens accepted.
  * @param _txCounter The tx counter for a specific _tokenId to prevent Transaction-Ordering Attacks
  */
  function purchaseLicenseERC20(
    uint256 _tokenId,
    address _ERC20Contract,
    uint256 _numberOfERC20Tokens,
    uint256 _txCounter
    )
    public
    isLicenseSelling(_tokenId)
  {
    require(tokenIdToTxCounter[_tokenId] == _txCounter);

    address assetOwner = nonFungibleRegistry.ownerOf(_tokenId);
    require(msg.sender != assetOwner);

    require(tokenIdToLicense[_tokenId].ERC20Contract == _ERC20Contract);
    require(tokenIdToLicense[_tokenId].numberOfERC20Tokens == _numberOfERC20Tokens);

    ERC20 erc20Contract = ERC20(_ERC20Contract);

    erc20Contract.transferFrom(
      msg.sender,
      assetOwner,
      _numberOfERC20Tokens
    );

    tokenIdToLicenseHolders[_tokenId].push(msg.sender);
    addressToLicensesHeld[msg.sender].push(_tokenId);


    emit PurchasedLicenseERC20(_tokenId, assetOwner, msg.sender, _ERC20Contract, _numberOfERC20Tokens);
  }

  /**
  * @dev Assigns a new accepted ERC721 address.
  * @param _newAddress The new contract address.
  */
  function setERC721Address(address _newAddress) public onlyOwner {
    require(_newAddress != address(0));
    ERC721 _newAddressContract = ERC721(_newAddress);
    nonFungibleRegistry = _newAddressContract;
  }

  /**
  * @dev Returns whether the caller is a license holder for a specific token.
  * @param _tokenId The token ID for the license held.
  */
  function isLicenseHolder(uint256 _tokenId) external view returns(bool){
    for(uint256 i = 0; i < addressToLicensesHeld[msg.sender].length; i++){
        if(_tokenId == addressToLicensesHeld[msg.sender][i]) {
            return true;
        }
    }
    return false;
  }

  /**
  * @dev Returns a lists of licenses held by a given address.
  * @param _holder Address for whom to query the licenses held.
  */
  function getLicensesHeldByAddress(address _holder) public view returns(uint256[]){
    return addressToLicensesHeld[_holder];
  }

  /**
  * @dev Returns the license holders by a given id.
  * @param _tokenId Id queried for the license holders.
  */
  function getLicenseHoldersByTokenId(uint256 _tokenId) public view returns(address[]){
    return tokenIdToLicenseHolders[_tokenId];
  }

  /**
  * @dev Returns ERC20 token information of a license sale.
  * @param _tokenId Id queried for ERC20 token info.
  */
  function getERC20TokentInfoByTokenId(uint256 _tokenId) public view returns(address, uint256){
    return (tokenIdToLicense[_tokenId].ERC20Contract, tokenIdToLicense[_tokenId].numberOfERC20Tokens);
  }

  /**
  * @dev Returns the price in wei for a license sale.
  * @param _tokenId The license id for sale.
  */
  function getPriceInWeiByTokenId(uint256 _tokenId) public view returns (uint256) {
    return tokenIdToLicense[_tokenId].price;
  }

  /**
  * @dev Returns whether a token's license is selling or not
  * @param _tokenId The license token Id for sale or not.
  */
  function isLicenseSellingByTokenId(uint256 _tokenId) public view returns (bool) {
    return tokenIdToLicense[_tokenId].isSelling;
  }

  /**
  * @dev Returns the transaction counter for a specific token.
  * @param _tokenId The license token Id for sale
  */
  function getTxCounterByTokenId (uint256 _tokenId) public view returns (uint256){
    return tokenIdToTxCounter[_tokenId];
  }

  /**
  * @dev Returns the pending ether on the contract belonged to a user.
  * @param _address User's address to whom the ETH belongs too.
  */
  function getPendingPayment(address _address) public view returns (uint256){
    return payments[_address];
  }

  /**
  * @dev Returns data referent to a specific license.
  * @param _tokenId The id of the license we want to query.
  */
  function getLicense(uint256 _tokenId) public view
    returns(
      bool isSelling,
      uint256 id,
      address owner,
      uint256 price,
      address ERC20Address,
      uint256 amountTokens
      ){
        License storage license = tokenIdToLicense[_tokenId];

        isSelling = license.isSelling;
        id = _tokenId;
        owner = nonFungibleRegistry.ownerOf(_tokenId);
        price = license.price;
        ERC20Address = license.ERC20Contract;
        amountTokens = license.numberOfERC20Tokens;
      }

}
