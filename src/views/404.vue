<template>

  <Navbar></Navbar>

<div class="container">
  <h1>404 Not Found</h1>
  <h2>Sorry, the page you are looking for does not exist or is not available</h2>

  <div class="btn btn-primary" @click="router_push('/')"><ion-icon name="arrow-back" class="betterIcon"></ion-icon>&nbsp; Back to home</div>
</div>

</template>

<script>

import Navbar from '@/components/Navbar.vue'

export default {
  name: 'NotFound',
  components: { Navbar }
}
</script>

<style lang="scss" scoped>

h1{
  color: #151538;
  font-size: 55px;
  margin-bottom: 20px;
}

h2{
  color: #5F6266;
  font-size: 17px;
  font-weight: 400;
}

.btn{
  display: inline-block;
  margin-top: 60px;
  font-weight: 500;
}

.container{
  margin: 100px;
  text-align: center;
}

</style>
