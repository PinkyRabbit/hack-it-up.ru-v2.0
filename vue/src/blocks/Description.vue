<template>
  <div 
    class="form-group"
    :class="{'has-error': hasError }">
    <label class="control-label" for="description">Описание {{count}}/150</label>
    <textarea
      id="description"
      name="description"
      class="form-control"
      :value="description"
      @keyup="setDescription"
      placeholder="любые, ключи"></textarea>
  </div>
</template>

<script>
export default {
  props: ['description'],
  data: function() {
    return {
      hasError: false,
    };
  },
  computed: {
    count() {
      return this.description.length;
    }
  },
  methods: {
    setDescription(e) {
      const val = e.target.value;
      if (val.length > 150) {
        this.hasError = true;
        setTimeout(() => {
          this.hasError = false;
        }, 1500);
      }
      this.$emit('setDescription', { val: val.substr(0, 150), field: 'description'});
    }
  }
}
</script>

