<template>

  <Navbar></Navbar>

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
  }
}
</script>
