<template lang="pug">
  no-ssr
    //- Available props: zoomval, centerval, markerval
    DrawMap(:zoomval="zoom")

</template>

<script>
import DrawMap from '../components/DrawMap.vue';

export default {
  components: { DrawMap },
  data() {
    return {
      zoom: 20,
      center: [47.41322, -1.219482],
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: [47.41322, -1.219482],
    };
  },
};
</script>

<style>
#map {
  height: 1100px;
}
</style>
