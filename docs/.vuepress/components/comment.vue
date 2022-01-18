<template>
  <Comment :author="'stormbuf'" :content="'just for test'"></Comment>
</template>




<script lang="ts">
import { defineComponent } from "vue";
import { Comment } from "ant-design-vue";
import 'ant-design-vue/dist/antd.css';
export default defineComponent({
  components: {
    Comment,
  },
});
</script>

<style>
</style>