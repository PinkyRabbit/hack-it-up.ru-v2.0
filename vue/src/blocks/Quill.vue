<template>
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOptions"
      @change="onEditorChange($event)"
    >
    </quill-editor>
</template>

<script>
import hljs from 'highlight.js'
import { Quill, quillEditor } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'quill',
  components: {
    quillEditor
  },
  props: ['body'],
  data: () => ({
    content: '',
    editorOptions: {
      debug: 'error',
      placeholder: 'Начни набирать текст... и всё получится!',
      readOnly: true,
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
          ['link', 'image', 'code', 'code-block'],
        ],
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        },
        imageDrop: true,
      }
    },
  }),
  computed: {
    contentCode() {
      return hljs.highlightAuto(this.content).value
    },
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  watch: {
    body: function(val) {
      this.content = val;
    }
  },
  methods: {
    onEditorChange({ quill, html, text }) {
      this.$emit('UpdateContent', html);
    }
  }
}
</script>

<style>
.ql-container {
    height: 540px;
    max-height: 450px;
    overflow-y: scroll;
}
.quill-editor:not(.bubble) .ql-container,
.quill-editor:not(.bubble) .ql-container .ql-editor {
    height: 30rem;
    padding-bottom: 1rem;
}
.quill-code {
    height: auto;
    border: none;
}
.quill-code .title {
    border: 1px solid #ccc;
    border-left: none;
    height: 3em;
    line-height: 3em;
    text-indent: 1rem;
    font-weight: bold;
}
.quill-code code {
    width: 100%;
    margin: 0;
    padding: 1rem;
    border: 1px solid #ccc;
    border-top: none;
    border-left: none;
    border-radius: 0;
    height: 30rem;
    overflow-y: auto;
}
</style>
