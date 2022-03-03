<template>
<Navbar></Navbar>


<div class="main">
  <div class="main-inner flex">

    <div class="card side-card">

      <h2>Settings</h2>

      <div @click="settings_tab = 'profile'" :class="'settings-tab v-center ' + ((settings_tab == 'profile') ? 'active':'')">
        Profile
      </div>

      <div @click="settings_tab = 'security'" :class="'settings-tab v-center ' + ((settings_tab == 'security') ? 'active':'')">
        Security
      </div>

    </div>

    <div class="card right-card" v-if="typeof(profile) !== 'undefined' && profile !== null">

      <div v-if="settings_tab == 'profile'">

        <p class="field-label">Twitter</p>
        <input type="text" :class="'field ' + ((!socials.hasOwnProperty('twitter') || socials.twitter.trim() == '' || socials.twitter.match(/^[a-z0-9_]{4,15}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.twitter"
          @input="socials.twitter = $event.target.value">

        <p class="field-label">Linkedin</p>
        <input type="text" :class="'field ' + ((!socials.hasOwnProperty('linkedin') || socials.linkedin.trim() == '' || socials.linkedin.match(/^[a-z0-9-]{3,100}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.linkedin"
          @input="socials.linkedin = $event.target.value">

        <p class="field-label">GitHub</p>
        <input type="text" :class="'field ' + ((!socials.hasOwnProperty('github') || socials.github.trim() == '' || socials.github.match(/^[a-z0-9-]{1,39}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.github"
          @input="socials.github = $event.target.value">

        <p class="field-label">Website</p>
        <input type="text" class="field" placeholder="https://mysite.com" :value="socials.website" @input="socials.website = $event.target.value">

        <p class="field-label">Location</p>
        <input type="text" :class="'field ' + ((!socials.hasOwnProperty('location') || socials.location.trim() == '' || socials.location.match(/^[A-Za-z0-9- ,]{1-35}$/) !== null) ? '':'invalid')" placeholder="London, UK" :value="socials.location"
          @input="socials.location = $event.target.value">

        <p class="field-label">Email</p>
        <input type="text" class="field" placeholder="example@example.com" :value="account.email" disabled>

        <div class="checkbox-area flex">
          <div class="v-center">
            <div :class="'checkbox v-center ' + (show_email ? 'on':'')" @click="show_email = !show_email">
              <ion-icon name="checkmark"></ion-icon>
            </div>
          </div>
          <div class="v-center">
            <p>Show email on profile</p>
          </div>
        </div>

        <div class="btn btn-primary" style="margin-top: 30px;" @click="save_profile()">Save
          <img v-if="save_profile_loading" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" alt="">
        </div>


      </div>

      <div v-if="settings_tab == 'security' && account !== null">

        <h3>Logins</h3>

        <div class="session-card flex" v-for="session in account.sessions.sort((a,b) => a.last_active < b.last_active)">
          <div class="v-center session-icon">
            <ion-icon name="location"></ion-icon>
          </div>
          <div class="v-center session-body">
            <h4>{{ session.geo }}</h4>
            <p v-if="session.last_active_relative == 'just now'"><span class="active">Active now</span> &bull; {{ session.device }} <span v-if="session.current">(You)</span></p>
            <p v-else>{{ session.last_active_relative }} &bull; {{ session.device }} <span v-if="session.current">(You)</span></p>
          </div>
          <div class="v-center controls">
            <div v-if="session.current" class="btn btn-small btn-danger" @click="logout(session.session_id,true)">Log out</div>
            <div v-else class="btn btn-small btn-danger" @click="logout(session.session_id)">Log out</div>
          </div>
        </div>

        <div v-if="account.sessions.length > 1" class="btn btn-danger" @click="logout('all')">Log out of all</div>

        <div style="height: 50px;"></div>

        <h3>Change password</h3>

        <div class="fail-message" style="margin-bottom: 25px" v-if="change_password_fail">Failed to change password</div>
        <div class="success-message" style="margin-bottom: 25px" v-if="change_password_successful">Successfully changed password</div>

        <p class="field-label">Old password</p>
        <input :value="change_password_old" @input="change_password_old = $event.target.value" type="password" class="field" placeholder="Enter your old password">

        <div class="flex">
          <div>
            <p class="field-label">New password</p>
            <input :value="change_password_new" @input="change_password_new = $event.target.value" type="password" class="field" placeholder="Enter your new password">
            <br />
            <div class="btn btn-primary" @click="change_password()">Change password <img v-if="change_password_loading" class="inline-loader betterIcon" src="@/assets/img/loader-white.png" /></div>
          </div>
          <div>
            <PasswordChecker :password="change_password_new"></PasswordChecker>
          </div>
        </div>


      </div>

    </div>

  </div>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import PasswordChecker from '@/components/PasswordChecker.vue'

export default {
  name: "Settings",
  components: {
    Navbar,
    PasswordChecker
  },
  watch: {
    isLoggedIn: function(isLoggedIn) {
      if (isLoggedIn !== null && !isLoggedIn) {
        this.router_push('/account/login');
      }
    },
    profile: function(profile) {
      this.socials = JSON.parse(JSON.stringify(profile.socials));
      this.show_email = profile.socials.hasOwnProperty('email');
    }
  },
  methods: {

    logout(session_id, reload = false) {
      this.api_request('POST', '/account/logout', {
        session_id: session_id
      }).then(() => {
        this.$store.dispatch('getAccount', {
          'force_reload': true
        });
      })
    },

    save_profile() {

      this.save_profile_loading = true;
      let save_promises = [];

      Object.values(this.socials).forEach((value, key) => {
        key = Object.keys(this.socials)[key];
        if (this.profile.socials[key] !== value) {
          save_promises.push(this.save_profile_item(key, value));
        }
      });

      if (this.show_email !== this.profile.socials.hasOwnProperty('email')) {
        save_promises.push(this.save_profile_item('show_email', this.show_email));
      }

      Promise.all(save_promises).then(() => {

        this.$store.dispatch('getProfile', {
          'username': this.account.username,
          'force_reload': true
        });

        (new Promise(function(resolve, reject) {
          setTimeout(() => {
            resolve();
          }, 400);
        })).then(() => {
          this.save_profile_loading = false;
          window.location.reload();
        });


      });

    },
    save_profile_item(key, value) {
      let obj = {};
      if (typeof(value) !== "boolean" && value.trim() == "") {
        obj['delete_field'] = key;
      } else {
        obj[key] = value;
      }
      return this.api_request('POST', '/editProfile', obj);
    },

    change_password(){

      this.change_password_fail = false;
      this.change_password_successful = false;
      this.change_password_loading = true;

      this.api_request('POST','/account/changePassword',{
        'old_password':this.change_password_old,
        'new_password':this.change_password_new
      },1000).then((resp) => {

        this.change_password_loading = false;

        if(resp.status == "success"){
          this.change_password_successful = true;
          setTimeout(() => {
            this.router_push('/account/login');
          } , 2000);
        } else {
          this.change_password_fail = true;
        }
      });

    }

  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    account() {
      return this.$store.getters.getAccount;
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
  data() {
    return {
      settings_tab: "profile",
      socials: {},
      show_email: false,
      console: console,
      save_profile_loading: false,

      change_password_old: "",
      change_password_new: "",
      change_password_loading: false,
      change_password_fail: false,
      change_password_successful: false

    }
  },
  mounted() {
    if (this.isLoggedIn !== null && !this.isLoggedIn) {
      this.router_push('/account/login');
    }

    if (typeof(this.profile) !== 'undefined' && this.profile !== null) {
      this.socials = JSON.parse(JSON.stringify(this.profile.socials));
      this.show_email = this.profile.socials.hasOwnProperty('email');
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
    padding: 50px;
    background-color: #F8FAFC;
    min-height: calc(100vh - 66px);

    .main-inner {
        margin: 0 auto;
        max-width: 1300px;
        align-items: flex-start;
    }
}

.card {
    padding: 20px;
    border: 1px solid #ECEBED;
    background-color: #fff;
    border-radius: 10px;
    flex-shrink: 0;
}

.right-card {
    flex-grow: 1;
    margin-left: 50px;
}

.side-card {
    width: 350px;
}

.settings-tab {
    padding: 10px;
    margin-bottom: 5px;
    border-radius: 6px;
    color: #383A42;
    user-select: none;
    cursor: pointer;
    transition: background-color 0.2s;

    &.active,
    &:hover {
        background-color: #F8F8FA;
    }
}

h2,
h3 {
    color: #151538;
}

h2 {
    margin-bottom: 35px;
}

h3 {
    margin-bottom: 20px;
}

p.field-label {
    color: #5F6266;
    margin-bottom: 5px;
    font-size: 14px;
}

.field {
    padding: 8px 10px;
    border: 1px solid #C4C4C4;
    color: #5F6266;
    border-radius: 6px;
    font-size: 15px;

    margin-bottom: 20px;

    &.invalid {
        border-color: #EC4747;
    }

    &::placeholder {
        color: #C4C4C4;
    }

    outline: none;

}

.checkbox-area {

    margin-top: -8px;

    p {
        color: #5F6266;
        font-size: 14px;
        margin-left: 5px;
    }

    .checkbox {
        border: 1px solid #C4C4C4;
        height: 18px;
        width: 18px;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.1s, border-color 0.1s;

        &.on {
            background-color: #3A76F6;
            border-color: transparent;
        }

        ion-icon {
            font-size: 12px;
            margin: auto;
            --ionicon-stroke-width: 50px;
            color: #fff;
        }
    }

}

.session-card {

    .session-icon {
        font-size: 25px;
        color: #A0A1A7;
        margin-right: 10px;
    }

    h4 {
        color: #5F6266;
        font-size: 18px;
        font-weight: 400;
    }

    p {
        color: #A0A1A7;
        font-size: 13px;
    }

    .active {
        color: #6FCF97;
    }

    border: 1px solid #E5E5E5;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 15px;
    max-width: 475px;

    .controls {
        margin-left: auto;
    }

}

.fail-message,
.success-message {
    background-color: #EC4747;
    color: #fff;
    font-size: 14px;
    padding: 7px 20px;
    border-radius: 6px;
    display: inline-block;
    max-width: 390px;
}

.success-message {
    background-color: #6FCF97;
}

</style>
