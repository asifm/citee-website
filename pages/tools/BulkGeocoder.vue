<template lang="pug">
div.grey.darken-2
    div.text-sm-center.pa-3.elevation-3.page-header
        h1 CITee Geocoder (Beta)
        h2 Convert US Locations to Census Legal and Statistical Entities
        p.caption The app is in beta phase, but we encourage you to use it. Send your suggestions, bug-reports, and questions to #[a(href="mehedia@darden.virginia.edu") mehedia@darden.virginia.edu].
    v-container(fluid)
        v-layout(row wrap).pa-5
            v-flex(lg6 xl4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.brown.lighten-4.elevation-3
                        h2 <strong>Step 1</strong> Prepare Your Data
                    v-card-text.pa-5
                        p An input file can have only one type of geodata. If you need to convert different types of geodata, please organize them in multiple files.
                        p The geodata types that can be converted are:
                        h3 Zip Codes
                        p Structure: one Zip code per line in a plain text file.
                        h3 Addresses
                        p Structure: one address per line in a plain text file. Unstructured and incomplete addresses are usually OK. Names of well-known institutions may also work.
                        h3 Geographic coordinates
                        p Structure: one longitude-latitude (in that order) pair per line in a plain text file. A comma should separate the longitude and latitude in each line.
            v-flex(lg6 xl4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.blue-grey.lighten-4.elevation-3
                        h2 <strong>Step 2</strong> Select Input and Output Entity Types
                    v-card-text.pa-5
                        p.body-2 &#9655; What type of geodata do you <strong>have</strong>?
                        v-radio-group(v-model="inputType")
                                    v-radio(value="zip" label="Zip Codes")
                                    v-radio(value="address" label="Addresses")
                                    v-radio(value="lon-lat" label="Geographic Coordinates")
                        p.body-2 &#9655; What type(s) of geodata do you <strong>need</strong>?
                        v-select(
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
                        p.body-2 &#9655; Include geographic identification codes?
                        v-switch(
                            label="Yes, include codes."
                            v-model="includeGeoCodes"
                            ).blue--text
            v-flex(lg6 xl4).pa-3
                v-card(height="100%").elevation-5
                    v-card-title.indigo.lighten-4.elevation-3
                        h2 <strong>Step 3</strong> Upload File
                    v-card-text.pa-5
                        no-ssr
                            div
                                p Click below to upload your file.
                                upload-button(
                                    title="Upload Your File"
                                    :selectedCallback="uploadCallback"
                                    )
                                v-dialog(v-model="dialog" max-width="400px")
                                    v-card.pa-5
                                        v-card-text
                                            p.body-2 {{ dialogText }}
                                            v-card-actions
                                                v-btn(@click.stop="dialog = false") Close
                                br
                                v-progress-linear(
                                    v-model="progressValue"
                                    color="accent"
                                    )
                                h4.green--text.darken-2 {{ progressFeedback }}
                                p.blue--text {{ filename }}
    v-card.ma-5
        v-layout(row wrap).ma-5.pa-5
            v-flex(lg6 md12).px-3
                p.body-2.mb-0 Developed by
                p Asif Mehedi, Batten Institute for Entrepreneurship and Innovation at the University of Virginia Darden School of Business.
                p.body-2.mb-0 Acknowledgment
                p Data and APIs provided by the #[a(href="https://www.census.gov/") Census Bureau], the #[a(href="https://censusreporter.org/") Census Reporter], and #[a(href="https://www.bing.com/maps") Bing Maps].
                p.body-2.mb-0 Citation and Use
                p You are free to use this software as you see fit. We request that you cite your use appropriately. Sample citations:
                p APA (6th): Mehedi, A. (2018). CITee Geocoder (Version 1.0). Charlottesville: Cities Innovating Tomorrow's Entrepreneurial Ecosystems Project, Darden School of Business.
                p Chicago: Mehedi, Asif. 2018. <em>Citee Geocoder</em> (version 1.0). Web. Charlottesville: Cities Innovating Tomorrow's Entrepreneurial Ecosystems Project, Darden School of Business.
                p.body-2.mb-0 Contact
                p #[a(href="mehedia@darden.virginia.edu") mehedia@darden.virginia.edu]
            v-flex(lg6 md12).px-3
                p.body-2 FAQ
                p <em>What problems does it solve?</em>
                p Researchers dealing with spatial analyses often need to identify different geographic entities that contain a given location. The location data are usually in the form of addresses, Zip codes, or geographic coordinates. The desired outputs may be different legal and statistical geographic entities, such as county, metropolitan statistical area (MSA), public use microdata area (PUMA), congressional district, etc.

                p This identification requires some effort, such as finding the right correspondence data (also known as crosswalks) and then performing a join operation between two datasets. This process may not yield satisfactory matches for a number of reasons. Many place names have variants, especially those involving abbreviated words. They may even be misspelled (common in survey data). The crosswalks data may not be complete.

                p Here, one simply uploads the location data and indicates the output types. The app (actually, the underlying processes — see acknowledgment section) does the rest. Converting hundreds of location data usually does not take more than a few seconds.
                p <em>What is CITee?</em>
                p See here: #[a(href="http://citee.darden.virginia.edu/") http://citee.darden.virginia.edu/]

                p <em>Will there be more input and output types in the future?</em>
                p Quite possibly. But it's not a priority right now.

                p <em> Does the app work on all browsers?</em>
                p We recommend a recent version of Chrome. We have not yet tested this app on other browsers.
</template>

<script>
import * as fs from 'file-saver';
import { csvParseRows, csvFormat } from 'd3';
import * as allGeoLevelsArr from '../../static/data/geo_levels_codes.json';
import validZips from '../../static/data/valid-zips.json';

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
            inputType: [ 'zip',
                'address',
                'lon-lat' ],
            textFile: null,
            selectedGeoLevelsArr: [ {
                code: '310',
                name: 'Core-Based Statistical Area',
            } ],
            allGeoLevelsArr,
            includeGeoCodes: true,
            progressFeedback: '',
            progressValue: 0,
            filename: '',
            dialog: false,
            dialogText: '',
        };
    },
    computed: {
        selectedGeoCodes() {
            return this.selectedGeoLevelsArr.map( elem => elem.code );
        },
    },
    methods: {
        uploadCallback( file ) {
            if ( this.inputType === 'zip' ) {
                this.fromZip( file );
            } else if ( this.inputType === 'address' ) {
                this.fromAddress( file );
            } else if ( this.inputType === 'lon-lat' ) {
                this.fromLonLat( file );
            } else {
                this.dialog = true;
                this.dialogText = 'You must select an input type first.';
            }
        },
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
                    vm.dialog = true;
                    vm.dialogText = `Please correct or exclude the following invalid Zip codes: ${ invalidZips }.`;
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
            this.progressFeedback = 'Writing data';
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
            this.filename = `CITee-Geocoder_${ now.toLocaleString( 'en', { month: 'short' } ) }${ now.getDate() }-${ now.getFullYear() }__${ now.getHours() }h-${ now.getMinutes() }m-${ now.getSeconds() }s.csv`;
            fs.saveAs( blob, this.filename );
            vm.progressValue = 100;
            vm.progressFeedback = 'Task completed. Check data for accuracy. File saved as:';
        },
        getGeoDescFromCode( givenCode, arr ) {
            return arr.filter( el => el.code === givenCode )[ 0 ].name;
        },
    },
};

// TODO: visual output (map)
// TODO: tips to ensure outputs are correct
// TODO: video demo lists of all universities

</script>

<style>
.page-header {
    background-color: #f2c811;
}
</style>
