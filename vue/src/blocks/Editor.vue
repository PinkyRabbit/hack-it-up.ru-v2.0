<template>
  <div class="form-group">
    <editor-menu-bar :editor="editor">
      <div class="menubar" slot-scope="{ commands, isActive }">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <span class="glyphicon glyphicon-bold" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <span class="glyphicon glyphicon-italic" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <span class="glyphicon glyphicon-euro" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <span class="glyphicon glyphicon-text-width" aria-hidden="true"></span>
        </button>


        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.link() }"
          @click="commands.link"
        >
          <span class="glyphicon glyphicon-link" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <span class="glyphicon glyphicon-sort-by-attributes" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <span class="glyphicon glyphicon-sort-by-order-alt" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <span class="glyphicon glyphicon-lamp" aria-hidden="true"></span>
        </button>


        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <span class="glyphicon glyphicon-console" aria-hidden="true"></span>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <span class="glyphicon glyphicon-object-align-top" aria-hidden="true"></span>
        </button>
      </div>
    </editor-menu-bar>
    <div class="teditor">
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  Heading,
  OrderedList,
  BulletList,
  ListItem,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
} from 'tiptap-extensions';
// import func from './vue-temp/vue-editor-bridge';

export default {
  props: ['body'],
  components: {
    EditorMenuBar,
    EditorContent,
  },
  data: function() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new CodeBlock(),
          new Heading({ levels: [1, 2, 3] }),
          new BulletList(),
          new OrderedList(),
          new ListItem(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
        ],
        content: '',
      }),
    };
  },
  methods: {
    updateBody(val) {
      this.$emit('updateBody', val);
    }
  },
  watch: {
    body: function(val) {
      this.editor.setContent(val);
    }
  },
  mounted() {
    this.$emit('passEditor', this.editor);
  }
}
</script>

<style scoped>
.teditor {
  margin-top: 10px;
  border: 1px #dcdcdc solid;
  padding: 3px;
  max-height: 300px;
  overflow-y: scroll;
}
</style>
