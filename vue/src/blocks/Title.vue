<template>
  <div 
    class="form-group"
    :class="{'has-error': hasError }">
    <label class="control-label" for="title">Заголовок. Не желательно менять! {{count}}/60</label>
    <input
      id="title"
      name="title"
      type="text"
      placeholder="Заголовок в гугле"
      class="form-control"
      autocomplete="off"
      :value="title"
      @keyup="setTitle">
  </div>
</template>

<script>
export default {
  props: ['title'],
  data: function() {
    return {
      hasError: false,
    };
  },
  computed: {
    count() {
      return this.title.length;
    }
  },
  methods: {
    setTitle(e) {
      const val = e.target.value;
      if (val.length > 60) {
        this.hasError = true;
        setTimeout(() => {
          this.hasError = false;
        }, 1500);
      }
      this.$emit('setTitle', { val: val.substr(0, 60), field: 'title'});
    }
  },
}
</script>

<style>

</style>
