<template lang="pug">
v-container
  v-layout(row wrap)
    v-flex(md5)
      p.pa-4 Input either an address or the longitude-latitude of a point. Then press Enter.
      v-layout
        v-flex(d-flex md8).pa-3
          v-card.pa-3.card--raised
            v-icon.orange--text mdi-map-marker
            v-text-field(label="Address" rows=2 multi-line v-model="address")
            p.caption The address need not be complete.
        
        v-flex(d-flex md4).pa-3
          v-card.pa-3.card--raised
            v-icon.orange--text mdi-view-grid
            v-text-field(label="Longitude" v-model.number="lon" @keyup.enter="renderAll()")
            v-text-field(label="Latitude" v-model.number="lat" @keyup.enter="renderAll()")
      div#warning
      
      v-layout
        v-flex(md12).pa-3
          no-ssr
            draw-map(:zoomval="zoom" :centerval="center" :markerval="marker")

    v-flex(offset-md1 md6)  
      v-container(fluid grid-list-md v-if="!loadingData")
        v-layout(row wrap)
          v-flex(xs4 v-for="(val, key) in geoLevelsObject" :key="key" d-flex)
            v-card.pa-3.secondary.white--text.caption.elevation-10
              //- p.caption {{val.name}}
              p {{val.value}}

</template>

<script>
// child component
import DrawMap from '../../components/DrawMap.vue';

import {
  getGeoFromLonLat,
  // getGeoFromAddress,
} from '../../assets/js/geoLocator';

// Import geo levels json data
import geoLevelsCodesNamesJson from '../../assets/data/geoLevelsCodesNames.json';

export default {
  components: {
    'draw-map': DrawMap,
  },
  data() {
    return {
      loadingData: true,
      lon: -98.35,
      lat: 39.5,
      address: '',
      geoLevelsCodesString:
        '020,030,040,050,060,160,250,310,314,330,500,610,620,860,950,960,970',
      geoLevelsObject: {},
      geoLevelsCodesArray: [],
      geoLevelsNamesArray: [],
      apiResultsObject: {},
      fullAddress: '',

      // leaflet options; marker set as computed property
      zoom: 6,
      center: [39.5, -98.35],
    };
  },
  methods: {
    renderGeodata() {
      this.loadingData = true;
      this.geoLevelsCodesArray = this.geoLevelsCodesString.split(',');
      // todo: fix eslint - array callback return
      this.geoLevelsCodesArray.map((val) => {
        this.geoLevelsObject[val] = { name: geoLevelsCodesNamesJson[val] };
      });
      const $this = this;
      getGeoFromLonLat(
        $this.lon,
        $this.lat,
        $this.geoLevelsCodesString,
      ).then((response) => {
        const { results } = response.data;
        results.map((val) => {
          const { sumlevel, full_name } = val;
          $this.apiResultsObject[sumlevel] = full_name;
        });
        Object.keys($this.geoLevelsObject).map(key =>
            // todo: refactor
            ($this.geoLevelsObject[key].value = $this.apiResultsObject[key]),);
        $this.loadingData = false;
      });
    },
    // geoLevelsValuesFromAddress() {
    //   getGeoFromAddress(this.address).then((response) => {
    //     [this.lon, this.lat] = response.data.features[0].center;
    //     this.fullAddress = response.data.features[0].place_name;
    //   });

    renderAll() {
      if (
        // todo: fix - unexpected use of isfinite (eslint)
        !isFinite(this.lon) ||
        !isFinite(this.lat) ||
        !this.lon ||
        !this.lat
      ) {
        document.getElementById('warning').innerText =
          'One or more inputs not valid';
        return null;
      }
      document.getElementById('warning').innerText = '';
      this.center = [this.lat, this.lon];
      this.renderGeodata();
      return null;
    },
  },
  computed: {
    marker() {
      return this.center;
    },
  },
};
</script>
