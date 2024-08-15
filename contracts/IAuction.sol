// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuction {
    struct PublicKey {
        uint256 a;
        uint256 b;
    }

    struct BidData {
        uint256 v0;
        uint256 v1;
        uint256 v2;
        uint256 v3;
    }

    event SetAuctionPeriod(uint256 auctionStart_, uint256 auctionEnd_);

    event SetCreatorPublicKey(uint256 a, uint256 b);

    event Bid(uint256 a, uint256 b, uint256 v1, uint256 v2, uint256 v3, uint256 v4);
}
