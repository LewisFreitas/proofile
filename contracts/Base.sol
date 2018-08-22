pragma solidity 0.4.24;

import "./NFTokenMetadata.sol";
import "./utils/SafeMath.sol";

/**
* @title Base
* @dev This contract allows to create a new deed with a specific
* structure following the ERC-721 standard.
*/

contract Base is NFTokenMetadata{

  /**
  * @dev Event emmitted when a new deed is created
  * @param owner The address who created the deed.
  * @param id The identifier for the created deed.
  */
  event NewDeed(address owner, uint256 id);

  /**
  * @dev Event emmitted when a new deed is created
  * @param owner The address who created the deed.
  * @param id The identifier for the created deed.
  */
  event UpdateDeed(uint256 id, address owner);

  /**
  * @dev Modifier that reverts if the caller is not the deed owner
  * @param _tokenId The license identifier
  */
  modifier onlyDeedOwner(uint256 _tokenId){
      if(msg.sender != idToOwner[_tokenId]) revert();
      _;
  }

  /**
  * @dev Modifier that reverts if the hash does not exist
  * @param _hash The license hash
  */
  modifier hashExists(string _hash){
    if(hashExistsMap[_hash] == false) revert();
    _;
  }

  /**
  * @dev Modifier that reverts if the hash does exist
  * @param _hash The license hash
  */
  modifier hashDoesNotExist(string _hash){
    if(hashExistsMap[_hash] == true) revert();
    _;
  }

  /**
  * @dev The structure that represents a Deed.
  */
  struct Deed {
      string IPFShash;
      string name;
      string description;
      string tag1;
      string tag2;
      address creator;
      uint64 dateCreation;
  }

  /**
  * @dev An array of Deed. It basically represents the state of created deeds.
  */
  Deed[] public deeds;

  /**
  * @dev A mapping from hash to bool. Exists or not?
  */
  mapping (string => bool) hashExistsMap;

  /**
  * @dev A mapping from hash to token id.
  */
  mapping (string => uint256) hashToTokenId;

  /**
   * @dev Contract constructor.
   */
  constructor() public{
    //genesis deed
    deeds.push(Deed("_IPFShash", "_name", "_description", "_tag1", "_tag2", msg.sender, uint64(now)));
  }

  /**
  * @dev Creates a new unique deed or NFT. Throws if hash does exist. Every file is unique.
  * @param _IPFShash IPFS hash, identifier of the file uploaded to IPFS
  * @param _name The token name
  * @param _description The token description
  * @param _tag1 A descriptive tag for the deed content (ex: sound, video, photo, document,...)
  * @param _tag2 A descriptive that gives more info on the content
  * @param _tokenUri A URI pointing to the file (ex: IPFS uri)
  */
  function createDeed(
    string _IPFShash,
    string _name,
    string _description,
    string _tag1,
    string _tag2,
    string _tokenUri)
    public
    hashDoesNotExist(_IPFShash) {

    uint256 index = deeds.push(
      Deed(
        _IPFShash,
        _name,
        _description,
        _tag1,
        _tag2,
        msg.sender,
        uint64(now))
        ) - 1;

    hashToTokenId[_IPFShash] = index;
    hashExistsMap[_IPFShash] = true;

    _mint(msg.sender, index);
    _setTokenUri(index, _tokenUri);

    emit NewDeed(msg.sender, index);
  }

  /**
  * @dev Updates name and description of a deed. Requires the caller to be the owner.
  * @param _tokenId The deed identifier
  * @param _name New name
  * @param _description New description
  */
  function update(uint256 _tokenId, string _name, string _description) public onlyDeedOwner(_tokenId) validNFToken(_tokenId){
    deeds[_tokenId].name = _name;
    deeds[_tokenId].description = _description;
  }

  /**
  * @dev Returns the total number of issued deeds. Does not count with the genesis.
  */
  function tokenSupply() public view returns(uint256){
    return deeds.length - 1;
  }

  /**
  * @dev Returns token id by hash.
  * @param fileHash The hash of the file
  */
  function getTokenIdByDocumentHash(string fileHash) external view returns(uint256){
    return hashToTokenId[fileHash];
  }

  /**
  * @dev Returns a list of owned deeds by address.
  * @param owner The address of the deed owner.
  */
  function getListOfTokenIdsByOwner(address owner) external view returns(uint256[]){
    uint256[] memory toReturnTokenIds = new uint256[](ownerToNFTokenCount[owner]);
    uint index = 0;
    for(uint256 i = 1; i < deeds.length; i++){
        address idOwner = idToOwner[i];
        if(owner == idOwner) {
            toReturnTokenIds[index] = i;
            index++;
        }
    }
    return toReturnTokenIds;
  }
}
