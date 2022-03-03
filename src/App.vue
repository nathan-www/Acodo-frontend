<template>

  <div class="loading-bar" v-if="loading_bar_width < 100" :style="'width: ' + loading_bar_width + 'vw'"></div>

<router-view />
</template>


<style lang="scss">
@use 'style/main.scss';


.loading-bar{
  height: 5px;
  position: fixed;
  top: 0px;
  left: 0px;
  background-color: #6FCF97;
  z-index: 200;
}

</style>


<script>

import Navbar from '@/components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  data(){
    return {
      loading_bar_width: 0
    }
  },
  methods: {

    load_bar: function(callback){

      this.loading_bar_width = 0;
      let that = this;

      let speeds = Array.apply(null, Array(11)).map(() => {
        return Math.random() * (3.5 - 0.03) + 0.03;
      });

      function progress(){
        setTimeout(() => {
          if(that.loading_bar_width < 100){
            that.loading_bar_width += 1;
            progress();
          } else {
            callback();
          }
        }, speeds[Math.floor(that.loading_bar_width/10)])
      }

      progress();

    }

  },
  mounted(){
    window.app = this;

    this.emitter.on("router_push", path => {
      this.load_bar(() => {
        this.$router.push(path);
      });
    });

  }
}
</script>
