<template>
  <textarea ref="r" class="xeditor" spellcheck="false" v-on:input="input">{{data}}</textarea>
</template>

<script>
export default {
  name: 'Xeditor',
  model: {
    prop: 'data',
  },
  props: {
    'data': String
  },
  mounted() {
    this.autoHeight()
  },
  methods: {
    autoHeight() {
      var textarea = this.$refs.r;
      textarea.style.height = "0px"; /* Reset the height*/
      textarea.style.height = textarea.scrollHeight + "px";
    },
    input(e) {
      this.autoHeight();
      this.$emit('input', e.target.value)
    }
  }
}
</script>
<style>
.xeditor { 
  background: #fff;
  display: block;
  overflow-y: hidden;
  padding: 10px;
  color: #000;
  box-sizing: border-box;
  width: 100%;
  font-size: 14px;
  border-radius: 6px;
  box-shadow: 2px 2px 8px rgba(0,0,0, .3);
  border: 0;
  resize: none;
}
.xeditor:focus {
  outline: none;
}
</style>