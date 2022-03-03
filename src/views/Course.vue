<template>
<Navbar></Navbar>

<div class="main">

  <div class="main-inner">

    <div class="card card-top flex" v-if="typeof(course) !== 'undefined' && course !== null">
      <div class="card-left">

        <div v-if="course.enrolled" class="btn btn-success btn-small enroll-btn" @click="unenroll()">
          <div class="flex">
            <div class="v-center">
              <ion-icon name="checkmark"></ion-icon>
            </div>
            <div class="v-center">
              &nbsp;Enrolled
            </div>
          </div>
        </div>

        <div v-else class="btn btn-grey btn-small enroll-btn" @click="enroll()">
          <div class="flex">
            <div class="v-center">
              <ion-icon name="add"></ion-icon>
            </div>
            <div class="v-center">
              &nbsp;Enroll
            </div>
          </div>
        </div>

        <h1>{{course.course_title}}</h1>
        <p class="desc">{{ course.description }}</p>
        <div class="course-properties">
          <p><span class="key">Languages: </span> <span class="value">{{ course.languages.join(", ") }}</span></p>
          <p><span class="key">Difficulty: </span> <span class="value">{{ course.difficulty }}</span></p>
          <p><span class="key">Authors: </span><span class="value"><a v-for="author in course.authors" @click="router_push('/@/'+author.username)">{{author.username}}</a></span></p>
        </div>

        <div class="card-bottom flex">

          <div class="bottom-item flex">
            <span class="v-center bottom-icon orange">
              <ion-icon name="sparkles-sharp"></ion-icon>
            </span>
            <span class="v-center text">
              {{course.total_xp}}xp Total
            </span>
          </div>

          <div class="bottom-item flex">
            <span class="bottom-icon v-center blue">
              <ion-icon name="time-outline"></ion-icon>
            </span>
            <span class="v-center text">
              {{course.duration_hours}}hrs
            </span>
          </div>

          <div class="bottom-item flex">
            <span class="bottom-icon v-center red">
              <ion-icon name="bar-chart"></ion-icon>
            </span>
            <span class="v-center text">
              {{ Object.values(course.chapters).reduce((a,b) => a+Object.keys(b.levels).length,0) }} levels
            </span>
          </div>

        </div>

      </div>
      <div class="card-right">

        <div class="v-center v-100">

          <div>
            <div class="thumbnail-container">
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

              <div class="progress-bar" v-if="progress.done > 0">
                <div class="progress-bar-inner" :style="'width: ' + Math.ceil((progress.done/progress.total)*100) + '%'"></div>
              </div>

              <div class="progress-text" v-if="progress.done > 0">
                {{ Math.ceil((progress.done/progress.total)*100) }}% completed <ion-icon v-if="Math.ceil(progress.done/progress.total) == 1" class="betterIcon" name="checkmark-circle"></ion-icon>
              </div>

            </div>



          </div>

        </div>

      </div>
    </div>

    <div class="card card-top" v-else>

      <div class="loadingFill" style="height: 30px; width: 250px; margin-bottom: 10px;"></div>
      <div class="loadingFill" style="height: 50px; width: 450px; margin-bottom: 25px;"></div>
      <div class="loadingFill" style="height: 70px; width: 145px; margin-bottom: 25px;"></div>
      <div class="loadingFill" style="height: 15px; width: 185px;"></div>

    </div>



    <div class="chapter-cards flex" v-if="typeof(course) !== 'undefined' && course !== null">

      <div class="card chapter-card" v-for="(chapter,i) in Object.values(course.chapters)">
        <h3>Chapter {{ i+1 }}</h3>
        <h2>{{ chapter.chapter_title }}</h2>

        <p class="level-count">{{Object.values(chapter.levels).length}} level{{ (Object.values(chapter.levels).length==1)?"":"s" }}</p>

        <div class="level-card flex" v-for="level in Object.values(chapter.levels)" @click="router_push('/courses/'+course_slug+'/'+chapter.chapter_slug+'/'+level.level_slug)">
          <div class="v-center">
            <div :class="'level-icon v-center ' + (level.complete?'complete':'')">
              <ion-icon name="checkmark-outline"></ion-icon>
            </div>
          </div>
          <div class="v-center w100">

            <div class="level-text w100 flex">

              <div class="v-center">
                {{ level.level_title }}
              </div>

              <div class="v-center auto-left">
                <span class="difficulty-text easy" v-if="level.difficulty.toLowerCase() == 'easy'">Easy</span>
                <span class="difficulty-text medium" v-if="level.difficulty.toLowerCase() == 'medium'">Medium</span>
                <span class="difficulty-text hard" v-if="level.difficulty.toLowerCase() == 'hard'">Hard</span>
              </div>

            </div>

          </div>
          <div class="v-center right-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
        </div>

      </div>
    </div>

  </div>

</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: "Course",
  components: {
    Navbar
  },
  data() {
    return {
      course_slug: this.$route.params.course_slug,
    }
  },
  computed: {
    course() {
      return this.$store.getters.getCourse(this.course_slug);
    },
    account() {
      return this.$store.getters.getAccount;
    },
    progress() {
      return Object.values(this.course.chapters).reduce((prev, curr) => {
        return {
          total: (prev.total + Object.values(curr.levels).length),
          done: (prev.done + Object.values(curr.levels).filter((l) => l.complete).length)
        };
      }, {
        total: 0,
        done: 0
      })
    }
  },
  methods: {

    enroll() {

      if (this.account == null) {
        this.router_push('/account/login');
      } else {
        this.api_request('POST', '/courses/' + this.course_slug + '/enroll').then(() => {
          this.$store.dispatch('getCourse', {
            'course_slug': this.course_slug,
            'force_reload': true
          });
        });
      }
    },

    unenroll() {
      this.api_request('POST', '/courses/' + this.course_slug + '/unenroll').then(() => {
        this.$store.dispatch('getCourse', {
          'course_slug': this.course_slug,
          'force_reload': true
        });
      });
    },

  },
  mounted() {

    this.$store.dispatch('getCourse', {
      'course_slug': this.course_slug
    });

  }
}
</script>

<style lang="scss" scoped>
p.desc {
    margin-right: 35px;
}

h1 {
    color: #151538;
    font-size: 25px;
    margin-bottom: 10px;
}

h2 {
    color: #5F6266;
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 20px;
}

h3 {
    color: #A0A1A7;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 3px;
}

p {
    font-size: 14px;
    color: #5F6266;
}

.progress-text {
    padding: 10px;
    font-size: 14px;
    color: #6FCF97;
}

.main {
    padding: 50px;
    background-color: #F8F8FA;
    min-height: calc(100vh - 66px);

    .main-inner {
        margin: 0 auto;
        max-width: 1300px;
    }
}

.enroll-btn {
    margin-bottom: 10px;
    --ionicon-stroke-width: 45px;
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

.course-properties {
    margin: 25px 0;

    p {
        margin-bottom: 7px;
    }

    span.key {
        color: #A2A0A7;
    }
    span.value {
        color: #5F6266;
    }

    a {
        color: #005FFE;
        cursor: pointer;
        font-weight: 500;
    }
}

.bottom-item {
    margin-right: 15px;

    span.text {
        color: #5F6266;
        font-size: 14px;
    }

    .icon {
        margin-right: 5px;
        font-size: 17px;
    }

    .bottom-icon {
        color: #fff;
        background-color: #000;
        width: 28px;
        height: 28px;
        border-radius: 5px;
        margin-right: 5px;

        --ionicon-stroke-width: 46px;
        font-size: 18px;

        &.orange {
            color: #F2C94C;
            background-color: rgba(#F2C94C,0.17);
        }

        &.blue {
            color: #65B0F2;
            background-color: rgba(#65B0F2,0.17);
        }

        &.red {
            color: #ED6964;
            background-color: rgba(#ED6964,0.17);
        }

        ion-icon {
            margin: auto;
        }
    }

}

.chapter-cards {
    margin-top: 30px;
    flex-wrap: wrap;
}

.chapter-card {
    padding: 30px;
    min-width: 400px;
    margin-right: 30px;
    margin-bottom: 30px;

    .level-count {
        font-size: 12px;
        color: #005FFE;
        margin-bottom: 7px;
    }
}

.level-card {
    background-color: #fff;
    border: 1px solid #ECEBED;
    padding: 8px 12px;
    border-radius: 5px;
    user-select: none;
    cursor: pointer;
    margin-bottom: 8px;
    transition: background-color 0.2s;
    overflow: hidden;

    &:hover {
        background-color: #fafafa;
    }

    &:last-child {
        margin-bottom: 0;
    }

    .level-text {
        color: #5F6266;
        font-size: 14px;
    }

    .right-arrow {
        margin-left: auto;
        color: #5F6266;
        position: relative;
        left: 30px;
        transition: left 0.2s;
    }

    &:hover {
        .right-arrow {
            left: 0;
        }
    }

    .level-icon {
        border-radius: 50%;
        background-color: #ECEBED;
        width: 25px;
        height: 25px;
        margin-right: 10px;
        --ionicon-stroke-width: 40px;

        &:not(.complete) {
            ion-icon {
                display: none;
            }
        }

        &.complete {
            background: rgba(111, 207, 151, 0.17);
        }

        ion-icon {
            margin: auto;
            color: #6FCF97;
        }
    }
}

.card-right {
    margin-left: auto;
}

.thumbnail-container {

    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #ECEBED;

    .progress-bar {
        width: 100%;
        height: 10px;
        background-color: #F0F7FF;

        .progress-bar-inner {
            background-color: #6FCF97;
            height: 100%;
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
        }
    }
}

.difficulty-text {
    font-size: 12px;
    padding: 3px 5px;
    border-radius: 3px;
    margin-right: 10px;

    &.easy{
      color: #6FCF97;
      background-color: rgba(#6FCF97,0.17);
    }

    &.medium{
      color: #F2C94C;
      background-color: rgba(#F2C94C,0.17);
    }

    &.hard{
      color: #E45649;
      background-color: rgba(#E45649,0.17);
    }
}
</style>
