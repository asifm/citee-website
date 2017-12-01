<template lang="pug">
v-container(fluid)
  v-toolbar(dark).secondary
    v-icon map
    v-toolbar-title  In aliquip ad sint officia culpa in labore nisi
    //- v-spacer
  v-layout(row wrap)#top-row
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised.grey.lighten-4
        p.caption Input a <strong>ZIP Code</strong> or a (partial) <strong>address</strong> or the <strong>longitude-latitude</strong> of a location.
        p.caption Then press <strong>Enter</strong>.
        p.caption The location must be within the United States of America.
        v-btn(@click="resetZoomCenter()").btn-small Reset Map
        
    v-flex(d-flex md3).pa-2
      v-card.pa-1.card--raised.grey.lighten-4
        v-layout(wrap)
          v-flex(d-flex lg8)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- Address input
              v-icon.orange--text.display-1 search
              v-text-field(
                label="ZIP Code" 
                placeholder="Must be a valid US ZIP code" 
                type="number"
                v-model="zipcode" 
                @keyup.enter="renderGeoFromZip"
                )
              v-text-field(
                label="Address"
                placeholder="Need not be complete"
                rows=2 
                multi-line 
                v-model="address" 
                @keyup.enter="renderGeoFromAddress()" 
                )
              v-alert(v-show="noDataMsg !== ''").secondary {{ noDataMsg }}
          v-flex(d-flex lg4)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- latlong input
              //- v-icon.orange--text mdi-view-grid
              v-text-field(label="Longitude" v-model="lon"  @keyup.enter.native="renderGeoTiles" type="number" id="lon")
              v-text-field(label="Latitude" v-model="lat" @keyup.enter="renderGeoTiles" type="number")


    v-flex(d-flex md5).pa-2
      v-card.pa-3.card--raised
        p.caption User will select variable. Data on the variable will be shown here (related to the geos) - preferably in a graph. Also possible: Some interesting facts about the location using wikidata. Lorem tempor cupidatat nulla laborum ut pariatur laboris tempor sit. Tempor nisi aute reprehenderit aute in exercitation est. 
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised
        v-select(placeholder="Select variable" :items="variablesArr" v-model="variableSelected" autocomplete)
        v-select(placeholder="Select geo-level to show data on map" :items="geoNamesArr" v-model="geoSelected" autocomplete)
    
  v-layout(row wrap)
    //- map
    v-flex(md6 sm12).pa-2
      v-card(hover).pa-1.secondary.elevation-0
        no-ssr
          draw-map(
            :zoom-val="zoom" 
            :center-val="center" 
            :marker-val="marker"
            :click-handler="renderGeoFromMap" 
            ref="drawMap")

    //- :zoom-move-handler="getZoomCenter"
    //- Using lib. For list of transitions: https://github.com/asika32764/vue2-animate
    transition(name="fadeLeft")
      v-flex(md6 v-if="!loadingAjaxData").pa-2
        //- Geodata
        v-toolbar(dark).pb-1.indigo.darken-1.elevation-24
          v-toolbar-title Laborum minim pariatur nisi dolor
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
  getGeoFromZip,
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

const variablesArr = [
  'Median age',
  'Aggregate annual income',
  'Labor force participation',
  'Self-employed in own incorporated business',
  'Income above poverty line',
  'Per capita annual income',
  'Broadband access',
  'Population',
  'Annual growth rate (2001-15)',
  'Annual growth rate (2010-15)',
  'Inequality: GINI coefficient',
  'Number of Fortune 1000 companies per 1M population',
  'Number of Inc 5000 companies per 1M population',
  'Number of patents since 2000 per 10K population',
  'Number of restaurants per 10K population',
];

export default {
  data() {
    return {
      // move to separate component
      variablesArr,
      variableSelected: '',
      geoSelected: '',
      loadingAjaxData: true,
      // centroid of contiguous US as a default
      lon: -98.35,
      lat: 39.5,
      address: '',
      fullAddress: '',
      zipcode: '',
      geoMainArr,
      geoCodesArr: geoMainArr.map(elem => elem.code),
      geoNamesArr: geoMainArr.map(elem => elem.name),
      apiResultsObj: {},
      noDataMsg: '',
      zoom: 4,
    };
  },
  methods: {
    renderGeoTiles() {
      // clear all value first
      this.geoMainArr.forEach((elem) => {
        elem.value = '';
        elem.geoid = '';
      });
      this.apiResultsObj = {};
      this.noDataMsg = '';
      // flag for v-if
      this.loadingAjaxData = true;

      // imported function
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

          this.zipcode = '';
          this.address = '';
          this.zoom = 6;
        })
        .catch(e => console.log('Error', e));
    },

    renderGeoFromAddress() {
      // imported function
      if (this.address.length < 30) {
        this.noDataMsg = 'Not enough information. Results may not be correct.';
      }
      getGeoFromAddress(this.address)
        .then((response) => {
          console.log(response.data);
          [this.lon, this.lat] = response.data.features[0].center;
          // To ask the user: Is this the place you're looking for? If not, provide more details.
          this.fullAddress = response.data.features[0].place_name;
          this.renderGeoTiles();
        })
        .catch(e => console.log('Error', e));
    },

    renderGeoFromZip() {
      // imported function
      getGeoFromZip(this.zipcode)
        .then((response) => {
          // TODO: check zip is in the returned address
          console.log(response.data);
          if (response.data.features[0].place_type[0] === 'postcode') {
            [this.lon, this.lat] = response.data.features[0].center;
            // To ask the user: Is this the place you're looking for? If not, provide more details.
            this.fullAddress = response.data.features[0].place_name;
            console.log(this.fullAddress);
            this.renderGeoTiles();
          } else {
            this.noDataMsg = 'Perhaps not a valid ZIP code.';
          }
        })
        .catch(e => console.log('Error', e));
    },

    resetZoomCenter() {
      this.zoom = 4;
      this.lat = 39.5;
      this.lon = -98.35;
    },
    renderGeoFromMap(e) {
      this.lat = e.latlng.lat;
      this.lon = e.latlng.lng;
      this.renderGeoTiles();
      // console.log(this.$refs.drawMap.$refs.map.mapObject.getZoom());
    },
  },
  computed: {
    center() {
      return [this.lat, this.lon];
    },
    marker() {
      return this.center;
    },
  },
  components: {
    'draw-map': drawMap,
    'list-geo-data': listGeoData,
  },
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
// [x] TODO: Get data based on zip code (append "Zip Code" to code)
// TODO: Reduce number of decimals in lot lan inputs
// TODO: Hover on map to show name of place in floating card
// TODO: Get wikidata id from mapbox and show interesting data. Example: https://www.wikidata.org/wiki/Q1509
// TODO: Get controls on map, such as toolbars https://vuetifyjs.com/components/toolbars#example-6 and leaflet controls
// TODO: Show some kind of data on the map for MSAs or other geo levels selectable by user. Population or other selectable variables


// [x] FIXME: Latlon gets reacted by map data
// [x] FIXME: Address input shows correct output after next keyup
// FIXME: geodata not being decoded as unicode (spanish names not working) 
// FIXME: Text geo gets chopped off if too long. Use tooltip to show full text
