<template lang="pug">
  v-container(fluid)#landing-top.text-xs-center
    v-layout.justify-center
      v-flex(xs12 sm8 md5 lg4).pa-0
        img(src="~/assets/img/citee-logo-white.svg").ma-3.dropshadow.opacity-6
        h1.display-1.pa-3.white--text.elevation-12#text-bg Cities Innovating Tomorrow's Entrepreneurial Ecosystems

    v-layout(row wrap v-if="show").pa-0.justify-center
      v-flex(xs12 sm5 md3 lg2).pa-3
        v-card.py-3.elevation-24.grey.lighten-3.opacity-7
          v-icon(x-large).blue-grey--text mdi-chart-bar
          h3 Visualizations
      v-flex(xs12 sm5 md3 lg2).pa-3
        v-card.py-3.elevation-24.grey.lighten-3.opacity-7
          v-icon(x-large).blue-grey--text mdi-map
          h3 Case Studies
      v-flex(xs12 sm5 md3 lg2).pa-3
        v-card.py-3.elevation-24.grey.lighten-3.opacity-7
          v-icon(x-large).blue-grey--text mdi-database
          h3 Resources
      v-flex(xs12 sm5 md3 lg2).pa-3
        v-card.py-3.elevation-24.grey.lighten-3.opacity-7
          v-icon(x-large).blue-grey--text mdi-book-open
          h3 Blog

</template>

<script>
export default {
    data() {
        return {
            show: false,
        };
    },
    mounted() {
        this.show = true;
    },
};
</script>

<style lang="scss" scoped>
#landing-top {
  background-size: cover;
  background-position: 50% 50%;
  background-attachment: scroll;
  background-image: url('~/assets/img/landing-background.jpg');
  // filter: grayscale(1);
  // filter: blur(20x);
  // filter: brightness(.8);
  // filter: contrast(90%);
  // filter: sepia(.4);
  img {
    width: 300px;
  }
  // text under logo
  .display-2 {
    font-weight: 800;
    // letter-spacing: 0.3em;
  }
  // cards
  h3 {
    font-weight: 800;
    text-transform: uppercase;
  }
  .dropshadow {
    -webkit-filter: drop-shadow(0 7px 8px rgba(0, 0, 0, 0.1));
    filter: drop-shadow(0 17px 8px rgba(0, 0, 0, 1));
    /* Same syntax as box-shadow */
  }
  #text-bg {
    background-color: rgba(0, 18, 42, 0.6);
  }
}
</style>
