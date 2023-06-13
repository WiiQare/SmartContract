// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.9;

library SharedStructs {
    struct Voucher {
        uint256 value;
        string currencySymbol;
        string ownerID;
        string providerID;
        string beneficiaryID;
        string status;
    }
}
