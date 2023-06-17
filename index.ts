import Chain from "./core/Chain";
import Wallet from "./core/Wallet";


const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(60, bob.publicKey);
bob.sendMoney(21, alice.publicKey);
alice.sendMoney(6, bob.publicKey);
alice.sendMoney(12, satoshi.publicKey);

console.log(Chain.instance)
