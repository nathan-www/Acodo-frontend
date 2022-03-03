<template>
<div class="nav flex">

  <div class="nav-left flex">

    <div class="logo flex" @click="router_push('/my-courses')">
      <div class="v-center logo-icon">
        <ion-icon name="code"></ion-icon>
      </div>
      <div class="v-center logo-text">Acodo</div>
    </div>

    <div @click="router_push('/my-courses')" :class="'nav-link v-center ' + ((getPath()=='/my-courses')?'active':'')">
      My courses
    </div>

    <div @click="router_push('/library')" :class="'nav-link v-center ' + ((getPath()=='/library')?'active':'')">
      Library
    </div>

    <div @click="router_push('/leaderboards')" :class="'nav-link v-center ' + ((getPath()=='/leaderboards')?'active':'')">
      Leaderboards
    </div>

  </div>

  <div class="nav-middle flex">

    <div class="biscuit-container v-center">
      <div class="flex">
        <slot name="biscuits"></slot>
      </div>
    </div>

  </div>

  <div class="nav-right flex">

    <div class="notification-button v-center" @click="if(!showNotifications){ getNotifications(); } showNotifications = true" v-click-outside="(function(){ showNotifications = false; })">
      <div class="inner">
        <div class="unread-dot" v-if="unreadNotificationCount > 0"></div>
        <ion-icon name="notifications"></ion-icon>
      </div>

      <div class="notification-dropdown" v-if="showNotifications">

        <div v-if="loadingNotifications" class="notificationPlaceholder v-center">
          <img class="inline-loader" src="@/assets/img/loader-grey.png" alt="">
        </div>

        <div v-else-if="notifications.length == 0" class="notificationPlaceholder v-center">
          <p>You don't have any notifications</p>
        </div>

        <template v-else>

          <template v-for="notification in notifications">
            <div class="notification" v-if="notification.notification_data.type == 'reply'" @click="router_push(notification.notification_data.link_url)">

              <div class="flex">
                <div class="v-center">
                  <div class="flex">
                    <div class="v-center">
                      <div class="notification-unread-dot" v-if="!notification.has_read"></div>
                    </div>
                    <h3 v-html="notification.notification_data.title"></h3>
                  </div>
                </div>
                <div class="v-center" style="margin-left: auto;">
                  <div class="notification-time">{{ ConvertTime(notification.timestamp,"semi-absolute") }}</div>
                </div>
              </div>

              <p>{{ notification.notification_data.subtitle }}</p>
              <p class="notification-reference" v-html="notification.notification_data.link_text.replace('>','<span class=\'reference-divider\'><ion-icon name=\'chevron-forward-outline\'></ion-icon></span>')"></p>

            </div>
          </template>

        </template>

      </div>

    </div>


    <div class="v-center" v-if="$store.state.isLoggedIn == null">
      <div class="loadingFill" style="width: 125px; height: 46px; margin-left: 25px;"></div>
    </div>

    <div class="v-center" style="margin-left: 25px;" v-if="$store.state.isLoggedIn == false">
      <div class="btn btn-primary" @click="router_push('/account/login')">
        Login or Register
      </div>
    </div>

    <div v-if="$store.state.isLoggedIn" class="account flex" @click="showAccountDropdown = true" v-click-outside="(function(){ showAccountDropdown = false; })">

      <div class="account-info">
        <div class="v-center h100">
          <h2 class="username">{{account.username}}</h2>
          <p class="xp">
            <ion-icon name="sparkles"></ion-icon> {{account.xp}} xp
          </p>
        </div>
      </div>

      <div class="account-icon v-center">
        <img :src="'https://robohash.org/'+MD5(account.username)+'.png'" alt="">
      </div>

      <div class="account-dropdown" v-if="showAccountDropdown">
        <div class="account-dropdown-info">

          <div class="flex">

            <img class="dropdown-profile-pic" :src="'https://robohash.org/'+MD5(account.username)+'.png'" @click="router_push('/@/'+account.username)" alt="">

            <div>

              <h3><span @click="router_push('/@/'+account.username)">{{account.username}}</span> <span class="rank-badge">{{ getRank(account.xp)['currentRank'] }}</span></h3>

              <div class="account-dropdown-stats flex" v-if="profile !== null">

                <div class="stat flex">
                  <div class="stat-icon v-center" data-tooltip="Streak (days)">
                    <ion-icon name="flame"></ion-icon>
                  </div>
                  <div class="v-center">
                    <p class="stat-num">{{ profile.stats.streak }}</p>
                  </div>
                </div>

                <div class="stat flex">
                  <div class="stat-icon v-center" data-tooltip="Solutions">
                    <ion-icon name="checkbox"></ion-icon>
                  </div>
                  <div class="v-center">
                    <p class="stat-num">{{ profile.stats.solutions }}</p>
                  </div>
                </div>

                <div class="stat flex" style="position: relative; left: -2px;">
                  <div class="stat-icon v-center thick-icon" data-tooltip="Solution upvotes">
                    <ion-icon name="arrow-up-outline"></ion-icon>
                  </div>
                  <div class="v-center">
                    <p class="stat-num">{{ profile.stats.solution_upvotes }}</p>
                  </div>
                </div>

              </div>

            </div>
          </div>



          <div class="rank-progress-bar" v-if="profile !== null">
            <div class="progress-inner" :style="'width: ' +  ((account.xp/getRank(account.xp)['nextRankVal'])*100) + '%'"></div>
          </div>
          <p class="label">{{ getRank(account.xp)['nextRankVal'] - account.xp }} xp until next rank ({{ getRank(account.xp)['nextRank'] }})</p>

        </div>

        <div class="account-dropdown-links">

          <div class="dropdown-link flex" @click="router_push('/my-courses')">
            <div class="icon v-center">
              <ion-icon name="apps"></ion-icon>
            </div>
            <div class="title v-center">
              <h3>My courses</h3>
            </div>
          </div>

          <div class="dropdown-link flex" @click="router_push('/@/'+username)">
            <div class="icon v-center">
              <ion-icon name="person"></ion-icon>
            </div>
            <div class="title v-center">
              <h3>Profile</h3>
            </div>
          </div>

          <div class="dropdown-link flex" @click="router_push('/settings')">
            <div class="icon v-center">
              <ion-icon name="cog"></ion-icon>
            </div>
            <div class="title v-center">
              <h3>Settings</h3>
            </div>
          </div>

          <div class="dropdown-divider"></div>

          <div class="dropdown-link flex" @click="logout()">
            <div class="icon v-center">
              <ion-icon name="log-out-outline"></ion-icon>
            </div>
            <div class="title v-center">
              <h3>Logout</h3>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>

</div>
</template>

<script>
import NavBiscuit from './NavBiscuit.vue'
import {
  MD5
} from '@/utility/MD5'

export default {
  name: 'Navbar',
  props: {
    biscuits: {
      default: []
    }
  },
  computed: {
    account() {
      return this.$store.getters.getAccount;
    },
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    username() {
      if (this.account !== null) {
        return this.account.username;
      } else {
        return null;
      }
    },
    profile() {
      return this.$store.getters.getProfile(this.username);
    }
  },
  components: {
    NavBiscuit
  },
  data() {
    return {
      showAccountDropdown: false,
      showNotifications: false,

      notificationPoll: null,
      unreadNotificationCount: 0,
      notifications: [],
      loadingNotifications: true

    }
  },
  methods: {

    getNotifications() {
      this.loadingNotifications = true;
      this.api_request('GET', '/list-notifications').then((response) => {
        if (response.status == 'success') {
          this.loadingNotifications = false;
          this.notifications = Object.values(response.notifications);
        }
      })
    },

    logout() {
      this.api_request("POST", "/account/logout").then((resp) => {
        if (resp.status == "success") {
          this.router_push('/account/login');
        }
      })
    },

    getNotificationCount() {
      this.api_request('GET', '/unread-notifications').then((response) => {
        if (response.status == 'success') {
          this.unreadNotificationCount = response.count;
        }
      })
    },

    getPath() {
      return location.pathname;
    },
    MD5(txt) {
      return MD5(txt);
    },
    getRank(xp) {

      let ranks = [0, 20, 50, 100, 150, 200, 250, 300, 350, 500, 1000, 10000];

      let currentRank = 0;

      ranks.forEach((rank, i) => {
        if (xp >= rank) {
          currentRank = i;
        }
      });

      currentRank += 1;

      return {
        "currentRank": "Level " + currentRank,
        "nextRank": "Level " + (currentRank + 1),
        'nextRankVal': ranks[currentRank]
      }


    }
  },
  watch: {
    isLoggedIn: function(isLoggedIn) {
      if (isLoggedIn !== null && isLoggedIn) {
        this.$store.dispatch('getProfile', {
          'username': this.account.username
        });
      }
    }
  },
  mounted() {
    this.$store.dispatch('getAccount', {})



    if (this.isLoggedIn !== null && this.isLoggedIn) {
      this.$store.dispatch('getProfile', {
        'username': this.account.username
      });
    }

    this.notificationPoll = setInterval(() => {
      this.getNotificationCount();
    }, 6000)

  },

  beforeUnmount() {
    clearInterval(this.notificationPoll);
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

    cursor: pointer;
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
    position: relative;
    cursor: pointer;

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
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 6px 10px;
    position: relative;
    z-index: 9;

    transition: background-color 0.3s;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: #f8f8fa;
    }

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

.account-dropdown {
    position: absolute;
    bottom: -10px;
    right: 0;
    background: #FFFFFF;
    box-shadow: 0 0 10px 1px rgba(196, 196, 196, 0.3);
    border-radius: 5px;
    transform: translateY(100%);

    .account-dropdown-info {
        padding: 20px 25px;
    }

    .account-dropdown-links {
        border-top: 1px solid #ECEBED;
        padding: 10px 0;

        .dropdown-divider {
            border-top: 1px solid #ECEBED;
            margin: 10px 0;
        }

        .dropdown-link {

            padding: 10px;
            margin: 0 10px;

            transition: background-color 0.3s;
            border-radius: 6px;
            cursor: pointer;

            &:hover {
                background-color: #f8f8fa;
            }

            .icon {
                font-size: 17px;
                color: #A0A1A7;
                width: 25px;

                ion-icon {
                    margin: auto;
                }
            }
            .title h3 {
                font-size: 14px;
                color: #A0A1A7;
            }
        }

    }

    h3 {
        font-weight: 400;
        font-size: 14px;
        line-height: 15px;
        color: #5F6266;
        white-space: nowrap;
    }

    .rank-badge {
        font-weight: 400;
        font-size: 11px;
        color: #6FCF97;
        border: 1px solid #6FCF97;
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: 2px;
        position: relative;
        top: -1px;
    }

    .rank-progress-bar {
        margin-top: 12px;
        width: 200px;
        height: 4px;
        border-radius: 100px;
        background: #ECEBED;

        .progress-inner {
            background-color: #F2C94C;
            width: 160px;
            height: 4px;
            border-radius: 100px;
        }
    }

    p.label {
        margin-top: 4px;
        font-size: 11px;
        font-weight: 400;
        color: #A0A1A7;
    }

    .dropdown-profile-pic {
        height: 45px;
        width: 45px;
        border-radius: 5px;
        margin-right: 10px;
        border: 2px solid #ECEBED;
    }

    .account-dropdown-stats {
        margin-top: 5px;

        .stat-icon {
            font-size: 16px;
            color: #A0A1A7;
            margin-right: 2px;
        }

        .stat {
            margin-right: 10px;
        }

        .stat-num {
            font-size: 16px;
            color: #5F6266;
        }

    }
}

.notification-dropdown {
    position: absolute;
    bottom: -10px;
    right: 0;
    background: #FFFFFF;
    box-shadow: 0 0 10px 1px rgba(196, 196, 196, 0.3);
    border-radius: 5px;
    transform: translateY(100%);
    z-index: 20;

    max-height: 400px;
    overflow-y: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }

    .notification {

        min-width: 320px;

        margin: 10px;
        padding: 12px 18px;

        transition: background-color 0.3s;
        border-radius: 6px;
        cursor: pointer;

        &:hover {
            background-color: #f8f8fa;
        }

        h3::v-deep {
            font-size: 13px;
            font-weight: 400;
            color: #5F6266;
            white-space: nowrap;
            position: relative;

            b {
                color: #151538;
                font-weight: 400;
            }
        }

        p {
            margin-top: 5px;
            font-size: 12px;
            line-height: 12px;
            color: #A0A1A7;
        }

        .notification-time {
            color: #C4C4C4;
            font-size: 10px;
        }

        p.notification-reference::v-deep {
            color: #A0A1A7;
            font-weight: 400;
            margin-top: 10px;

            .reference-divider {
                color: #5F6266;
                position: relative;
                top: 2px;
            }
        }
    }
}

.notificationPlaceholder {
    width: 320px;
    height: 50px;

    color: #5F6266;
    font-size: 13px;

    p {
        width: 320px;
        text-align: center;
    }

    img {
        margin: 0 auto;
    }
}

.notification-unread-dot {
    background-color: #005FFE;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-right: 5px;
}
</style>
