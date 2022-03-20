const web3 = require('web3');
require('dotenv').config();

class TransactionChecker {
    web3;
    web3ws;
    account;
    subscription;

    constructor(projectId, account){
        this.web3ws = new web3(new web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/' + projectId));
         this.web3 = new web3(new web3.providers.HttpProvider('https://ropsten.infura.io/v3/' + projectId));
         this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if(err) console.error(err)
        })
    }
    
    watchTransactions(){
        console.log("watching all transactions");
         this.subscription.on('data', (txhash) => {
             setTimeout(async () => {
                 try {
                    if(txhash){
                        let tx = await this.web3.eth.getTransaction(txhash);
                        if(tx != null){
                            console.log(tx.from);
                            if(this.account == tx.to.toLowerCase()){
                                console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()})
                            }
                        }
                    }
                 } catch (error) {
                     console.error(error)
                 }
             }, 6000)
         })
    }
}

const infura_id = process.env.INFURA_ID
const account_id = process.env.ACCOUNT_1

let txChecker = new TransactionChecker(infura_id, account_id);
txChecker.subscribe('pendingTransactions');
// txChecker.watchTransactions()