<template lang="html">
    <div class="message-editor"></div>
</template>

<script>

var Quill = require("quill")
const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

/* SOURCE: https://gist.github.com/prodrammer/d4d205594b2993224b8ad111cebe1a13 */
class PlainClipboard extends Clipboard {
  onPaste(e) {
    e.preventDefault()
    const range = this.quill.getSelection()
    const text = e.clipboardData.getData('text/plain')
    const delta = new Delta()
      .retain(range.index)
      .delete(range.length)
      .insert(text)
    const index = text.length + range.index
    const length = 0
    this.quill.updateContents(delta, 'silent')
    this.quill.setSelection(index, length, 'silent')
    this.quill.scrollIntoView()
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)

export default {
  name: "Quill",
  data() {
    return {
      editor: null,
      message_content: []
    }
  },
  mounted() {

    if (this.editor == null) {

      this.editor = new Quill('.message-editor', {
        theme: 'bubble',
        placeholder: "What are your thoughts?",
        scrollingContainer: ".message-editor",
        modules: {
          toolbar: ['bold', 'italic', 'code-block', 'code']
        }
      });

      let app = this;

      this.editor.on('editor-change', function(delta, oldDelta, source) {
        app.$parent.send_message_content = app.editor.root.innerHTML;
      });

      if (app.$parent.send_message_content !== null) {
        app.editor.root.innerHTML = app.$parent.send_message_content;
      }


    }


  },
  methods: {

    inlinecode() {
      document.querySelector('.ql-code').click();
    },
    codeblock() {
      document.querySelector('.ql-code-block').click();

    },
    bold() {
      document.querySelector('.ql-bold').click();
    },
    italic() {
      document.querySelector('.ql-italic').click();
    }

  }
}
</script>

<style lang="scss">
.message-editor {

    background-color: #fff;
    border-radius: 8px;
    border-bottom: 1px solid #ECEBED;

    .ql-toolbar,
    .ql-tooltip-arrow {
        display: none;
    }

    .ql-editor {
        font-size: 13px;
        padding: 0;
        color: #5F6266;
        padding: 10px;
    }

    .ql-editor.ql-blank::before {
        font-size: 13px;
        left: 10px;
        font-style: normal;
        color: #A0A1A7;
    }

    .ql-editor pre.ql-syntax {
        font-family: 'Source Code Pro', monospace;
        color: #5C616B;
        background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
        border: 1px solid rgba(0, 95, 254, 0.17);
        padding: 7px;
        border-radius: 5px;
    }

    .ql-editor code {
        font-family: 'Source Code Pro', monospace;
        color: #5C616B;
        background: linear-gradient(0deg, rgba(0, 95, 254, 0.07), rgba(0, 95, 254, 0.07)), #FFFFFF;
        border: 1px solid rgba(0, 95, 254, 0.17);
        border-radius: 5px;
    }

}
</style>
