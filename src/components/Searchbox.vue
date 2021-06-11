<template>
    <div>
    <div class="form-group">
        <input placeholder="Example: 123456789876." class="form-field" type="number" v-model="barcode">
        <span class="btn" @click.prevent="validateBarcode">{{ searchText }}</span>
        <span class="btn" @click.prevent="">║█║</span>
    </div>  
    </div>
</template>
<script>
import axios from 'axios';
export default {
    name: 'searchbox',
    data(){
        return{
            data: {},
            URI: 'https://recycoinv0.herokuapp.com/getDetailsByCode/',
            productDB_URI: 'http://localhost:5000/productDB/',
            barcode: '',
            searchText: 'Search'
        }
    },
    methods: {

        /**
         * Check ProductDB for the product
         * If product doesn not exists in ProductDB,
         *      -> Search with search API
         *      -> Save the product in Product DB
         */
       async getDetails() {
            this.searchText = 'Searching...'
            var vm = this
             axios.get(this.productDB_URI + 'getProduct/' + this.barcode).then( (response) => {
                if(response.data.length == 0){
                    vm.fetchProductDetails();
                }else{
                    vm.data = {...response.data[0]}
                    this.$emit('searchData',vm.data)
                   // console.log(response.data)
                    this.searchText = 'Search'
                }
            })
        },

        fetchProductDetails(){
            debugger
            var vm = this
            axios.get(this.URI + this.barcode).then(response => {
                if(response.data.status != "invalid"){
                    this.data = {...response.data}
                    this.$emit('searchData',this.data)
                    this.searchText = 'Search'
                    vm.updateProductDB(response.data);
                }else if(response.data.status == "invalid"){
                     this.searchText = 'Failed to search'
                    this.$emit('searchData', null)
                }
                
                }).catch((err) => {
                    debugger
                    this.searchText = 'Failed to search'
                    this.$emit('searchData_nf')
            } )
        },

        updateProductDB(productDetails){
            var vm = this
            axios.post(this.productDB_URI + 'save/', productDetails).then((response) => {
                debugger
                console.log(response)
            }).catch((err) => {

            })
        },
        validateBarcode(){
            // if(this.barcode.length < 10){
            //     let isValid = 
            //     ^\d{10}$
            // }
            // else
            //     this.getDetails()
        }
    }
}
</script>