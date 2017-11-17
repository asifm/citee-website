// This file is for testing

<template lang="pug">
v-app
  v-container
    p {{ message }}
    svg#canvas
</template>

<script>
import { makeGraph } from '../assets/js/makeGraph';

export default {
  data() {
    return {
      message: 'This is a message',
    };
  },
  mounted() {
    makeGraph('#canvas');
  },
  created() {},
};
</script>

