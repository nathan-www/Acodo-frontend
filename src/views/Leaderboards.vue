<template>
<Navbar></Navbar>

<div class="main">
  <div class="main-inner">
    <h1>Leaderboards</h1>


    <div v-if="loading_leaderboards" class="loadingFill" style="width: 100%; height: 300px; margin-top: 35px;"></div>
    <div v-else>

      <div class="tabs flex">
        <div @click="current_leaderboard=l.name" :class="'tab ' + (current_leaderboard==l.name ? 'active':'')" v-for="l in leaderboards">
          {{ l.name }}
        </div>
      </div>

      <template v-for="leaderboard in leaderboards">
        <template v-if="current_leaderboard==leaderboard.name">
          <div class="table-header flex">
            <div class="item rank">#</div>
            <div class="item">Player</div>
            <div class="item right">{{ leaderboard.measure }}</div>
          </div>

          <div>
            <div class="entry flex" v-for="(entry,index) in leaderboard.leaderboard">
              <div class="item rank v-center">
                {{ index }}
              </div>
              <div class="item flex user" @click="router_push('/@/'+entry['username'])">
                <div class="v-center">
                  <img :src="'https://robohash.org/' + MD5(entry['username'])" alt="" class="profile-pic">
                </div>
                <div class="v-center">
                  {{ entry['username'] }}
                </div>
              </div>
              <div class="item right v-center">
                {{ entry['score'] }}
              </div>
            </div>
          </div>
        </template>
      </template>

    </div>


  </div>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

import {
  MD5
} from '@/utility/MD5'

export default {
  name: "Leaderboards",
  components: {
    Navbar
  },
  data() {
    return {
      loading_leaderboards: true,
      leaderboards: [],
      current_leaderboard: null,
      MD5: MD5
    }
  },
  created() {

    this.api_request("GET", "/leaderboards").then((resp) => {
      if (resp.status == "success") {
        this.loading_leaderboards = false;
        this.leaderboards = resp.leaderboards;
        this.current_leaderboard = this.leaderboards[0]['name'];
      }
    });

  }
}
</script>

<style lang="scss" scoped>
.main {
    padding: 85px;
    min-height: calc(100vh - 66px);

    .main-inner {
        margin: 0 auto;
        max-width: 1300px;
    }
}

.tabs {

    margin-top: 35px;
    margin-left: -5px;

    .tab {
        color: #5F6266;
        padding: 0 12px 8px;
        margin: 0 5px;
        cursor: pointer;

        &.active {
            color: #000;
            border-bottom: 1px solid #005FFE;
        }
    }

}

.table-header {

    margin-top: 20px;
    color: #151538;
    font-weight: 500;

    .right {
        margin-left: auto;
    }

}

.entry {

    &:nth-child(even) {
        background-color: #F8FAFC;
    }

    .right {
        margin-left: auto;
    }

    .user {
        cursor: pointer;
    }

    color: #5F6266;
    font-weight: 300;
}

.entry,
.table-header {

    padding: 6px 15px;

    .item.rank {
        width: 45px;
    }
}

.profile-pic {
    height: 30px;
    width: 30px;
    border-radius: 4px;
    border: 1px solid #6FCF97;
    margin-right: 8px;
}

h1 {
    color: #151538;
}
</style>
