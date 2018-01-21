<<template lang="pug">
v-container
    v-layout(row wrap).text-lg-center
        v-flex(offset-lg4 lg4)
            v-toolbar.indigo.lighten-3.pa-3
                h1.display-1 Metro Geocoder
            v-card.pa-5
                p Upload a list of addresses in a csv file and get back detailed geographical data about these addresses. The addresses need not be complete.
                div#address
                    no-ssr
                        upload-button(
                            title="Upload a list of adresses"
                            :selectedCallback="fromAddress")
            v-card.pa-5
                p Upload a list of latitude-longitude pairs in a csv file and get back detailed geographical data about these locations.
                div#latlon
                    no-ssr
                       upload-button(
                           title="Upload a list of latitude-longitude pairs"
                           :selectedCallback="fromLatLon")
            v-card.pa-5
                a#downloadlink Download File

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
