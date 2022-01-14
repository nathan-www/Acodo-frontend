<template lang="html">
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
            <input type="text" :class="'field ' + ((!socials.hasOwnProperty('twitter') || socials.twitter.trim() == '' || socials.twitter.match(/^[a-z0-9_]{4,15}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.twitter" @input="socials.twitter = $event.target.value">

            <p class="field-label">Linkedin</p>
            <input type="text" :class="'field ' + ((!socials.hasOwnProperty('linkedin') || socials.linkedin.trim() == '' || socials.linkedin.match(/^[a-z0-9-]{3,100}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.linkedin" @input="socials.linkedin = $event.target.value">

            <p class="field-label">GitHub</p>
            <input type="text" :class="'field ' + ((!socials.hasOwnProperty('github') || socials.github.trim() == '' || socials.github.match(/^[a-z0-9-]{1,39}$/) !== null) ? '':'invalid')" placeholder="johndoe" :value="socials.github" @input="socials.github = $event.target.value">

            <p class="field-label">Website</p>
            <input type="text" class="field" placeholder="https://mysite.com" :value="socials.website" @input="socials.website = $event.target.value">

            <p class="field-label">Location</p>
            <input type="text" :class="'field ' + ((!socials.hasOwnProperty('location') || socials.location.trim() == '' || socials.location.match(/^[A-Za-z0-9- ,]{1-35}$/) !== null) ? '':'invalid')" placeholder="London, UK" :value="socials.location" @input="socials.location = $event.target.value">

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

    </div>

  </div>
</div>


</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: "Settings",
  components: {
    Navbar
  },
  watch: {
    isLoggedIn: function(isLoggedIn) {
      if (isLoggedIn !== null && !isLoggedIn) {
        this.$router.push('/account/login');
      }
    },
    profile: function(profile) {
      this.socials = JSON.parse(JSON.stringify(profile.socials));
      this.show_email = profile.socials.hasOwnProperty('email');
    }
  },
  methods: {

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
      save_profile_loading: false
    }
  },
  mounted() {
    if (this.isLoggedIn !== null && !this.isLoggedIn) {
      this.$router.push('/account/login');
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

h2 {
    color: #151538;
    margin-bottom: 35px;
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
</style>
