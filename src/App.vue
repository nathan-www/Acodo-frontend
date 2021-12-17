<template>

<router-view />
</template>

<style lang="scss">
@use 'style/main.scss';
</style>


<script>

import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  mounted(){
    window.app = this;
  }
}
</script>
