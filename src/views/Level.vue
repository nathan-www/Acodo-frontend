<template>
<Navbar>
  <template v-slot:biscuits>
    <NavBiscuit title="Python" :items="[{title:'Basic Algorithms',levels_total:8,levels_done:1,active:true,link:'/courses/dfs/fds/fds'}]"></NavBiscuit>
  </template>
</Navbar>

<div class="main flex">
  <div class="sidebar">

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

      <div class="sidebar-breadcrumb">
        <a>Python</a>
        <ion-icon name="chevron-forward"></ion-icon><a>Object-Oriented Programming</a>
      </div>

      <div class="flex">
        <div class="v-center">
          <h2>Constructors &amp; Attributes</h2>
        </div>
        <div class="v-center">
          <span class="difficulty-badge easy">Easy</span>
        </div>
      </div>

      <div class="separator"></div>

      <p>Python is an object oriented programming language.</p>
      <p>Almost everything in Python is an object, with its properties and methods.</p>
      <p>A Class is like an object constructor, or a "blueprint" for creating objects.</p>

      <h3>Example</h3>

      <p>Create a class named MyClass, with a property named x:</p>

      <div>
        <div class="code-block">
          class MyClass:<br />
          &nbsp;&nbsp;&nbsp;x = 5
        </div>
      </div>

      <div class="separator"></div>
      <div class="separator"></div>

      <h3>
        <ion-icon name="hammer"></ion-icon> Task
      </h3>

      <p>Create a class <span class="inline-code">Person</span> with the attributes ‘firstname’ and ‘lastname’.</p>
      <p>Define a method <span class="inline-code">printname</span> that prints the firstname and lastname.</p>

      <div class="test-area">
        <h3>Code tests</h3>

        <div class="test flex">
          <div class="v-center">
            <div class="test-icon v-center pass">
              <ion-icon name="checkmark"></ion-icon>
            </div>
          </div>
          <div class="v-center">
            <div>
              <h4>Class ‘Person’ must contain the property ‘firstname’</h4>
            </div>
          </div>
        </div>

        <div class="test flex">
          <div class="v-center">
            <div class="test-icon v-center fail">
              <ion-icon name="close"></ion-icon>
            </div>
          </div>
          <div class="v-center">
            <div>
              <h4>Code must contain an IF statement</h4>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div class="footer" v-if="sidebarTab == 'challenge'">
      <p>Author: <a>John Doe</a> <span class="float-right">&copy; Acodo, {{(new Date()).getFullYear()}}</span></p>
    </div>




    <div class="sidebar-inner" v-if="sidebarTab == 'chat'">


      <div class="messages-scroll">

        <div class="message flex">

          <div class="message-left">
            <img src="https://robohash.org/example" alt="" class="profile-pic">
            <div class="sideline"></div>
          </div>

          <div class="message-right">
            <div class="flex">
              <div class="username">johndoe</div>
              <div class="xp">
                <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
              </div>
              <div class="time">Today, 13:22</div>
            </div>

            <p class="message-content">
              My solution that always passes JS sometimes fails Python. I'm positive it's because of some edge case you check in Python and not in JS.
              <br />Could you verify both languages for edge case generation?
            </p>

            <div class="message-bottom">
              <div class="flex">
                <div class="upvote v-center">
                  <ion-icon name="arrow-up"></ion-icon>
                </div>
                <div class="vote-count v-center">
                  6
                </div>
                <div class="downvote v-center">
                  <ion-icon name="arrow-down"></ion-icon>
                </div>
              </div>

              <div class="message-bottom-left">
                <div class="reply-button">
                  <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                </div>
              </div>
            </div>

          </div>

        </div>

        <div class="message reply flex">

          <div class="message-left reply">
            <div class="sideline"></div>
          </div>

          <div class="message-left">
            <img src="https://robohash.org/example" alt="" class="profile-pic">
            <div class="sideline"></div>
          </div>

          <div class="message-right">
            <div class="flex">
              <div class="username">johndoe</div>
              <div class="xp">
                <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
              </div>
              <div class="time">Today, 13:22</div>
            </div>

            <p class="message-content">
              My solution that always passes JS sometimes fails Python. I'm positive it's because of some edge case you check in Python and not in JS.
              <br />Could you verify both languages for edge case generation?
            </p>

            <div class="message-bottom">
              <div class="flex">
                <div class="upvote v-center">
                  <ion-icon name="arrow-up"></ion-icon>
                </div>
                <div class="vote-count v-center">
                  6
                </div>
                <div class="downvote v-center">
                  <ion-icon name="arrow-down"></ion-icon>
                </div>
              </div>

              <div class="message-bottom-left">
                <div class="reply-button">
                  <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                </div>
              </div>
            </div>

          </div>

        </div>


        <div class="message flex">

          <div class="message-left">
            <img src="https://robohash.org/example" alt="" class="profile-pic">
            <div class="sideline"></div>
          </div>

          <div class="message-right">
            <div class="flex">
              <div class="username">johndoe</div>
              <div class="xp">
                <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
              </div>
              <div class="time">Today, 13:22</div>
            </div>

            <p class="message-content">
              My solution that always passes JS sometimes fails Python. I'm positive it's because of some edge case you check in Python and not in JS.
              <br />Could you verify both languages for edge case generation?
            </p>

            <div class="message-bottom">
              <div class="flex">
                <div class="upvote v-center">
                  <ion-icon name="arrow-up"></ion-icon>
                </div>
                <div class="vote-count v-center">
                  6
                </div>
                <div class="downvote v-center">
                  <ion-icon name="arrow-down"></ion-icon>
                </div>
              </div>

              <div class="message-bottom-left">
                <div class="reply-button">
                  <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                </div>
              </div>
            </div>

          </div>

        </div>

        <div class="message flex">

          <div class="message-left">
            <img src="https://robohash.org/example" alt="" class="profile-pic">
            <div class="sideline"></div>
          </div>

          <div class="message-right">
            <div class="flex">
              <div class="username">johndoe</div>
              <div class="xp">
                <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
              </div>
              <div class="time">Today, 13:22</div>
            </div>

            <p class="message-content">
              My solution that always passes JS sometimes fails Python. I'm positive it's because of some edge case you check in Python and not in JS.
              <br />Could you verify both languages for edge case generation?
            </p>

            <div class="message-bottom">
              <div class="flex">
                <div class="upvote v-center">
                  <ion-icon name="arrow-up"></ion-icon>
                </div>
                <div class="vote-count v-center">
                  6
                </div>
                <div class="downvote v-center">
                  <ion-icon name="arrow-down"></ion-icon>
                </div>
              </div>

              <div class="message-bottom-left">
                <div class="reply-button">
                  <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                </div>
              </div>
            </div>

          </div>

        </div>

        <div class="message flex">

          <div class="message-left">
            <img src="https://robohash.org/example" alt="" class="profile-pic">
            <div class="sideline"></div>
          </div>

          <div class="message-right">
            <div class="flex">
              <div class="username">johndoe</div>
              <div class="xp">
                <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
              </div>
              <div class="time">Today, 13:22</div>
            </div>

            <p class="message-content">
              My solution that always passes JS sometimes fails Python. I'm positive it's because of some edge case you check in Python and not in JS.
              <br />Could you verify both languages for edge case generation?
            </p>

            <div class="message-bottom">
              <div class="flex">
                <div class="upvote v-center">
                  <ion-icon name="arrow-up"></ion-icon>
                </div>
                <div class="vote-count v-center">
                  6
                </div>
                <div class="downvote v-center">
                  <ion-icon name="arrow-down"></ion-icon>
                </div>
              </div>

              <div class="message-bottom-left">
                <div class="reply-button">
                  <ion-icon name="arrow-undo" class="betterIcon"></ion-icon> Reply
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>


      <div class="send-box">
        <div @keyup="(function(e){ if(e.target.innerHTML=='<br>'){ e.target.innerHTML = ''; } })($event)" class="send-content" contenteditable=""></div>

        <div class="send-bar flex">
          <div class="send-box-button code-button">
            <ion-icon name="code" class="betterIcon"></ion-icon>
          </div>
          <div class="send-box-button send-button">
            <ion-icon name="send" class="betterIcon"></ion-icon>
          </div>
        </div>
      </div>


    </div>



    <div class="sidebar-inner" v-if="sidebarTab == 'solutions'">

      <div class="solution flex">

        <div class="solution-left">
          <img src="https://robohash.org/example" alt="" class="profile-pic">

          <div class="upvote-button">
            <ion-icon name="arrow-up" class="betterIcon"></ion-icon>
          </div>
          <div class="vote-count">
            9
          </div>
          <div class="downvote-button">
            <ion-icon name="arrow-down" class="betterIcon"></ion-icon>
          </div>

        </div>

        <div class="solution-right">

          <div class="flex">
            <div class="username">johndoe</div>
            <div class="xp">
              <ion-icon class="betterIcon" name="sparkles-sharp"></ion-icon>217 xp
            </div>
            <div class="time">Today, 13:22</div>
          </div>

          <div class="code-block">
            function knights(ranks, p, r) {
  <br />const l = ranks.length;
  <br />let [x, a, b, c] = [0, (p-1+l)%l, p%l, 1];
  <br />while (c) {
  <br />  c = 0;
  <br />  while (ranks[a] == r) {
  <br />    [a, x, c] = [(a-1+l)%l, x+1, c+1];
  <br />    if (a == b) return 1 + (c + r != ranks[a] && r != ranks[a]);
  <br />  } while (ranks[b] == r) {
  <br />    [b, x, c] = [(b+1)%l, x+1, c+1];
  <br />    if (a == b) return 1 + (c + r != ranks[a] && r != ranks[a]);
  <br />  } r += c;
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


  <div class="code-area">


  </div>

</div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import NavBiscuit from '@/components/NavBiscuit.vue'

export default {
  name: 'Level',
  components: {
    Navbar,
    NavBiscuit
  },
  data() {
    return {
      "sidebarTab": "challenge",
      console: console
    }
  }
}
</script>

<style lang="scss" scoped>

.main {
    height: calc(100% - 66px);
}

.sidebar {
    width: 450px;
    height: 100%;
    border-right: 1.5px solid #ECEBED;
}

.sidebar-tabs {
    padding: 10px 25px;
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

.code-block {
    font-family: Roboto Mono;
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
    font-family: Roboto Mono;
    font-size: 14px;
    color: #5C616B;
    background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
    border: 1px solid rgba(0, 95, 254, 0.17);
    padding: 1px 5px;
    border-radius: 5px;
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
}

.sidebar-inner {
    padding: 25px;
    height: calc(100% - 48px);
    overflow: scroll;
    position: relative;

    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }

    &.challenge {
        background-color: #F8F8FA;
        height: calc(100% - 48px - 45px);
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

.code-area {
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

        &:hover {
            background-color: #ECEBED;
        }
    }

    .message-bottom-left {
        margin-left: auto;
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

    .send-content:empty::before {
        content: 'Write a new message...';
        color: #A0A1A7;
    }

    .send-content {
        font-size: 12px;
        cursor: text;
        color: #5F6266;
        margin: 10px;
        max-height: 60px;
        overflow-y: scroll;
    }

    .send-bar {

        padding: 0 10px 7px;

        .send-button {
            margin-left: auto;
        }

        .send-box-button {
            font-size: 15px;
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

    .badge{
      background-color: #EDEDED;
      padding: 2px 9px 3px 9px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s;

      margin-top: 5px;

      &:hover{
        background-color: #E5E5E5;
      }

      .badge-icon{
        margin-right: 5px;
      }

      .badge-text{
        color: #5F6266;
        font-size: 12px;
        margin-right: 5px;
      }
      .badge-count{
        color: #A0A1A7;
        font-size: 12px;
        font-weight: 500;
      }
    }

    .solution-right{
      width: calc(100% - 55px);
      margin-left: 15px;

      .code-block{
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
