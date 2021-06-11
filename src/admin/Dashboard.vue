<template>
    <div>
         <navigation :defaultAccount = defaultAccount></navigation>

         <div>ERROR: {{error}}</div>

         <div class="main space-above2">

             <p class="admin-heading">Contract Balance: <label></label>{{smartContractBalance}} ETH</p>
            <br>
            <input type="number" class="input-txt" placeholder="0" v-model="etherToTransfer">
            <button class="primaryBtn-dark space-left" @click.prevent="addFunds()">Add Funds</button><br>
            <p>Transaction:</p><br>
                {{txReceipt}}
        </div>
    
    </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import Web3 from "web3"
import TruffleContract from "truffle-contract"
import RecycoinFunds from '../../build/contracts/RecycoinFunds.json'
export default {
    name: 'admin-dashboard',
    data(){
        return{
            web3: null,
            provider: null,
            truffleContract: {},
            recycoincontract: {},
            defaultAccount: null,
            gas: 6721975,
            txReceipt: null,
            etherToTransfer: 0,
            smartContractBalance: 0,
            error: "No error"
        }
    },

    methods: {
        async loadContract(){
                        //init Web3
            // Web3.providers.HttpProvider.prototype.sendAsync =
            // Web3.providers.HttpProvider.prototype.send;
            //     if (this.web3) {
            //     this.provider = this.web3.currentProvider;
            // } else {
            //     this.provider = new Web3.providers.HttpProvider("http://localhost:7545");
            // }
            // this.web3 = new Web3(this.provider);

             if (window.ethereum) {
                window.web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
            }
                else if (window.web3) {
                    this.provider = window.web3 = new Web3(window.web3.currentProvider)
            }
            else {
            // DO NOTHING...
            }

            //init Contract
            this.truffleContract = TruffleContract(RecycoinFunds);
            this.truffleContract.setProvider(window.web3.currentProvider);
            this.recycoincontract = await this.truffleContract.deployed();

            //set default account
           // this.getDefaultAccount();
           await this.loadAccounts();
           await this.getSmartContractBalance();
        },
        async loadAccounts(){
            const web3 = window.web3
            // Load account
            const accounts = await web3.eth.getAccounts()
            this.defaultAccount = accounts[0].toString()
          //  await this.getSmartContractBalance();
            //this.walletAddress = this.userAccountAddress.toString();
        },
        // async getDefaultAccount(){
        //     var vm = this
        //     this.web3.eth.getAccounts( (err, accounts) => {
        //         if(!err){
        //           vm.defaultAccount = accounts[0]
        //           console.log("DEFAULT ACCOUNT: " + vm.defaultAccount)
        //         }else{
        //             console.log("ERR: " + err)
        //         }
        //     });
        //     //var balance = await this.web3.eth.getBalance(vm.defaultAccount);
        //     this.recycoincontract = await this.truffleContract.deployed();

        //     this.getSmartContractBalance();
        // },

        async addFunds(){
            var vm = this
            var ether = vm.etherToTransfer*10**18
            var resp = await this.recycoincontract.invest({
                from: vm.defaultAccount,
                value: ether
            })

            this.txReceipt = resp.receipt
            this.getSmartContractBalance()
        },

        async getSmartContractBalance(){
            //  debugger
            //  this.recycoincontract.getBalance().then((resp) => {
            //      debugger

            //  })
            var sc_balance = await this.recycoincontract.getBalance();
            this.smartContractBalance = window.web3.utils.fromWei(sc_balance.toString(),'ether');
            console.log("sc_balance: " + sc_balance)
        }
    },

    async mounted(){
        const metamaskInstalled = typeof window.web3 !== 'undefined'
        console.log(metamaskInstalled)
        if(metamaskInstalled) {
            await this.loadContract()
        }
       //await this.loadContract()
       //await this.loadAccounts()
    },
    components:{
        Navigation
    }
}
</script>