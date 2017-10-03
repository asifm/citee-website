<template lang="pug">
  v-container(fluid)#landing-top.text-xs-center
    v-layout.justify-center
      v-flex(xs12 sm8 md5 lg4).pa-0
        transition(name="fade" appear)
          div(v-if="show")
            img(src="~/assets/img/citee-logo-white.svg").ma-3.dropshadow.opacity-6
            h4.pa-3.primary--text.elevation-12#text-bg Cities Innovating Tomorrow's Entrepreneurial Ecosystems
    transition(name="fade" appear)
      v-layout(row wrap v-if="show").pa-0.justify-center
        v-flex(xs12 sm5 md3 lg2).pa-3
          v-card.py-3.elevation-24.grey.lighten-3.opacity-7
            v-icon.display-4.blue-grey--text mdi-chart-bar
            h6 Visualizations
        v-flex(xs12 sm5 md3 lg2).pa-3
          v-card.py-3.elevation-24.grey.lighten-3.opacity-7
            v-icon.display-4.blue-grey--text mdi-map
            h6 Case Studies
        v-flex(xs12 sm5 md3 lg2).pa-3
          v-card.py-3.elevation-24.grey.lighten-3.opacity-7
            v-icon.display-4.blue-grey--text mdi-database
            h6 Resources
        v-flex(xs12 sm5 md3 lg2).pa-3
          v-card.py-3.elevation-24.grey.lighten-3.opacity-7
            v-icon.display-4.blue-grey--text mdi-book-open
            h6 Blog
          
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-out;
}

fade-enter-to {
  opacity: 1
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


#landing-top {
  background-size: cover;
  background-position: 50% 50%;
  background-attachment: scroll;
  background-image: url('~/assets/img/landing-background.jpg'); // filter: grayscale(1);
  // filter: blur(20x);
  // filter: brightness(.8);
  // filter: contrast(90%);
  filter: sepia(.4);
  img {
    width: 300px;
  } // text under logo
  h4 {
    font-weight: bold; // text-transform: uppercase;
    letter-spacing: 0.1em;
  } // cards
  h6 {
    font-weight: bold;
    text-transform: uppercase;
  }
  .dropshadow {
    -webkit-filter: drop-shadow(0 7px 8px rgba(0, 0, 0, 0.1));
    filter: drop-shadow( 0 17px 8px rgba(0, 0, 0, 1));
    /* Same syntax as box-shadow */
  }
  #text-bg {
    background-color: rgba(0, 18, 42, 0.6);
  }
}
</style>
