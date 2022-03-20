const web3 = require('web3');
console.log(process.env.INFURA_ID, "env")

class TransactionChecker {
    web3;
    account;

    constructor(projectId, account) {
        this.web3 = new web3(new web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + projectId));
        // this.web3 = new web3(web3.givenProvider);
        this.account = account.toLowerCase()
    }

    checkWeb3(){
        console.log(this.web3, "web3", this.account,"account")
        const data = this.web3.eth.getBlockNumber().then((result) => {
            console.log("Latest Ethereum Block is ",result);
        });
    }
    

    async checkBlock(){
        let block = await this.web3.eth.getBlock('latest')
        let number = block.number;
        console.log("block number", number);
        console.log(block.transactions)
        if(block != null && block.transactions != null){
            for(let txhash of block.transactions){
                let tx  = await this.web3.eth.getTransaction(txhash)
                console.log(tx, "transaction")
                if(tx.to && this.account == tx.to.toLowerCase()){
                    console.log('Transaction fround on block')
                    console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                }
            }
        }
    }
}

const infura_id = process.env.INFURA_ID
const account_id = process.env.ACCOUNT_1

let txChecker = new TransactionChecker(infura_id, account_id);
tXChecker.checkBlock()