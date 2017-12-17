Definitely check out
margin conventions https://gist.github.com/mbostock/3019563

Potentially useful
reusability https://bocoup.com/blog/reusability-with-d3
responsive svg https://mathisonian.com/writing/easy-responsive-svgs-with-viewbox

## GeoLocator.vue / Your CITY

Amet do veniam pariatur mollit. Id incididunt ea consectetur ipsum exercitation.
Velit anim eiusmod eiusmod irure nisi quis minim magna. Pariatur dolore deserunt
eiusmod irure aliqua sunt. Ipsum deserunt dolore excepteur voluptate do ad. Sint
deserunt ad adipisicing labore ad mollit velit reprehenderit proident irure.

* [ ] Show nearest R universities
* [ ] Add select to change map type: satellite etc.
* [ ] Reduce number of decimals in lot lan inputs
* [ ] Hover on map to show name of place in floating card
* [ ] Get wikidata id from mapbox and show interesting data and/or image.
      Example: https://www.wikidata.org/wiki/Q1509
* [ ] Get location images through bing API
      https://azure.microsoft.com/en-us/services/cognitive-services/bing-image-search-api/
      //
      https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-images-api-v7-reference
      // Bing: Use search terms seach as cityname + statename +
      'attractions/history/skyline/sunset/building' // TODO: Address
      autocomplete
      https://developers.google.com/maps/documentation/javascript/places-autocomplete
* [ ] Get controls on map, such as toolbars
      https://vuetifyjs.com/components/toolbars#example-6 and leaflet controls
* [ ] Show some kind of data on the map for MSAs or other geo levels selectable
      by user. Population or other selectable variables
* [ ] Explore if switching to google maps api makes better sense //
      https://developers.google.com/maps/documentation/javascript/styling //
      https://mapstyle.withgoogle.com/ // https://snazzymaps.com/ // Places api:
      https://developers.google.com/maps/documentation/javascript/places //
      visualization apoi:
      https://developers.google.com/maps/documentation/javascript/earthquakes
* [ ] major attractions: google places api //
      https://maps.googleapis.com/maps/api/place/textsearch/json?query=new+york+city+point+of+interest&language=en&key=API_KEY
      //
      https://www.google.com/search?sclient=psy-ab&site=&source=hp&btnG=Search&q=New+York+point+of+interest
      // Seems to work well:
      https://maps.googleapis.com/maps/api/place/textsearch/json?query=charlottesville%20virginia%20tourist&language=en&key=AIzaSyBTN2PHKwjp4_WWBqI43qRcsbw-Q5fUjZg
* [ ] Add more controls to easily navigate the map
* [ ] Check foursquare api for top attractions //
      https://developer.foursquare.com/docs/api/venues/details // TODO: Explore
      http://developer.factual.com/places/supported-countries/index.html //
      Google maps api key: AIzaSyBTN2PHKwjp4_WWBqI43qRcsbw-Q5fUjZg
* [ ] Add graphs for different geo level data with margin of error

* [ ] FIXME: geodata from censusreporter not being decoded as unicode (spanish
      names not working). Minor problem (spanish names with ñ and such).
* [ ]

## General

* Add google analytics: https://nuxtjs.org/faq/google-analytics
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

lists https://github.com/wbkd/awesome-d3 https://github.com/d3/d3/wiki/Plugins

* d3 legend _ http://d3-legend-v3.susielu.com/ _ use idea: in all charts
* d3 annotation https://github.com/susielu/d3-annotation \*
  http://d3-annotation.susielu.com/#examples
* d3 kit https://github.com/twitter/d3kit
* leaflet d3 https://github.com/Asymmetrik/leaflet-d3
* d3 loom https://github.com/nbremer/d3-loom _
  https://www.visualcinnamon.com/2017/08/d3-loom.html _ use idea: startup
  capital flow between msas
* d3 map https://github.com/markmarkoh/datamaps
* Explored d3 map https://github.com/bsouthga/d3-exploder _ example
  http://bsouthga.github.io/d3-exploder/ _ example
  https://jsfiddle.net/9Lpcm56n/16/
* d3 text-wrap https://github.com/vijithassar/d3-textwrap
* Fuzzy search http://fusejs.io/

  ## Learn

* Vue component unit testing
* Geojson with leaflet: http://leafletjs.com/examples/geojson/
*

## Ideas

### Tools

Learn about your city: top meetups, top tweets, top news, top images, key data
(census), wikidata (https://www.wikidata.org/wiki/Q1509), // elevation, top
attractions, distance from nearest large city etc.

## dataexplorer

* make graph resizable based on window resize
* add national averages as vertical and horizontal lines add floating labels for
  outlier metros
* FIXME: place circles in a way that small is over large (for being able to
  hover). sort metros by circle variable before rendering
