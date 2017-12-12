<template lang="pug">
v-container(fluid)
  v-toolbar(dark).secondary
    v-icon map
    v-toolbar-title  In aliquip ad sint officia culpa in labore nisi
    //- v-spacer
  v-layout(row wrap)#top-row
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised.grey.lighten-3
        p.card__text Input a <strong>ZIP Code</strong> or a (partial) <strong>address</strong> or the <strong>longitude-latitude</strong> of a location.
        p.card__text Then press <strong>Enter</strong>.
        v-btn(@click="resetZoomCenter()").btn-small Reset Map
        
    v-flex(d-flex md3).pa-2
      v-card.pa-1.card--raised.grey.lighten-3
        v-layout(wrap)
          v-flex(d-flex lg8)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- Address input
              v-icon.orange--text.display-1 search
              v-text-field(
                label="ZIP Code" 
                placeholder="Must be a valid US ZIP code" 
                type="number"
                id="zipcode"
                v-model="zipcode" 
                @keyup.enter="renderGeoFromAddress(zipcode, true)"
                )
              v-text-field(
                label="Address"
                placeholder="Need not be complete"
                rows=2 
                id="address"
                multi-line 
                v-model="address" 
                @keyup.enter="renderGeoFromAddress(address, false)" 
                )
              transition(name="zoomUp")
                v-alert(v-show="dataErrorMsg !== ''").secondary {{ dataErrorMsg }}
        
          v-flex(d-flex lg4)
            v-card.pl-3.pr-3.pt-3.pb-1.ma-1
              //- latlong input
              transition(name="fadeUp")
                div(v-show="renderData")
                  v-text-field(label="Longitude" v-model="lon"  @keyup.enter.native="renderGeoTiles" type="number" id="lon")
                  v-text-field(label="Latitude" v-model="lat" @keyup.enter="renderGeoTiles" type="number" id="lat")

    v-flex(d-flex md5).pa-2
      v-card.pa-3.card--raised.grey.lighten-3
        p.card__text User will select variable. Data on the variable will be shown here (related to the geos) - preferably in a graph. Also possible: Some interesting facts about the location using wikidata. Lorem tempor cupidatat nulla laborum ut pariatur laboris tempor sit. Tempor nisi aute reprehenderit aute in exercitation est. 
    
    v-flex(d-flex md2).pa-2
      v-card.pa-3.card--raised.grey.lighten-3
        v-select(placeholder="Select variable" :items="variablesArr" v-model="variableSelected" autocomplete)
        v-select(placeholder="Select geo-level to show data on map" :items="geoNamesArr" v-model="geoSelected" append-icon="map" autocomplete)
    
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

    //- Using lib. For list of transitions: https://github.com/asika32764/vue2-animate
    transition(name="bounceUp")
      v-flex(md6 v-if="renderData").pa-2
        //- Geodata
        v-layout
          v-flex(md6)
            //- because v-for index starts at 1
            list-geo-data(:geoData="geoMainArr" v-for="n in 3" :beginIndex="(n - 1) * 3" :endIndex="(n - 1) * 3 + 3" :key="n")
          v-flex(md6)
            list-geo-data(:geoData="geoMainArr" v-for="n in 3" :beginIndex="(n + 2) * 3" :endIndex="(n + 2) * 3 + 3" :key="n")                
</template>

<script>
// child component
import drawMap from '../../components/DrawMap.vue';
import listGeoData from '../../components/ListGeoData.vue';
import {
  getGeoFromLonLat,
  getGeoFromAddress
} from '../../assets/js/geocodingHelpers/geoLocator';

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
  { code: '970', name: 'School District (Unified)' }
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
  'Number of restaurants per 10K population'
];

export default {
  data() {
    return {
      // move to separate component
      variablesArr,
      variableSelected: '',
      geoSelected: '',
      renderData: false,
      // centroid of contiguous US as a default
      lon: -98.35,
      lat: 39.5,
      address: '',
      fullAddress: '',
      zipcode: '',
      onlyZip: null,
      geoMainArr,
      geoCodesArr: geoMainArr.map(elem => elem.code),
      geoNamesArr: geoMainArr.map(elem => elem.name),
      apiResultsObj: {},
      dataErrorMsg: '',
      zoom: 4
    };
  },
  methods: {
    clearResults() {
      // clear returned results
      this.geoMainArr.forEach(elem => {
        elem.value = '';
        elem.geoid = '';
      });
      this.apiResultsObj = {};
      this.renderData = false;
    },
    renderGeoTiles() {
      this.clearResults();

      // imported function
      getGeoFromLonLat(this.lon, this.lat, this.geoCodesArr.toString())
        .then(response => {
          const { results } = response.data;
          this.geoMainArr.forEach(elem => {
            const correspondingElemAPI = results.filter(
              apiElem => apiElem.sumlevel === elem.code
            );
            elem.value =
              correspondingElemAPI.length > 0
                ? correspondingElemAPI[0].full_name
                : '';
            elem.geoid =
              correspondingElemAPI.length > 0 &&
              correspondingElemAPI[0].sumlevel !== '860'
                ? correspondingElemAPI[0].full_geoid.slice(7)
                : '';
            this.renderData = true;
            // Empty textboxes and set zoom to default after returning results
            this.zipcode = '';
            this.address = '';
            this.zoom = 6;
            setTimeout(() => {
              this.zoom = 4;
            }, 3000);
          });
        })
        .catch(e => console.log('Error', e));
    },

    renderGeoFromAddress(addressQuery, onlyZip = false) {
      this.renderData = false;
      this.dataErrorMsg = '';
      if (this.address.length < 30 && onlyZip === false) {
        this.dataErrorMsg = 'Too few details. Results likely incorrect.';
      }
      // imported function
      getGeoFromAddress(addressQuery, onlyZip)
        .then(response => {
          console.log(response.data);
          // check result is a postcode
          if (
            // If address is only the zip code
            onlyZip === true &&
            (response.data.features[0].place_type[0] !== 'postcode' ||
              // This is a common return address when zip code fails
              response.data.features[0].place_name[0] ===
                'Zip Code Pl, West Palm Beach, Florida 33409, United States')
          ) {
            this.dataErrorMsg = 'Perhaps not a valid ZIP code.';
            console.log('if triggered', this.dataErrorMsg);
            // Don't render data and remove previously rendered data
            this.renderData = false;
            return;
          }
          console.log(response.data.features[0].place_type[0]);
          [this.lon, this.lat] = response.data.features[0].center;
          this.fullAddress = response.data.features[0].place_name;
          console.log(this.fullAddress);
          // this.renderData = true;
          this.renderGeoTiles();
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
    }
  },
  computed: {
    center() {
      return [this.lat, this.lon];
    },
    marker() {
      return this.center;
    }
  },
  components: {
    'draw-map': drawMap,
    'list-geo-data': listGeoData
  }
};
</script>


<style lang="scss" scoped>
#top-row {
  // line-height: 1.1em;
}
.list__tile--highlighted {
  font-family: Open Sans;
}
</style>
