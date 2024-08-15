import { expect } from "chai";

import { r, Base8, mulPointEscalar, Point } from "@zk-kit/baby-jubjub";
import { PlainText, poseidonEncrypt, poseidonDecrypt, EncryptionKey } from "@zk-kit/poseidon-cipher";

describe('crypto', () => {
  let create_ecdh_private_key: bigint;
  let user_ecdh_private_key: bigint;
  let shared_secret_key: Point;
  let nonce: bigint;

  beforeEach(async () => {
    create_ecdh_private_key = randomBigInt();
    user_ecdh_private_key = randomBigInt();
    nonce = BigInt(2000);
    shared_secret_key = mulPointEscalar(mulPointEscalar(Base8, create_ecdh_private_key), user_ecdh_private_key);
  });

  it("local ecdh", async () => {
    // public key
    const CreatorP = mulPointEscalar(Base8, create_ecdh_private_key);
    const userP = mulPointEscalar(Base8, user_ecdh_private_key);
    // share secret key
    const S_1 = mulPointEscalar(userP, create_ecdh_private_key);
    const S_2 = mulPointEscalar(CreatorP, user_ecdh_private_key);
    // assert
    expect(shared_secret_key[0]).equals(S_1[0]);
    expect(shared_secret_key[1]).equals(S_1[1]);
    expect(shared_secret_key[0]).equals(S_2[0]);
    expect(shared_secret_key[1]).equals(S_2[1]);
  });

  it("local encryption", async () => {
    const msg: PlainText<bigint> = [BigInt(0), BigInt(1), BigInt(2), BigInt(3)];
    const len = msg.length;
    const cipher = poseidonEncrypt(msg, (shared_secret_key as EncryptionKey<bigint>), nonce);
    const decrypted = poseidonDecrypt(cipher, (shared_secret_key as EncryptionKey<bigint>), nonce, len);
    for (let i = 0; i < len; i++) {
      expect(msg[i]).equals(decrypted[i]);
    }
  });
});

function randomBigInt() {
  const randomFactor = BigInt(Math.floor(Math.random() * Number(r - BigInt(0) + BigInt(1))));
  return randomFactor;
}
