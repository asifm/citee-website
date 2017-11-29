<template lang="pug">
v-container(fluid).grey.lighten-2
  v-layout(row-wrap)#top-row
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised
        p.caption Input either an <strong>address</strong> or the <strong>longitude-latitude</strong> of a point. Then press <strong>Enter</strong>. 
        p.caption Ut eiusmod eu aliqua mollit veniam qui laborum eu qui ad ad aliqua. Nulla sint fugiat elit non nisi exercitation reprehenderit.
    v-flex(d-flex md2).pa-2
      //- Address input
      v-card.pa-3.card--raised.amber
        v-icon.orange--text search
        v-text-field(label="Address" rows=2 multi-line v-model="address" @keyup.enter="renderAll()" placeholder="The address need not be complete")
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised.amber
        v-icon.orange--text mdi-view-grid
        v-text-field(label="Longitude" v-model="lon" @keyup.enter="renderAll()" type="number")
        v-text-field(label="Latitude" v-model="lat" @keyup.enter="renderAll()" type="number")
    v-flex(d-flex md7).pa-2
      v-card.pa-3.card--raised
        p.caption User will select variable. Data on the variable will be shown here (related to the geos) - preferably in a graph. Also possible: Some interesting facts about the location using wikidata. Lorem tempor cupidatat nulla laborum ut pariatur laboris tempor sit. Tempor nisi aute reprehenderit aute in exercitation est. 
    
  v-layout(row wrap)
    //- map
    v-flex(md8).pa-2
      v-card(hover).pa-2.secondary  
        no-ssr
          draw-map(:zoomval="zoom" :centerval="center" :markerval="marker" :clickhandler="getLonLat" ref="drawmap")
      
    v-flex(md3).pa-2
      //- Geodata
      v-card(v-if="!loadingAjaxData" hover).pa-2
        v-list(two-lines dark v-for="(elem) in geoMainArr" :key="elem.code" dense)#geodata-maincard
          v-list-tile
            v-list-tile-content
              v-list-tile-sub-title {{ elem.name }}
              v-list-tile-title {{ elem.value }}
</template>

<script>
// child component
import DrawMap from '../../components/DrawMap.vue';

import {
  getGeoFromLonLat,
  getGeoFromAddress,
} from '../../assets/js/geoLocator';

// TODO: Add definition to each geo in the array
// TODO: On hover show definition
const geoMainArr = [
  { code: '020', name: 'Region' },
  { code: '030', name: 'Division' },
  { code: '040', name: 'State' },
  { code: '050', name: 'County' },
  { code: '060', name: 'County Subdivision' },

  { code: '140', name: 'Census Tract' },
  { code: '150', name: 'Block Group' },
  { code: '160', name: 'Place' },
  { code: '860', name: 'ZIP Code Tabulation Area' },

  { code: '310', name: 'Core-Based Statistical Area' },
  { code: '314', name: 'Metropolitan Division' },
  { code: '330', name: 'Combined Statistical Area' },

  { code: '500', name: 'Congressional District (111th)' },
  { code: '610', name: 'State Legislative District (Upper)' },
  { code: '620', name: 'State Legislative District (Lower)' },

  { code: '950', name: 'School District (Elementary)' },
  { code: '960', name: 'School District (Secondary)' },
  { code: '970', name: 'School District (Unified)' },
];

export default {
  components: {
    'draw-map': DrawMap,
  },
  data() {
    return {
      loadingAjaxData: true,
      lon: -98.35,
      lat: 39.5,
      address: '',
      fullAddress: '',

      geoMainArr,
      geoCodesArr: geoMainArr.map(elem => elem.code),
      apiResultsObj: {},

      // leaflet options; marker set as computed property
      zoom: 4,
      // centroid of contiguous US as a default
      center: [39.5, -98.35],
    };
  },
  methods: {
    renderGeodata() {
      // clear all value first
      this.geoMainArr.forEach((elem) => {
        elem.value = '';
      });
      this.apiResultsObj = {};

      // flag for v-if
      this.loadingAjaxData = true;

      getGeoFromLonLat(this.lon, this.lat, this.geoCodesArr.toString())
        .then((response) => {
          const { results } = response.data;
          results.forEach((val) => {
            const { sumlevel, full_name } = val;
            // eslint-disable-next-line camelcase
            this.apiResultsObj[sumlevel] = full_name;
          });
          this.geoMainArr.forEach((elem) => {
            elem.value = this.apiResultsObj[elem.code];
          });

          this.loadingAjaxData = false;
        })
        .catch(e => console.log(e));
    },

    renderGeoFromAddress() {
      getGeoFromAddress(this.address)
        .then((response) => {
          [this.lon, this.lat] = response.data.features[0].center;
          this.fullAddress = response.data.features[0].place_name;
          console.log(response.data.features[0]);
        })
        .catch(e => console.log(e));
    },
    renderAll() {
      if (
        // If not numbers or not coerceable to numbers
        // TODO: Probably can omit this check, now that input type is number
        !Number.isFinite(parseFloat(this.lon)) ||
        !Number.isFinite(parseFloat(this.lat)) ||
        // If empty
        !this.lon ||
        !this.lat
      ) {
        return null;
      }

      this.center = [parseFloat(this.lat), parseFloat(this.lon)];
      this.renderGeodata();
      this.renderGeoFromAddress();
      return null;
    },
    getLonLat(e) {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      this.center = [this.lat, this.lon];
      this.renderGeodata();
      console.log(e);
    },
  },
  computed: {
    marker() {
      console.log(this.center);
      return this.center;
    },
  },
};
</script>


<style lang="scss" scoped>
#top-row {
  line-height: 1.1em;
}
#geodata-maincard {
  font-family: Open Sans;
  font-size: 11px !important;
}
</style>

// TODO: Add catch to promises to handle errors
// TODO: Get address from lon lat
// TODO: Add search to map
// TODO: Flex layout redo
// TODO: Add FIPS code to geo data shown
// TODO: Get wikidata id from mapbox and show interesting data. Example: https://www.wikidata.org/wiki/Q1509
// TODO: Add transitions
// TODO: Use debounce instead of keyup.enter
// TODO: Add a button to get back to full US map when zoomed in or out (that is, change zoom value to default)
// TODO: Address input -> zoom in on location on map (use watchers?)
// TODO: On map input boxes: https://vuetifyjs.com/components/toolbars#example-6
// TODO: Display only non-empty geo data
// TODO: Organize the display by categories of geo data
// TODO: Reduce number of decimals in lot lan inputs
// FIXME: Address input shows correct output after next keyup
// FIXME: geodata not being decoded as unicode (spanish names not working) 
