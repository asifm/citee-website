<template lang="pug">

  v-container(fluid).pa-0.pt-1
    v-layout(row wrap)
      v-flex(lg12)
        v-toolbar(dark).secondary.elevation-5
          h4.display-1 Metro Explorer
        v-card.pa-0.grey.lighten-4
          v-layout(row wrap)
            v-flex(lg3 xs6).pa-3
              v-btn.lime X Axis
              v-select(
                autocomplete
                dense
                :items="varsMetaArr"
                v-model="currentVars.x"
                item-value="name"
                item-text="text"
                @select="renderScatter()"
                ).text--white

            v-flex(lg3 xs6).pa-3
              v-btn.lime Y Axis
              v-select(
                    autocomplete
                    dense
                    :items="varsMetaArr"
                    v-model="currentVars.y"
                    item-value="name"
                    item-text="text"
                    @select="renderScatter()"
                    )

            v-flex(lg3 xs6).pa-3
              v-btn.lime Radius
              v-select(
                    autocomplete
                    dense
                    :items="varsMetaArr"
                    v-model="currentVars.radius"
                    item-value="name"
                    item-text="text"
                    @select="renderScatter()"
                    )

            v-flex(lg3 xs6).pa-3
              v-btn.lime Color
              v-select(
                    autocomplete
                    dense
                    :items="varsMetaArr"
                    v-model="currentVars.color"
                    item-value="name"
                    item-text="text"
                    @select="renderScatter()"
                    )
      v-layout
        v-flex(lg12 md12).pa-0
          v-card.pa-3.card--raised.elevation-10
            v-layout
              v-flex(lg6).pa-5
                div#scatter.elevation-3
                  defs
                    filter#dropshadow
                      feGaussianBlur(in="SourceAlpha" stdDeviation="10")
                      feOffset(dx="0", dy="0")
                      feMerge
                        feMergeNode
                        feMergeNode(in="SourceGraphic")

              v-flex(lg6).pa-5
                div#map.elevation-7
                  no-ssr
                    google-map(
                      :markers-val="markers"
                      :center-val="center"
                      :zoom-val="zoom"
                      )
                v-layout(row wrap)
                  v-flex(lg12)
                    //- use log scale
                    //- TODO population range selection
                    v-slider(label="Metro population range").mt-4
                    v-layout(row wrap)
                      v-flex(lg6).pa-2
                        v-select(
                        label="Select metro"
                        autocomplete
                        clearable
                        chips
                        dense
                        multiple
                        max-height="300px"
                        ref="metroSelector"
                        v-model="selectedMetrosArr"
                        :items="metrosArr"
                        )
                      v-flex(lg6).pa-2
                        v-select(
                        label="Select state"
                        autocomplete
                        clearable
                        chips
                        dense
                        multiple
                        ref="stateSelector"
                        v-model="selectedStatesArr"
                        :items="statesArr"
                        )

      v-layout
        v-flex(lg12).pa-4
          v-data-table(
            must-sort
            rows-per-page-text="Select number of metros tow"
            :rows-per-page-items=[10, 20, 50, {text: "All", value: -1}]
            :headers="tableHeaders"
            :items="allData")

            template(slot="items" slot-scope="props")
              td {{ props.item.cbsaname15 }}
              td(class="text-xs-right") {{ props.item[currentVars.x] }}
              td(class="text-xs-right") {{ props.item[currentVars.y] }}
              td(class="text-xs-right") {{ props.item[currentVars.radius] }}
              td(class="text-xs-right") {{ props.item[currentVars.color] }}

</template>

<script>
/* **************************
  section: Imports
************************** */

import { parseData } from '../../assets/js/dataHelpers/parseData';
import { numberify } from '../../assets/js/dataHelpers/numberify';
import { varsMetaAllArr } from '../../assets/js/dataHelpers/dataExplorerMetaData';
import { separatePosNeg } from '../../assets/js/dataHelpers/separatePosNeg';
import * as miscFunc from '../../assets/js/dataHelpers/miscHelpers';

import { drawSvg } from '../../assets/js/svgHelpers/drawSvg';
import { createScales } from '../../assets/js/svgHelpers/createScales';
import { setTicks } from '../../assets/js/svgHelpers/setTicks';
import { drawAxes } from '../../assets/js/svgHelpers/drawAxes';
import { drawGridlines } from '../../assets/js/svgHelpers/drawGridlines';
import { drawCircles } from '../../assets/js/svgHelpers/drawCircles';
import { createTooltips } from '../../assets/js/svgHelpers/createTooltips';
import { createBrush } from '../../assets/js/svgHelpers/createBrush';
import { getLatLonsForMap } from '../../assets/js/svgHelpers/getLatLonsForMap';
import googleMap from '../../components/GoogleMap.vue';

/* +++++++++ import ends +++++++++ */

// Choose only the vars marked with 'include'
const varsMetaArr = varsMetaAllArr.filter( elem => elem.include );

const defaultVars = {
    x: 'income_above_poverty_line',
    y: 'bachelors_degree_or_higher',
    radius: 'patents_count',
    color: 'per_capita_income',
};

/* **************************
  section: Options/parameters
  for which reactivity is not needed
************************** */

// Separately declared as need to refer
// from within scatterParams object
const width = 750;
const height = 750;
const margin = {
    top: 40,
    right: 40,
    bottom: 120,
    left: 120,
};
const plotwidth = width - margin.left - margin.right;
const plotheight = height - margin.top - margin.bottom;

// All params related to scatter chart
const scatterParams = {
    containerId: '#scatter',
    width,
    height,
    margin,
    plotwidth,
    plotheight,
    xScale: Function,
    xScaleType: 'log',
    xScaleRange: [ 0, plotwidth ],
    yScale: Function,
    yScaleType: 'log',
    yScaleRange: [ plotheight, 0 ],
    radiusScaleType: 'sqrt',
    radiusScaleRange: [ 2, 20 ],
    colorScaleType: 'log',
    colorScaleRange: [ '#FFD500', '#007AFF' ],

    xAxis: Function,
    yAxis: Function,
};
/* +++++++++ Parameters end +++++++++ */

export default {
    components: { 'google-map': googleMap },
    data() {
        return {
            markers: [],
            center: {
                lat: 39.5,
                lng: -98.35,
            },
            zoom: 4,
            tableHeaders: [],
            // currently selected variable names; inited with defaults
            currentVars: {
                x: defaultVars.x,
                y: defaultVars.y,
                radius: defaultVars.radius,
                color: defaultVars.color,
            },
            varsMetaArr,
            // allData => parsed and processed data without any filtering
            // but only for the "include"-marked variables
            allData: [],
            // current data with filtering if any before showing;
            dataToGraph: [],
            // Data not graphed, of current vars
            dataToNotGraph: [],
            metrosArr: [],
            statesArr: [],
            selectedMetrosArr: [],
            selectedStatesArr: [],
        };
    },
    mounted() {
        this.tableHeaders = [
            {
                text: 'Metro Area',
                value: 'MetroArea',
                align: 'left',
            },
            {
                text: this.varsMetaArr.filter( elem =>
                    elem.name === this.currentVars.x )[ 0 ].text,
                value: this.currentVars.x,
                align: 'right',
            },
            {
                text: this.varsMetaArr.filter( elem =>
                    elem.name === this.currentVars.y )[ 0 ].text,
                value: this.currentVars.y,
                align: 'right',
            },
            {
                text: this.varsMetaArr.filter( elem =>
                    elem.name === this.currentVars.radius )[ 0 ].text,
                value: this.currentVars.radius,
                align: 'right',
            },
            {
                text: this.varsMetaArr.filter( elem =>
                    elem.name === this.currentVars.color )[ 0 ].text,
                value: this.currentVars.color,
                align: 'right',
            },
        ];
        const filepath = '/data/data_explorer_12_6_17.csv';
        parseData( filepath ).get( data => {
            this.allData = numberify( data, varsMetaArr );
            this.allData.forEach( elem =>
                ( elem.cbsaname15 =
                miscFunc.shortenMetroName( elem.cbsaname15 ) ) );
            // Run renderSetup this first time only, on mount
            this.renderSetup();
            // Run renderScatter and renderMap on mount and
            // then every time a relevant change happens
            this.renderScatter();
            // this.renderMap();
        } );
    },
    methods: {
        renderSetup() {
            [ scatterParams.svg, scatterParams.svgG ] =
            drawSvg( scatterParams );
        },
        renderScatter() {
            console.log( 'inside render scatter' );
            console.log( this.$refs.metroSelector.$el );

            // Remove all elements from parent svgG
            scatterParams.svgG.selectAll( '*' ).remove();

            [ this.dataToGraph, this.dataToNotGraph ] =
                separatePosNeg( this.allData, this.currentVars );
            [
                scatterParams.xScale,
                scatterParams.yScale,
                scatterParams.radiusScale,
                scatterParams.colorScale,
            ] = createScales(
                scatterParams, this.dataToGraph,
                this.currentVars
            );

            this.metrosArr = this.dataToGraph.map( elem => elem.cbsaname15 );
            this.statesArr = this.dataToGraph.map( elem => elem.state_name );

            // this.selectedMetrosArr = this.metrosArr;
            // this.selectedStatesArr = this.statesArr;

            drawAxes(
                scatterParams,
                this.varsMetaArr,
                this.currentVars
            );

            setTicks( scatterParams );

            drawGridlines( scatterParams );

            // Sorts in-place; smaller circles will be on top of bigger
            this.dataToGraph.sort( ( a, b ) =>
                b[ this.currentVars.radius ] - a[ this.currentVars.radius ] );

            const brushGenerator = createBrush( scatterParams );

            scatterParams.circles = drawCircles(
                scatterParams,
                this.dataToGraph,
                this.currentVars
            );
            const vm = this;
            const goldStar = {
                path:
                    'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                fillColor: 'yellow',
                fillOpacity: 0.8,
                scale: 1,
                strokeColor: 'gold',
                strokeWeight: 14,
            };
            getLatLonsForMap(
                brushGenerator, scatterParams, latLons => {
                    vm.markers = [];
                    latLons.forEach( latLon => {
                        Object.assign( latLon, { icon: goldStar } );
                        // {path: google.maps.SymbolPath.CIRCLE, scale: 10} })
                        vm.markers.push( latLon );
                    } );
                }
            );

            createTooltips(
                scatterParams.circles, this.currentVars, this.varsMetaArr,
                scatterParams
            );
        },
    },
};
</script>

<style lang="scss" scoped>
#scatter {
    background-color: #fcfcfc;
}
</style>
