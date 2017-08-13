<template lang="pug">
v-app(light)
  v-container(img="http://az616578.vo.msecnd.net/files/2016/09/24/636102733878712501681721606_Downtown-Cville1.jpg")
    v-btn(dark :loading="!loaded") The Button!
    v-layout
      v-flex(md6)
        v-card(height="100%").pa-3
          v-card-title
            h1.pa-3 {{ this.$route.params.id }}
          v-card-text
            p 
              | Lorem ipsum dolor sit amet, consectetur 
              a(href="/user/yes! Denver", title="title") adipiscing elit, 
              | sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
      v-flex(md6).pa-5
        p.text-md-center.pa-5 Ipsum magna enim excepteur irure et. Ullamco quis ipsum minim aute velit ipsum aute pariatur adipisicing tempor laboris quis velit officia. Labore commodo cupidatat pariatur in reprehenderit elit cillum. Pariatur laborum ipsum dolore ullamco qui ullamco. Officia incididunt anim ipsum et Lorem. Aute ex consequat ex voluptate qui Lorem in laboris.
        v-btn(spacer large @click="loadText()" id="btn") Button!
      v-flex(md6)
        p Deserunt cillum quis non esse tempor ex. Non pariatur proident aute enim id culpa aute occaecat fugiat in consectetur proident veniam voluptate. Enim occaecat eiusmod velit laborum ea nostrud culpa ipsum.
</template>

<script>
export default {
  data() {
    console.log(this.$route.params);
    // console.log(this.$refs.btn);
    return {
      params: this.$route.params,
      loaded: true,
      text3: "Here's a heading that you may like",
      text1: 'Ullamco excepteur non tempor amet non velit dolore reprehenderit.',
      text2: 'Ut culpa adipisicing incididunt incididunt ',
    };
  },
  methods: {
    loadText() {
      setTimeout(() => {
        this.text3 = this.text3 === this.text1 ? this.text2 : this.text1;
      }, 1000);
    },
  },
};
</script>

