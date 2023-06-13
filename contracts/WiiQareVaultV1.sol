// SPDX-License-Identifier: Unlicensed
//=============================================================================
//                       WiiQare NFT Vault Smart Contract
//=============================================================================
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./WiiQareVoucherV1.sol";
import "./WiiQareSharedStructs.sol";

contract WiiQareVault is Pausable, Ownable {
    //=============================================================================
    //                              Structs
    //=============================================================================
    struct Vault {
        string userReference;
        address tokenVault;
        string tokenSymbol;
        uint256 tokenBalance;
    }

    struct Voucher {
        uint256 value;
        string currencySymbol;
        string ownerID;
        string providerID;
        string beneficiaryID;
        string status;
    }

    address private _voucherAddress =
        0x3Aa5ebB10DC797CAC828524e59A333d0A371443c;

    WiiQareVoucherV1 public voucherContract;

    //=============================================================================

    //=============================================================================
    //                              Mappings
    //=============================================================================
    mapping(string => mapping(address => Vault)) public userVaults;
    mapping(string => bool) private _vaultExists;
    mapping(address => bool) private _stableTokens;
    mapping(address => uint256) private _tokenBalances;

    //=============================================================================

    constructor() {
        voucherContract = WiiQareVoucherV1(_voucherAddress);
    }

    //=============================================================================
    //                              Functions
    //=============================================================================
    function createVault(Vault memory vault) public onlyOwner whenNotPaused {
        require(
            vault.tokenBalance > 0,
            "Vault entry ammount should be greater than 0"
        );
        require(!_vaultExists[vault.userReference], "Vault already exists");
        userVaults[vault.userReference][vault.tokenVault] = vault;
        _tokenBalances[vault.tokenVault] += vault.tokenBalance;
        _vaultExists[vault.userReference] = true;
    }

    function updateVault(Vault memory newVault) public onlyOwner whenNotPaused {
        require(
            newVault.tokenBalance > 0,
            "Vault entry ammount should be greater than 0"
        );
        require(_vaultExists[newVault.userReference], "Vault doesn't exist!");
        userVaults[newVault.userReference][newVault.tokenVault] = newVault;
    }

    function depositFundsToVault(
        string memory userReference,
        address tokenVault,
        uint256 ammount
    ) public onlyOwner whenNotPaused {
        require(ammount > 0, "Vault entry ammount should be greater than 0");
        require(_vaultExists[userReference], "Vault doesn't exist!");
        userVaults[userReference][tokenVault].tokenBalance += ammount;
    }

    function withdrawFundsFromVault(
        string memory userReference,
        address tokenVault,
        uint256 ammount
    ) public onlyOwner whenNotPaused {
        require(ammount > 0, "Vault entry ammount should be greater than 0");
        require(_vaultExists[userReference], "Vault doesn't exist!");
        require(
            userVaults[userReference][tokenVault].tokenBalance > ammount,
            "Not enough funds for withdraw!"
        );
        userVaults[userReference][tokenVault].tokenBalance -= ammount;
    }

    function addStableToken(address tokenAddress)
        public
        onlyOwner
        whenNotPaused
    {
        _stableTokens[tokenAddress] = true;
    }

    function removeStableToken(address tokenAddress)
        public
        onlyOwner
        whenNotPaused
    {
        _stableTokens[tokenAddress] = false;
    }

    function transferTokenFromContract(
        address tokenAddress,
        address to,
        uint256 ammount
    ) public onlyOwner whenNotPaused {
        require(_stableTokens[tokenAddress], "Token is not supported!");
        require(
            ammount > 0,
            "Ammount to be transfered should be greater than 0"
        );

        IERC20 token = IERC20(address(tokenAddress));
        token.transfer(to, ammount);
    }

    function buyVoucherWithStableTokens(
        string memory userReference,
        address tokenVault,
        SharedStructs.Voucher memory voucher
    ) public onlyOwner whenNotPaused {
        require(voucher.value > 0, "Voucher value should be greater than 0!");
        withdrawFundsFromVault(userReference, tokenVault, voucher.value);
        voucherContract.mintVoucher(voucher);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getVaultByVaultId(string memory userReference, address tokenVault)
        public
        view
        returns (Vault memory)
    {
        return userVaults[userReference][tokenVault];
    }

    //=============================================================================
}
