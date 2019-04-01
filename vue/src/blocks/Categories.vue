<template>
  <div> 
    <div class="form-group">
      <label class="control-label" for="categories">Категория</label>
      <input 
        name="categories"
        id="categories"
        type="text"
        class="form-control"
        placeholder="Начните вводить для автоподбора..."
        autocomplete="off"
        :value="category"
        @keyup="searchItem">
    </div>
    <ul class="list-group">
      <li 
        class="list-group-item"
        v-for="(item, index) in active"
        :key="`item-${index}`"
        @click="selectItem"
        >{{ item }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['category'],
  data: function() {
    return {
      categories: [],
      active: [],
    };
  },
  methods: {
    searchItem(e) {
      this.$emit('updateCategory', { val: e.target.value, field: 'category'});
      this.makeList(e.target.value);
    },
    makeList(str) {
      const reg = new RegExp(this.escapeRegExp(str), 'i');
      this.active = this.categories
        .filter(x => reg.test(x))
        .slice(0, 5);
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    selectItem(e) {
      this.$emit('updateCategory', { val: e.target.textContent, field: 'category'});
      this.active = [];
    },
  },
  mounted() {
    this.$http.get('/admin/api?categories=find').then(response => {
      // get body data
      this.categories = response.body
        .filter(x => x.name)
        .map(x => x.name);
    }, response => {
      console.error(response);
    });
  }
}
</script>

<style scoped>
  .list-group-item {
    cursor: pointer;
  }
</style>
