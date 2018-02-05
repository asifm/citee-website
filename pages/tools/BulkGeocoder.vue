<template lang="pug">
div.grey.lighten-3
    div.text-sm-center.pa-3.elevation-3.page-header
        h1 CITee Geocoder (Beta)
        h2 Convert Locations to Census Legal and Statistical Entities
    v-container.pa-5
        v-layout(row wrap)
            v-flex(lg4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.brown.lighten-4.elevation-3
                        h2 <strong>Step 1</strong> Prepare Your Data
                    v-card-text.pa-5
                        p TODO: Instructions for how to prepare the data before uploading.
                        p.caption This app has been tested only on the latest versions of Chrome. It may or may not work on other browsers.
                        p.caption Although the app is in beta phase, you're encouraged to use it. Please report bugs and errors and send your suggestions to mehedia@darden.virginia.edu.
            v-flex(lg4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.blue-grey.lighten-4.elevation-3
                        h2 <strong>Step 2</strong> Select Types of Geographic Entities
                    v-card-text.pa-5
                        p TODO: briefly about the options available
                        v-select(
                            label="Select"
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
                            append-icon="map"
                            )
                        br

                        v-checkbox(label="Include geographic identification codes." v-model="includeGeoCodes").blue--text
            v-flex(lg4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.indigo.lighten-4.elevation-3
                        h2 <strong>Step 3</strong> Upload File
                    v-card-text.pa-5
                        no-ssr
                            div
                                div
                                    v-progress-circular(:value="60")
                                    upload-button(
                                        title="Zip Codes"
                                        :selectedCallback="fromZip")
                                        .amber.lighten-1.ml-0
                                    p Qui do sit sunt quis qui officia tempor labore sunt ullamco minim nostrud.
                                div
                                    upload-button(
                                        title="Addresses / Landmarks"
                                        :selectedCallback="fromAddress")
                                        .light-green.lighten-1.ml-0
                                    p Minim magna dolore incididunt duis reprehenderit incididunt est ad nostrud pariatur magna esse.
                                div
                                    upload-button(
                                        title="Longitude-Latitude Pairs"
                                        :selectedCallback="fromLonLat")
                                        .indigo.lighten-3.ml-0
                                    p Ad aliqua ex occaecat incididunt est reprehenderit dolor.
    v-card.pa-5.ma-5
        p <strong>Developed by</strong> <br> Asif Mehedi, Batten Institute for Entrepreneurship and Innovation at the University of Virginia Darden School of Business. Contact: MehediA@darden.virginia.edu.
        p <strong>Acknowledgement</strong> <br> Data and APIs provided by the #[a(href="https://www.census.gov/") Census Bureau], the #[a(href="https://censusreporter.org/") Census Reporter], and #[a(href="https://www.bing.com/maps") Bing Maps].
        p <strong>Citation and Use</strong> <br> You are free to use this software as you see fit. We request that you cite your use appropriately. Sample citations:
        p APA (6th): Mehedi, A. (2018). CITee Geocoder (Version 1.0). Charlottesville: Cities Innovating Tomorrow's Entrepreneurial Ecosystems Project, Darden School of Business.
        p Chicago: Mehedi, Asif. 2018. <em>Citee Geocoder</em> (version 1.0). Web. Charlottesville: Cities Innovating Tomorrow's Entrepreneurial Ecosystems Project, Darden School of Business.
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
            selectedGeoLevelsArr: [ {
                code: '310',
                name: 'Core-Based Statistical Area',
            } ],
            allGeoLevelsArr,
            includeGeoCodes: true,
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
                    alert( `Please correct or exclude the invalid Zip codes: ${ invalidZips }. Then reupload the file.` );
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
            if ( this.selectedGeoCodes.length === 0 ) {
                // eslint-disable-next-line no-alert
                alert( 'You must select at least one geographic entity type.' );
                return;
            }
            const reader = new FileReader();
            reader.readAsText( file );
            reader.onload = fileLoadHandler;
        },
        writeCsv( dataArr, inputsArr, inputObjsArr ) {
            const vm = this;
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
                        // GeoCodes — except zip code, because it's already in numeric form
                        if ( vm.includeGeoCodes ) {
                            if ( innerEl.sumlevel !== '860' ) {
                                outputObj[ `geoid_${ geoDesc }` ] = innerEl.full_geoid.slice( 7 );
                            }
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
            const filename = `CITee-Geocoder_${ now.toLocaleString( 'en', { month: 'short' } ) }${ now.getDate() }-${ now.getFullYear() }__${ now.getHours() }h-${ now.getMinutes() }m-${ now.getSeconds() }s.csv`;
            fs.saveAs( blob, filename );
        },
        getGeoDescFromCode( givenCode, arr ) {
            return arr.filter( el => el.code === givenCode )[ 0 ].name;
        },
    },
};
// TODO: add instructions, use cases, what problem it solves, sample inputs, (limit to 500 at a time)
// TODO: visual output (map)
// TODO: tips to ensure outputs are correct
// TODO: video demo lists of all universities
// TODO: progress bar; show the inputs being completed; finally announce file is downloaded

</script>

<style>
.page-header {
    background-color: #f2c811;
}
</style>
