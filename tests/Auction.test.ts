import hre from "hardhat";
import { expect } from "chai";

import { r, Base8, mulPointEscalar, Point } from "@zk-kit/baby-jubjub";
import { PlainText, poseidonEncrypt, poseidonDecrypt, EncryptionKey, CipherText } from "@zk-kit/poseidon-cipher";

import { Auction } from "../dist/solc/type";

describe('Auction contract', () => {
  let auction: Auction;

  let creator: any;
  let creator_privkey: bigint;
  let creator_pubkey: Point<bigint>;

  let signer1: any;
  let user1_privkey: bigint;
  let user1_pubkey: Point<bigint>;

  let signer2: any;
  let user2_privkey: bigint;
  let user2_pubkey: Point<bigint>;

  let signer3: any;
  let user3_privkey: bigint;
  let user3_pubkey: Point<bigint>;

  let signer4: any;
  let user4_privkey: bigint;
  let user4_pubkey: Point<bigint>;

  const msg: PlainText<bigint> = [BigInt(10000)];
  const nonce = BigInt(12);

  before(async () => {
    // variables
    creator_privkey = randomBigInt();
    creator_pubkey = mulPointEscalar(Base8, creator_privkey);

    user1_privkey = randomBigInt();
    user1_pubkey = mulPointEscalar(Base8, user1_privkey);

    user2_privkey = randomBigInt();
    user2_pubkey = mulPointEscalar(Base8, user2_privkey);

    user3_privkey = randomBigInt();
    user3_pubkey = mulPointEscalar(Base8, user3_privkey);

    user4_privkey = randomBigInt();
    user4_pubkey = mulPointEscalar(Base8, user4_privkey);

    // assign address
    [creator, signer1, signer2, signer3, signer4] = await hre.ethers.getSigners();

    // deployment
    const factory = await hre.ethers.getContractFactory('Auction');
    auction = (await factory.deploy() as any);

    // setter
    auction.setCreatorECDHPubkey(creator_pubkey[0], creator_pubkey[1]);
  });

  it('set creator public key', async () => {
    await expect(auction.setCreatorECDHPubkey(creator_pubkey[0], creator_pubkey[1]))
      .emit(auction, "SetCreatorPublicKey")
      .withArgs(creator_pubkey[0], creator_pubkey[1]);
  });

  it('user1 submit bid', async () => {
    // bid message
    const shareSecretKey = mulPointEscalar(creator_pubkey, user1_privkey);
    const cipher = poseidonEncrypt(msg, (shareSecretKey as EncryptionKey<bigint>), nonce);

    // bid()
    await expect(auction.connect(signer1).bid(user1_pubkey[0], user1_pubkey[1], cipher[0], cipher[1], cipher[2], cipher[3]))
      .emit(auction, "Bid")
      .withArgs(user1_pubkey[0], user1_pubkey[1], cipher[0], cipher[1], cipher[2], cipher[3]);
  });

  it('creator decrypt', async () => {
    const [a, b, v1, v2, v3, v4] = await auction.userBidData(signer1);
    const loadedPubkey: Point<bigint> = [a, b];
    const loadedSharedSecretKey = mulPointEscalar(loadedPubkey, creator_privkey) as EncryptionKey<bigint>;
    const loadedCipher: CipherText<bigint> = [v1, v2, v3, v4];
    const decrypted_msg = poseidonDecrypt(loadedCipher, loadedSharedSecretKey, nonce, msg.length);
    for (let i = 0; i < decrypted_msg.length; i++) {
      expect(decrypted_msg[i]).to.equals(msg[i]);
    }
  });
});

function randomBigInt() {
  const randomFactor = BigInt(Math.floor(Math.random() * Number(r - BigInt(0) + BigInt(1))));
  return randomFactor;
}
