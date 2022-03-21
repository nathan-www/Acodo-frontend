<template>
<Navbar>
  <template v-slot:biscuits>

    <NavBiscuit v-if="level !== null && course !== null" biscuitType="chapters" :title="course.course_title"
      :items="Object.values(course.chapters).map((c)=>{return{title:c.chapter_title,levels_total:Object.keys(c.levels).length,levels_done:Object.values(c.levels).filter((l)=>l.complete).length,active:(c.chapter_slug==chapter_slug),link:'/courses/'+course.course_slug+'/'+c.chapter_slug}})">
    </NavBiscuit>

    <NavBiscuit v-if="level !== null && course !== null" biscuitType="levels" :title="course.chapters[chapter_slug].chapter_title"
      :items="Object.values(course.chapters[chapter_slug].levels).map((l)=>{return{title:l.level_title,levels_total:1,levels_done:(l.complete?1:0),active:(l.level_slug==level_slug),link:'/courses/'+course_slug+'/'+chapter_slug+'/'+l.level_slug}})">
    </NavBiscuit>

  </template>
</Navbar>

<div class="main flex">
  <div :class="'sidebar ' + ((level !== null && level.complete) ? 'level-done':'')">

    <div class="level-done-banner">
      <ion-icon name="checkmark-circle" class="betterIcon"></ion-icon> You have completed this level
    </div>

    <div class="sidebar-tabs flex">

      <div :class="'sidebar-tab flex ' + ((sidebarTab=='challenge') ? 'active':'')" @click="sidebarTab = 'challenge'">
        <div class="v-center tab-icon">
          <ion-icon name="trophy"></ion-icon>
        </div>
        <div class="v-center">
          Challenge
        </div>
      </div>

      <div :class="'sidebar-tab flex ' + ((sidebarTab=='chat') ? 'active':'')" @click="sidebarTab = 'chat'">
        <div class="v-center tab-icon">
          <ion-icon name="chatbox"></ion-icon>
        </div>
        <div class="v-center">
          Chat
        </div>
        <div class="v-center">
          <span class="tab-count" v-if="messageCount > 0">({{AbbreviateNumber(messageCount)}})</span>
        </div>
      </div>

      <div :class="'sidebar-tab flex ' + ((sidebarTab=='solutions') ? 'active':'')" @click="sidebarTab = 'solutions'">
        <div class="v-center tab-icon">
          <ion-icon name="checkbox"></ion-icon>
        </div>
        <div class="v-center">
          Solutions
        </div>
        <div class="v-center">
          <span class="tab-count" v-if="level !== null && level.solutions_count > 0">({{AbbreviateNumber(level.solutions_count)}})</span>
        </div>
      </div>

    </div>

    <div class="sidebar-inner challenge" v-if="sidebarTab == 'challenge'">

      <div v-if="level == null">
        <div class="loadingFill" style="width: 100%; height: 40px; background-color: #eee;"></div>
        <div class="loadingFill" style="width: 100%; height: 100px; background-color: #eee; margin-top: 20px"></div>
        <div class="loadingFill" style="width: 100%; height: 70px; background-color: #eee; margin-top: 10px"></div>
        <div class="loadingFill" style="width: 100%; height: 120px; background-color: #eee; margin-top: 10px"></div>
        <div class="loadingFill" style="width: 100%; height: 50px; background-color: #eee; margin-top: 10px"></div>
      </div>
      <div v-else>

        <div class="sidebar-breadcrumb">
          <a @click="router_push('/courses/'+course.course_slug)">{{ course.course_title }}</a>
          <ion-icon name="chevron-forward"></ion-icon><a @click="router_push('/courses/'+course.course_slug+'/'+chapter_slug)">{{ course.chapters[chapter_slug].chapter_title }}</a>
        </div>

        <div class="flex">
          <div class="v-center">
            <h2>{{ level.level_title }}</h2>
          </div>
          <div class="v-center">
            <span :class="'difficulty-badge ' + level.difficulty.toLowerCase()">{{level.difficulty}}</span>
          </div>
          <div class="v-center xp-badge">
            <div class="flex">
              <div class="v-center icon">
                <ion-icon name="sparkles"></ion-icon>
              </div>
              <div class="v-center">{{level.xp}} xp</div>
            </div>
          </div>
        </div>

        <div class="separator"></div>

        <div class="brief" v-html="brief"></div>

        <div class="test-area">
          <h3>Code tests</h3>

          <div class="unit_testing_error flex" v-if="unit_testing_error">
            <div class="left-icon">
              <ion-icon class="betterIcon" name="alert-circle"></ion-icon>
            </div>
            <div class="v-center">An error occured while running your code, check the console for details.</div>
          </div>

          <div class="test flex" v-for="test in level.unit_tests">
            <div class="v-center">
              <div class="test-icon v-center pass" v-if="unit_test_output.hasOwnProperty(test.test_id) && unit_test_output[test.test_id].passed">
                <ion-icon name="checkmark"></ion-icon>
              </div>
              <div class="test-icon v-center fail" v-else>
                <ion-icon name="close"></ion-icon>
              </div>
            </div>
            <div class="v-center">
              <div>
                <h4 v-html="MarkdownCoverter(test.title)"></h4>
                <h5 v-if="test.subtitle.length > 0" v-html="MarkdownCoverter(test.subtitle)"></h5>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div class="footer" v-if="sidebarTab == 'challenge'">
      <p>
        <span v-if="level !== null && level.authors.length > 0">Author<span v-if="level.authors.length > 1">s</span>: </span>
        <a v-if="level !== null" v-for="author in level.authors" @click="router_push('/@/'+author.username)">{{author.username}}</a>

        <span class="float-right">&copy; Acodo, {{(new Date()).getFullYear()}}</span>
      </p>
    </div>




    <div class="sidebar-inner" v-if="sidebarTab == 'chat'">

      <div class="messages-scroll">

        <div class="empty-area" v-if="sortedMessages.length == 0">

          <h1>&#128564;</h1>
          <p>
            The chat is sleeping.<br />
            Be the first to send a message!
          </p>

        </div>

        <template v-for="m in sortedMessages">

          <div class="message flex">

            <div class="message-left">
              <img :src="'https://robohash.org/'+MD5(m.user.username)" @click="router_push('/@/'+m.user.username)" alt="" class="profile-pic">
              <div class="sideline"></div>
            </div>

            <div class="message-right">
              <div class="flex">
                <div class="username" @click="router_push('/@/'+m.user.username)">{{m.user.username}}</div>
                <div class="xp">
                  <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>{{m.user.xp}} xp
                </div>
                <div class="time">{{ ConvertTime(m.created,'semi-absolute') }} <i v-if="m.created !== m.last_edited">(Edited {{ConvertTime(m.last_edited,'semi-absolute')}})</i></div>
              </div>

              <p class="message-content" v-html="decodeMessage(m.message_content)"></p>

              <div class="message-bottom">

                <div :class="'flex ' + (m.user_vote==1 ? 'upvoted ':' ') +  (m.user_vote==-1 ? 'downvoted ':' ')">
                  <div class="upvote v-center" @click="voteMessage(1,m)">
                    <ion-icon name="arrow-up"></ion-icon>
                  </div>
                  <div class="vote-count v-center">
                    {{m.upvotes - m.downvotes}}
                  </div>
                  <div class="downvote v-center" @click="voteMessage(-1,m)">
                    <ion-icon name="arrow-down"></ion-icon>
                  </div>
                </div>

                <div class="message-bottom-left flex">
                  <div class="reply-button" @click="start_reply(m)">
                    <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                  </div>
                  <div class="reply-button" v-if="account.username == m.user.username" @click="edit_message(m)">
                    <ion-icon name="pencil" class="betterIcon"></ion-icon> Edit
                  </div>
                  <div class="reply-button" v-if="account.username == m.user.username && (deleting_message == null || deleting_message.message_id !== m.message_id)" @click="markMessageToDelete(m)">
                    <ion-icon name="trash" class="betterIcon"></ion-icon> Delete
                  </div>
                  <div class="reply-button delete-confirm" v-else-if="account.username == m.user.username && deleting_message.message_id == m.message_id" @click="deleteMessage()">
                    <ion-icon name="trash" class="betterIcon"></ion-icon> Sure?
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div class="message reply flex" v-for="r in m.replies">

            <div class="message-left reply">
              <div class="sideline"></div>
            </div>

            <div class="message-left">
              <img :src="'https://robohash.org/'+MD5(r.user.username)" @click="router_push('/@/'+r.user.username)" alt="" class="profile-pic">
              <div class="sideline"></div>
            </div>

            <div class="message-right reply">
              <div class="flex">
                <div class="username" @click="router_push('/@/'+r.user.username)">{{r.user.username}}</div>
                <div class="xp">
                  <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>{{r.user.xp}} xp
                </div>
                <div class="time">{{ ConvertTime(r.created,'semi-absolute') }} <i v-if="r.created !== r.last_edited">(Edited {{ConvertTime(r.last_edited,'semi-absolute')}})</i></div>
              </div>

              <p class="message-content" v-html="decodeMessage(r.message_content)"></p>

              <div class="message-bottom">


                <div class="message-bottom-left flex">
                  <div class="reply-button" @click="start_reply(r)">
                    <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                  </div>
                  <div class="reply-button" v-if="account.username == r.user.username" @click="edit_message(r)">
                    <ion-icon name="pencil" class="betterIcon"></ion-icon> Edit
                  </div>
                  <div class="reply-button" v-if="account.username == r.user.username && (deleting_message == null || deleting_message.message_id !== r.message_id)" @click="markMessageToDelete(r)">
                    <ion-icon name="trash" class="betterIcon"></ion-icon> Delete
                  </div>
                  <div class="reply-button delete-confirm" v-else-if="account.username == r.user.username && deleting_message.message_id == r.message_id" @click="deleteMessage()">
                    <ion-icon name="trash" class="betterIcon"></ion-icon> Sure?
                  </div>
                </div>

              </div>

            </div>

          </div>


        </template>






      </div>


  <div class="send-box" @keyup="(() => {  if(!this.sending_message && keysDown.includes(13) && (keysDown.includes(17) || keysDown.includes(224))){    if(!sending_message && editing_message !== null){ submit_edit(); } else { sendMessage(); } } })()">
        <div class="reply-to-banner" v-if="reply_to !== null">
          Replying to @{{reply_to.user.username}}
          <ion-icon @click="reply_to=null" name="close-outline"></ion-icon>
        </div>

        <div class="reply-to-banner" v-else-if="editing_message !== null">
          Editing message <ion-icon @click="stop_editing()" name="close-outline"></ion-icon>
        </div>

        <Quill ref="messageEditor"></Quill>


        <div class="send-bar flex">


          <div data-tooltip="Inline code" data-tooltip-location="top" class="send-box-button code-button" @mousedown="$event.preventDefault()" @mouseup="$refs.messageEditor.inlinecode()">
            <ion-icon name="code-working" class="betterIcon"></ion-icon>
          </div>
          <div data-tooltip="Code block" data-tooltip-location="top" class="send-box-button code-button" @mousedown="$event.preventDefault()" @mouseup="$refs.messageEditor.codeblock()">
            <ion-icon name="code" class="betterIcon"></ion-icon>
          </div>
          <div class="send-box-button code-button bold" @mousedown="$event.preventDefault()" @mouseup="$refs.messageEditor.bold()">
            B
          </div>
          <div class="send-box-button code-button italic" @mousedown="$event.preventDefault()" @mouseup="$refs.messageEditor.italic()">
            I
          </div>

          <div v-if="!sending_message && editing_message !== null" class="send-box-button send-button" @click="submit_edit()">
            <ion-icon name="arrow-forward" class="betterIcon"></ion-icon>
          </div>
          <div v-else-if="!sending_message" class="send-box-button send-button" @click="sendMessage()">
            <ion-icon name="send" class="betterIcon"></ion-icon>
          </div>
          <div v-else class="send-box-button send-button v-center" @click="sendMessage()">
            <img class="inline-loader" src="@/assets/img/loader-grey.png" alt="">
          </div>

        </div>
      </div>


    </div>



    <div class="sidebar-inner" v-if="sidebarTab == 'solutions'">

      <div class="solution-prompt" v-if="!level.complete && !level.forfeited && level.solutions_count > 0 && loading_solutions==false && Object.keys(solutions).length==0">
        <h1>&#128274;</h1>
        <h3>The solutions to this level are locked</h3>
        <p>You haven't solved the level yet. If you choose to unlock solutions now, you will forfeit any XP and won't be able to publish your own solution. </p>

        <a class="btn btn-primary" @click="fetchSolutions()">Forfeit and unlock solutions</a>
      </div>

      <div v-if="loading_solutions">
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
      </div>


      <div class="empty-area" v-if="level.solutions_count == 0 || (sortedSolutions.length == 0 && loading_solutions==false && (level.complete || level.forfeited))">

        <h1>&#129488;</h1>
        <p>
          Nobody has submitted a solution yet.<br />
          Could you be the first?
        </p>

      </div>

      <div class="solution flex" v-for="solution in sortedSolutions">

        <div class="solution-left">
          <img :src="'https://robohash.org/'+MD5(solution.user.username)" alt="" class="profile-pic">

          <div :class="((solution.user_vote == 1) ? 'upvoted ':' ') + ((solution.user_vote == -1) ? 'downvoted ':'')">
            <div class="upvote-button" @click="voteSolution(1,solution,'main')">
              <ion-icon name="arrow-up" class="betterIcon"></ion-icon>
            </div>
            <div class="vote-count">
              {{ solution.upvotes - solution.downvotes }}
            </div>
            <div class="downvote-button" @click="voteSolution(-1,solution,'main')">
              <ion-icon name="arrow-down" class="betterIcon"></ion-icon>
            </div>

          </div>
        </div>

        <div class="solution-right">

          <div class="flex">
            <div class="username" @click="router_push('/@/'+solution.user.username)">{{ solution.user.username }}</div>
            <div class="xp">
              <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>{{ solution.user.xp }} xp
            </div>
            <div class="time">{{ ConvertTime(solution.timestamp,"semi-absolute") }}</div>
          </div>

          <div class="code-block" v-html="decodeSolutionCode(solution.code)"></div>

          <div class="badges flex">

            <div v-for="b in solutions[solution.solution_id].badges" :class="'badge ' + (((b.votes.filter((v) => v.user.username == account.username)).length > 0) ? 'voted':'')"
              @click="voteSolution((((b.votes.filter((v) => v.user.username == account.username)).length > 0) ? -1:1), solution, b.badge_id)">
              <span class="badge-icon">{{ he.decode(b.icon) }}</span>
              <span class="badge-text">{{ b.name }}</span>
              <span class="badge-count">{{ b.votes.length }}</span>
            </div>

          </div>

        </div>
      </div>

    </div>



  </div>


  <div class="work-area">

    <div class="code-area">

      <div class="code-tool-bar flex">
        <div class="tool reload-button v-center" data-tooltip="Reload default code" @click="reload_default_code()">
          <ion-icon name="refresh"></ion-icon>
        </div>
        <div class="tool copy-button v-center" data-tooltip="Copy code" @click="Banner('Copied to clipboard','success',2000,false); clipBoardCopy(code);">
          <ion-icon name="copy-outline"></ion-icon>
        </div>

        <div class="tool save-button v-center" data-tooltip="Save draft" @click="if(!saving_draft){ save_draft(); }">
          <ion-icon name="save-outline" v-if="!saving_draft"></ion-icon>
          <img class="inline-loader" style="margin: auto;" src="@/assets/img/loader-grey.png" alt="" v-else>
        </div>

        <div class="saved-message flex" v-if="saved_draft">
          <div class="v-center">
            <ion-icon name="checkmark-outline"></ion-icon>
          </div>
          <div class="v-center">
            Saved
          </div>
        </div>

        <div class="code-tool-bar-right flex">

          <div v-if="isMac" class="btn btn-primary-light" data-tooltip="⌘⇧R" @click="runCode()">
            <ion-icon name="play-outline" class="betterIcon"></ion-icon> Run 
          </div>
          <div v-else class="btn btn-primary-light" data-tooltip="Ctrl⇧R" @click="runCode()">
            <ion-icon name="play-outline" class="betterIcon"></ion-icon> Run
          </div>

          <div class="btn btn-primary" @click="complete_level()" v-if="level !== null && !level.complete && !level.forfeited">
            Submit solution <img style="margin-left: 5px; position: relative; top: 1px;" v-if="submitting_solution" class="inline-loader" src="@/assets/img/loader-white.png" alt="">
          </div>
          <div class="btn btn-primary" @click="complete_level()" v-else-if="level !== null && !level.complete && level.forfeited">
            Complete <img style="margin-left: 5px; position: relative; top: 1px;" v-if="submitting_solution" class="inline-loader" src="@/assets/img/loader-white.png" alt="">
          </div>

        </div>
      </div>

      <div class="code-editor-container">
        <Codemirror v-model:value="code" :options="cmOptions" @change="saved_draft = false" />
      </div>

    </div>


    <PythonEmulator ref="PythonEmulator"></PythonEmulator>

  </div>

</div>
</template>


<script>
import Navbar from '@/components/Navbar.vue'
import NavBiscuit from '@/components/NavBiscuit.vue'

import Quill from '@/components/Quill.vue'

import PythonEmulator from '@/emulators/python.vue'

import Codemirror from "codemirror-editor-vue3"
import "codemirror/mode/python/python.js"
import "@/style/cmtheme.css"

var he = require('he');

import {
  MD5
} from '@/utility/MD5'

import {
  MarkdownCoverter
} from '@/utility/MarkdownCoverter'

import {
  MessageHTMLToMarkdown,
  MessageMarkdownToHTML,
  MessageMarkdownToEditable
} from '@/utility/MessageMarkdownConverter'

import {
  SafeBase64Encode,
  SafeBase64Decode
} from '@/utility/SafeBase64'

import {
  AbbreviateNumber
} from '@/utility/AbbreviateNumber';

window.MessageHTMLToMarkdown = MessageHTMLToMarkdown;




export default {
  name: 'Level',
  components: {
    Navbar,
    NavBiscuit,
    Codemirror,
    PythonEmulator,
    Quill
  },
  data() {
    return {
      code: "",
      loaded_code: false,

      code_running: false,

      sidebarTab: "challenge",
      cmOptions: {
        mode: "python",
        theme: "acodo",
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 4,
        foldGutter: true,
        styleActiveLine: true,
      },
      course_slug: this.$route.params.course_slug,
      chapter_slug: this.$route.params.chapter_slug,
      level_slug: this.$route.params.level_slug,

      unit_test_output: {},
      unit_testing_error: false,

      messages: {},
      messages_since: 0,
      messages_timer: null,

      send_message_content: null,
      reply_to: null,
      sending_message: false,
      editing_message: null,

      deleting_message: null,
      deleting_message_timer: null,

      loading_solutions: false,
      solutions: {},

      he: he,

      keysDown: [],

      messageCount: 0,

      saving_draft: false,
      saved_draft: false,

      submitting_solution: false

    }
  },
  watch: {
    level: function(level) {

      if (level.hasOwnProperty('exists') && !level.exists) {
        if (this.isLoggedIn == false) {
          this.router_push('/account/login');
        } else if (this.$store.state.isLoggedIn == true) {
          this.router_push('/404');
        }
      }

      this.loadStuff();

    },
    isLoggedIn: function(isLoggedIn) {

      if (isLoggedIn == false) {
        this.router_push('/account/login');
      } else if (this.level !== null && this.level.hasOwnProperty('exists') && !this.level.exists) {
        this.router_push('/404');
      }

    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
    account() {
      return this.$store.getters.getAccount;
    },
    level() {
      return this.$store.getters.getLevel(this.course_slug, this.chapter_slug, this.level_slug);
    },
    course() {
      return this.$store.getters.getCourse(this.course_slug);
    },
    brief() {
      return MarkdownCoverter(atob(atob(this.level.brief)));
    },
    isMac() {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0
    },
    sortedMessages() {

      let messages = Object.values(this.messages);

      messages = messages.sort((a, b) => {
        if ((a.net_votes_on_load) < (b.net_votes_on_load)) {
          return 1;
        } else if ((a.net_votes_on_load) == (b.net_votes_on_load)) {
          if (a.created < b.created) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return -1;
        }
      });

      messages = messages.map((m) => {
        m.replies = Object.values(m.replies).sort((a, b) => {
          if (a.created < b.created) {
            return -1;
          } else {
            return 1;
          }
        });
        return m;
      });

      return messages;
    },

    sortedSolutions() {

      let solutions = Object.values(this.solutions);

      solutions = solutions.sort((a, b) => {
        if ((a.net_votes_on_load) < (b.net_votes_on_load)) {
          return 1;
        } else if ((a.net_votes_on_load) == (b.net_votes_on_load)) {
          if (a.timestamp < b.timestamp) {
            return 1;
          } else {
            return -1;
          }
        } else {
          return -1;
        }
      });

      return solutions;

    },

    all_tests_passed() {

      if (this.level == null) {
        return false;
      }

      for (var i = 0; i < this.level.unit_tests.length; i++) {

        let test = this.level.unit_tests[i];
        if (!(this.unit_test_output.hasOwnProperty(test.test_id) && this.unit_test_output[test.test_id].passed)) {
          return false;
        }

      }

      return true;

    }

  },
  methods: {

    loadStuff() {

      if (this.level.hasOwnProperty('exists') && this.level.exists) {


        //Load the code editor
        if (!this.loaded_code) {


          if (this.level.draft_code.code == "") {

            this.code = atob(atob(this.level.default_code)); //No draft, load default code
          } else {
            this.code = SafeBase64Decode(atob(this.level.draft_code.code)); //Load draft code
            this.saved_draft = true;
          }

          this.loaded_code = true;

        }

      }

      if (this.level.hasOwnProperty('complete') && (this.level.complete || this.level.forfeited) && Object.keys(this.solutions).length == 0) {
        this.fetchSolutions();
      }

    },


    AbbreviateNumber(num) {
      return AbbreviateNumber(num);
    },

    runCode() {
      this.code_running = true;
      this.$refs.PythonEmulator.runCode({
        code: this.code,
        tests: this.level.unit_tests,
        test_code: atob(atob(this.level.test_code))
      });
    },
    HTMLentities(r) {
      return r.replace(/[\x26\x0A\<>'"]/g, function(r) {
        return "&#" + r.charCodeAt(0) + ";"
      })
    },
    atob(a) {
      return atob(a);
    },
    MarkdownCoverter(md) {
      return MarkdownCoverter(md)
    },
    MessageMarkdownToHTML(md) {
      return MessageMarkdownToHTML(md)
    },
    receiveTestFeedback(feedback, error) {
      this.unit_testing_error = error;
      this.unit_test_output = feedback;
      this.code_running = false;
    },

    SafeBase64Decode(a) {
      return SafeBase64Decode(a);
    },

    SafeBase64Encode(a) {
      return SafeBase64Encode(a);
    },

    decodeMessage(m) {
      try {
        return MessageMarkdownToHTML(SafeBase64Decode(atob(m)))
      } catch (e) {
        return MessageMarkdownToHTML("*Message unreadable*")
      }
    },

    decodeSolutionCode(s) {

      function HTMLentities(r) {
        return r.replace(/[\x26\x0A\<>'"]/g, function(r) {
          return "&#" + r.charCodeAt(0) + ";"
        })
      }

      return HTMLentities(SafeBase64Decode(atob(s))).replaceAll(" ", "&nbsp").replaceAll("\n", "<br>").replaceAll("&#10;", "<br>").replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");

    },

    clipBoardCopy(text) {
      navigator.clipboard.writeText(text);
    },

    MD5(text) {
      return MD5(text);
    },
    atob(b64) {
      return atob(b64)
    },

    fetchMessages(since = null) {

      if (since == null) {
        since = this.messages_since;
      }

      this.api_request('GET', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/' + since).then((resp) => {
        if (resp.status == "success") {

          if (resp.last_change > 0) {
            this.messages_since = resp.last_change;
          }

          if (Object.keys(this.messages).length == 0) {
            this.messageCount = resp.messages.length;
          }


          //Process all top-level messages
          resp.messages.filter((m) => m.reply_to == "").forEach((message) => {
            let replies = {};

            //Save replies previously saved
            if (this.messages.hasOwnProperty(message.message_id) && this.messages[message.message_id].hasOwnProperty('replies')) {
              replies = this.messages[message.message_id].replies;
            }

            //To prevent moving messages, store vote count on load (will only order by vote once on load)
            message.net_votes_on_load = message.upvotes - message.downvotes;
            if (this.messages.hasOwnProperty(message.message_id)) {
              message.net_votes_on_load = this.messages[message.message_id].net_votes_on_load;
            }

            message.replies = replies;

            //this.messages[message.message_id] = message;
            let obj = {};
            obj[message.message_id] = message;
            this.messages = Object.assign({}, this.messages, obj);

          });

          //Process all replies
          resp.messages.filter((m) => m.reply_to !== "").forEach((message) => {
            if (this.messages.hasOwnProperty(message.reply_to)) {
              //this.messages[message.reply_to].replies[message.message_id] = message;
              let obj = {};
              obj[message.message_id] = message
              this.messages[message.reply_to].replies = Object.assign({}, this.messages[message.reply_to].replies, obj);
            }
          });

        }
      });
    },

    fetchSolutions(suppressLoading = false) {

      if (!suppressLoading) {
        this.loading_solutions = true;
      }

      this.api_request('GET', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/solutions').then((resp) => {
        if (resp.status == "success") {

          resp.solutions.forEach((s) => {

            s.net_votes_on_load = s.upvotes - s.downvotes;
            if (this.solutions.hasOwnProperty(s.solution_id)) {
              s.net_votes_on_load = this.solutions[s.solution_id].net_votes_on_load;
            }

            let obj = {};
            obj[s.solution_id] = s;
            this.solutions = Object.assign({}, this.solutions, obj);

          });;
        }
        console.log("loaded solutions");
        this.loading_solutions = false;
      });

    },

    voteSolution(vote, solution, type) {


      if (type == "main") {
        if (vote == solution.user_vote) {
          vote = 0;
        }

        if (solution.user_vote == 1) {
          solution.upvotes -= 1;
        }
        if (solution.user_vote == -1) {
          solution.downvotes -= 1;
        }
        if (vote == 1) {
          solution.upvotes += 1;
        }
        if (vote == -1) {
          solution.downvotes += 1;
        }

        solution.user_vote = vote;

      } else {

        for (var i = 0; i < this.solutions[solution.solution_id].badges.length; i++) {
          let b = this.solutions[solution.solution_id].badges[i];
          if (b.badge_id == type) {
            this.solutions[solution.solution_id].badges[i]['votes'] = this.solutions[solution.solution_id].badges[i]['votes'].filter((v) => v.user.username !== this.account.username);
          }
          if (b.badge_id == type && vote == 1) {
            this.solutions[solution.solution_id].badges[i]['votes'].push({
              user: {
                user_id: this.account.user_id,
                username: this.account.username,
                xp: this.account.xp
              }
            })
          }
        }

      }

      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/solutions/vote', {
        solution_id: solution.solution_id,
        vote: vote,
        vote_type: type
      }).then((resp) => {})

    },

    voteMessage(vote, message) {
      if (vote == message.user_vote) {
        vote = 0;
      }

      if (message.user_vote == 1) {
        message.upvotes -= 1;
      }
      if (message.user_vote == -1) {
        message.downvotes -= 1;
      }
      if (vote == 1) {
        message.upvotes += 1;
      }
      if (vote == -1) {
        message.downvotes += 1;
      }

      message.user_vote = vote;

      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/vote', {
        message_id: message.message_id,
        vote: vote
      }).then(() => {
        this.fetchMessages();
      })
    },

    start_reply(r) {
      this.reply_to = r;
      this.$refs.messageEditor.editor.root.innerHTML = "";
    },

    markMessageToDelete(m) {

      this.deleting_message = m;

      if (this.deleting_message_timer !== null) {
        clearTimeout(this.deleting_message_timer);
      }

      let app = this;
      this.deleting_message_timer = setTimeout(() => {
        app.deleting_message = null;
      }, 2500);

    },

    deleteMessage() {

      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/delete', {
        message_id: this.deleting_message.message_id,
      }).then(() => {

        if (this.deleting_message.reply_to == "") {
          delete this.messages[this.deleting_message.message_id];
        } else {
          delete this.messages[this.deleting_message.reply_to];
        }

        this.fetchMessages(0);
      })

    },

    sendMessage() {

      if (MessageHTMLToMarkdown(this.send_message_content).trim().length == 0) {
        //Soft fail
      } else if (MessageHTMLToMarkdown(this.send_message_content).trim().length > 2500) {
        this.Banner("Message too long! Maximum 2500 characters");
      } else {

        let obj = {
          message_content: SafeBase64Encode(MessageHTMLToMarkdown(this.send_message_content))
        }

        if (this.reply_to !== null) {
          obj.reply_to = this.reply_to.message_id;
        }

        this.sending_message = true;
        this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/send', obj, 300).then((resp) => {

          this.sending_message = false;

          if (resp.status == "success") {
            this.send_message_content = "";
            this.$refs.messageEditor.editor.root.innerHTML = "";
            this.fetchMessages();
            this.reply_to = null;
          } else {
            if (resp.error_message == "You are sending messages too fast") {
              this.Banner("You are sending messages too fast");
            } else {
              this.Banner("Failed to send message");
            }
          }

        });

      }

    },

    edit_message(m) {
      this.editing_message = m;
      this.$refs.messageEditor.editor.root.innerHTML = MessageMarkdownToEditable(SafeBase64Decode(atob(m.message_content)));
    },

    stop_editing() {
      this.editing_message = null;
      this.$refs.messageEditor.editor.root.innerHTML = "";
    },

    submit_edit() {

      this.sending_message = true;
      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/edit', {
        message_id: this.editing_message.message_id,
        message_content: SafeBase64Encode(MessageHTMLToMarkdown(this.send_message_content))
      }, 300).then(() => {
        this.send_message_content = "";
        this.$refs.messageEditor.editor.root.innerHTML = "";
        this.fetchMessages();
        this.reply_to = null;
        this.editing_message = null;
        this.sending_message = false;
      });

    },

    save_draft() {

      this.saving_draft = true;
      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/saveDraft', {
        code: SafeBase64Encode(this.code),
      }, 500).then((resp) => {

        if (resp.status !== "success") {
          this.Banner("Failed to save draft code");
        } else {
          this.saved_draft = true;

          this.$store.commit("SET_DRAFT", {
            course_slug: this.course_slug,
            chapter_slug: this.chapter_slug,
            level_slug: this.level_slug,
            code: SafeBase64Encode(this.code)
          });

        }

        this.saving_draft = false;

      })

    },

    reload_default_code() {

      let confirm = this.ConfirmDialog('Are you sure you want to reload the default code?', 'You will lose any code you are currently working on', 'Yes, reload')
      confirm.then(() => {
        this.code = atob(atob(this.level.default_code));
      });

    },

    getV() {
      /*
      Congrats, you've found the secret salt!
      To support the Acodo community, please do not abuse this.
      */
      return "super_secret_salt_eq55M4Q2xQ" + this.account.user_id;
    },

    complete_level() {

      if (!this.all_tests_passed) {
        this.Banner("Your code must pass all the tests before you can complete the level");
        return null;
      }



      if (!this.level.forfeited) {

        this.ConfirmDialog("Ready to submit your solution?", "You won't be able to edit your solution once it's published.", "Submit and complete", "primary").then(() => {

          this.save_draft();

          this.submitting_solution = true;
          let code = SafeBase64Encode(this.code);
          let v = MD5(code + this.getV());


          this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/solutions/submit', {
            code: code,
            v: v
          }, 600).then(() => {


            this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/markComplete').then(() => {
              this.$store.dispatch('getLevel', {
                'course_slug': this.course_slug,
                'chapter_slug': this.chapter_slug,
                'level_slug': this.level_slug,
                'force_reload': true
              });
              this.$store.dispatch('getAccount', {
                'force_reload': true
              });

              this.submitting_solution = false;
            })

          });
        })

      } else {

        this.submitting_solution = true;

        this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/markComplete', {}, 600).then(() => {
          this.$store.dispatch('getLevel', {
            'course_slug': this.course_slug,
            'chapter_slug': this.chapter_slug,
            'level_slug': this.level_slug,
            'force_reload': true
          });
          this.$store.dispatch('getAccount', {
            'force_reload': true
          });
          this.submitting_solution = false;

        });

      }



    }

  },
  beforeRouteLeave() {
    clearInterval(this.messages_timer);
    clearInterval(this.save_timer);
    this.loaded_code = false;
  },
  created() {

    if (this.level !== null && this.level.hasOwnProperty('brief')) {
      this.loadStuff();
    }

    this.$store.dispatch('getLevel', {
      'course_slug': this.course_slug,
      'chapter_slug': this.chapter_slug,
      'level_slug': this.level_slug
    });

    window.addEventListener('keydown', (e) => {
      this.keysDown = this.keysDown.filter((i) => i !== e.keyCode);
      this.keysDown.push(e.keyCode);

      if ((this.keysDown.includes(17) || this.keysDown.includes(224)) && this.keysDown.includes(83)) {
        e.preventDefault();
        this.save_draft();
        this.keysDown = this.keysDown.filter((i) => i !== e.keyCode);
      }

      if ((this.keysDown.includes(17) || this.keysDown.includes(224)) && this.keysDown.includes(16) && this.keysDown.includes(82)) {
        e.preventDefault();
        this.runCode();
        this.keysDown = this.keysDown.filter((i) => i !== e.keyCode);
      }

    });
    window.addEventListener('keyup', (e) => {
      this.keysDown = this.keysDown.filter((i) => i !== e.keyCode);
    });

    this.fetchMessages();

    this.messages_timer = setInterval(this.fetchMessages, 7000);


    this.save_timer = setInterval(() => {
      if (!this.saved_draft) {
        //Autosave
        this.save_draft();
      }
    }, 20000);


  }
}
</script>

<style lang="scss">
.brief {

    .horizotal-rule {
        width: 100%;
        border-top: 1px solid #ECEBED;
        margin: 12px 0;
    }

    a {
        color: #005FFE;
    }

    img {
        max-width: 100%;
        border-radius: 5px;
    }

    h1,
    h2,
    h3 {
        color: #151538;
        font-size: 15px;
        margin-bottom: 5px;
        margin-top: 15px;
    }

    p {
        color: #5F6266;
        font-size: 13px;
        line-height: 1.5em;
        margin-bottom: 6px;
    }

}

.brief,
.message-content,
.test-area {
    .inline-code,
    code:not(pre code) {
        font-family: 'Source Code Pro', monospace;
        font-size: 14px;
        color: #5C616B;
        background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
        border: 1px solid rgba(0, 95, 254, 0.17);
        padding: 1px 5px;
        border-radius: 5px;
    }
    .code-block,
    pre {
        font-family: 'Source Code Pro', monospace;
        font-size: 14px;
        color: #5C616B;
        background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
        border: 1px solid rgba(0, 95, 254, 0.17);
        padding: 7px;
        display: inline-block;
        border-radius: 5px;

        white-space: nowrap;
        overflow: scroll;

        width: 100%;
        -ms-overflow-style: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }

}

div.test-area span.inline-code {
    font-size: 1em;
}
</style>

<style lang="scss" scoped>
.profile-pic.loader-grey,
.vote-count {
    user-select: none;
}

.saved-message {
    --ionicon-stroke-width: 50px;
    color: #6FCF97;
    font-size: 14px;
    user-select: none;

    ion-icon {
        margin-right: 2px;
    }
}

.xp-badge {
    color: #F2C94C;
    font-size: 13px;
    margin-left: auto;

    .icon{
      margin-right: 2px;
    }
}

.tab-count {
    font-size: 12px;
    position: relative;
    font-weight: 500;
    padding-left: 5px;
}

.solution-prompt {
    margin: 20px;
    text-align: center;
    p:last-of-type {
        margin-bottom: 25px;
    }
}

.reply-to-banner {
    background-color: #151538;
    color: #fff;
    width: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateY(-100%) translateX(-50%);
    text-align: center;
    padding: 3px;
    font-size: 12px;
    border-radius: 4px 4px 0 0;
    user-select: none;

    ion-icon {
        font-size: 15px;
        position: absolute;
        right: 10px;
        cursor: pointer;
    }
}

.unit_testing_error {
    background-color: #EC4747;
    color: #fff;
    padding: 5px 8px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 13px;

    .left-icon {
        margin-right: 8px;
        font-size: 18px;
    }
}

h2 {
    color: #151538;
    font-size: 18px;
}

h3 {
    color: #151538;
    font-size: 15px;
    margin-bottom: 5px;
    margin-top: 15px;
}

p {
    color: #5F6266;
    font-size: 13px;
    line-height: 1.5em;
    margin-bottom: 6px;
}

.level-done-banner {
    background-color: #6FCF97;
    color: #fff;
    padding: 9px;
    text-align: center;
    font-size: 14px;
    user-select: none;
    display: none;

    .level-done & {
        display: block;
    }
}

.code-block {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    color: #5C616B;
    background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
    border: 1px solid rgba(0, 95, 254, 0.17);
    padding: 7px;
    display: inline-block;
    border-radius: 5px;

    white-space: nowrap;
    overflow: scroll;
}

.inline-code {
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    color: #5C616B;
    background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
    border: 1px solid rgba(0, 95, 254, 0.17);
    padding: 1px 5px;
    border-radius: 5px;
}

.main {
    height: calc(100% - 66px);
    overflow: hidden;
}

.code-area {

    height: 50%;
    border-bottom: 1px solid #E5E9F7;

    .code-editor-container {
        padding: 5px 0;
        font-family: 'Source Code Pro', monospace;
        height: calc(100% - 51px);
    }

    .code-tool-bar {

        .tool {
            margin-right: 5px;
            font-size: 20px;
            color: #A0A1A7;
            cursor: pointer;

            cursor: pointer;
            transition: background-color 0.2s;
            border-radius: 4px;
            width: 33.5px;
            text-align: center;

            ion-icon {
                margin: auto;
            }

            &:hover {
                background-color: #ECEBED;
            }

        }

        padding: 8px 25px 8px 10px;
        border-bottom: 1px solid #ECEBED;

        .code-tool-bar-right {
            margin-left: auto;
        }
        .btn {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}

.empty-area {
    text-align: center;
    margin: 20px;

    h1 {
        margin-bottom: 20px;
    }
}

.sidebar {
    width: 450px;
    height: 100%;
    border-right: 1px solid #ECEBED;
}

.sidebar-tabs {
    padding: 11.25px 25px;
    border-bottom: 1px solid #ECEBED;
    user-select: none;
    background-color: #F8F8FA;
}

.sidebar-tab {
    color: #A0A1A7;
    font-size: 15px;
    margin-left: 10px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;

    white-space: nowrap;

    &:first-child {
        margin-left: 0;
    }

    &.active {
        color: #005FFE;
        background: rgba(0, 95, 254, 0.07);
    }

    &:not(.active) {
        transition: background-color 0.2s;

        &:hover {
            background-color: #ECEBED;
        }
    }

    .tab-icon {
        margin-right: 5px;
    }
}

.separator {
    margin-bottom: 15px;
    height: 1px;
}

.difficulty-badge {
    font-size: 13px;
    font-weight: 300;
    padding: 3px 12px;
    border-radius: 3px;
    display: block;
    margin-left: 8px;
    user-select: none;
    text-transform: capitalize;

    &.easy {
        color: #6FCF97;
        background: rgba(111, 207, 151, 0.17);
    }

    &.medium {
        color: #F2C94C;
        background: rgba(242, 201, 76, 0.17);
    }

    &.hard {
        color: #EC4747;
        background: rgba(236, 71, 71, 0.17);
    }

}

.sidebar-inner {
    padding: 25px;
    height: calc(100% - 48px);
    overflow: scroll;
    position: relative;

    .level-done & {
        height: calc(100% - 48px - 35.5px);
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }

    &.challenge {
        background-color: #F8F8FA;
        height: calc(100% - 48px - 45px);

        .level-done & {
            height: calc(100% - 48px - 45px - 35.5px);
        }

    }
}

.sidebar-breadcrumb {
    font-size: 12px;
    color: #A2A0A7;
    margin-bottom: 5px;

    a {
        transition: color 0.2s;
        cursor: pointer;
    }

    & a:hover {
        color: #5F6266;
    }

    ion-icon {
        position: relative;
        top: 1.5px;
        color: #E5E5E5;
        margin: 0 3px;
    }
}

.test-area {

    background: #FFFFFF;
    border: 1px solid #ECEBED;
    box-shadow: 0 0 5px 1px rgba(236, 235, 237, 0.25);
    border-radius: 5px;
    padding: 15px 12px;
    margin-top: 15px;

    h3 {
        margin: 0 0 12px;
        color: #383A42;
    }

    .test {

        border-radius: 5px;
        border: 1px solid #ECEBED;
        padding: 10px 15px;
        background-color: #fff;
        box-shadow: 0 0 5px 1px rgba(236, 235, 237, 0.25);

        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }

        .test-icon {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-right: 8px;
            --ionicon-stroke-width: 48px;

            ion-icon {
                margin: auto;
            }

            &.pass {
                background: rgba(111, 207, 151, 0.17);
                color: #6FCF97;
            }

            &.fail {
                background: rgba(236, 71, 71, 0.17);
                color: #EC4747;
            }
        }

        h4 {
            font-size: 13px;
            color: #252526;
            font-weight: 400;
            margin-bottom: 5px;
        }

        h5 {
            font-size: 11px;
            color: #5F6266;
            font-weight: 400;
        }

    }

}

.footer {

    background-color: #fff;
    padding: 12px 25px;
    border-top: 1px solid #ECEBED;

    p {
        margin: 0;
        font-size: 13px;
        color: #A2A0A7;
        position: relative;
    }

    a {
        color: #005FFE;
        cursor: pointer;
    }

    .float-right {
        text-align: right;
        position: absolute;
        right: 0;
    }
}

.work-area {
    width: calc(100% - 450px);
}

.message {

    &+.message {
        .message-left:not(.reply),
        .message-right {
            margin-top: 25px;
        }
    }

    .sideline {
        height: calc(100% - 50px);
        width: 1.5px;
        background-color: #ECEBED;
        margin: 0 auto;
    }

    .message-left.reply {
        width: 40px;
        flex-shrink: 0;
        .sideline {
            height: 100%;
        }
    }

    .message-content {
        color: #5F6266;
        font-size: 13px;
        font-weight: 400;
        margin-top: 5px;
        word-wrap: anywhere;
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        background-color: #ECEBED;
        border-radius: 50%;
        margin: 0 auto 10px;
        display: block;
        cursor: pointer;
    }

    .downvote,
    .upvote {
        font-size: 14px;
        color: #A0A1A7;
        ion-icon {
            display: block;
            margin: 0 auto;
        }

        cursor: pointer;
        transition: background-color 0.2s;
        width: 22.5px;
        border-radius: 2px;

        &:hover {
            background-color: #ECEBED;
        }
    }

    .upvoted .upvote,
    .upvoted .vote-count {
        color: #6FCF97;
    }

    .downvoted .downvote,
    .downvoted .vote-count {
        color: #EC4747;
    }

    .vote-count {
        font-size: 16px;
        color: #383A42;
        text-align: center;
        margin: 0 2px;
        user-select: none;
    }

    .message-right {
        width: 100%;
        margin-left: 15px;
        max-width: calc(100% - 40px - 15px);

        &.reply {
            max-width: calc(100% - 80px - 15px);
        }
    }

    .message-bottom {
        margin-top: 10px;
        display: flex;
    }

    .reply-button {
        color: #A0A1A7;
        cursor: pointer;
        padding: 3px 6px;
        transition: background-color 0.2s;
        font-size: 13px;
        border-radius: 4px;
        user-select: none;

        &:hover {
            background-color: #ECEBED;
        }

        &.delete-confirm {
            background-color: #EC4747;
            color: #fff;
        }
    }

    .message-bottom-left {
        margin-left: 5px;
    }

    .username {
        color: #151538;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
    }

    .xp {
        font-size: 12px;
        font-weight: 500;
        color: #F2C94C;
        margin-left: 5px;
        position: relative;
        top: 1px;
        user-select: none;
    }

    .time {
        font-weight: 400;
        font-size: 12px;
        color: #C4C4C4;
        /*margin-left: auto;*/
        margin-left: 6px;
        position: relative;
        top: 1.5px;
        user-select: none;
    }

}

[contenteditable]:focus {
    outline: none;
}

.send-box {
    width: calc(100% - 30px);
    background-color: #F8F8FA;
    border: 1px solid #ECEBED;
    border-radius: 8px;
    position: absolute;
    bottom: 0;
    left: 0;
    margin: 15px;
    transition: box-shadow 0.2s;

    &:hover {
        box-shadow: 0 0 10px 1px rgba(196, 196, 196, 0.35);
    }
    box-shadow: 0 0 10px 1px rgba(196, 196, 196, 0.2);

    .message-editor {
        max-height: 90px;
        overflow-y: scroll;
    }

    .send-bar {

        padding: 6px 10px;

        .send-button {
            margin-left: auto;
        }

        .send-box-button {

            &.send-button {
                font-size: 15px;
            }

            font-size: 17px;
            padding-right: 5px;
            color: #5F6266;
            cursor: pointer;
            transition: color 0.2s;

            &:hover {
                color: #252526;
            }

            &:last-child {
                padding-right: 0;
            }

            &.bold {
                font-weight: 500;
                font-family: Source Code Pro;
                position: relative;
                top: -1px;
                margin-left: 2px;
                user-select: none;
            }

            &.italic {
                font-style: italic;
                font-family: arial;
                font-family: Source Code Pro;
                position: relative;
                top: -1px;
                margin-left: 2px;
                user-select: none;
            }
        }

    }
}

.messages-scroll {
    height: 100%;
    overflow-x: scroll;
    padding-bottom: 108px;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
}

.solution {

    margin-top: 25px;

    &:first-child {
        margin-top: 0;
    }

    .solution-left {
        width: 40px;
    }

    .downvote-button,
    .upvote-button,
    .vote-count {
        text-align: center;
        color: #A0A1A7;
    }

    .upvoted .upvote-button,
    .upvoted .vote-count {
        color: #6FCF97;
    }

    .downvoted .downvote-button,
    .downvoted .vote-count {
        color: #EC4747;
    }

    .downvote-button,
    .upvote-button {
        transition: background-color 0.2s;
        cursor: pointer;
        border-radius: 4px;
        width: 24px;
        margin: 0 auto;
        padding: 2px;

        &:hover {
            background-color: #ECEBED;
        }
    }

    .vote-count {
        margin: 2px 0;
        color: #383A42;
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        background-color: #ECEBED;
        border-radius: 50%;
        margin: 0 auto 10px;
        display: block;
    }

    .username {
        color: #151538;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
    }

    .xp {
        font-size: 12px;
        font-weight: 500;
        color: #F2C94C;
        margin-left: 5px;
        position: relative;
        top: 1px;
        user-select: none;
    }

    .time {
        font-weight: 400;
        font-size: 12px;
        color: #C4C4C4;
        margin-left: auto;
        user-select: none;
    }

    .badges {
        flex-wrap: wrap;
    }

    .badge {
        background-color: #EDEDED;
        padding: 2px 9px 3px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-right: 5px;
        user-select: none;
        margin-top: 5px;
        white-space: nowrap;
        border: 1px solid transparent;

        &.voted {
            border: 1px solid #6FCF97;
        }

        &:hover {
            background-color: #E5E5E5;
        }

        .badge-icon {
            margin-right: 5px;
        }

        .badge-text {
            color: #5F6266;
            font-size: 12px;
            margin-right: 5px;
        }
        .badge-count {
            color: #A0A1A7;
            font-size: 12px;
            font-weight: 500;
        }
    }

    .solution-right {
        width: calc(100% - 55px);
        margin-left: 15px;

        .code-block {
            margin-top: 7px;
            width: 100%;
            font-size: 13px;
            -ms-overflow-style: none;
            scrollbar-width: none;
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }

}
</style>
