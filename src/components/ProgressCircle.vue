<template>

  <div class="circle">

    <div v-if="progress < 25" class="circle-inner-square s1" :style="'transform: rotate(' + (-90 + (progress/25) * 90) +'deg)'"></div>
    <div v-else class="circle-inner-square s1"></div>

    <div v-if="progress < 50 && progress > 25" class="circle-inner-square s2" :style="'transform: rotate(' + (-90 + ((progress - 25)/25) * 90) +'deg)'"></div>
    <div v-else-if="progress >= 50" class="circle-inner-square s2"></div>

    <div v-if="progress < 75 && progress > 50" class="circle-inner-square s3" :style="'transform: rotate(' + (-90 + ((progress - 50)/25) * 90) +'deg)'"></div>
    <div v-else-if="progress >= 75" class="circle-inner-square s3"></div>

    <div v-if="progress < 100 && progress > 75" class="circle-inner-square s4" :style="'transform: rotate(' + (-90 + ((progress - 75)/25) * 90) +'deg)'"></div>
    <div v-else-if="progress >= 100" class="circle-inner-square s4"></div>

    <div class="circle-inner-square cover"></div>
    <div class="inner-circle"></div>
  </div>


</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    progress:{}
  }
}
</script>

<style lang="scss" scoped>

.circle{
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #e7f7ed;
  position: relative;
  overflow: hidden;

  .inner-circle {
    width: 80%;
    height: 80%;
    position: absolute;
    top: 10%;
    left: 10%;
    background-color: #fff;
    border-radius: 50%;
    z-index: 4;
  }

  .circle-inner-square{
    height: 15px;
    width: 15px;
    position: absolute;

    &.cover{
      background-color: #e7f7ed;
      top: 0px;
      left: 0px;
      z-index: 2;
    }

    &.s1, &.s2, &.s3, &.s4{
      background-color: #6fcf97;
    }

    &.s1{
      top: 0px;
      right: 0px;
      transform-origin: 0% 100%;
    }

    &.s2{
      top: 15px;
      right: 0px;
      transform-origin: 0% 0%;
    }

    &.s3{
      top: 15px;
      left: 0px;
      transform-origin: 100% 0%;
    }

    &.s4{
      top: 0px;
      left: 0px;
      transform-origin: 100% 100%;
      z-index: 3;
    }

  }
}

</style>
