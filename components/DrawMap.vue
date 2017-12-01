<template lang="pug">
  div
    v-map(
      id="map" 
      ref="map"
      @l-click="clickHandler" 
      :zoom="zoomVal" 
      :center="centerVal" 
      :maxZoom="mapboxOptions.maxZoom" 
      :minZoom="mapboxOptions.minZoom" 
      )
      v-tilelayer(:url="url" :attribution="mapboxOptions.attribution")
      v-marker(:lat-lng="centerVal")

      //- @l-zoomend="zoomMoveHandler" 
      //- @l-moveend="zoomMoveHandler" 
      //- @l-dblclick="zoomMoveHandler"

</template>

<script>
const mapboxOptions = {
  // accessToken:
  // 'pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg',,
  accessToken:
    'pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA',
  type: 'mapbox.light',
  attribution: `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, 
    <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, 
    Imagery © <a href="http://mapbox.com">Mapbox</a>`,
  maxZoom: 12,
  minZoom: 4,
};

export default {
  props: {
    zoomMoveHandler: Function,
    clickHandler: Function,
    zoomVal: { default: 5 },
    centerVal: {
      default() {
        return [38.0293, -78.4767];
      },
    },
  },
  data() {
    return {
      url: `https://api.tiles.mapbox.com/v4/${mapboxOptions.type}/{z}/{x}/{y}.png?access_token=${mapboxOptions.accessToken}`,
      mapboxOptions,
    };
  },
};
</script>

<style scoped>
#map {
  height: 800px;
  cursor: crosshair;
}
</style>

// Open street map tiles
      // url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // attribution:
      // '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
