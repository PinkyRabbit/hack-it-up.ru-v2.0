<template>
  <div>
    <div class="form-group" v-show="showImg">
      <img :src="src" class="img-responsive" alt="Responsive image">
      <label class="control-label" for="slug">Ссылка на изображение</label>
      <div class="input-group">
        <input 
          type="text"
          placeholder="Сгенерируется автоматом"
          class="form-control"
          autocomplete="off"
          :value="postimage"
          disabled />
        <span
          class="input-group-addon"
          @click="$refs.file.click()">Изменить</span>
      </div>
      <input
        type="file"
        ref="file"
        name="image"
        style="display: none"
        @change="changeImage">
    </div>
    <div class="form-group" v-show="!showImg">
      <label for="postimage">Изображение поста (800x350)</label>
      <input type="file" id="postimage" name="postimage" class="form-control" @change="changeImage">
    </div>
  </div>
</template>

<script>
export default {
  props: ['postimage', 'csrf'],
  data: function() {
    return {
    };
  },
  methods: {
    changeImage(e) {
      const url = '/admin/image?_csrf=' + this.csrf;
      var fd = new FormData();
      fd.append('image', e.target.files[0]);
      const headers = { 'Content-Type': 'multipart/form-data' };
      this.$http.post(url, fd, { headers }).then(response => {
        // get body data
        this.$emit('updateImage', { val: response.body.filename, field: 'postimage'});
      }, response => {
        console.error(response);
      });
    },
  },
  computed: {
    src() {
      return `/images/uploads/${this.postimage}`;
    },
    showImg() {
      return this.postimage && this.postimage.length;
    }
  },
}
</script>

<style scoped>
  .input-group-addon {
    cursor: pointer;
  }
</style>
