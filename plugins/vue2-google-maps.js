import Vue from 'vue';
import * as VueGoogleMaps from '../node_modules/vue2-google-maps/src/main';

Vue.use( VueGoogleMaps, {
    load: {
        // New one: AIzaSyBGiVhgeE09GiYUQMzWSEaIqkonsiRPCO8
        key: 'AIzaSyCDVttVn5UxsYmZgtjVgLW_kSlrLX7zxms',
        libraries: 'places,drawing,visualization',
    },
} );
