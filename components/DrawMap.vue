<template lang="pug">
  div
    v-map(:zoom="zoomval" :center="centerval" id="map")
      v-tilelayer(:url="url" :attribution="attribution")
      v-marker(:lat-lng="markerval")
</template>

<script>
export default {
  props: {
    zoomval: { default: 13 },
    centerval: {
      default() {
        return [38.0293, -78.4767];
      },
    },
    markerval: {
      default() {
        return this.centerval;
      },
    },
  },
  data() {
    return {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    };
  },
};
</script>

<style scoped>
#map {
  height: 1100px;
}
</style>
