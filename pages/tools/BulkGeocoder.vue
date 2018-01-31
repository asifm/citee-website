<template lang="pug">
div.grey.lighten-2
    v-container
        v-toolbar.secondary.pl-3.white--text
            h1 Convert Between Types of Geographic Data (Beta)
        v-layout(row wrap)
            v-flex(lg4).pa-3
                v-card(height="100%").brown.lighten-4
                    v-card-title.grey.lighten-2.elevation-3
                        h2 Step 1: Prepare Your Data
                    v-card-text.pa-5
                        p This product is in beta stage, but you're encouraged to use it. Please report any bugs or errors to mehedia@darden.virginia.edu.
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
                                        title="Upload Longitude-Latitude Pairs"
                                        :selectedCallback="fromLonLat")
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

// TODO: Refactor so no need for external uploadbutton component
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
    computed: {
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

                const [ promisesArr, inputObjsArr ] =
                    vm.createDataPromises(
                        addressesArr,
                        getDetailForAddress,
                    );
                vm.resolvePromisesAndWriteData( promisesArr,
                    addressesArr, inputObjsArr );
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
                    Please correct or exclude, and then reupload file.` );
                    return;
                }

                const [ promisesArr, inputObjsArr ] = vm.createDataPromises(
                    zipsArr,
                    getDetailForZip,
                );

                vm.resolvePromisesAndWriteData( promisesArr,
                    zipsArr, inputObjsArr );
            }
        },

        fromLonLat( file ) {
            const vm = this;
            this.loadFile( file, loadedLonLats );
            function loadedLonLats( evt ) {
                const csvString = evt.target.result;
                const lonLatsArr = [];
                csvParseRows( csvString, data => {
                    lonLatsArr.push( data.map( el => el.trim() ) );
                } );

                const promises = [];
                const inputObjsArr = [];
                lonLatsArr.forEach( lonLat => {
                    inputObjsArr.push( {
                        input: lonLat,
                    } );
                    promises.push( getGeoLevelsForLonLat(
                        lonLat[ 0 ],
                        lonLat[ 1 ],
                        vm.selectedGeoCodes.toString()
                    ) );
                } );

                vm.resolvePromisesAndWriteData( promises,
                    lonLatsArr, inputObjsArr );
            }
        },
        createDataPromises( inputsArr, functionToGetDetail ) {
            const vm = this;
            const promisesArr = [];
            const inputObjsArr = [];
            inputsArr.forEach( inputItem =>
                promisesArr.push(
                    functionToGetDetail( inputItem )
                        .then( response => {
                            const data = response.data
                                .resourceSets[ 0 ].resources[ 0 ];
                            const lonLat = data.point.coordinates;
                            // create input object to later merge with output before writing
                            inputObjsArr.push( {
                                input: inputItem,
                                formatted_address: data
                                    .address.formattedAddress,
                                longitude: lonLat[ 1 ],
                                latitude: lonLat[ 0 ],
                                confidence: data.confidence,
                                entity_type: data.entityType,
                            } );

                            // Important: Bing returns lat first and lon second
                            return getGeoLevelsForLonLat(
                                lonLat[ 1 ],
                                lonLat[ 0 ],
                                vm.selectedGeoCodes.toString()
                            );
                        } )
                ) );
            return [ promisesArr, inputObjsArr ];
        },
        resolvePromisesAndWriteData( promises, inputsArr, inputObjsArr ) {
            const vm = this;
            Promise.all( promises )
                .then( resolvedArr => {
                    const dataArr = resolvedArr
                        .map( el => el.data.results );
                    vm.writeCsv( dataArr, inputsArr, inputObjsArr );
                } )
                .catch( error => console.log( 'Something went wrong', error ) );
        },
        loadFile( file, fileLoadHandler ) {
            const reader = new FileReader();
            reader.readAsText( file );
            reader.onload = fileLoadHandler;
        },
        writeCsv( dataArr, inputsArr, inputObjsArr ) {
            const modDataArr = dataArr.reduce(
                ( accum, curVal, curValIndex ) => {
                    accum.push( curVal.reduce( ( outputObj, innerEl ) => {
                        // Since input items are not ordered correctly, use filter to identify right input
                        const inputVal = inputsArr[ curValIndex ];
                        const inputObj = inputObjsArr.filter( el =>
                            el.input === inputVal )[ 0 ];
                        // clean up column heads before writing
                        const geoDesc = this.getGeoDescFromCode(
                            innerEl.sumlevel, allGeoLevelsArr
                        ).toLowerCase().replace( /\s/g, '_' );
                        // Geoid — except zip code, because it's already in numeric form
                        if ( innerEl.sumlevel !== '860' ) {
                            outputObj[ `geoid_${ geoDesc }` ] = innerEl.full_geoid.slice( 7 );
                        }
                        outputObj[ `${ geoDesc }` ] = innerEl.full_name;
                        // merge input and output objects for the current index
                        return { ...inputObj, ...outputObj };
                    }, {} ) );
                    return accum;
                }, []
            );
            // d3 function to convert array to csv-formatted string
            const geoDataText = csvFormat( modDataArr );
            const blob = new Blob( [ geoDataText ], {
                type: 'text/plain;charset=utf-8',
            } );
            // Use date and time in file name
            const now = new Date();
            const filename = `Output_${ now.toLocaleString( 'en', { month: 'short' } ) + 1 }-${ now.getDate() }-${ now.getFullYear() }-${ now.getHours() }-${ now.getMinutes() }-${ now.getSeconds() }.csv`;
            // TODO: ensure no memory leak from prior files
            // FIX: doesn't work when tried the same fileload function the  second time
            fs.saveAs( blob, filename );
        },
        getGeoDescFromCode( givenCode, arr ) {
            return arr.filter( el => el.code === givenCode )[ 0 ].name;
        },
    },
};
</script>
