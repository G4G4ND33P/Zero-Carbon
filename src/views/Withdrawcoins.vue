<template>
    <div>
        <Navigation></Navigation>
        <br>
        <div class="space-above">
            <input class="input-txt" placeholder="10">
            &nbsp; ⇆
            <input class="input-txt" placeholder="20">
            &nbsp;
            <button class="primaryBtn">Transfer</button>
        </div>
    </div>
</template>
<script>
import Navigation from '@/components/Navigation.vue'
export default {
    name: 'withdraw',
    data(){
        return{

        }
    },

    components:{
        Navigation
    }
}
</script>