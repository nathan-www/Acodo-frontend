<template>
<div class="nav-biscuit flex" @click="showDropdown = true">

  <div class="biscuit-circle-container v-center">
    <ProgressCircle :progress="Math.floor((items.reduce((total, current) => { return total + current.levels_done; },0)/items.reduce((total, current) => { return total + current.levels_total; },0))*100)"></ProgressCircle>
  </div>

  <div class="biscuit-info">
    <h3>{{title}}</h3>
    <p>{{ Math.floor((items.reduce((total, current) => { return total + current.levels_done; },0)/items.reduce((total, current) => { return total + current.levels_total; },0))*100) }}%</p>
  </div>
  <div class="biscuit-toggle-icon v-center">
    <ion-icon name="chevron-down-outline"></ion-icon>
  </div>


  <div class="biscuit-dropdown-area" v-click-outside="function(){ showDropdown=false; }" v-if="showDropdown">

    <div v-for="item in items" :class="'dropdown-item ' + (item.active ? 'active':'')">
      <div class="flex">
        <div class="v-center">
          <div :class="'dropdown-icon v-center ' + (item.levels_done==item.levels_total ? 'check':'')">
            <ion-icon v-if="item.levels_done==item.levels_total" name="checkmark-outline"></ion-icon>
          </div>
        </div>
        <div class="dropdown-info v-center">
          <div>
            <h3>{{item.title}}</h3>
            <p v-if="item.levels_total > 1">{{item.levels_done}}/{{item.levels_total}} levels complete</p>
          </div>
        </div>
        <div class="v-center" style="margin-left: auto;">
          <div class="active-dot"></div>
        </div>
      </div>
    </div>


  </div>

</div>
</template>

<script>

import ProgressCircle from './ProgressCircle.vue'

export default {
  name: 'NavBiscuit',
  props: {
    title: {},
    items: {}
  },
  components: { ProgressCircle },
  data(){
    return {
      showDropdown: false,
      window: window
    }
  }
}
</script>

<style lang="scss" scoped>


.biscuit-dropdown-area {
    background: #FFFFFF;
    box-shadow: 0 0 10px 1px rgba(196, 196, 196, 0.3);
    border-radius: 5px;
    position: absolute;
    bottom: -10px;
    left: 0;
    transform: translateY(100%);
    padding: 10px 0px;
    z-index: 20;

    .dropdown-item {

        margin: 0px 10px;
        padding: 10px 15px;
        width: 400px;
        transition: background-color 0.3s;
        border-radius: 6px;

        &:hover{
          background-color: #f8f8fa;
        }

        &.active{
          .active-dot{
            background-color: #005FFE;
            width: 7px;
            height: 7px;
            border-radius: 50%;
          }
        }

        h3 {
            font-weight: 500;
            font-size: 14px;
            color: #5f6266;
            margin-bottom: 1.5px;
        }

        p {
            font-weight: 400;
            font-size: 12px;
            color: #A0A1A7;
        }
    }

    .dropdown-icon{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #e7f7ed;
      color: #6fcf97;
      --ionicon-stroke-width: 48px;
      font-size: 17px;
      margin-right: 10px;
      background-color: #ECEBED;

      &.check{
        background-color: #e7f7ed;
      }

      &.check ion-icon{
        margin: auto;
      }
    }
}

.nav-biscuit {
    border: 1.5px solid #ECEBED;
    padding: 5px 15px;
    border-radius: 5px;
    transition: box-shadow 0.2s;
    cursor: pointer;
    position: relative;

    &:hover {
        box-shadow: 0 0 5px 0 #ecebed;
    }

    .biscuit-circle-container {
        margin-right: 10px;
    }

    .biscuit-info {
        h3 {
            font-weight: 400;
            font-size: 14px;
            color: #a0a1a7;
            margin-bottom: 1.5px;
        }

        p {
            font-weight: 400;
            font-size: 11px;
            color: #6FCF97;
        }
    }

    .biscuit-toggle-icon {
        color: #A0A1A7;
        margin-left: 20px;
    }
}

</style>
