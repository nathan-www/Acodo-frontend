<template lang="html">

  <div class="console" id="console" onclick="document.querySelector('.console-input-box').focus()">

    <div class="console-loading v-center" v-if="consoleLoading">
      <img class="inline-loader" src="@/assets/img/loader-grey.png" alt="">
    </div>

    <div class="console-container" v-show="!consoleLoading">
      <div class="console-entries">
        <div class="console-entry title">Python 2.7.9 (Emulator)</div>
      </div>
      <div class="console-input-area flex">
        <span class="prompt"></span>
        <div class="console-input-box" contenteditable=""></div>
      </div>
    </div>

  </div>

</template>

<script>
var consolePromResolve;
var appConsole;

var pypyworker;

class Terminal {

  constructor({
    el,
    consoleInput
  }) {
    this.el = el;
    this.inputBox = this.el.getElementsByClassName('console-input-box')[0];
    this.consoleInput = consoleInput;
    this.enabled = false;

    let inputBox = this.inputBox;
    this.inputBox.onkeypress = (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        this.execLine(inputBox.innerText);
      }
    };
  }

  execLine(code) {
    let entry = document.createElement("div");
    entry.classList.add('console-entry');
    entry.classList.add('output');
    entry.innerHTML = "<span class='prompt'></span>" + code;
    this.el.querySelector(".console-entries").appendChild(entry);
    this.inputBox.innerText = "";
    this.disable();
    this.consoleInput(code);
  }

  response(resp) {
    let entry = document.createElement("div");
    entry.classList.add('console-entry');
    entry.classList.add('input');
    entry.innerHTML = resp.replaceAll(" ", "&nbsp").replaceAll("\n", "<br>");
    this.el.querySelector(".console-entries").appendChild(entry);
  }

  error(err) {
    let lastEntry = this.el.querySelector('.console-entries').children[this.el.querySelector('.console-entries').children.length - 1];
    if (lastEntry.classList.contains('error')) {
      lastEntry.innerHTML += err.replaceAll(" ", "&nbsp").replaceAll("\n", "<br>");
    } else {
      let entry = document.createElement("div");
      entry.classList.add('console-entry');
      entry.classList.add('error');
      entry.innerHTML = err.replaceAll(" ", "&nbsp").replaceAll("\n", "<br>");
      this.el.querySelector(".console-entries").appendChild(entry);
    }
  }

  executionStamp() {
    let entry = document.createElement("div");
    entry.classList.add('console-entry');
    entry.classList.add('executionStamp');
    entry.innerHTML = "====== " + ("0" + (new Date()).getHours()).substr(-2) + ":" + ("0" + (new Date()).getMinutes()).substr(-2) + ":" + ("0" + (new Date()).getSeconds()).substr(-2) + " ======";
    this.el.querySelector(".console-entries").appendChild(entry);
  }

  enable() {
    this.enabled = true;
    this.el.querySelector('.console-input-area').style.display = 'flex';
    this.el.scrollTop = this.el.scrollHeight;
  }

  disable() {
    this.enabled = false;
    this.el.querySelector('.console-input-area').style.display = 'none';
  }

}

export default {

  name: 'PythonEmulator',

  data() {
    return {
      consoleLoading: true
    }
  },

  methods: {

    runCode: function(obj) {



      appConsole.disable();
      appConsole.executionStamp();
      pypyworker.postMessage({
        "type": "execute",
        "code": obj.code,
        "tests": JSON.parse(JSON.stringify(obj.tests)),
        "test_code": obj.test_code
      });

    }

  },

  mounted() {

    var alreadyLoaded = false;
    if (typeof pypyworker == 'undefined') {
      //Setup PyPyJS environment
      pypyworker = new Worker('/static/pypyjs/worker.js');
    }
    else{
      alreadyLoaded = true;
    }

    app = this;
    pypyworker.onmessage = (e) => {

      if (e.data.type == "consoleEnable") {
        app.consoleLoading = false;
        appConsole.enable();
      } else if (e.data.type == "consoleError") {
        appConsole.error(e.data.error);
      } else if (e.data.type == "consoleOutput") {
        appConsole.response(e.data.data);
      } else if(e.data.type == "test_feedback"){
        app.$parent.receiveTestFeedback(e.data.feedback,e.data.error);
      }
    };

    appConsole = new Terminal({
      el: document.querySelector('#console'),
      consoleInput: (code) => {
        appConsole.disable();
        pypyworker.postMessage({
          "type": "consoleInput",
          "code": code
        });
      }
    });

    if(alreadyLoaded){
      this.consoleLoading = false;
      appConsole.enable();
    }


  }

}
</script>

<style lang="scss">
.console {
    height: 50%;
    padding: 10px;
    overflow: scroll;
}

.console-loading {
    height: 100%;
    font-size: 25px;
    img {
        margin: auto;
        display: block;
    }
}

div.console-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    font-size: 13px;
    font-family: 'Source Code Pro', monospace;
}

.console-entry {
    color: #383A42;
}

.console-entry,
.console-entry *,
.console-input-area,
.console-input-area * {
    font-family: 'Source Code Pro', monospace;
}

.console-entry.title {
    user-select: none;
    margin-bottom: 5px;
    color: #383A42;
}

.console-entry.error {
    color: #EC4747;
}

.console-entry.executionStamp {
    color: #A0A1A7;
}

.console-input-box {
    width: 100%;
    color: #383A42;
    outline: none;
    font-family: 'Source Code Pro', monospace;
}

.console-input-area {
    padding-bottom: 15px;
    display: none;
}

span.prompt::before {
    content: '>>>';
    margin-right: 5px;
    color: #A0A1A7;
}
</style>
