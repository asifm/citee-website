<template lang="pug">
v-container
    v-layout(row wrap)
        v-flex(lg6 md12)
            div(ref="firstmap")#first-map.elevation-7.pa-5
                no-ssr
                    google-map(
                        :height-val="mapHeight"
                        :width-val="mapWidth"
                        :markers-val="markers"
                        :center-val="center"
                        :zoom-val="zoom"
                        :map-type-id-val="mapType"
                    )
</template>
<script>
import googleMap from '~/components/GoogleMap.vue';
import { window } from 'd3';

export default {
    components: { 'google-map': googleMap },
    data() {
        return {
            mapHeight: '100%',
            mapWidth: '100%',
            markers: [ -100, 40 ],
            zoom: 8,
            center: {
                lat: 39.5,
                lng: -98.35,
            },
            mapType: 'hybrid',

        };
    },
    methods: {
        getFirstMapDivDims() {

        },
    },
    mounted() {
        console.log( this.$refs.firstmap );
        console.log( window.innerWidth );
        console.log( window.innerHeight );
    },

};
</script>
