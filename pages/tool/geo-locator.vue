<template lang="pug">
v-container(fluid).grey.lighten-2
  v-layout(row wrap)#top-row
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised.grey.lighten-4
        p.caption Input a <strong>ZIP Code</strong> or a (partial) <strong>address</strong> or the <strong>longitude-latitude</strong> of a location.
        p.caption Then click button <strong>Show Data</strong>
        p.caption The location must be within the United States of America.
        v-btn(@click="resetZoomCenter()").btn-small Reset Map
        
    v-flex(d-flex md3).pa-2
      v-card.pa-1.card--raised.grey.lighten-4
        v-layout(wrap)
          v-flex(d-flex lg8)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- Address input
              v-icon.orange--text.display-1 search
              v-text-field(label="ZIP Code" placeholder="5-digit code" v-model="zipcode" type="number")
              v-text-field(label="Address" rows=2 multi-line v-model="address" @keyup.enter="renderAll()" placeholder="Need not be complete")
              v-btn.btn-small.primary Submit
              v-btn.btn-small.primary Clear 
          v-flex(d-flex lg4)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- latlong input
              //- v-icon.orange--text mdi-view-grid
              v-text-field(label="Longitude" v-model="lon"  @keyup.enter="renderAll()" type="number" id="lon")
              v-text-field(label="Latitude" v-model="lat" @keyup.enter="renderAll()" type="number")


    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised
        v-select(placeholder="Select variable")
        v-select(placeholder="Select Options")
    v-flex(d-flex md5).pa-2
      v-card.pa-3.card--raised
        p.caption User will select variable. Data on the variable will be shown here (related to the geos) - preferably in a graph. Also possible: Some interesting facts about the location using wikidata. Lorem tempor cupidatat nulla laborum ut pariatur laboris tempor sit. Tempor nisi aute reprehenderit aute in exercitation est. 
    
  v-layout(row wrap)
    //- map
    v-flex(md6 sm12).pa-2
      v-card(hover).pa-1.secondary.elevation-24
        no-ssr
          draw-map(
            :zoom-val="zoom" 
            :center-val="center" 
            
            :click-handler="getLonLat" 
            :zoom-move-handler="getZoomCenter"
            ref="drawMap")

    //- Using lib. For list of transitions: https://github.com/asika32764/vue2-animate
    transition(name="fadeLeft")
      v-flex(md6 v-if="!loadingAjaxData").pa-2
        //- Geodata
        v-layout
          v-flex(md6)
            list-geo-data(:geoData="geoMainArr" :beginIndex=0 :endIndex=3)
            list-geo-data(:geoData="geoMainArr" :beginIndex=3 :endIndex=6)
            list-geo-data(:geoData="geoMainArr" :beginIndex=6 :endIndex=9)
          v-flex(md6)
            list-geo-data(:geoData="geoMainArr" :beginIndex=9 :endIndex=12)
            list-geo-data(:geoData="geoMainArr" :beginIndex=12 :endIndex=15)
            list-geo-data(:geoData="geoMainArr" :beginIndex=15 :endIndex=18)
                
</template>

<script>
// child component
import drawMap from '../../components/DrawMap.vue';
import listGeoData from './helpers/ListGeoData.vue';
import {
  getGeoFromLonLat,
  getGeoFromAddress,
} from '../../assets/js/geoLocator';

// TODO: Add definition to each geo in the array
// TODO: On hover show definition
const geoMainArr = [
  { code: '310', name: 'Core-Based Statistical Area' },
  { code: '314', name: 'Metropolitan Division' },
  { code: '330', name: 'Combined Statistical Area' },

  { code: '050', name: 'County' },
  { code: '060', name: 'County Subdivision' },
  { code: '160', name: 'Place' },

  { code: '020', name: 'Region' },
  { code: '030', name: 'Division' },
  { code: '040', name: 'State' },

  { code: '140', name: 'Census Tract' },
  { code: '150', name: 'Block Group' },
  { code: '860', name: 'ZIP Code Tabulation Area' },

  { code: '500', name: 'Congressional District (111th)' },
  { code: '610', name: 'State Legislative District (Upper)' },
  { code: '620', name: 'State Legislative District (Lower)' },

  { code: '950', name: 'School District (Elementary)' },
  { code: '960', name: 'School District (Secondary)' },
  { code: '970', name: 'School District (Unified)' },
];

export default {
  data() {
    return {
      loadingAjaxData: true,
      // centroid of contiguous US as a default
      lon: -98.35,
      lat: 39.5,
      address: '',
      fullAddress: '',
      zipcode: '',
      geoMainArr,
      geoCodesArr: geoMainArr.map(elem => elem.code),
      apiResultsObj: {},

      zoom: 4,
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
          this.geoMainArr.forEach((elem) => {
            // TODO: implement error checking for when there's no code
            const correspondingElemAPI = results.filter(apiElem => apiElem.sumlevel === elem.code,);
            elem.value =
              correspondingElemAPI.length > 0
                ? correspondingElemAPI[0].full_name
                : '';
            elem.geoid =
              correspondingElemAPI.length > 0 &&
              correspondingElemAPI[0].sumlevel !== '860'
                ? correspondingElemAPI[0].full_geoid.slice(7)
                : '';
          });
          this.loadingAjaxData = false;
        })
        .catch(e => console.log('Error', e));
    },

    renderGeoFromAddress() {
      getGeoFromAddress(this.address)
        .then((response) => {
          [this.lon, this.lat] = response.data.features[0].center;
          this.fullAddress = response.data.features[0].place_name;
        })
        .catch(e => console.log('Error', e));
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

      this.renderGeodata();
      this.renderGeoFromAddress();

      return null;
    },
    getZoomCenter() {
      this.zoom = this.$refs.drawMap.$refs.map.mapObject.getZoom();
      // this.lat = this.$refs.drawMap.$refs.map.mapObject.getCenter().lat;
      // this.lon = this.$refs.drawMap.$refs.map.mapObject.getCenter().lng;
      this.msg = this.geoMainArr.filter(elem => 'value' in Object.keys(elem));
      // console.log(this.center);
    },
    resetZoomCenter() {
      this.zoom = 4;
      this.lat = 39.5;
      this.lon = -98.35;
    },
    getLonLat(e) {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      // this.center = [this.lat, this.lon];
      this.renderGeodata();
      // console.log(this.$refs.drawMap.$refs.map.mapObject.getZoom());
    },
  },
  computed: {
    center() {
      return [this.lat, this.lon];
    },
  },
  components: {
    'draw-map': drawMap,
    'list-geo-data': listGeoData,
  },
  filters: {},
};
</script>


<style lang="scss" scoped>
#top-row {
  line-height: 1.1em;
}
</style>

// [x] TODO: Add catch to promises to handle errors
// [x] TODO: Flex layout redo
// [x] TODO: Add transitions
// [x] TODO: Add a button to get back to full US map when zoomed in or out (that is, change zoom value to default)
// [x] TODO: Highlight non-empty geo data
// [x] TODO: Organize the display by categories of geo data
// [x] TODO: Add FIPS code to geo data shown
// TODO: Use button  instead of keyup.enter
// TODO: Get data based on zip code (append "Zip Code" to code)
// TODO: Reduce number of decimals in lot lan inputs
// TODO: Hover on map to show name of place in floating card
// TODO: Get wikidata id from mapbox and show interesting data. Example: https://www.wikidata.org/wiki/Q1509
// TODO: Get controls on map, such as toolbars https://vuetifyjs.com/components/toolbars#example-6 and leaflet controls



// FIXME: Latlon gets reacted by map data
// FIXME: Address input shows correct output after next keyup
// FIXME: geodata not being decoded as unicode (spanish names not working) 
// FIXME: Empty input boxes
// FIXME: Text geo gets chopped off if too long. Use tooltip to show full text
