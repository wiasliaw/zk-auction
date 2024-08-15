// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IAuction} from "./IAuction.sol";

contract Auction is IAuction {
    ////////////////////////////////////////////////////////////////////////////
    // variables
    ////////////////////////////////////////////////////////////////////////////

    // auction start
    uint256 internal _start;

    // auction end
    uint256 internal _end;

    // creator
    address internal _creator;

    // auction creater ECDH public key
    PublicKey internal _creatorECDHPubkey;

    // user ECDH public key
    mapping(address => PublicKey) internal _userECDHPubkey;

    // user encrypted bid data
    mapping(address => BidData) internal _userBidData;

    ////////////////////////////////////////////////////////////////////////////
    // core functions
    ////////////////////////////////////////////////////////////////////////////

    function bid(uint256 a_, uint256 b_, uint256 v1_, uint256 v2_, uint256 v3_, uint256 v4_) external {
        _userBidData[msg.sender] = BidData(v1_, v2_, v3_, v4_);
        _userECDHPubkey[msg.sender] = PublicKey(a_, b_);
        emit Bid(a_, b_, v1_, v2_, v3_, v4_);
    }

    ////////////////////////////////////////////////////////////////////////////
    // setter
    ////////////////////////////////////////////////////////////////////////////

    function setCreatorECDHPubkey(uint256 a_, uint256 b_) external {
        _creatorECDHPubkey = PublicKey({a: a_, b: b_});
        emit SetCreatorPublicKey(a_, b_);
    }

    ////////////////////////////////////////////////////////////////////////////
    // getter
    ////////////////////////////////////////////////////////////////////////////

    function userBidData(address account)
        external
        view
        returns (uint256 a, uint256 b, uint256 v1, uint256 v2, uint256 v3, uint256 v4)
    {
        PublicKey memory pubKey = _userECDHPubkey[account];
        BidData memory data = _userBidData[account];
        // ret
        a = pubKey.a;
        b = pubKey.b;
        v1 = data.v0;
        v2 = data.v1;
        v3 = data.v2;
        v4 = data.v3;
    }
}
