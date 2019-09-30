<template lang="pug">
    div.example
        div.main {{msg}}
        v_footer
</template>
<script>
import v_footer from '../public/footer.vue';
export default {
    components:{
        v_footer
    },
    data(){
        return {
            msg:'Hello Vue'
        }
    }
}
</script>
<style lang="scss">
    .main {
        $width:600px;
        $height:80px;
        $green:#42b983;
        width:$width; height:$height; line-height:$height; color:$green; font-size:$height * 0.8; text-align:center; font-weight:bold; position:absolute; left:50%; top:40%;

        margin:{
            left:-($width / 2);
            top:-($height / 2);
        }
    }
</style>

