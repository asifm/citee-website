<template lang="pug">
  div#mapcon
    gmap-map(
      style="height:400px; width:700px;"
      :center="center"
      :zoom="zoom"
      :mapTypeId="mapTypeId"
      )
      //- gmap-marker(
      //-   v-for="(m, index) in markers"
      //-   :key="index"
      //-   :position="m.position"
      //-   :clickable="true"
      //-   :draggable="true"
      //-   @click="center=m.position"
      //-   )
</template>


<script>
  const mapOptions = {

  };
  export default  {
    props: {
      zoom: { default:4},
      mapTypeId: { default: 'roadmap'},
      center: {
        default() {
        return {lat: 38.0, lng: -100.0}
        }
      },
    },
    data() {
      return {
        mapTypeId: 'hybrid'
      }
    }
  }
</script>

<style lang="scss" scoped>
#mapcon {
  width: 700;
  height: 450;
}
</style>
