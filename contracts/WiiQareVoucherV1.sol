// SPDX-License-Identifier: Unlicensed
//=============================================================================
//                       WiiQare NFT Voucher smart contract
//=============================================================================
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./WiiQareSharedStructs.sol";

contract WiiQareVoucherV1 is ERC721, Pausable, Ownable, ERC721Burnable {
    //=============================================================================
    //                              State variables
    //=============================================================================
    uint256 private _voucherID;
    //=============================================================================

    //=============================================================================
    //                              Structs
    //=============================================================================
    struct Voucher {
        uint256 value;
        string currencySymbol;
        string ownerID;
        string providerID;
        string beneficiaryID;
        string status;
    }
    //=============================================================================

    //=============================================================================
    //                              Mappings
    //=============================================================================
    mapping(uint256 => SharedStructs.Voucher) public vouchers;

    //=============================================================================

    //=============================================================================
    //                              Events
    //=============================================================================
    event mintVoucherEvent(uint256 voucherID, SharedStructs.Voucher nftVoucer);
    event transferVoucherEvent(uint256 voucherID, string ownerID);
    event splitVoucherEvent(
        uint256 voucherID,
        SharedStructs.Voucher firstVoucher,
        SharedStructs.Voucher secondVoucher
    );
    event alterVoucherEvent(uint256 voucherID, SharedStructs.Voucher voucher);
    event burnVoucher(uint256 voucherID);

    //=============================================================================

    constructor() ERC721("WiiQareVoucherV1", "WiiQare") {
        _voucherID = 0;
    }

    //=============================================================================
    //                              Functions
    //=============================================================================

    /**
     * Allows the contract owner to mint a voucher when the contract is not paused
     * @param voucher new voucher metadata
     */
    function mintVoucher(
        SharedStructs.Voucher memory voucher
    ) public onlyOwner whenNotPaused {
        require(voucher.value > 0, "Value of voucher must be greater than 0");
        vouchers[_voucherID] = voucher;
        _safeMint(msg.sender, _voucherID);
        emit mintVoucherEvent(_voucherID, voucher);
        _incrementVoucherID();
    }

    /**
     * Allows the contract owner to transfer a voucher when the contract is not paused
     * @param voucherID id of the target voucher
     * @param ownerID new owner for the target voucher
     */
    function transferVoucher(
        uint256 voucherID,
        string memory ownerID
    ) public whenNotPaused onlyOwner {
        vouchers[voucherID].ownerID = ownerID;
        emit transferVoucherEvent(voucherID, ownerID);
    }

    /**
     * Allows the contract owner to alter data for a voucher when the contract is not paused
     * @param voucherID id of the target voucher
     * @param voucher new voucher data
     */
    function alterVoucher(
        uint256 voucherID,
        SharedStructs.Voucher memory voucher
    ) public whenNotPaused onlyOwner {
        vouchers[voucherID] = voucher;
        emit alterVoucherEvent(voucherID, voucher);
    }

    /**
     * Allows the contract owner to split a voucher into 2 new ones, target will be deleted when the contract is not paused
     * @param voucherID id of the target voucher
     * @param firstVoucher metadata for the first voucher of the split
     * @param secondVoucher metadata for the second voucher of the split
     */
    function splitVoucher(
        uint256 voucherID,
        SharedStructs.Voucher memory firstVoucher,
        SharedStructs.Voucher memory secondVoucher
    ) public whenNotPaused onlyOwner {
        require(firstVoucher.value > 0, "Invalid value for voucher 1");
        require(secondVoucher.value > 0, "Invalid value for voucher 2");
        require(
            firstVoucher.value + secondVoucher.value ==
                vouchers[voucherID].value,
            "Sum of target voucher is different than sum of splitted vouchers"
        );
        mintVoucher(firstVoucher);
        mintVoucher(secondVoucher);
        _burn(voucherID);
        emit splitVoucherEvent(voucherID, firstVoucher, secondVoucher);
    }

    /**
     * Allows the contract owner to destroy a voucher when the contract is not paused
     * @param voucherID id of the target voucher
     */
    function _burn(
        uint256 voucherID
    ) internal override(ERC721) whenNotPaused onlyOwner {
        delete vouchers[voucherID];
        super._burn(voucherID);
        emit burnVoucher(voucherID);
    }

    /**
     * Returns all the minted vouchers
     * @return Voucher[]
     */
    function getAllVouchers() public view returns (SharedStructs.Voucher[] memory) {
        SharedStructs.Voucher[] memory vouchersArray = new SharedStructs.Voucher[](_voucherID);
        require(vouchersArray.length > 0, "No vouchers have been minted!");
        for (uint256 index = 0; index < vouchersArray.length; index++) {
            vouchersArray[index] = vouchers[index];
        }
        return vouchersArray;
    }

    /**
     * Returns the last voucher ID that has been minted
     * @return uint
     */
    function getCurrentVoucherID() public view returns (uint256) {
        return _voucherID;
    }

    /**
     * Increments the voucher ID by 1
     */
    function _incrementVoucherID() internal {
        unchecked {
            _voucherID += 1;
        }
    }

    /**
     * Substracts 1 from the voucherID
     */
    function _decrementVoucherID() internal {
        uint256 value = _voucherID;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            _voucherID = _voucherID - 1;
        }
    }

    /**
     * Sets the voucherID to 0
     */
    function _resetVoucherID() internal onlyOwner {
        _voucherID = 0;
    }

    /**
     * Allows the contract owner to pause the execution of the contract
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * Allows the contract owner to unpause the execution of the contract
     */
    function unpause() public onlyOwner {
        _unpause();
    }
    //=============================================================================
}
