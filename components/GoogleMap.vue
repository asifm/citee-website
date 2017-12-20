<template lang="pug">
  div
    gmap-map(
      style="height:450px; width:850px;"
      :center="centerVal"
      :zoom="zoomVal"
      :mapTypeId="mapTypeIdVal",
      )
      gmap-marker(
        :clickable="true"
        :draggable="true"
        v-for="(m, index) in markersVal"
        :key="index"
        :position="m.position"
        @click="center=m.position"
        )
</template>


<script>
  
  export default  {
    props: {
      markersVal: {
        type: Array,
        default() { return []}
      },
      zoomVal: {
        type: Number,
        default: 4
      },
      mapTypeIdVal: {
        type: String,
        default: 'roadmap'
      },
      centerVal: {
        type: Object,
        default() {
          return {
            lat: 39.5,
            lng: -98.35,
          }
        }
      }
    },
    data() {
      return {
      }
    }
  }
</script>

