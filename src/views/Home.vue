<template>
  
  <!-- <div class="container">


    <div class="form-group">
      <span>Enter barcode</span>
      <input class="form-field" type="text" v-model="barcode">
       <span class="btn" @click.prevent="getProductDetails">{{ button_Text }}</span>
       <span class="btn" @click.prevent="initQuagga">║█║</span>
    </div>    

      <div id="interactive" class="viewport scanner">
      </div>
   
   <div v-if="productData != null">
     <p>Product Image:</p>
     <img class="image" :src="productData.image_url">
     <p>Product Code: {{ productData.code }}</p>
     <p>Product Company: {{ productData.company }}</p>
     <p>Product Description: {{ productData.description }}</p>
   </div>
    
  </div> -->

  <div>
    <navigation></navigation>
    <section>
      <div class="centered">
        <p class="intro-head">Zero Carbon</p>
        <p class="intro-tagline">Scan and Earn Cryptocurrency.</p><br>
        <!-- <p class="intro-info">Earn by scanning recycable items.</p> -->
        <button class="primaryBtn" @click.prevent="getStarted">Get Started</button>
      </div>
    </section>
  </div>
  
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import Navigation from '@/components/Navigation.vue'
import axios from 'axios'
import Quagga from 'quagga'

export default {
  name: 'Home',
  data(){
    return{
      button_Text: 'Search',
      imageURL: 'https://images.barcodespider.com/upcbarcode/74892702414.png',
      barcode: '',
      productData: null,
    }
  },
  methods:{
    readBarcodeFromImage(){
      var vm = this
      axios
      .get('http://localhost:8000/getText/' + vm.imageURL)
      .then(response => { console.log(response)})
     },

     getProductDetails(){
       var vm = this
       vm.productData = null
       vm.button_Text = 'Looking for product details ...'
       
       axios
      .get('https://recycoinv0.herokuapp.com/getDetailsByCode/'+ vm.barcode, (err) => {
        // window.alert(err)
      })
      .then(resp => {
        vm.button_Text = 'Search'
        vm.productData = resp.data
        console.log(vm.productData)
      })
     },

      startScanning(){

     },

     initQuagga(){
       var vm = this
       Quagga.init({
          inputStream: {
            constraints: {
              facingMode: 'environment' // restrict camera type
            },
            area: { // defines rectangle of the detection
              top: '0%',    // top offset
              right: '0%',  // right offset
              left: '0%',   // left offset
              bottom: '0%'  // bottom offset
            },
          },
          decoder: {
            readers: ['ean_reader','upc_reader'] // restrict code types
          },
        },
        (err) => {
          if (err) {
            // window.alert(err)
            this.errorMessage = 'QuaggaJS could not be initialized, err:' + err;
          } else {
            Quagga.start()  
            Quagga.onProcessed((res) => {
              vm.barcode = res.codeResult.code
              vm.closeQuagga();
              vm.getProductDetails();
             // window.alert('code:' + res.codeResult.code);
            })
          }
        });
     },

     closeQuagga(){
      Quagga.offDetected()
      Quagga.stop()
      document.getElementById('interactive').style.display = 'none';
     },

     getStarted(){
       this.$router.push('dashboard');
     }

    //  upcItemsDB(){
    //    var vm = this
    //     vm.button_Text = 'Looking for product details ...'
       
    //     axios
    //   .get('http://localhost:8000/upcitemsdb/'+ vm.barcode)
    //   .then(resp => {
    //     vm.button_Text = 'Search'
    //     console.log(resp)
    //   })
    //  }
  },

  components: {
    Navigation
  }

}
</script>
<style>
video{
  width: 400px;
  height: 300px;
}

canvas{
  display: none;
}
.btn{
  cursor: pointer;
}
.scanner{
  /* border: 1px solid #99A3BA;
  border-radius: 4px; */
  padding: 2px 4px;
  margin: 10px 20px;
}


</style>
