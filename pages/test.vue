// This file is for testing

<template lang="pug">
v-app
  v-container
    #landing-top
      img(src="~/assets/img/citee-logo-white.svg").ma-3.dropshadow
    
    p {{ message }}
    //- svg#canvas
</template>

<script>

// import { makeGraph } from '../assets/js/makeGraph';

export default {
  data() {
    return {
      message: 'This is a message',
    };
  },
  mounted() {
    // makeGraph();
  },
  created() {
  },
};
</script>

