<template>
<Navbar>
  <template v-slot:biscuits>
    <NavBiscuit title="Python" :items="[{title:'Basic Algorithms',levels_total:8,levels_done:1,active:true,link:'/courses/dfs/fds/fds'}]"></NavBiscuit>
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
      </div>

      <div :class="'sidebar-tab flex ' + ((sidebarTab=='solutions') ? 'active':'')" @click="sidebarTab = 'solutions'">
        <div class="v-center tab-icon">
          <ion-icon name="checkbox"></ion-icon>
        </div>
        <div class="v-center">
          Solutions
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
          <a @click="$router.push('/courses/'+course.course_slug)">{{ course.course_title }}</a>
          <ion-icon name="chevron-forward"></ion-icon><a @click="$router.push('/courses/'+course.course_slug+'/'+chapter_slug)">{{ course.chapters[chapter_slug].chapter_title }}</a>
        </div>

        <div class="flex">
          <div class="v-center">
            <h2>{{ level.level_title }}</h2>
          </div>
          <div class="v-center">
            <span :class="'difficulty-badge ' + level.difficulty.toLowerCase()">{{level.difficulty}}</span>
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
        <a v-if="level !== null" v-for="author in level.authors" @click="$router.push('/@/'+author.username)">{{author.username}}</a>

        <span class="float-right">&copy; Acodo, {{(new Date()).getFullYear()}}</span>
      </p>
    </div>




    <div class="sidebar-inner" v-if="sidebarTab == 'chat'">

      <div class="messages-scroll">

        <template v-for="m in sortedMessages">

          <div class="message flex">

            <div class="message-left">
              <img :src="'https://robohash.org/'+MD5(m.user.username)" alt="" class="profile-pic">
              <div class="sideline"></div>
            </div>

            <div class="message-right">
              <div class="flex">
                <div class="username">{{m.user.username}}</div>
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
              <img :src="'https://robohash.org/'+MD5(r.user.username)" alt="" class="profile-pic">
              <div class="sideline"></div>
            </div>

            <div class="message-right reply">
              <div class="flex">
                <div class="username">{{r.user.username}}</div>
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


      <div class="send-box">

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

      <div class="solution-prompt" v-if="!level.complete && !level.forfeited && loading_solutions==false && solutions.length==0">
        <h3>Are you sure you want to view the solutions?</h3>
        <p>Since you have not solved this level yet we have hidden the solutions.</p>
        <p style="margin-bottom: 20px;">If you choose to view the solutions you will forfeit any XP from this level and won't be allowed to publish your own solutions.</p>

        <a class="btn btn-danger" @click="fetchSolutions()">Forfeit and show solutions</a>
      </div>

      <div v-if="loading_solutions">
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
        <div class="loadingFill" style="height: 100px; margin-bottom: 20px;"></div>
      </div>


      <div class="solution flex" v-for="solution in solutions">

        <div class="solution-left">
          <img :src="'https://robohash.org/'+MD5(solution.user.username)" alt="" class="profile-pic">

          <div class="upvote-button">
            <ion-icon name="arrow-up" class="betterIcon"></ion-icon>
          </div>
          <div class="vote-count">
            {{ solution.upvotes - solution.downvotes }}
          </div>
          <div class="downvote-button">
            <ion-icon name="arrow-down" class="betterIcon"></ion-icon>
          </div>

        </div>

        <div class="solution-right">

          <div class="flex">
            <div class="username">{{ solution.user.username }}</div>
            <div class="xp">
              <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>{{ solution.user.xp }} xp
            </div>
            <div class="time">{{ ConvertTime(solution.timestamp,"semi-absolute") }}</div>
          </div>

          <div class="code-block">
            function knights(ranks, p, r) {
            <br />const l = ranks.length;
            <br />let [x, a, b, c] = [0, (p-1+l)%l, p%l, 1];
            <br />while (c) {
            <br /> c = 0;
            <br /> while (ranks[a] == r) {
            <br /> [a, x, c] = [(a-1+l)%l, x+1, c+1];
            <br /> if (a == b) return 1 + (c + r != ranks[a] && r != ranks[a]);
            <br /> } while (ranks[b] == r) {
            <br /> [b, x, c] = [(b+1)%l, x+1, c+1];
            <br /> if (a == b) return 1 + (c + r != ranks[a] && r != ranks[a]);
            <br /> } r += c;
            <br />} return l - x + 1;
            }
          </div>

          <div class="badges flex">

            <div class="badge">
              <span class="badge-icon">💡</span>
              <span class="badge-text">Clever solution</span>
              <span class="badge-count">2</span>
            </div>

          </div>

        </div>
      </div>

    </div>



  </div>


  <div class="work-area">

    <div class="code-area">

      <div class="code-tool-bar flex">
        <div class="tool reload-button v-center" data-tooltip="Load default code">
          <ion-icon name="refresh"></ion-icon>
        </div>
        <div class="tool copy-button v-center" data-tooltip="Copy code">
          <ion-icon name="copy-outline"></ion-icon>
        </div>
        <div class="tool save-button v-center" data-tooltip="Save draft">
          <ion-icon name="save-outline"></ion-icon>
        </div>

        <div class="code-tool-bar-right flex">
          <div class="btn btn-primary-light" data-tooltip="⌘R, Ctrl+R" @click="runCode()">
            <ion-icon name="play-outline" class="betterIcon"></ion-icon> Run
          </div>

          <div class="btn btn-primary" v-if="level !== null && !level.complete && !level.forfeited">
            Submit solution
          </div>
          <div class="btn btn-primary" v-else-if="level !== null && !level.complete && level.forfeited">
            Complete
          </div>
          <div class="btn btn-primary" v-if="level !== null && level.complete && !level.forfeited">
            Re-submit solution
          </div>

        </div>
      </div>

      <div class="code-editor-container">
        <Codemirror v-model:value="code" :options="cmOptions" placeholder="test placeholder" />
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
      sidebarTab: "challenge",
      cmOptions: {
        mode: "python",
        theme: "acodo",
        lineNumbers: true,
        smartIndent: true,
        indentUnit: 2,
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
      solutions: []

    }
  },
  watch: {
    level: function(level) {
      if (level.hasOwnProperty('exists') && !level.exists) {
        this.$router.push('/404');
      }

      if (level.hasOwnProperty('complete') && (level.complete || level.forfeited) && this.solutions.length == 0) {
        this.fetchSolutions();
      }

    }
  },
  computed: {
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
    }

  },
  methods: {
    runCode() {
      this.$refs.PythonEmulator.runCode({
        code: this.code,
        tests: this.level.unit_tests,
        test_code: atob(atob(this.level.test_code))
      });
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
    },

    decodeMessage(m) {
      try {
        return MessageMarkdownToHTML(atob(atob(m)))
      } catch (e) {
        return MessageMarkdownToHTML("*Message unreadable*")
      }
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

    fetchSolutions() {


      this.loading_solutions = true;
      this.api_request('GET', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/solutions').then((resp) => {
        if (resp.status == "success") {
          this.solutions = resp.solutions;
        }
        this.loading_solutions = false;
      });


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

      console.log(this.messages);

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

      let obj = {
        message_content: btoa(MessageHTMLToMarkdown(this.send_message_content))
      }

      if (this.reply_to !== null) {
        obj.reply_to = this.reply_to.message_id;
      }

      this.sending_message = true;
      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/send', obj, 300).then(() => {
        this.send_message_content = "";
        this.$refs.messageEditor.editor.root.innerHTML = "";
        this.fetchMessages();
        this.reply_to = null;
        this.sending_message = false;
      });

    },

    edit_message(m) {
      this.editing_message = m;
      this.$refs.messageEditor.editor.root.innerHTML = MessageMarkdownToEditable(atob(atob(m.message_content)));
    },

    stop_editing() {
      this.editing_message = null;
      this.$refs.messageEditor.editor.root.innerHTML = "";
    },

    submit_edit() {

      this.sending_message = true;
      this.api_request('POST', '/courses/' + this.course_slug + '/chapters/' + this.chapter_slug + '/level/' + this.level_slug + '/messages/edit', {
        message_id: this.editing_message.message_id,
        message_content: btoa(MessageHTMLToMarkdown(this.send_message_content))
      }, 300).then(() => {
        this.send_message_content = "";
        this.$refs.messageEditor.editor.root.innerHTML = "";
        this.fetchMessages();
        this.reply_to = null;
        this.editing_message = null;
        this.sending_message = false;
      });

    }

  },
  beforeDestroy() {
    clearInterval(this.messages_timer);
  },
  mounted() {

    this.$store.dispatch('getLevel', {
      'course_slug': this.course_slug,
      'chapter_slug': this.chapter_slug,
      'level_slug': this.level_slug
    });

    this.fetchMessages();
    this.messages_timer = setInterval(this.fetchMessages, 7000);

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

}

.brief,
.message-content,
.test-area {
    .inline-code {
        font-family: 'Source Code Pro', monospace;
        font-size: 14px;
        color: #5C616B;
        background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
        border: 1px solid rgba(0, 95, 254, 0.17);
        padding: 1px 5px;
        border-radius: 5px;
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
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 13px;

    .left-icon {
        margin-right: 5px;
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
    cursor: pointer;
    margin-bottom: 5px;

    a {
        transition: color 0.2s;
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
    }

    .profile-pic {
        width: 40px;
        height: 40px;
        background-color: #ECEBED;
        border-radius: 50%;
        margin: 0 auto 10px;
        display: block;
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
            }

            &.italic {
                font-style: italic;
                font-family: arial;
                font-family: Source Code Pro;
                position: relative;
                top: -1px;
                margin-left: 2px;
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

    .solution-left {
        width: 40px;
    }

    .downvote-button,
    .upvote-button,
    .vote-count {
        text-align: center;
        color: #A0A1A7;
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

    .badge {
        background-color: #EDEDED;
        padding: 2px 9px 3px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;

        margin-top: 5px;

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
