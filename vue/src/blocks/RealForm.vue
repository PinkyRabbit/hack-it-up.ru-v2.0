<template>
  <form :action="action" method="post" id="realform">
    <input type="hidden" name="author" :value="article.author">
    <input type="hidden" name="body" :value="article.body">
    <input type="hidden" name="category" :value="article.category">
    <input type="hidden" name="description" :value="article.description">
    <input type="hidden" name="h1" :value="article.h1">
    <input type="hidden" name="keywords" :value="article.keywords">
    <input type="hidden" name="postimage" :value="article.postimage">
    <input type="hidden" name="slug" :value="article.slug">
    <input type="hidden" name="tags" :value="article.tags">
    <input type="hidden" name="title" :value="article.title">
  </form>
</template>

<script>
export default {
  props: ['article'],
  computed: {
    action() {
      return '/admin/edit/' + this.article._id + '?_csrf=' + this.article._csrf;
    },
  }
}
</script>
