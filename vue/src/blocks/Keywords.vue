<template>
  <div class="form-group">
    <label class="control-label" for="keywords">Ключевые слова (2-5 слов через запятую)</label>
    <input 
      name="keywords"
      id="keywords"
      type="text" 
      placeholder="любые, ключи"
      class="form-control"
      autocomplete="off"
      @keyup="setKeywords"
      :value="keywords">
  </div>
</template>

<script>
export default {
  props: ['keywords'],
  methods: {
    setKeywords(e) {
      this.$emit('setKeywords', { val: e.target.value, field: 'keywords'});
    }
  }
}
</script>

<style>

</style>
