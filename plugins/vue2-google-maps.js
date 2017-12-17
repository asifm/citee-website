// AIzaSyCDVttVn5UxsYmZgtjVgLW_kSlrLX7zxms

import Vue from 'vue';
// import * as VueGoogleMaps from 'vue2-google-maps'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCDVttVn5UxsYmZgtjVgLW_kSlrLX7zxms',
    libraries: 'places,drawing,visualization',
  },
});
