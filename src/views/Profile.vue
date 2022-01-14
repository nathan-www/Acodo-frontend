<template>
  
<Navbar></Navbar>

<div class="main">
  <div class="main-inner flex">

    <div class="side-card" v-if="profile == null">
      <div class="loadingFill" style="width: 100px; height: 100px; margin-bottom: 25px;"></div>
      <div class="loadingFill" style="width: 170px; height: 30px; margin-bottom: 25px;"></div>
      <div class="loadingFill" style="width: 200px; height: 30px; margin-bottom: 8px;"></div>
      <div class="loadingFill" style="width: 200px; height: 30px; margin-bottom: 8px;"></div>
      <div class="loadingFill" style="width: 200px; height: 30px; margin-bottom: 8px;"></div>
      <div class="loadingFill" style="width: 200px; height: 30px; margin-bottom: 8px;"></div>
    </div>

    <div class="side-card" v-else>

      <img :src="'https://robohash.org/'+MD5(username)" alt="" class="profile-pic">

      <div class="flex name">
        <div class="v-center">
          <span :class="'activity-orb ' + ( (profile.last_seen_seconds<180)?'online':'')"></span>
        </div>
        <div class="v-center">
          <h1>{{username}}</h1>
        </div>
      </div>

      <p>Last active {{profile.last_seen_relative}}</p>

      <div class="properties">

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="sparkles-sharp"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.xp) }}</span> XP</span>
          </div>
        </div>

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="flame"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.stats.streak) }}</span> Days streak</span>
          </div>
        </div>

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="checkbox"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.stats.solutions) }}</span> Solutions</span>
          </div>
        </div>

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="arrow-up"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.stats.solution_upvotes) }}</span> Solution upvotes</span>
          </div>
        </div>

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="star"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.stats.best_solutions) }}</span> Best solutions</span>
          </div>
        </div>

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="chatbubble"></ion-icon>
          </div>
          <div class="text v-center">
            <span><span class="fig">{{ AbbreviateNumber(profile.stats.comments) }}</span> Comments</span>
          </div>
        </div>

      </div>

      <div class="divider"></div>

      <div class="properties">

        <div class="property flex">
          <div class="icon v-center">
            <ion-icon name="calendar"></ion-icon>
          </div>
          <div class="text v-center">
            <span>Joined {{ConvertTime(profile.joined_timestamp,'relative')}}</span>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('location')">
          <div class="icon v-center">
            <ion-icon name="location"></ion-icon>
          </div>
          <div class="text v-center">
            <span>{{ profile.socials.location }}</span>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('email')">
          <div class="icon v-center">
            <ion-icon name="mail"></ion-icon>
          </div>
          <div class="text v-center">
            <a :href="'mailto:'+profile.socials.email">{{ profile.socials.email }}</a>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('twitter')">
          <div class="icon v-center">
            <ion-icon name="logo-twitter"></ion-icon>
          </div>
          <div class="text v-center">
            <a target="_blank" rel="nofollow" :href="'https://twitter.com/'+profile.socials.twitter">{{ profile.socials.twitter }}</a>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('linkedin')">
          <div class="icon v-center">
            <ion-icon name="logo-linkedin"></ion-icon>
          </div>
          <div class="text v-center">
            <a target="_blank" rel="nofollow" :href="'https://www.linkedin.com/in/'+profile.socials.linkedin">{{ profile.socials.linkedin }}</a>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('github')">
          <div class="icon v-center">
            <ion-icon name="logo-github"></ion-icon>
          </div>
          <div class="text v-center">
            <a target="_blank" rel="nofollow" :href="'https://github.com/'+profile.socials.github">{{ profile.socials.github }}</a>
          </div>
        </div>

        <div class="property flex" v-if="profile.socials.hasOwnProperty('website')">
          <div class="icon v-center">
            <ion-icon name="link"></ion-icon>
          </div>
          <div class="text v-center">
            <a target="_blank" rel="nofollow" :href="profile.socials.website">{{ profile.socials.website }}</a>
          </div>
        </div>

      </div>

    </div>


    <div class="right-cards" v-if="profile !== null && typeof profile !== 'undefined'">


      <div class="right-card">
        <h1>Badges</h1>
        <div class="flex" v-if="profile.badges.length > 0">

          <div class="badge-container flex" v-for="badge in profile.badges">
            <div class="v-center">
              <div class="badge flex">
                <div class="badge-icon v-center">
                  {{ he.decode(badge.icon) }}
                </div>
                <div class="badge-text v-center">
                  {{ badge.name }}
                </div>
              </div>
            </div>
            <div class="v-center">
              <div class="badge-count">x{{ AbbreviateNumber(badge.votes) }}</div>
            </div>
          </div>

        </div>

        <p v-else>&#128533; This user has not received any badges yet</p>
      </div>

      <div class="right-card">
        <h1>Courses</h1>

        <p v-if="(profile.courses.length==0)">&#128533; This user has not enrolled on any courses yet</p>

        <div class="flex course-cards">

          <div class="course-card" v-for="course in profile.courses" @click="$router.push('/courses/'+course.course_slug)">
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

            <div class="course-progress-bar">
              <div class="bar-inner" :style="'width: '+course.progress+'%'"></div>
            </div>

            <div class="course-card-bottom">

              <h2>{{ course.course_title }}</h2>
              <h3>{{ course.progress }}% complete</h3>

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

              </div>

            </div>
          </div>

        </div>


      </div>


      <div class="right-card">

        <h1>Solutions</h1>

        <p v-if="(profile.solutions.length==0)">&#128533; This user has not submited any solutions yet</p>


        <div class="solution-card flex" v-for="s in profile.solutions">

          <div class="v-center">
            <div :class="'solution-vote ' + (((s.upvotes - s.downvotes)>=0)?'upvoted':'downvoted')">
              <ion-icon v-if="(s.upvotes - s.downvotes)>=0" name="arrow-up"></ion-icon>
              <span class="vote-count">{{ s.upvotes - s.downvotes }}</span>
              <ion-icon v-if="(s.upvotes - s.downvotes)<0" name="arrow-down"></ion-icon>
            </div>
          </div>

          <div class="v-center">
            <div class="solution-info">
              <div class="breadcrumb flex">
                <div class="v-center">
                  <a @click="$router.push('/courses/'+s.course_slug)">{{ s.course_title  }}</a>
                </div>
                <div class="v-center">
                  <span class="separator">
                    <ion-icon name="chevron-forward"></ion-icon>
                  </span>
                </div>
                <div class="v-center">
                  <a @click="$router.push('/courses/'+s.course_slug+'/'+s.chapter_slug)">{{ s.chapter_title  }}</a>
                </div>
              </div>
              <h2 @click="$router.push('/courses/'+s.course_slug+'/'+s.chapter_slug+'/'+s.level_slug)">{{ s.level_title }}</h2>
            </div>
          </div>


          <div class="v-center">

            <div class="solution-badges flex">

              <div class="badge flex" v-for="badge in s.solution_badges">
                <div class="badge-icon v-center">
                  {{ he.decode(badge.icon) }}
                </div>
                <div class="badge-text v-center">
                  {{ badge.name }}
                </div>
                <div class="badge-count v-center">{{ AbbreviateNumber(badge.votes) }}</div>
              </div>


            </div>

          </div>


          <div class="v-center best-solution" v-if="s.best_solution && (s.upvotes - s.downvotes)>0">
            <div class="flex">
              <div class="v-center">
                <ion-icon name="star"></ion-icon>
              </div>
              <div class="v-center">
                Best solution
              </div>
            </div>
          </div>

          <div class="v-center solution-time">
            <div class="flex">
              <div class="v-center">
                <ion-icon name="time-outline"></ion-icon>
              </div>
              <div class="v-center">
                {{ ConvertTime(s.timestamp,'semi-absolute') }}
              </div>
            </div>
          </div>

        </div>

      </div>


    </div>


    <div class="right-cards" v-else>

      <div class="right-card">
        <div class="loadingFill" style="width: 300px; height: 30px;"></div>
      </div>

      <div class="right-card flex">
        <div class="loadingFill" style="width: 200px; height: 200px; margin-right: 20px;"></div>
        <div class="loadingFill" style="width: 200px; height: 200px; margin-right: 20px;"></div>
      </div>

      <div class="right-card">
        <div class="loadingFill" style="width: 300px; height: 60px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="width: 300px; height: 60px; margin-bottom: 20px;"></div>
      </div>

    </div>

  </div>
</div>
</template>

<script>
import {
  MD5
} from '@/utility/MD5'

import Navbar from '@/components/Navbar.vue'

var he = require('he');

import {
  AbbreviateNumber
} from '@/utility/AbbreviateNumber';

export default {
  name: 'Profile',
  components: {
    Navbar
  },
  data() {
    return {
      he: he
    }
  },
  computed: {
    username() {
      return this.$route.params.username;
    },
    profile() {
      return this.$store.getters.getProfile(this.username);
    },
    nonexistent_profiles(){
      return this.$store.state.nonexistent_profiles;
    }
  },
  watch:{
    nonexistent_profiles: function(nonexistent_profiles){
      console.log("warch");
      if(nonexistent_profiles.hasOwnProperty(this.username)){
        this.$router.push('/404');
      }
    }
  },
  methods: {
    MD5(e) {
      return MD5(e);
    },
    AbbreviateNumber(n) {
      return AbbreviateNumber(n);
    },
  },
  mounted() {
    this.$store.dispatch('getProfile', {
      'username': this.username
    });

    if(this.nonexistent_profiles.hasOwnProperty(this.username)){
      this.$router.push('/404');
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

.solution-card {

    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }

    border: 1px solid #ECEBED;
    padding: 10px 20px;
    border-radius: 5px;

    .solution-badges {
        flex-wrap: wrap;
        margin: -5px;

        .badges {
            margin: 0 auto;
        }

        .badge {
            border: 0;
            margin: 5px;
            padding: 2px 5px;
        }

        .badge-count {
            color: #A0A1A7;
            font-size: 12px;
            margin-left: 5px;
        }

    }

    .best-solution {

        color: #F2C94C;
        font-size: 14px;
        padding: 0 20px;
        margin-left: auto;

        flex-shrink: 0;
        white-space: nowrap;

        ion-icon {
            font-size: 16px;
            margin-right: 3px;
            position: relative;
            top: -1.5px;
        }
    }

    .solution-time {
        color: #A0A1A7;
        font-size: 13px;

        flex-shrink: 0;
        white-space: nowrap;

        margin-left: auto;

        ion-icon {
            font-size: 16px;
            margin-right: 3px;
        }
        --ionicon-stroke-width: 40px;
    }

    .solution-info {

        flex-shrink: 0;
        white-space: nowrap;
        margin-right: 20px;

        h2 {
            color: #5F6266;
            font-size: 16px;
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
                color: #252526;
            }
        }

        .breadcrumb {

            margin-bottom: 4px;

            a {
                color: #A2A0A7;
                font-size: 12px;
                cursor: pointer;
                transition: color 0.2s;

                &:hover {
                    color: #5F6266;
                }
            }
            .separator {
                color: #C4C4C4;
                font-size: 12px;
                margin: 0 3px;
            }
        }

        margin-left: 20px;
    }

    .solution-vote {

        &.downvoted {
            color: #E45649;
        }

        ion-icon {
            font-size: 22px;
            margin: 0 auto;
            display: block;
            margin-bottom: 3px;
        }

        .vote-count {
            display: block;
            text-align: center;
        }

        color: #6FCF97;
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

    h3 {
        color: #6FCF97;
        font-size: 13px;
        font-weight: 500;
        margin-top: 3px;
        margin-bottom: 15px;
    }

}

.thumbnail {

    position: relative;
    user-select: none;
    height: 180px;

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
        height: 180px;
        border-radius: 5px 5px 0 0;
    }
}

.badge {

    background-color: #F8F8FA;
    border-radius: 3px;
    border: 1px solid #6FCF97;
    padding: 1px 6px;
    user-select: none;

    .badge-icon {}
    .badge-text {
        font-size: 13px;
        color: #5F6266;
        margin-left: 5px;
    }
}

.badge-container {
    .badge-count {
        font-size: 12px;
        color: #151538;
        margin-left: 5px;
        font-weight: 500;
        user-select: none;
    }

    margin-right: 15px;
}

.right-cards {
    width: 100%;
    margin-left: 30px;
}

.right-card {
    padding: 20px;
    border: 1px solid #ECEBED;
    background-color: #fff;
    border-radius: 10px;
    width: 100%;
    flex-shrink: 0;

    margin-top: 30px;

    &:first-child {
        margin-top: 0;
    }

    h1 {
        color: #A2A0A7;
        font-size: 15px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 15px;
    }

    h2 {
        color: #151538;
        font-weight: 500;
        font-size: 17px;

    }

    p {
        color: #5F6266;
        font-size: 13px;
    }

}

.side-card {
    padding: 20px;
    border: 1px solid #ECEBED;
    background-color: #fff;
    border-radius: 10px;
    width: 350px;
    flex-shrink: 0;

    .divider {
        width: 100%;
        height: 1px;
        background-color: #ECEBED;
    }

    .profile-pic {
        width: 100px;
        border-radius: 20px;
        background-color: #ECEBED;
        border: 2px solid #6FCF97;
        margin-bottom: 25px;
    }

    .activity-orb {
        width: 10px;
        height: 10px;
        background-color: #bbb;
        border-radius: 50%;
        margin-right: 7px;

        &.online {
            background-color: #6FCF97;
        }
    }

    .name {
        margin-bottom: 3px;
    }

    h1 {
        color: #5F6266;
        font-size: 20px;
        font-weight: 400;
    }

    p {
        font-size: 13px;
        color: #A0A1A7;
    }

    .properties {

        margin: 20px 0;

        .property {

            a {
                color: #5F6266;
                text-decoration: none;
            }

            margin-bottom: 8px;

            .icon {
                font-size: 18px;
                color: #A0A1A7;
                width: 20px;

                ion-icon {
                    margin: auto;
                }
            }

            .text {
                color: #A2A0A7;
                margin-left: 5px;

                .fig {
                    color: #5F6266;
                }
            }

        }

    }

}
</style>
