<template lang="pug">
  div
    v-map(:zoom="zoomval" :center="centerval" :maxZoom="mapboxOptions.maxZoom" :minZoom="mapboxOptions.minZoom" @l-click="clickhandler" id="map" ref="map")
      v-tilelayer(:url="url" :attribution="mapboxOptions.attribution")
      v-marker(:lat-lng="markerval")
</template>

<script>
const mapboxOptions = {
  // accessToken:
  //   'pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg',,
  accessToken:
    'pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA',
  type: 'mapbox.light',
  attribution:
    'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 12,
  minZoom: 4,
};

export default {
  props: {
    clickhandler: Function,
    zoomval: { default: 6 },
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
      url: `https://api.tiles.mapbox.com/v4/${mapboxOptions.type}/{z}/{x}/{y}.png?access_token=${mapboxOptions.accessToken}`,
      mapboxOptions,
    };
  },
  methods: {},
};
</script>

<style scoped>
#map {
  height: 800px;
  cursor: crosshair;
}
</style>

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.streets',
//     accessToken: 'your.mapbox.access.token'
// }).addTo(mymap);
// @token = pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA
// @token2 = pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg

// Open street map tiles
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution:
      // '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
