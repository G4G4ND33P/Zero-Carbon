<template>
    <div>
        <navigation :defaultAccount = userAccountAddress></navigation>

        <div class="main">

        <div class="space-above search-container">
           <p>Enter barcode or Scan item to search</p><br>
           <searchbox @searchData=getData></searchbox>
        </div>

 {{searchData}}
         <div v-if="showDataBox" class="data-box space-above">
            <p v-if="searchData != not_found" class="data-box--heading">Match Found ...</p>
            <div class="divider"></div>

            <div class="searchResult-container space-above">
                <div class="searchResult-left">
                    <!-- <img v-if="searchData.image_url" class="searchResult-img" :src="getResultThumbnail" alt=""> -->
                    <p v-if=" searchData.description " class="data-box--desc ">{{ searchData.description }}</p>
                    <p v-if=" searchData.company " class="data-box--info">{{ searchData.company }}</p>
                    <p v-if="searchData.code " class="data-box--info">{{ searchData.code }}</p>

                    <p v-if="searchData == not_found">NO data found</p>
                </div>
                <div class="searchResult-right">
                    <button class="primaryBtn-dark space-above" @click.prevent="submitDetails">Submit</button>
                    <button class="primaryBtn-dark--outine space-above space-left" @click.prevent="showDataBox = !showDataBox">Cancel</button>
                </div>
            </div>
        </div>

            <div class="flex-container space-above2">
                <div class="card flex-item">
                    <p class="card-heading">Main account</p>
                    <p class="card-info">{{ userAccountAddress }}</p>

                    <span class="pull-right space-left">{{account_ether_balance}} ETH</span>
                    <span class="pull-right"><img class="svg-bitcoin" src="../images/bitcoin.svg" alt="Ether in account"></span>
                    <br>
                    <button class="space-above2 primaryBtn-dark" @click.prevent="withdrawClicked">Withdraw</button>
                </div>
            </div>


        <div v-if="showTransferBox" class="space-above2">
            <input readonly type="number" class="input-txt" v-model="totalCoins" min=0 oninput="validity.valid||(value='');">
            &nbsp; ⇛ 
            <input type="number" class="input-txt" placeholder="0" v-model="coinsToTransfer">
            &nbsp;
            <button class="primaryBtn-dark sapce-left" @click.prevent="checkTransfer">Transfer</button>
            <button class="primaryBtn-dark--outine space-left" @click.prevent="showTransferBox = !showTransferBox">Cancel</button>
        </div>

        <TableData class="space-above" :data=responseData></TableData>

        <!-- <div class="space-above card-container">
            <div class="card-item">
                {{totalCoins}}
            </div>
            <div class="card-item">
                {{recycoinBallance}}
            </div>
        </div> -->
<!-- 
        <TableData class="space-above" :data=responseData @withdrawClicked=withdrawClicked></TableData> -->
        </div>
    </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
import Searchbox from '@/components/Searchbox.vue'
import TableData from '@/components/TableData.vue'
import Web3 from "web3"
import TruffleContract from "truffle-contract"
import RecycoinFunds from '../../build/contracts/RecycoinFunds.json'
import axios from 'axios'

export default {
    name: 'dashboard',
    data(){
        return{
            searchData: {},
            responseData: [],
            URI: 'http://localhost:5000',
            showDataBox: false,
            showTransferBox: false,
            coinsToTransfer: 0,

            walletAddress: "",
            totalCoins: 0,
            recycoinBallance: 0,
            recycoin_value: 0,

            web3: null,
            provider: null,
            userAccountAddress: null,
            truffleContract: {},
            recycoinContract: {},
            gas: 6721975,
            not_found: 202,
            account_ether_balance: 0,
        }
    },
    methods:{
        getData(data){
           this.searchData = data == null ? this.not_found : {...data}
            // debugger
            // this.searchData = {...data};
            debugger
            this.showDataBox = true
        },
          submitDetails(){
            var vm = this
            let obj = {
                walletAddress: this.walletAddress,
                productId: vm.searchData.code,
                productDesc: vm.searchData.description
            }

           axios.post(this.URI + '/saveItem', obj).then( (resp) => {
               vm.responseData.push(resp.data.data)
               vm.showDataBox = false

               vm.getWalletInfo();
           }).catch( (err) => {
               window.alert(err.response.data.message)
           })

           
        },
       async fetchData(){
            var vm = this

            // GET USER UPLOADED 
            let userID = this.walletAddress.toString()
            axios.get(this.URI + '/getUserItems/' + userID).then( (resp) => {
                for(let item of resp.data)
                    vm.responseData.push(item)

                vm.getWalletInfo();
            })

            //TO GET ALL THE PRODUCTS
            // TODO: REMOVE IT
            // axios.get(this.URI + '/getAllProducts').then( (resp) => {
            //     for(let item of resp.data){
            //         vm.responseData.push(item)
            //     }

            //     vm.getWalletInfo();
            // })
        },

       async getWalletInfo(){
            axios.get(this.URI + '/getWalletInfo/' + this.walletAddress).then( (response) => {
                if(response.data.length > 0 ){
                    this.totalCoins = response.data[0].amount
                    this.recycoinBallance = response.data[0].recycoin_amount
                }
                
            })
        },
        withdrawClicked(event){
            this.resetTransferFundBox();

           // this.$router.push('withdraw');
        },

        checkTransfer(){
            if(this.coinsToTransfer < 0)
                window.alert('Negative coins not allowed.')
             if(this.coinsToTransfer > this.totalCoins){
                 window.alert('Cannot take out more than you have.')
             }else{
                 this.initTransfer();
             }
        },
        initTransfer(){
            var vm = this
            let obj = {
                coins: Number(this.coinsToTransfer)
            }
            axios.post(this.URI + '/withdraw/'+this.walletAddress, obj).then( (response) => {
                vm.totalCoins = response.data[0].amount
                vm.recycoinBallance = response.data[0].recycoin_amount
                this.resetTransferFundBox();
            })

          this.withdrawEther();
        },

        resetTransferFundBox(){
            this.coinsToTransfer = 0
            this.showTransferBox = !this.showTransferBox
        },

        async loadWeb3(){
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
        },
        async loadAccounts(){
            const web3 = window.web3
            // Load account
            const accounts = await web3.eth.getAccounts()
            this.userAccountAddress = accounts[0]
            this.walletAddress = this.userAccountAddress.toString();
        },

        async loadContract(){
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

            this.truffleContract =new TruffleContract(RecycoinFunds);
            this.truffleContract.setProvider(window.web3.currentProvider);
            this.recycoincontract = await this.truffleContract.deployed();

            await this.loadAccounts();
            await this.getAccountEtherBalance();

            // this.getUserAccount();
        },

        // async getUserAccount(){
        //     var vm = this
        //     this.web3.eth.getAccounts( (err, accounts) => {
        //         if(!err){
        //           //vm.userAccountAddress = "0xFe936c788BC56d8A50Cb15Da5915dc95E04467aa"
        //           vm.userAccountAddress = accounts[1]
        //           console.log("USER ACCOUNT: " + vm.userAccountAddress)
        //         }else{
        //             console.log("ERR: " + err)
        //         }
        //     });
        //     //var balance = await this.web3.eth.getBalance(vm.defaultAccount);
        //     this.recycoincontract = await this.truffleContract.deployed();
        //     this.getAccountEtherBalance();
        // },

        async withdrawEther(){
            var vm = this
            let tempCoins = vm.coinsToTransfer;
            var response = await this.recycoincontract.withdraw(tempCoins,{
                from: vm.userAccountAddress,
                gas: vm.gas,
            });
          //  let tempCoins = await window.web3.utils.toWei(vm.coinsToTransfer);
            // var response = await this.recycoincontract.transferToaddress({
            //     from: vm.userAccountAddress,
            //     gas: vm.gas
            // })
            console.log("Withdraw response: " + response.receipt)
            this.getAccountEtherBalance()
        },

        async getAccountEtherBalance(){
            var response = await window.web3.eth.getBalance(this.userAccountAddress);
            let balanceInEther = await window.web3.utils.fromWei(response.toString(), 'ether');
            this.account_ether_balance = this.round(parseFloat(balanceInEther),2).toFixed(2)
        },

        round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        },

        getResultThumbnail(){
            return this.searchData.image_url;
        }
    },
    async mounted(){
        const metamaskInstalled = typeof window.web3 !== 'undefined'
        console.log(metamaskInstalled)
        if(metamaskInstalled) {
            //await this.loadWeb3()
            await this.loadContract()
            await this.fetchData()
            
        }
        // this.loadContract();
        // this.fetchData();
    },
    components: {
        Navigation,
        Searchbox,
        TableData
    }
}
</script>