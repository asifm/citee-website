<template lang="pug">
div.blue-grey.darken-1
    div.text-sm-center.pa-3.elevation-5.page-header
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
                        p Prepare your data in a <strong>plain text file</strong> (e.g. a csv or txt file).
                        p.body-2.mb-0 For Zip Codes
                        p One Zip code per line. (Invalid Zip codes will be skipped over.)
                        p.body-2.mb-0 For addresses
                        p One address per line. Unstructured and incomplete addresses are usually OK. Names of well-known institutions may also work.
                        p.body-2.mb-0 For geographic coordinates
                        p One longitude-latitude (in that order) pair per line. A comma should separate the longitude and latitude in each line.
                        p.caption An input file can have only one type of geodata. If you need to convert different types of geodata, please organize them in multiple files.
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
                        //- no-ssr
                        div
                            p Click below to upload your file.
                            upload-button(
                                id="upload-button"
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
                            v-progress-circular(
                                v-show="processing"
                                :size="100"
                                :width="5"
                                indeterminate
                                color="accent"
                                )
                            br
                            v-btn(v-show="processing" @click="stopProcessing") Stop Processing
                            br
                            p.body-2.green--text.text--darken-3 {{ progressMessage }}
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
                p <strong>What problems does it solve?</strong>
                div#why
                    p Researchers dealing with spatial analyses often need to identify different geographic entities that enclose a given location. The location data are usually in the form of addresses, Zip codes, or geographic coordinates. The desired outputs may be different legal and statistical geographic entities, such as county, metropolitan statistical area (MSA), public use microdata area (PUMA), congressional district, etc.

                    p This identification requires some effort, e.g. finding the right correspondence data (also known as crosswalks) and then performing a join operation between two datasets. This process may not yield satisfactory matches for a number of reasons. Many place names have variants, especially those involving abbreviated words. They may even be misspelled (common in survey data). The crosswalks data may not be complete.

                    p Here, one simply uploads the location data and indicates the output types. The app (actually, the underlying processes — see acknowledgment section) does the rest.
                br
                p <strong>What are some examples of use cases?</strong>
                p Find which different MSAs all the US research universities are located in.
                p Map a list of venture addresses to their respective counties.
                p From the Zip codes of survey respondents, find their legislative districts.
                p <strong>What is CITee?</strong>
                p See here: #[a(href="http://citee.darden.virginia.edu/") http://citee.darden.virginia.edu/]

                p <strong>Will there be more input and output types in the future?</strong>
                p Quite possibly. But it's not a priority right now.

                p <strong> Does the app work on all browsers?</strong>
                p We recommend a recent version of Chrome. We have not yet tested this app on other browsers.

                p <strong> Are the returned data accurate?</strong>
                p Not always. You should check the data for accuracy. The <em>confidence</em> and <em>entity_type</em> columns will help you to quickly scan for errors.
</template>

<script>
import * as fs from 'file-saver';
import { csvParseRows, csvFormat } from 'd3';
import * as allGeoLevelsArr from '~/assets/data/geoLevelsCodes.json';
import validZips from '~/assets/data/validZips.json';

import UploadButton from '~/components/UploadButton.vue';
import {
    getGeoLevelsForLonLat,
    getDetailForAddress,
    getDetailForZip,
} from '~/assets/js/mapHelpers/geoLocator';

export default {
    components: { 'upload-button': UploadButton },
    data() {
        return {
            inputType: [
                'zip',
                'address',
                'lon-lat',
            ],
            textFile: null,
            // have cbsa selected by default
            selectedGeoLevelsArr: [
                {
                    code: '310',
                    name: 'Core-Based Statistical Area',
                },
            ],
            allGeoLevelsArr,
            includeGeoCodes: true,
            progressMessage: '',
            processing: false,
            filename: '',
            dialog: false,
            dialogText: '',
        };
    },
    computed: {
        selectedGeoCodes() {
            return this.selectedGeoLevelsArr.map(elem => elem.code);
        },
    },
    methods: {
        uploadCallback(file) {
            // set messages to blank
            this.progressMessage = '';
            this.filename = '';

            if (file.size > 200000) {
                this.dialog = true;
                this.dialogText =
                    'The file is too big. The size limit is 200kB.';
                return;
            } else if (file.size === 0) {
                this.dialog = true;
                this.dialogText =
                    'You file has no data.';
                return;
            }
            if (file.name.match(/(xls|xlsx|doc|docx|pdf)$/)) {
                this.dialog = true;
                this.dialogText =
                    `Only plain text files are allowed.
                    If this is an Excel file,
                    you can save it as CSV and try again.`;
                return;
            }
            if (this.inputType === 'zip') {
                this.fromZip(file);
            } else if (this.inputType === 'address') {
                this.fromAddress(file);
            } else if (this.inputType === 'lon-lat') {
                this.fromLonLat(file);
            } else {
                this.dialog = true;
                this.dialogText = 'You must select an input type first.';
            }
        },
        loadFile(file, fileLoadHandler) {
            if (this.selectedGeoCodes.length === 0) {
                this.dialog = true;
                this.dialogText =
                    'You must select at least one output entity type.';
                return;
            }
            const reader = new FileReader();
            reader.readAsText(file, 'utf-8');
            reader.onload = fileLoadHandler;
        },
        fromAddress(file) {
            const vm = this;
            this.loadFile(file, loadedAddresses);
            function loadedAddresses(evt) {
                const csvString = evt.target.result;
                // returns an array of arrays
                const addressesArr = csvParseRows(csvString)
                    .map(el => el.join(','))
                    .filter(el1 => el1 !== '');

                vm.createDataPromises(
                    addressesArr,
                    getDetailForAddress
                ).then(([ promisesArr, inputObjsArr ]) => {
                    vm.resolvePromisesAndWriteData(
                        promisesArr,
                        addressesArr,
                        inputObjsArr
                    );
                });
            }
        },
        fromZip(file) {
            const vm = this;
            this.loadFile(file, loadedZips);
            function loadedZips(evt) {
                const csvString = evt.target.result;
                // returns an array of arrays

                const zipsArr = csvParseRows(csvString)
                    .map(el => el[ 0 ])
                    .filter(el => el !== '' && validZips.includes(el));

                vm.createDataPromises(zipsArr, getDetailForZip)
                    .then(([ promisesArr, inputObjsArr ]) => {
                        vm.resolvePromisesAndWriteData(
                            promisesArr,
                            zipsArr,
                            inputObjsArr
                        );
                    });
            }
        },

        fromLonLat(file) {
            const vm = this;
            vm.processing = true;
            vm.loadFile(file, loadedLonLats);
            async function loadedLonLats(evt) {
                const csvString = evt.target.result;
                const lonLatsArr = [];
                // eslint-disable-next-line complexity
                csvParseRows(csvString, data => {
                    // Check input is valid
                    if (+data[ 0 ] > -180 && +data[ 0 ] < 180
                        && +data[ 1 ] > -90 && +data[ 1 ] < 90
                        && data[ 0 ] !== '' && data[ 1 ] !== '') {
                        lonLatsArr.push(data.map(el => el.trim()));
                    }
                });
                const promises = [];
                const inputObjsArr = [];
                // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
                for (const [ index, lonLat ] of lonLatsArr.entries()) {
                    if (vm.processing === true) {
                        vm.progressMessage =
                            `Processing line ${ index }: ${ lonLat }`;
                        inputObjsArr.push({
                            input: lonLat,
                        });

                        promises.push(
                            getGeoLevelsForLonLat(
                                lonLat[ 0 ],
                                lonLat[ 1 ],
                                vm.selectedGeoCodes.toString()
                            )
                        );
                        await vm.delay(100);
                    }
                }

                vm.resolvePromisesAndWriteData(
                    promises,
                    lonLatsArr,
                    inputObjsArr
                );
            }
        },
        async createDataPromises(inputsArr, functionToGetDetail) {
            const vm = this;

            vm.processing = true;
            const promisesArr = [];
            const inputObjsArr = [];
            // eslint-disable-next-line no-await-in-loop, no-restricted-syntax
            for (const [ index, inputItem ] of inputsArr.entries()) {
                if (vm.processing === true) {
                    vm.progressMessage =
                        `Processing line ${ index }: ${ inputItem }...`;
                    promisesArr.push(
                        functionToGetDetail(inputItem)
                            .then(response => {
                                const data = response.data.resourceSets[ 0 ]
                                    .resources[ 0 ];
                                const lonLat = data.point.coordinates;
                                // create input object to merge with output
                                inputObjsArr.push({
                                    input: inputItem,
                                    formatted_address:
                                        data.address.formattedAddress,
                                    longitude: lonLat[ 1 ],
                                    latitude: lonLat[ 0 ],
                                    confidence: data.confidence,
                                    entity_type: data.entityType,
                                });

                                // Important: Bing returns lat first and lon second
                                return getGeoLevelsForLonLat(
                                    lonLat[ 1 ],
                                    lonLat[ 0 ],
                                    vm.selectedGeoCodes.toString()
                                );
                            }).catch(err => {
                                console.log('there was an error', err);
                            })
                    );
                    await this.delay(100);
                }
            }
            return [ promisesArr, inputObjsArr ];
        },
        resolvePromisesAndWriteData(promises, inputsArr, inputObjsArr) {
            const vm = this;
            Promise.all(promises)
                .then(resolvedArr => {
                    const dataArr = resolvedArr.map(el => {
                        if (el) {
                            return el.data.results;
                        }
                        return [ 'Could not resolve input' ];
                    });
                    vm.writeCsv(dataArr, inputsArr, inputObjsArr);
                })
                .catch(error => console.log('Something went wrong', error));
        },
        writeCsv(dataArr, inputsArr, inputObjsArr) {
            try {
                this.progressMessage = 'Writing data...';
                const vm = this;
                const modDataArr =
                dataArr.reduce((accum, curVal, curValIndex) => {
                    accum.push(
                        curVal.reduce((outputObj, innerEl) => {
                        // Since input items are not ordered correctly, use filter to identify right input
                            const inputVal = inputsArr[ curValIndex ];
                            const inputObj = inputObjsArr.find(
                                el => el.input === inputVal
                            );
                            // get and clean up column heads before writing
                            const geoDesc = this.getGeoDescFromCode(
                                innerEl.sumlevel,
                                allGeoLevelsArr
                            )
                                .toLowerCase()
                                .replace(/\s/g, '_');
                            try {
                                // GeoCodes — except zip code, because it's already in numeric form
                                if (vm.includeGeoCodes) {
                                    if (innerEl.sumlevel !== '860') {
                                        outputObj[
                                            `geoid_${ geoDesc }`
                                        ] = innerEl.full_geoid.slice(7);
                                    }
                                }
                                outputObj[ `${ geoDesc }` ] = innerEl.full_name;
                            } catch (err) {
                                console.error('Error when writing file', err);
                            }
                            // merge input and output objects for the current index
                            return { ...inputObj, ...outputObj };
                        }, {})
                    );
                    return accum;
                }, []);
                // d3 function to convert array to csv-formatted string
                const geoDataText = csvFormat(modDataArr);
                if (geoDataText.trim() === '') {
                    this.dialog = true;
                    this.dialogText = 'Your file could not be parsed. It\'s missing valid inputs.';
                    this.processing = false;
                    this.progressMessage = '';
                    this.filename = '';
                    return;
                }
                const blob = new Blob([ geoDataText ], {
                    type: 'text/plain;charset=utf-8',
                });

                // Use date and time in file name

                const now = new Date();
                this.filename = `CITee-${ this.inputType.toUpperCase() }_${ now.toLocaleString('en', {
                    month: 'short',
                }) }${ now.getDate() }-${ now.getFullYear() }__${ now.getHours() }h-${
                    now.getMinutes() }m-${ now.getSeconds() }s.csv`;
                fs.saveAs(blob, this.filename);
                vm.processing = false;
                vm.progressMessage =
                    'Task completed. Check data for accuracy. File saved as: ';
            } catch (err) {
                console.error(err);
            }
        },
        getGeoDescFromCode(givenCode, arr) {
            try {
                return arr.find(el => el.code === givenCode).name;
            } catch (err) {
                console.log('No name found', err);
                return 'status';
            }
        },
        stopProcessing() {
            this.processing = false;
        },
        // Used to throttle API calls
        delay(ms) {
            return new Promise((resolve => {
                setTimeout(resolve, ms);
            }));
        },
    },
};

// TODO: Add link to explanation of geoid: https://www.census.gov/geo/reference/geoidentifiers.html
// TODO: Better, more straight-forward error-handling
// TODO: tips to ensure outputs are correct
// TODO: Use google for geocoding
// https://developers.google.com/maps/documentation/geocoding/intro
</script>

<style>
.page-header {
    background-color: #f2c811;
}
#why {
    column-count: 2;
}
</style>
