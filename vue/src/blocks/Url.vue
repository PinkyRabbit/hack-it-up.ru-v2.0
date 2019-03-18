<template>
  <div
    class="form-group"
    :class="{'has-warning': hasErrors }">
    <label class="control-label" for="slug">Ссылка на статью. Генерируется автоматом</label>
    <input 
      id="slug"
      name="slug"
      type="text"
      placeholder="Сгенерируется автоматом"
      class="form-control"
      autocomplete="off"
      :value="slug"
      disabled />
  </div>
</template>

<script>
export default {
  props: ['slug', 'hasErrors'],
}
</script>

