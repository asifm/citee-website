<template lang="pug">
div.grey.lighten-2
    v-container
        v-toolbar.secondary.pl-3.white--text
            h1 Convert Between Geographic Data
        v-layout(row wrap)
            v-flex(lg4).pa-3
                v-card(height="100%").brown.lighten-4
                    v-card-title.grey.lighten-2.elevation-3
                        h2 Step 1: Prepare Your Data
                    v-card-text.pa-5
                        p Pariatur Lorem sunt non nisi cillum enim nisi ea.
                        p Tempor eiusmod aliqua cupidatat ipsum tempor esse id occaecat.
                        p commodo non dolore ea exercitation ullamco.
                        p Elit consectetur id aliqua culpa consectetur voluptate.
                        p Elit adipisicing laborum excepteur aliquip labore officia Lorem consequat aliqua Lorem.
                        p Id nulla officia mollit ullamco officia dolore Lorem ea et dolore ullamco veniam occaecat mollit.
            v-flex(lg4).pa-3
                v-card(height="100%").blue-grey.lighten-4
                    v-card-title.grey.lighten-2.elevation-3
                        h2 Step 2: Select Types of Geography
                    v-card-text.pa-5
                        p Aliqua enim id reprehenderit nisi deserunt fugiat. Incididunt adipisicing ex Lorem id et laboris aute elit labore aute anim do cupidatat. Consequat pariatur id laboris aute enim eu ad. Culpa aute exercitation qui nulla labore velit occaecat mollit anim esse enim ullamco. Velit pariatur proident adipisicing aliquip fugiat ipsum. Esse ex et labore ex irure consectetur sint ipsum est magna ullamco adipisicing eu.
                        v-select(label="Select"
                            :items="geoNamesArr"
                            :v-model="selectedLevels"
                            multiple
                            persistent-hint
                            chips
                            hint="Choose the types of geographic data you need")

            v-flex(lg4).pa-3
                v-card(height="100%").grey.lighten-4
                    v-card-title.grey.lighten-2.elevation-3
                        h2 Step 3: Upload File
                    v-card-text.pa-5
                        no-ssr
                            div
                                div
                                    upload-button(
                                        title="Upload Zip Codes"
                                        :selectedCallback="fromZip").amber.lighten-1.ml-0
                                    p Qui do sit sunt quis qui officia tempor labore sunt ullamco minim nostrud.
                                div
                                    upload-button(
                                        title="Upload (Partial) Addresses"
                                        :selectedCallback="fromAddress").light-green.lighten-1.ml-0
                                    p Minim magna dolore incididunt duis reprehenderit incididunt est ad nostrud pariatur magna esse.
                                div
                                    upload-button(
                                        title="Upload Latitude-Longitude Pairs"
                                        :selectedCallback="fromLatLon").indigo.lighten-3.ml-0
                                    p Ad aliqua ex occaecat incididunt est reprehenderit dolor.

        v-card.pa-5.card--flat.grey.lighten-2
            h4 Developed By
            p Ad labore reprehenderit labore sunt exercitation dolor nostrud nisi pariatur ut est cupidatat.
            h4 Acknowledgement
            p Officia sit laborum aliqua ad minim officia consectetur aute culpa.
            h4 Citation
            p Reprehenderit commodo adipisicing consectetur eiusmod occaecat consequat ea ad non incididunt ea. Occaecat veniam commodo ullamco enim sint fugiat Lorem voluptate adipisicing Lorem. Ipsum irure ex non magna et occaecat.

</template>

<script>
import * as fs from 'file-saver';
import { csvParseRows, csvFormat } from 'd3';
import UploadButton from '../../components/UploadButton.vue';
import {
    getGeoLevelsForLonLat,
    getDetailForAddress,
    getDetailForZip,
} from '../../assets/js/mapHelpers/geoLocator';

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
    components: { 'upload-button': UploadButton },
    data() {
        return {
            textFile: null,
            selectedLevels: [],
            geoMainArr,
            geoCodesArr: geoMainArr.map( elem => elem.code ),
            geoNamesArr: geoMainArr.map( elem => elem.name ),
        };
    },
    methods: {
        fromAddress( file ) {
            const vm = this;
            const reader = new FileReader();
            reader.readAsText( file );
            reader.onload = fileLoadHandler;
            function fileLoadHandler( evt ) {
                const csvString = evt.target.result;
                // returns an array of arrays
                const addressesArr = csvParseRows( csvString )
                    .map( el => el[ 0 ] );

                const promises = [];
                addressesArr.forEach( address =>
                    promises.push( getDetailForAddress( address )
                        .then( response => response.data.features[ 0 ].center )
                        .then( lonLat => ( getGeoLevelsForLonLat(
                            lonLat[ 0 ],
                            lonLat[ 1 ],
                            vm.geoCodesArr.toString()
                        ) ) ) ) );

                Promise.all( promises )
                    .then( resolvedArr => {
                        const dataArr = resolvedArr.map( el => el.data );
                        // TODO: convert dataArr to the right format: array of objects
                        // add options to select fields
                        // normalize the geo codes
                        const geoDataText = csvFormat( dataArr[ 0 ].results );
                        const blob = new Blob( [ geoDataText ], { type: 'text/plain;charset=utf-8' } );
                        // TODO: filename based on date and time
                        fs.saveAs( blob, 'Results.csv' );
                    } )
                    .catch( error => console.log( 'Something went wrong', error ) );
            }
        },
        fromZip( file ) {
            // TODO:
            getDetailForZip( zip );
        },
        fromLatLon( file ) {
            const reader = new FileReader();
            reader.readAsText( file );
            reader.onload = loaded;
            function loaded( evt ) {
                const csvString = evt.target.result;
                const latLonArr = [];
                csvParseRows( csvString, data => {
                    latLonArr.push( data );
                } );
            }
        },
    },
};
</script>
