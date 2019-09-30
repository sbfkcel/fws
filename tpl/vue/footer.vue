<template lang="pug">
  footer.footer(v-html="copyRight")
</template>
<script>
export default {
    data(){
        return {
            copyRight:`Copyright By fws &copy; ${new Date().getFullYear()}`
        }
    }
}
</script>

<style lang="scss">
    .footer {
        $gray:#666;
        width:100%; font-size:12px; text-align:center; color:$gray; position:absolute; left:0; bottom:40px;
    }
</style>

