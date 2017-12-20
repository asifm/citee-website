<template lang="pug">
v-container
    v-layout(row wrap)
        v-flex(offset-lg4 lg4)
            v-toolbar.indigo.lighten-3
                h1.display-1 Metro Geocoder
            v-card.pa-5
                p Upload a list of addresses in a csv file and get back detailed geographical data about these addresses. The addresses need not be complete. 
                div#address
                    no-ssr  
                        upload-button(title="Upload list of adresses" :selectedCallback="fromAddress")
            v-card.pa-5
                p Upload a list of latitude-longitude pairs in a csv file and get back detailed geographical data about these locations. 
                div#latlon
                    no-ssr
                        upload-button(title="Upload list of latitude-longitude pairs" :selectedCallback="fromLatLon")
            v-card.pa-5
                a#downloadlink Download File
                  
</template>

<script>
import { csvParseRows, csvParse } from 'd3'
import UploadButton from "../../components/UploadButton.vue";
import { getGeoFromLonLat, getGeoFromAddress } from "../../assets/js/mapHelpers/geoLocator";


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
    components: {'upload-button': UploadButton},
    data() {
        return {
            textFile: null,
            geoMainArr,
            geoCodesArr: geoMainArr.map(elem => elem.code),
            geoNamesArr: geoMainArr.map(elem => elem.name),
        }
    },
    methods: {


        async fromAddress(file) {
            const vm = this;
            const reader = new FileReader;
            reader.readAsText(file)
            reader.onload = loaded
            function loaded(evt) {

                function makeTextFile (text) {
                    var data = new Blob([text], {type: 'text/plain'});
                    console.log('inner', data);
                    // If we are replacing a previously generated file we need to
                    // manually revoke the object URL to avoid memory leaks.
                    // if (textFile !== null) {
                    //     window.URL.revokeObjectURL(textFile);
                    // }
                    const textFile = window.URL.createObjectURL(data);
                    return textFile;
                };
                const csvString = evt.target.result
                const addressesArr = []
                const fullAddressesArr = []
                const lonLatsArr = []
                const geoDataArr = []
                const geoDataObj = {}
                csvParseRows(csvString, function(data) {
                    addressesArr.push(data);
                })
                addressesArr.forEach(elem => {
                    const el = elem[0]
                    getGeoFromAddress(el, false).then(function(response) {
                        const lonLat = response.data.features[0].center
                        const fulladdress = response.data.features[0].place_name;
                        geoDataObj[el] = {};
                        geoDataObj[el]['lonLat'] = lonLat;
                        geoDataObj[el]['fulladdress'] = fulladdress;

                       getGeoFromLonLat(lonLat[0], lonLat[1], vm.geoCodesArr.toString()).then(function(response){
                            geoDataObj[el]['results'] = response.data.results
                        })
                    })
                // const geoDataText = JSON.stringify(geoDataObj[el])
                // console.log(geoDataText);
                // var link = document.getElementById('downloadlink');
                // link.href = makeTextFile(geoDataText);
                })
            }
          },
         fromLatLon(file) {
             const reader = new FileReader;
            reader.readAsText(file)
            reader.onload = loaded
            function loaded(evt) {
                const csvString = evt.target.result;
                const latLonArr = [];
                csvParseRows(csvString, function(data) {
                    latLonArr.push(data)
                });

            }
         }
    }
}
</script>




//   var create = document.getElementById('create'),
//     textbox = document.getElementById('textbox');

//   create.addEventListener('click', function () {
//     var link = document.getElementById('downloadlink');
//     link.href = makeTextFile(textbox.value);
//     link.style.display = 'block';
//   }, false);
// })();
