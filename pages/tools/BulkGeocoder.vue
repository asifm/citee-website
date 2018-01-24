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
                            :items="allGeoLevelsArr"
                            item-text="name"
                            item-value="code"
                            v-model="selectedGeoLevelsArr"
                            return-object
                            multiple
                            autocomplete
                            dense
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
                                        :selectedCallback="fromZip")
                                        .amber.lighten-1.ml-0
                                    p Qui do sit sunt quis qui officia tempor labore sunt ullamco minim nostrud.
                                div
                                    upload-button(
                                        title="Upload (Partial) Addresses"
                                        :selectedCallback="fromAddress")
                                        .light-green.lighten-1.ml-0
                                    p Minim magna dolore incididunt duis reprehenderit incididunt est ad nostrud pariatur magna esse.
                                div
                                    upload-button(
                                        title="Upload Latitude-Longitude Pairs"
                                        :selectedCallback="fromLatLon")
                                        .indigo.lighten-3.ml-0
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
import * as allGeoLevelsArr from '../../static/data/geo_levels_codes.json';
import validZips from '../../static/data/valid-zips.json';

// Refactor so no need for external uploadbutton component
import UploadButton from '../../components/UploadButton.vue';
import {
    getGeoLevelsForLonLat,
    getDetailForAddress,
    getDetailForZip,
} from '../../assets/js/mapHelpers/geoLocator';

export default {
    components: { 'upload-button': UploadButton },
    data() {
        return {
            textFile: null,
            selectedGeoLevelsArr: [],
            allGeoLevelsArr,
        };
    },
    computed:
        {
            selectedGeoCodes() {
                return this.selectedGeoLevelsArr.map( elem => elem.code );
            },
        },
    methods: {
        fromAddress( file ) {
            const vm = this;
            this.loadFile( file, loadedAddresses );
            function loadedAddresses( evt ) {
                const csvString = evt.target.result;
                // returns an array of arrays
                const addressesArr = csvParseRows( csvString )
                    .map( el => el[ 0 ] );

                const promises = [];
                addressesArr.forEach( address =>
                    promises.push(
                        getDetailForAddress( address )
                            .then( response =>
                                response.data.features[ 0 ].center )
                            .then( lonLat =>
                                getGeoLevelsForLonLat(
                                    lonLat[ 0 ],
                                    lonLat[ 1 ],
                                    vm.selectedGeoCodes.toString()
                                ) )
                    ) );

                Promise.all( promises )
                    .then( resolvedArr => {
                        const dataArr = resolvedArr
                            .map( el => el.data.results );
                        vm.writeCsv( dataArr );
                    } )
                    .catch( error => console.log( 'Something went wrong', error ) );
            }
        },
        fromZip( file ) {
            const vm = this;
            this.loadFile( file, loadedZips );
            function loadedZips( evt ) {
                const csvString = evt.target.result;
                // returns an array of arrays
                const zipsArr = csvParseRows( csvString ).map( el => el[ 0 ] );

                const invalidZips = zipsArr.filter(
                    zip => !validZips.includes( zip )
                );
                if ( invalidZips.length > 0 ) {
                    // eslint-disable-next-line no-alert
                    alert( `Invalid Zip codes: ${ invalidZips }
                    Please correct or exclude, and then reupload.` );
                    return;
                }

                const promises = [];
                zipsArr.forEach( zip =>
                    promises.push(
                        getDetailForZip( zip )
                            .then( response =>
                                response.data.features[ 0 ].center )
                            .then( lonLat =>
                                getGeoLevelsForLonLat(
                                    lonLat[ 0 ],
                                    lonLat[ 1 ],
                                    vm.selectedGeoCodes.toString()
                                ) )
                    ) );

                // TODO: refactor Promise.all and other repeated codes to separate functions for DRY
                Promise.all( promises )
                    .then( resolvedArr => {
                        const dataArr = resolvedArr
                            .map( el => el.data.results );
                        vm.writeCsv( dataArr );
                    } )
                    .catch( error => console.log( 'Something went wrong', error ) );
            }
        },

        fromLatLon( file ) {
            // TODO
            this.loadFile( file, loadedLatLons );
            function loadedLatLons( evt ) {
                const csvString = evt.target.result;
                const latLonArr = [];
                csvParseRows( csvString, data => {
                    latLonArr.push( data );
                } );
            }
        },
        loadFile( file, loadHandler ) {
            const reader = new FileReader();
            reader.readAsText( file );
            reader.onload = loadHandler;
        },
        writeCsv( dataArr ) {
            // TODO: convert dataArr to the right format: array of objects
            // normalize the geo codes
            const geoDataText = csvFormat( dataArr[ 2 ] );
            const blob = new Blob( [ geoDataText ], {
                type: 'text/plain;charset=utf-8',
            } );
            const now = new Date();
            const filename = `Results_${ now.toLocaleString( 'en', { month: 'short' } ) + 1 }-${ now.getDate() }-${ now.getFullYear() }-${ now.getHours() }-${ now.getMinutes() }-${ now.getSeconds() }.csv`;
            // TODO: ensure no memory leak from prior files
            fs.saveAs( blob, filename );
        },
    },
};
</script>
