<template>
    <div>
        <table>
            <caption class="pull-txt--left">My uploads
                 <!-- <button class="primaryBtn pull-right" @click.prevent="emitWithdraw">Withdraw</button> -->
            </caption>
            <thead>
                <tr>
                <th scope="col">Sno.</th>
                <th scope="col">Barcode</th>
                <th scope="col">Description</th>
                <th scope="col">Uploaded at</th>
                <th scope="col">Coins earned</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="item._id">
                    <td data-label="Sno.">{{ index+1 }}</td>
                    <td data-label="Barcode">{{ item.productId }}</td>
                    <td data-label="Description">{{ item.productDesc }}</td>
                    <td data-label="Uploaded at">{{ item.createdAt }}</td>
                    <td class="img-plus" data-label="Coins earned"> +
                        <!-- <img class="svg-bitcoin" src="../images/plus.svg" alt=""> -->
                        {{ item.coinsEarned }}</td>
                </tr>
            </tbody>
            </table>
    </div>
</template>
<script>
export default {
    name: 'table',
    props:{
        data: {
            type: Array,
            required: false
        }
    },
    methods:{
        emitWithdraw(event){
            this.$emit('withdrawClicked',event);
        }
    }
}
</script>