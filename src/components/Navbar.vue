<template>
<div class="nav flex">

  <div class="nav-left flex">

    <div class="logo flex">
      <div class="v-center logo-icon">
        <ion-icon name="code"></ion-icon>
      </div>
      <div class="v-center logo-text">Acodo</div>
    </div>

    <div class="nav-link v-center">
      Library
    </div>

    <div class="nav-link active v-center">
      My courses
    </div>

    <div class="nav-link v-center">
      Leaderboards
    </div>

  </div>

  <div class="nav-middle flex">

    <div class="biscuit-container v-center">
      <NavBiscuit title="Python" :items="[{title:'Basic Algorithms',levels_total:8,levels_done:1,active:true,link:'/course/dfs/fds/fds'}]"></NavBiscuit>
    </div>

  </div>

  <div class="nav-right flex">

    <div class="notification-button v-center">
      <div class="inner">
        <div class="unread-dot"></div>
        <ion-icon name="notifications"></ion-icon>
      </div>
    </div>

    <div class="account flex">

      <div class="account-info">
        <div class="v-center h100">
          <h2 class="username">chrisdoe</h2>
          <p class="xp">
            <ion-icon name="sparkles"></ion-icon> 14 xp
          </p>
        </div>
      </div>


      <div class="account-icon v-center">
        <img src="https://robohash.org/fsjdkflskdf.png" alt="">
      </div>

      <div class="account-dropdown">
        <h3>hoi</h3>
      </div>

    </div>

  </div>

</div>
</template>

<script>
import NavBiscuit from './NavBiscuit.vue'

export default {
  name: 'Navbar',
  props: {
    biscuits: {
      default: []
    }
  },
  components: {
    NavBiscuit
  },
  data(){
    return{
      window: window
    }
  }
}
</script>

<style scoped lang="scss">
.nav {
    background-color: #fff;
    width: 100%;
    border-bottom: 1px solid #ECEBED;
    height: 66px;

    padding-left: 25px;
    padding-right: 25px;

    user-select: none;

    .nav-left,
    .nav-middle,
    .nav-right {
        height: 100%;
    }

    .nav-right {
        margin-left: auto;
    }

    .nav-middle {
        margin: 0 auto;
    }
}

.logo {
    .logo-icon {
        margin-right: 5px;
        ion-icon {
            font-size: 22px;
        }
    }
    .logo-text {
        font-weight: 600;
        font-size: 20px;
    }
}

.nav-link {
    margin-left: 25px;
    font-weight: normal;
    font-size: 14px;
    color: #5F6266;
    cursor: pointer;

    &.active {
        border-bottom: 1px solid #005FFE;
        margin-bottom: -1px;
        color: #000;
    }
}

.notification-button {
    border-left: 1px solid #ECEBED;
    border-right: 1px solid #ECEBED;
    font-size: 20px;
    color: #A0A1A7;
    width: 55px;

    .inner {
        width: 20px;
        height: 20px;
        margin: auto;
        position: relative;
    }

    .unread-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #EC4747;
        position: absolute;
        top: -3px;
        right: -3px;
    }

}

.account {

    margin-left: 25px;

    h2.username {
        font-weight: 400;
        font-size: 14px;
        color: #5F6266;
        text-align: right;
        margin-bottom: 2px;
    }
    .xp {
        font-weight: 400;
        font-size: 13px;
        line-height: 16px;
        color: #F2C94C;
        text-align: right;
    }
}

.account-info {
    margin-right: 10px;
    position: relative;
}

.account-icon {
    img {
        height: 35px;
        width: 35px;
        border-radius: 50%;
        background-color: #ECEBED;
    }
}

.biscuit-container {
    margin-left: 15px;

    &:last-child {
        margin-right: 15px;
    }
}

.account-dropdown{

}

</style>
