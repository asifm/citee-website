<template lang="pug">
q-app
  q-toolbar
    q-btn A Button!
    h1 Amet incididunt qui non do aute deserunt. Deserunt est in aute veniam in id dolor veniam sunt. Cillum incididunt excepteur voluptate ipsum proident duis nulla pariatur dolore do ea cupidatat adipisicing. Proident nisi irure enim pariatur eu aute Lorem dolore laboris ut.
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
        makeGraph( '#canvas' );
    },
    created() {},
};
</script>
