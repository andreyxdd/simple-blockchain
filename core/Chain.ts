import * as crypto from "crypto";
import Transaction from "./Transaction";
import Block from "./Block";

class Chain {
  public static instance = new Chain(); // singleton
  chain: Array<Block>;

  constructor() {
    const genesisTransaction = new Transaction(100, 'genesis', 'satoshi');
    const genesisBlock = new Block('', genesisTransaction);
    this.chain = [genesisBlock];
  }

  get lastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  mine(nonce: number) {
    let solution = 1;
    console.log('⛏️  mining...');

    while (true) {
      // MD5 similar to SHA256 but faster to compute
      // MD states for message-digest algorithm
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');
      if(attempt.slice(0,4) === '0000'){
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer): void {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());

    const isValid = verifier.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }


  }
}

export default Chain;