import Vue from 'vue';
import Vue2Leaflet from 'vue2-leaflet';

Vue.component( 'v-map', Vue2Leaflet.Map );
Vue.component( 'v-tilelayer', Vue2Leaflet.TileLayer );
Vue.component( 'v-marker', Vue2Leaflet.Marker );
// Tooltip not working; investigate
// Vue.component('v-tooltip-leaflet', Vue2Leaflet.Tooltip);
