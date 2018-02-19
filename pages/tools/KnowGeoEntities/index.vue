<template lang="pug">
v-container(fluid).grey.lighten-2
  v-toolbar(dark).secondary.darken-1.white--text
    v-icon.pr-2 map
    //- v-spacer
    h2 Visual Geocoder
  v-layout(row wrap)#top-row
    v-flex(d-flex md2).pa-2
      v-card.pa-4.card--raised.grey.lighten-3
        //- Address input
        v-text-field(
            label="ZIP Code"
            placeholder="5-digit US Zip code"
            type="number"
            id="zipcode"
            v-model="zipcode"
            @keyup.enter="renderGeoForZip(zipcode)"
        )
        v-text-field(
            label="Address"
            placeholder="Need not be complete"
            rows=2
            id="address"
            multi-line
            v-model="address"
            @keyup.enter="renderGeoForAddress(address)"
        )
        transition(name="zoomUp")
        v-alert(
            v-show="dataErrorMsg !== ''"
            ).secondary {{ dataErrorMsg }}
    v-flex(d-flex md1).pa-2
      v-card.pa-4.card--raised.grey.lighten-3
        //- latlong input
        //- transition(name="fadeUp")
        div
            v-text-field(
                label="Longitude"
                v-model="threeDecimLon"
                @keyup.enter.native="renderGeoTiles"
                type="number" id="lon"
                )
            v-text-field(
                label="Latitude"
                v-model="threeDecimLat"
                @keyup.enter="renderGeoTiles"
                type="number"
                id="lat"
                )
    v-btn(@click="resetZoomCenter()").btn-small Reset Map 
  v-layout(row wrap)
    //- map
    v-flex(md5 sm12).pa-2
      v-card(hover).pa-1.secondary.elevation-0
        no-ssr
          draw-map(
            :zoom-val="zoom"
            :center-val="center"
            :click-handler="renderGeoForMap"
            ref="mapbox")

    //- Using lib. For list of transitions: https://github.com/asika32764/vue2-animate
    transition(name="zoom")
      v-flex(md6 v-if="renderData").pa-2
        //- Geodata
        v-layout
          v-flex(md6)
            //- because v-for index starts at 1
            //- TODO: Make it independent of changes in total number of datapoints
            list-geo-data(:geoData="geoMainArr" v-for="n in 2"
            :beginIndex="(n - 1) * 5" :endIndex="(n - 1) * 5 + 5" :key="n")
          v-flex(md6)
            list-geo-data(:geoData="geoMainArr" v-for="n in 2"
            :beginIndex="(n + 1) * 5" :endIndex="(n + 1) * 5 + 5" :key="n")
</template>

<script>
// child component
import mapbox from '~/components/Mapbox.vue';
import listGeoData from '~/components/ListGeoData.vue';
import geoMainArr from '~/data/geoLevelsCodes.json';
import validZips from '~/data/validZips.json';
import {
    getGeoLevelsForLonLat,
    getDetailForAddress,
    getDetailForZip,
} from '~/assets/js/mapHelpers/geoLocator';

// TODO: Add definition to each geo in the array
// TODO: On hover show definition

export default {
    components: {
        'draw-map': mapbox,
        'list-geo-data': listGeoData,
    },
    data() {
        return {
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
            zoom: 4,
        };
    },
    computed: {
        center() {
            return [ this.lat, this.lon ];
        },
        marker() {
            return this.center;
        },
        threeDecimLon() {
            return this.lon.toFixed(3);
        },
        threeDecimLat() {
            return this.lat.toFixed(3);
        },
    },
    filters: {
        latLonTruncate(value) {
            return value.toString().slice(1, 4);
        },
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
            this.dataErrorMsg = '';
        },
        renderGeoTiles() {
            this.clearResults();

            // imported function
            getGeoLevelsForLonLat(
                this.lon,
                this.lat,
                this.geoCodesArr.toString()
            )
                .then(response => {
                    const { results } = response.data;
                    this.geoMainArr.forEach(elem => {
                        const correspElemAPI = results.filter(apiElem =>
                            apiElem.sumlevel === elem.code);
                        elem.value =
                            correspElemAPI.length > 0
                                ? correspElemAPI[ 0 ].full_name
                                : '';
                        elem.geoid =
                            correspElemAPI.length > 0 &&
                            correspElemAPI[ 0 ].sumlevel !== '860'
                                ? correspElemAPI[ 0 ].full_geoid.slice(7)
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

        renderGeoForAddress(query) {
            this.renderData = false;
            this.dataErrorMsg = '';
            if (this.address.length < 30) {
                this.dataErrorMsg =
                    'Too few details. Results may be incorrect.';
            }
            // imported function
            getDetailForAddress(query)
                .then(response => {
                    const data = response.data.resourceSets[ 0 ]
                        .resources[ 0 ];
                    // IMPORTANT: Bing return lat first, lon second
                    [ this.lat, this.lon ] = data.point.coordinates;
                    this.fullAddress = data.address.formattedAddress;
                    // this.renderData = true;
                    this.renderGeoTiles();
                })
                .catch(error => console.log('Something went wrong', error));
        },

        renderGeoForZip(zip) {
            // imported function
            getDetailForZip(zip)
                .then(response => {
                    // check result is a postcode
                    if (!validZips.includes(zip)) {
                        this.dataErrorMsg = 'Not a valid ZIP code.';
                        // Don't render data and remove previously rendered data
                        this.renderData = false;
                        return;
                    }
                    const data = response.data.resourceSets[ 0 ]
                        .resources[ 0 ];
                    // IMPORTANT: Bing return lat first, lon second
                    [ this.lat, this.lon ] = data.point.coordinates;
                    this.fullAddress = data.address.formattedAddress;

                    // this.renderData = true;
                    this.renderGeoTiles();
                })
                .catch(error => console.log('Something went wrong', error));
        },

        resetZoomCenter() {
            this.zoom = 4;
            this.lat = 39.5;
            this.lon = -98.35;
        },
        renderGeoForMap(e) {
            this.lat = e.latlng.lat;
            this.lon = e.latlng.lng;
            this.renderGeoTiles();
        },
    },
};
</script>

<style lang="scss" scoped>
.list__tile--highlighted {
    font-family: Open Sans;
}
</style>
