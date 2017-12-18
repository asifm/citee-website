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

      v-flex(lg12 md12).pa-0
        v-card.pa-3.card--raised.elevation-1
          v-layout
            v-flex(lg6)
              div#scatter.elevation-10
                defs
                  filter#dropshadow
                    feGaussianBlur(in="SourceAlpha" stdDeviation="10")
                    feOffset(dx="0", dy="0")
                    feMerge
                      feMergeNode
                      feMergeNode(in="SourceGraphic")
            
            v-flex(lg6)
              div#map
                no-ssr
                  google-map
            
              v-card.pa-5
                p Tempor qui Lorem ipsum Lorem ut labore. Irure fugiat commodo duis quis aute officia sit amet ea commodo. Exercitation mollit culpa sint cupidatat consectetur ea excepteur laboris cupidatat ullamco.
    v-layout
      v-flex(lg12).pa-4
        v-data-table(
            must-sort
            rows-per-page-text="Select number of metros to show"
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
import { getLatLonsForMap } from "../../assets/js/svgHelpers/getLatLonsForMap";
import  googleMap  from "../../components/GoogleMap.vue";

/* +++++++++ import ends +++++++++ */

// Choose only the vars marked with 'include'
const varsMetaArr = varsMetaAllArr.filter(elem => elem.include);

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
  xScaleRange: [0, plotwidth],
  yScale: Function,
  yScaleType: 'log',
  yScaleRange: [plotheight, 0],
  radiusScaleType: 'sqrt',
  radiusScaleRange: [2, 20],
  colorScaleType: 'log',
  colorScaleRange: ['#FFD500', '#007AFF'],

  xAxis: Function,
  yAxis: Function,
};
/* +++++++++ Parameters end +++++++++ */

export default {
  components: {'google-map': googleMap},
  data() {
    return {
      tableHeaders: [],

      // similar to scatter params, contain map params in an object
      mapParams: {},

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

      // // Arr of variable names
      // varsNamesArr: varsMetaArr.map(elem => elem.name),
      // // Text representation of variable names; what users see
      // varsTextArr: varsMetaArr.map(elem => elem.text)
    };
  },
  methods: {
    renderSetup() {
      [scatterParams.svg, scatterParams.svgG] = drawSvg(scatterParams);
    },
    renderScatter() {
      // Remove all elements from parent svgG
      scatterParams.svgG.selectAll('*').remove();

      [this.dataToGraph, this.dataToNotGraph] = separatePosNeg(
        this.allData,
        this.currentVars,
      );
      [
        scatterParams.xScale,
        scatterParams.yScale,
        scatterParams.radiusScale,
        scatterParams.colorScale,
      ] = createScales(scatterParams, this.dataToGraph, this.currentVars);

      drawAxes(
        scatterParams,
        this.varsMetaArr,
        this.currentVars,
      );

      setTicks( scatterParams );

      drawGridlines(scatterParams);

      // Sorts in-place; smaller circles will be on top of bigger
      this.dataToGraph.sort((a, b) => b[this.currentVars.radius] - a[this.currentVars.radius],);

      const brushGenerator = createBrush(scatterParams);

      scatterParams.circles = drawCircles(
        scatterParams,
        this.dataToGraph,
        this.currentVars,
      );

      scatterParams.latLonsForMap = getLatLonsForMap(brushGenerator, scatterParams, console.log)


      createTooltips(
        scatterParams.circles,
        this.currentVars,
        this.varsMetaArr,
        scatterParams,
      );
    },
  },
  mounted() {
    const filepath = '/data/data_explorer_12_6_17.csv';
    parseData(filepath).get((data) => {
      this.allData = numberify(data, varsMetaArr);

      this.metrosArr = this.allData.map(elem => elem.cbsaname15);
      this.statesArr = this.allData.map(elem => elem.state_name);

      // Run renderSetup this first time only, on mount
      this.renderSetup();
      // Run renderScatter and renderMap on mount and
      // then every time a relevant change happens
      this.renderScatter();
      // this.renderMap();
    });
  },
};
</script>

<style lang="scss" scoped>

</style>


