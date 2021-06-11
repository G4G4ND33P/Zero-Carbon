<template>
  <header>
    <nav>
          <h1 class=logo>Zero Carbon</h1>
          <ul v-if="!isAdminView" class="nav_links">
            <!-- <li class="nav-account">{{ defaultAccount }}</li> -->
            <!-- <li class="nav-item"><a href="#">How it works</a></li>
            <li class="nav-item"><a href="#">About</a></li>
            <li class="nav-item"><a href="#">FAQ</a></li> -->
          </ul>
          <a href="#" class="nav-account"> <label v-if="isAdminView && defaultAccount!=null">Admin: </label> {{ defaultAccount }}</a>
          <!-- <div class="dropdown">
            <span><img class="logo-bitcoin" src="../images/bitcoin.svg" alt="Account Details"></span>
            <div class="dropdown-content">
            <p>{{ defaultAccount }}</p>
            <p>100 ETH</p>
          </div>
        </div> -->
      </nav>
    </header>
</template>
<script>
export default {
    name: 'navigation',
    data(){
      return{
        isAdminView: false
      }
    },
    props:{
      defaultAccount: {
        type: String,
        required: false
      }
    },

    methods:{
      checkUserView(){
        let currentView = this.$route.name

        if(currentView.toString().toLowerCase() == 'admin'){
          this.isAdminView = true
        }

      }
    },

    mounted(){
      this.checkUserView()
    }
}
</script>