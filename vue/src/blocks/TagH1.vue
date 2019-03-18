<template>
  <div
    class="form-group"
    :class="{'has-warning': hasErrors }">
    <label class="control-label" for="h1">Заголовок h1. Не желательно менять!</label>
    <input
      id="h1"
      name="h1"
      type="text"
      placeholder="Заголовок статьи"
      class="form-control"
      autocomplete="off"
      @keyup="setH1"
      :value="h1">
  </div>
</template>

<script>
export default {
  props: ['h1', 'hasErrors'],
  methods: {
    setH1(e) {
      this.$emit('setH1', e.target.value );
    }
  }
}
</script>
