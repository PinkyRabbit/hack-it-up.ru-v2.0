<template>
  <div id="app">
    <form action="post" v-on:submit.prevent="onSubmit">
      <!-- Title -->
      <Title
        :title="article.title"
        @setTitle="updateField"
      >Loading...</Title>

      <!-- Заголовок в h1 -->
      <TagH1
        :h1="article.h1"
        :hasError="errors.h1"
        @setH1="updateH1"
      >Loading...</TagH1>

      <!-- Ссылка на статью -->
      <Url
        :slug="article.slug"
        :hasError="errors.slug">Loading...</Url>

      <!-- Описание description -->
      <Description
        :description="article.description"
        @setDescription="updateField"
      >Loading...</Description>

      <!-- Ключевые слова -->
      <Keywords
        :keywords="article.keywords"
        @setKeywords="updateField"
      >Loading...</Keywords>

      <!-- Категории -->
      <Categories
        :category="article.category"
        @updateCategory="updateField"
      >Loading...</Categories>

      <!-- Изображение -->
      <form-image
        :csrf="article._csrf"
        :postimage="article.postimage"
        @updateImage="updateField"
      >Loading...</form-image>

      <!-- Текст статьи -->
      <Body
        :body="article.body"
        @passEditor="passEditor"
        >Loading...</Body>

      <!-- Теги -->
      <Tags
        :tags="article.tags"
        @addTag="addTag"
        @removeTag="removeTag"
      >Loading...</Tags>

      <hr/>
      <button class="btn btn-danger" type="submit">Сохранить</button>
    </form>
    <RealForm
      :article="article"
    >Loading...</RealForm>
  </div>
</template>

<script>
import Keywords from './blocks/Keywords.vue';
import Categories from './blocks/Categories.vue';
import Description from './blocks/Description.vue';
import Url from './blocks/Url.vue';
import TagH1 from './blocks/TagH1.vue';
import Title from './blocks/Title.vue';
import Body from './blocks/Editor.vue';
import Tags from './blocks/Tags.vue';
import Image from './blocks/Image.vue';
import RealForm from './blocks/RealForm.vue';

export default {
  name: 'app',
  components: {
    Description,
    Categories,
    Keywords,
    Url,
    TagH1,
    Title,
    Body,
    Tags,
    'form-image': Image,
    RealForm,
  },
  data: function () {
    return {
      article: {
        _csrf: "",
        author: "",
        body: "",
        category: "",
        description: "",
        h1: "",
        keywords: "",
        postimage: "",
        slug: "",
        tags: [],
        title: "",
        _id: "",
      },
      editor: null,
      errors: {
        h1: false,
        slug: false,
      }
    };
  },
  methods: {
    onSubmit(e) {
      const body = {
        ...this.article,
        body: this.editor.getHTML(),
      };

      document.getElementById('realform').submit();
    },
    autoUpdate() {
      const body = {
        ...this.article,
        body: this.editor.getHTML(),
      };

      const url = '/admin/edit/' + this.article._id + '?_csrf=' + this.article._csrf;
      this.$http.put(url, body)
        .then(response => {
          // get body data
          console.log('autoUpdate =>', response.body);
        }, response => {
          console.error(response);
        });
    },
    updateField(obj) {
      const { val, field } = obj;
      this.article[field] = val;
    },
    updateH1(val) {
      this.article.h1 = val;
      this.$http.get('/admin/api?slug='+val).then(response => {
        // get body data
        this.article.slug = response.body.slug;
        this.errors.h1 = response.body.doubled;
        this.errors.slug = response.body.doubled;
      }, response => {
        console.error(response);
      });
    },
    addTag(val) {
      this.article.tags.push(val);
    },
    removeTag(val) {
      const index = this.article.tags.indexOf(val);
      const arr = this.article.tags;
      arr.splice(index, 1);
      this.article.tags = arr;
    },
    passEditor(editor) {
      this.editor = editor;
    }
  },
  mounted() {
    const d = window.location.pathname.split('/');
    const id = d[d.length - 1];
    this.$http.get('/admin/api?post=' + id).then(response => {
      // get body data
      this.article = {...this.article, ...response.body};
    }, response => {
      console.error(response);
    });

    this.$http.get('/admin/api?csrf=true').then(response => {
      // get body data
      this.article._csrf = response.body;
    }, response => {
      console.error(response);
    });

    setInterval(() => {
      this.autoUpdate();
    }, 30000);
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
