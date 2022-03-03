<template>
<Navbar></Navbar>

<div class="main">
  <div class="main-inner">

    <div class="card streak-card" v-if="$store.state.isLoggedIn !== null && $store.state.isLoggedIn">
      <h2>Welcome back, {{ (account.username[0].toUpperCase() + account.username.substring(1)) }}!</h2>
      <p>Complete at least 1 level per day to keep up your streak</p>

      <div class="streak-track flex" v-if="typeof(profile) !== 'undefined' && profile !== null">

        <div class="v-center" v-for="i in 16">

          <div :class="'orb v-center ' + ((profile.stats.streak >= i)?'active':'')" v-if="[1,6,11].includes(i)">
            <div class="orb-inner"></div>
          </div>


          <div :class="'orb fire v-center ' + ((profile.stats.streak >= i)?'active':'')" v-else-if="i == 16">
            <ion-icon name="flame"></ion-icon>
          </div>

          <div :class="'line ' + ((profile.stats.streak >= i)?'active':'')" v-else></div>



        </div>


      </div>


      <div class="streak-track-labels flex">
        <div class="label"><span class="label-inner">1 day</span></div>
        <div class="label"><span class="label-inner">6 days</span></div>
        <div class="label"><span class="label-inner">11 days</span></div>
        <div class="label"><span class="label-inner">16 days</span></div>
      </div>

    </div>

    <div class="flex" v-if="!loadedCourses">
      <div class="loadingFill" style="width: 340px; height: 290px; margin-right: 20px;"></div>
      <div class="loadingFill" style="width: 340px; height: 290px; margin-right: 20px;"></div>
      <div class="loadingFill" style="width: 340px; height: 290px; margin-right: 20px;"></div>
    </div>

    <div class="nocourses" v-if="loadedCourses && $store.state.courses.courses.filter((c) => c.enrolled).length == 0">
      <h3>You are not enrolled on any courses</h3>
      <div class="btn btn-primary" @click="router_push('/library')">
        <ion-icon class="betterIcon" name="apps"></ion-icon> Browse course library
      </div>
    </div>

    <div v-else>

      <h1 class="title">My courses</h1>

      <div class="flex course-cards" v-if="loadedCourses">

        <div class="course-card" v-for="course in $store.state.courses.courses.filter((c) => c.enrolled)" @click="router_push('/courses/'+course.course_slug)">
          <div class="thumbnail">
            <div class="thumbnail-inner">

              <div class="v-center v-100">
                <div>
                  <h2>
                    <ion-icon class="betterIcon" name="code-outline"></ion-icon> Acodo
                  </h2>
                  <h1>{{ course.course_title }}</h1>

                  <div class="language-badges flex">
                    <div class="language-badge" v-for="l in course.languages">{{l}}</div>
                  </div>
                </div>
              </div>
            </div>
            <img src="@/assets/img/thumbnail-bgs/1.png" alt="">
          </div>

          <div class="course-progress-bar" v-if="course.progress > 0">
            <div class="bar-inner" :style="'width: '+course.progress+'%'"></div>
          </div>
          <div v-else style="height: 7px"></div>

          <div class="course-card-bottom">

            <h2>{{ course.course_title }}</h2>
            <h3 v-if="course.progress > 0">{{ course.progress }}% complete</h3>
            <h3 class="desc" v-else>{{ course.description }}</h3>

            <div class="flex">

              <div class="course-prop flex">
                <div class="v-center">
                  <ion-icon name="time-outline"></ion-icon>
                </div>
                <div class="v-center">
                  <span class="fig">{{course.duration_hours}} hrs</span>
                </div>
              </div>

              <div class="course-prop orange flex">
                <div class="v-center">
                  <ion-icon name="sparkles-sharp"></ion-icon>
                </div>
                <div class="v-center">
                  {{course.total_xp}} xp
                </div>
              </div>

              <div class="course-prop flex" style="margin-left: auto;">
                <div class="v-center">
                  <ion-icon name="people"></ion-icon>
                </div>
                <div class="v-center">
                  <span class="fig">{{AbbreviateNumber(course.total_enrollments)}} enrolled</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>


    </div>




  </div>
</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

import {
  AbbreviateNumber
} from '@/utility/AbbreviateNumber'

export default {
  name: 'Library',
  components: {
    Navbar
  },
  watch: {
    isLoggedIn: function(isLoggedIn) {
      if (isLoggedIn !== null && !isLoggedIn) {
        this.router_push('/account/login');
      }
    }
  },
  methods: {
    AbbreviateNumber(n) {
      return AbbreviateNumber(n);
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    courses() {
      return this.$store.state.courses;
    },
    loadedCourses() {
      return this.$store.state.loadedCourses;
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
  mounted() {

    this.$store.dispatch('getCourses', {});

    if (this.isLoggedIn !== null && !this.isLoggedIn) {
      this.router_push('/account/login');
    }

  }
}
</script>

<style lang="scss" scoped>
.nocourses {
    text-align: center;
    margin-top: 100px;

    h3 {
        margin-bottom: 40px;
        color: #A0A1A7;
        font-weight: 400;
    }
}

.streak-track-labels {

    margin-top: 5px;
    user-select: none;

    .label {
        color: #5F6266;
        font-size: 13px;
        width: 70px;

        &:last-child {
            .label-inner {
                transform: translateX(calc(-50% + 15px));
            }
        }

        .label-inner {
            display: inline-block;
            transform: translateX(calc(-50% + 11px));
        }
    }
}

.streak-track {

    margin-top: 20px;

    .orb {
        height: 22px;
        width: 22px;
        border: 3px solid #ECEBED;
        border-radius: 50%;

        &.active{
            border: 3px solid #EC4747;

            .orb-inner {
                width: 55%;
                height: 55%;
                background-color: #EC4747;
                border-radius: 50%;
                margin: auto;
            }
        }

        &.fire {
            height: 30px;
            width: 30px;
            color: #ECEBED;

            &.active ion-icon{
              color: #EC4747;  
            }

            ion-icon {
                margin: auto;
            }
        }
    }

    .line {
        width: 12px;
        height: 3px;
        background-color: #ECEBED;

        &.active {
            background-color: #EC4747;
        }
    }
}

.streak-card {
    margin-bottom: 50px;

    h2 {
        margin-bottom: 5px;
    }
}

h1,
h2,
h3 {
    color: #151538;
}

h1 {
    margin-bottom: 35px;
    color: #151538;

    &.title {
        color: #A0A1A7;
        font-size: 18px;
        text-transform: uppercase;
        font-weight: 400;
    }
}

.streak-card {
    p {
        color: #5F6266;
    }
}

.card {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
    border: 1px solid #ECEBED;
    transition: box-shadow 0.2s;

    &.top {
        width: 100%;
    }

    &:hover {
        box-shadow: 0 0 4px #ECEBED;
    }
}

.main {
    padding: 50px;
    background-color: #fff;
    min-height: calc(100vh - 66px);

    .main-inner {
        margin: 0 auto;
        max-width: 1300px;
    }
}

.course-cards {
    flex-wrap: wrap;
}

.course-card {

    border: 1px solid #ECEBED;
    border-radius: 10px;
    transition: box-shadow 0.2s;
    cursor: pointer;
    width: 342px; //2px for border

    margin-right: 20px;
    margin-bottom: 20px;

    &:hover {
        box-shadow: 0 0 5px 2px rgba(196, 196, 196, 0.2);
    }

    .course-card-bottom {
        width: 100%;
        padding: 15px 25px;
    }

    .course-progress-bar {
        width: 100%;
        height: 7px;
        background-color: #F0F7FF;

        .bar-inner {
            background-color: #6FCF97;
            height: 100%;
        }
    }

    .course-prop {
        color: #A0A1A7;
        font-size: 12px;
        margin-right: 10px;
        --ionicon-stroke-width: 46px;

        &.orange {
            color: #F2C94C;
        }

        ion-icon {
            font-size: 14px;
            margin-right: 2px;
        }

        .fig {
            color: #5F6266;
        }
    }

    h2 {
        font-size: 17px;
        color: #151538;
    }

    h3 {
        color: #6FCF97;
        font-size: 13px;
        font-weight: 500;
        margin-top: 3px;
        margin-bottom: 15px;

        &.desc {
            color: #A0A1A7;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 400;
        }
    }

}

.thumbnail {

    position: relative;
    user-select: none;
    width: 340px;
    height: 179px;

    .thumbnail-inner {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding: 20px;

        h1 {
            color: #fff;
            font-size: 18px;
            margin-bottom: 35px;
            font-weight: 500;
            text-transform: none;
        }

        h2 {
            color: #A0A1A7;
            font-size: 14px;
            margin-bottom: 5px;
            font-weight: 500;
            --ionicon-stroke-width: 50px;
        }

        .language-badges {
            position: absolute;
            bottom: 25px;
        }

        .language-badge {
            color: #001733;
            background-color: #fff;
            padding: 2px 8px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            margin-right: 7px;
        }

    }

    img {
        width: 340px;
        border-radius: 5px 5px 0 0;
    }
}

.bg-banner {

    background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("~@/assets/img/stock/4.jpg");
    background-size: cover;
    background-position: left;
    height: 300px;
    border-radius: 15px;
    margin-bottom: 50px;
    padding: 25px 50px;

    h1 {
        color: #fff;
        font-family: 'Unna', serif;
        font-size: 50px;
        max-width: 75%;
        font-weight: 600;
        margin-bottom: 0;
    }

    h2 {
        color: #fff;
        margin-bottom: 20px;
        font-size: 20px;
        font-weight: 400;
    }

}
</style>
