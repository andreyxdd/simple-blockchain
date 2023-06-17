import * as crypto from "crypto";
import Transaction from "./Transaction";
import Chain from "./Chain";

// Basically, wallet is just a wrapper for a public and private keys
// The wallet allows both encryption and decription via RSA algorithm

// The message in the chain is signed with the private key
// and then can be verified with the public key

class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    const { publicKey, privateKey } = keyPair;

    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  sendMoney(amount: number, payeePublicKey: string) {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);
    
    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

export default Wallet;