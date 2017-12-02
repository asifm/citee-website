* Add google analytics: https://nuxtjs.org/faq/google-analytics
* Change heading font to franklin-gothic-urw
* Comment generously: DrawMap.vue, geo-locator.vue
* Create component for selecting variable and getting data for different
  geo-levels
* Explore: switch to mapbox gl https://github.com/phegman/vue-mapbox-gl
  * https://github.com/mapbox/mapbox-gl-leafletS
* Explore leaflet plugins: http://leafletjs.com/plugins.html
  * Flow map: https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer
    * Example:
      https://jwasilgeo.github.io/Leaflet.Canvas-Flowmap-Layer/docs/main/
  * Swoopy map: https://blog.webkid.io/swoopy-arrows-for-leaflet-maps/
  * ## Fullscreen: https://github.com/Leaflet/Leaflet.fullscreen

## Cool libraries

* Fuzzy search: http://fusejs.io/

## Learn

* Vue component unit testing
* Geojson with leaflet: http://leafletjs.com/examples/geojson/
*

# GeoLocator.vue

// [x] TODO: Add catch to promises to handle errors // [x] TODO: Flex layout
redo // [x] TODO: Add transitions // [x] TODO: Add a button to get back to full
US map when zoomed in or out (that is, change zoom value to default) // [x]
TODO: Highlight non-empty geo data // [x] TODO: Organize the display by
categories of geo data // [x] TODO: Add FIPS code to geo data shown // [x] TODO:
Get data based on zip code (append "Zip Code" to code) // TODO: Reduce number of
decimals in lot lan inputs // TODO: Hover on map to show name of place in
floating card // TODO: Get wikidata id from mapbox and show interesting data
and/or image. Example: https://www.wikidata.org/wiki/Q1509 // TODO: Get location
images through bing API
https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/
//
https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference
// Bing: Use search terms seach as cityname + statename +
'attractions/history/skyline/sunset/building' // TODO: Address autocomplete
https://developers.google.com/maps/documentation/javascript/places-autocomplete
// TODO: Get controls on map, such as toolbars
https://vuetifyjs.com/components/toolbars#example-6 and leaflet controls //
TODO: Show some kind of data on the map for MSAs or other geo levels selectable
by user. Population or other selectable variables // TODO: Explore if switching
to google maps api makes better sense //
https://developers.google.com/maps/documentation/javascript/styling //
https://mapstyle.withgoogle.com/ // https://snazzymaps.com/ // Places api:
https://developers.google.com/maps/documentation/javascript/places //
visualization apoi:
https://developers.google.com/maps/documentation/javascript/earthquakes // TODO:
major attractions: google places api //
https://maps.googleapis.com/maps/api/place/textsearch/json?query=new+york+city+point+of+interest&language=en&key=API_KEY
//
https://www.google.com/search?sclient=psy-ab&site=&source=hp&btnG=Search&q=New+York+point+of+interest
// Seems to work well:
https://maps.googleapis.com/maps/api/place/textsearch/json?query=charlottesville%20virginia%20tourist&language=en&key=AIzaSyBTN2PHKwjp4_WWBqI43qRcsbw-Q5fUjZg
// TODO: Add more controls to easily navigate the map // TODO: Check foursquare
api for top attractions //
https://developer.foursquare.com/docs/api/venues/details // TODO: Explore
http://developer.factual.com/places/supported-countries/index.html

// [x] FIXME: Latlon gets reacted by map data // [x] FIXME: Address input shows
correct output after next keyup // [x] FIXME: Text geo gets chopped off if too
long. Use tooltip to show full text // FIXME: geodata not being decoded as
unicode (spanish names not working)

// !! New tool idea: Learn about your city: top meetups, top tweets, top news,
top images, key data (census), wikidata (https://www.wikidata.org/wiki/Q1509),
// elevation, top attractions, distance from nearest large city etc.

// Google maps api key: AIzaSyBTN2PHKwjp4_WWBqI43qRcsbw-Q5fUjZg
