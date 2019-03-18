<template>
  <div>
    <div class="form-group">
      <label class="control-label" for="tag">Добавить тег</label>
      <div class="input-group">
        <input 
          name="tag"
          id="tag"
          type="text"
          class="form-control"
          placeholder="Начните вводить для автоподбора..."
          autocomplete="off"
          v-model="tag"
          @keyup="searchItem">
        <span
          class="input-group-addon"
          @click="addTag">Добавить</span>
      </div>
    </div>

    <ul class="list-group">
      <li 
        class="list-group-item"
        v-for="(item, index) in active"
        :key="`item-${index}`"
        @click="selectItem"
        >{{ item }}</li>
    </ul>

    <div>
      <h4>
        <span
          class="label label-default"
          v-for="(item, index) in tags"
          :key="`item-${index}`"
          @click="removeItem"
          >{{ item }}</span>
      </h4>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tags'],
  data: function() {
    return {
      tag: '',
      list: [],
      active: [],
    };
  },
  methods: {
    searchItem(e) {
      this.makeList(e.target.value);
    },
    makeList(str) {
      const reg = new RegExp(this.escapeRegExp(str), 'i');
      this.active = this.list
        .filter(x => reg.test(x))
        .slice(0, 5);
    },
    removeItem(e) {
      this.$emit('removeTag', e.target.textContent);
    },
    addTag(e) {
      this.$http.get('/admin/api?tag=' + this.tag).then(response => {
        // get body data
        this.list.push(this.tag);
        this.$emit('addTag', this.tag);
        this.active = [];
        this.tag = '';
      }, response => {
        console.error(response);
      });
    },
    selectItem(e) {
      this.list.push(e.target.textContent);
      this.active = [];
      this.tag = '';
      this.$emit('addTag', e.target.textContent);
    },
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
  },
  mounted() {
    this.$http.get('/admin/api?tag=find').then(response => {
      // get body data
      this.list = response.body
        .filter(x => x.name)
        .map(x => x.name);
    }, response => {
      console.error(response);
    });
  },
}
</script>

<style scoped>
  .list-group-item,
  .label-default,
  .input-group-addon {
    cursor: pointer;
  }
  .label-default {
    margin-right: 10px;
    margin-bottom: 5px;
  }
</style>
