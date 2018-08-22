pragma solidity ^0.4.24;

import "./utils/Ownable.sol";
import "./utils/Pausable.sol";

/** @title Administrable. */
contract Administrable is Ownable, Pausable{
    using SafeMath for uint256;

    /** @dev Number of added admin addresses to the admins mapping. */
    uint256 public totalAdmins;

    /** @dev Number of added admin address to the super admins mapping. */
    uint256 public totalSuperAdmins;

    mapping(uint256 => address) public idToAdminAddress;
    mapping(uint256 => address) public idToSuperAdminAddress;
    mapping(address => bool) public admins;
    mapping(address => bool) public superAdmins;

    mapping(address => bool) public processedAdmin;
    mapping(address => bool) public processedSuperAdmin;

    event AddAdmin(address indexed admin);
    event RemoveAdmin(address indexed admin);
    event AddSuperAdmin(address indexed admin);
    event RemoveSuperAdmin(address indexed admin);

    modifier onlyAdmins {
        if (msg.sender != owner && !superAdmins[msg.sender] && !admins[msg.sender]) revert();
        _;
    }

    modifier onlySuperAdmins {
        if (msg.sender != owner && !superAdmins[msg.sender]) revert();
        _;
    }

    /** @dev Gives an address super admin privileges.
        @param admin The address to give admin privileges.
    */
    function addSuperAdmin(address admin) public onlyOwner {
        superAdmins[admin] = true;
        if (!processedSuperAdmin[admin]) {
            processedSuperAdmin[admin] = true;
            idToSuperAdminAddress[totalSuperAdmins] = admin;
            totalSuperAdmins = totalSuperAdmins.add(1);
        }

        emit AddSuperAdmin(admin);
    }


    /** @dev Removes super admin privileges from an address.
        @param admin The address to remove super admin privileges from.
    */
    function removeSuperAdmin(address admin) public onlyOwner {
        superAdmins[admin] = false;

        emit RemoveSuperAdmin(admin);
    }

    function addAdmin(address admin) public onlySuperAdmins {
        admins[admin] = true;
        if (!processedAdmin[admin]) {
            processedAdmin[admin] = true;
            idToAdminAddress[totalAdmins] = admin;
            totalAdmins = totalAdmins.add(1);
        }

        emit AddAdmin(admin);
    }

    function removeAdmin(address admin) public onlySuperAdmins {
        admins[admin] = false;

        emit RemoveAdmin(admin);
    }

}
