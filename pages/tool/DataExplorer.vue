<template lang="pug">

  v-container(fluid).pa-0
    v-card.pa-0.orange.opacity-8
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
        

    v-layout(row wrap).pa-0
      v-flex(lg7 md12).pa-0
        v-card.pa-2.card--raised.elevation-10
          div#scatter
            //- TODO: apply the filter to circles and lines only. not on text
            //- create a separate svg element for this purpose
            defs
              filter#dropshadow
                feGaussianBlur(in="SourceAlpha" stdDeviation="10")
                feOffset(dx="0", dy="0")
                feMerge
                  feMergeNode
                  feMergeNode(in="SourceGraphic")
      
      
                
          //- v-flex(lg12)
            v-card.pa-4.card--raised
              //- use log scale
              //- TODO population range selection
              //- v-slider(label="Metro population range")

              v-select(
                label="Select metro"
                autocomplete
                clearable
                chips
                dense
                :items="metrosArr"
                v-model="selectedMetrosArr"
                )
              v-select(
                label="Select state"
                autocomplete
                clearable
                chips
                dense
                :items="statesArr"
                v-model="selectedStatesArr"
                )
    

    v-layout
      //- map
      v-flex(lg12).pa-4
        v-data-table(
            must-sort
            :rows-per-page-items=[10, 20, 50, {text: "All", value: -1}]
            rows-per-page-text="Select number of metros to show"
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
// import * as _ from 'lodash';

import { parseData } from '../../assets/js/dataHelpers/parseData';
import { numberify } from '../../assets/js/dataHelpers/numberify';
// This contains meta data about vars to use for chart parameters
import { varsMetaAllArr } from '../../assets/js/dataHelpers/dataExplorerMetaData';

import { drawSvg } from '../../assets/js/svgHelpers/drawSvg';
import { createScales } from '../../assets/js/svgHelpers/createScales';
import { setTicks } from '../../assets/js/svgHelpers/setTicks';
import { drawAxes } from '../../assets/js/svgHelpers/drawAxes';
import { drawGridlines } from '../../assets/js/svgHelpers/drawGridlines';
import { drawCircles } from '../../assets/js/svgHelpers/drawCircles';
import { createTooltips } from '../../assets/js/svgHelpers/createTooltips';
import { separatePosNeg } from '../../assets/js/dataHelpers/separatePosNeg';
/* +++++++++ import ends +++++++++ */

// Choose only the vars marked with 'include'
const varsMetaArr = varsMetaAllArr.filter(elem => elem.include);

const defaultVars = {
  x: 'income_above_poverty_line',
  y: 'bachelors_degree_or_higher',
  radius: 'patents_count',
  color: 'per_capita_income'
};

/* **************************
  section: Options/parameters
  for which reactivity is not needed
************************** */

const width = 700;
const height = 700;
// All params related to scatter chart
const scatterParams = {
  svg: null,
  svgG: null,
  svgGFilter: null,
  containerId: '#scatter',
  width,
  height,
  margin: {
    top: 10,
    right: 10,
    bottom: 100,
    left: 100
  },

  xScaleType: 'log',
  xScaleRange: [25, width - 25],
  yScaleType: 'log',
  yScaleRange: [height - 25, 25],
  radiusScaleType: 'log',
  radiusScaleRange: [3, 20],
  colorScaleType: 'log',
  colorScaleRange: ['#FFD500', '#007AFF'],

  xAxis: Function,
  yAxis: Function
};
/* +++++++++ Parameters end +++++++++ */

export default {
  data() {
    return {
      tableHeaders: [],

      // similar to scatter params, contain map params in an object
      mapParams: {},

      // vars that are included in this viz;
      // marked by 'include' in main (here imported) file
      varsMetaArr,

      // currently selected variable names; inited with defaults
      currentVars: {
        x: defaultVars['x'],
        y: defaultVars['y'],
        radius: defaultVars['radius'],
        color: defaultVars['color']
      },

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
      selectedStatesArr: []

      // // Arr of variable names
      // varsNamesArr: varsMetaArr.map(elem => elem.name),
      // // Text representation of variable names; what users see
      // varsTextArr: varsMetaArr.map(elem => elem.text)
    };
  },
  methods: {
    renderSetup() {
      [
        scatterParams.svg,
        scatterParams.svgG,
        scatterParams.svgSvgFilter
      ] = drawSvg(scatterParams);
    },
    renderScatter() {
      // Remove all elements from parent svgG
      scatterParams.svgG.selectAll('*').remove();

      [this.dataToGraph, this.dataToNotGraph] = separatePosNeg(
        this.allData,
        this.currentVars
      );
      [
        scatterParams.xScale,
        scatterParams.yScale,
        scatterParams.radiusScale,
        scatterParams.colorScale
      ] = createScales(scatterParams, this.dataToGraph, this.currentVars);

      [scatterParams.xAxis, scatterParams.yAxis] = drawAxes(
        scatterParams.svgG,
        scatterParams,
        this.varsMetaArr,
        this.currentVars
      );

      setTicks(
        scatterParams.xScale,
        scatterParams.yScale,
        scatterParams.xAxis,
        scatterParams.yAxis
      );

      drawGridlines(scatterParams);

      const circles = drawCircles(
        scatterParams,
        this.dataToGraph,
        this.currentVars
      );
    }
  },
  mounted() {
    const filepath = '/data/data_explorer_12_6_17.csv';
    parseData(filepath).get(data => {
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
  }
};
</script>

<style lang="scss" scoped>

</style>


// // For code that'll run only once, at the beginning (on mount)
    // renderSetup() {
    /* select all metros and states on mount for display
    TODO: figure out a way to select all
    without showing more than 3 or 5;
    for now, not allowing multiple selection */
    //   // TODO: change name of drawSvgScatter function
    //   this.svgElement = drawSvgElement(
    //     this.svgElementContainer,
    //     this.width,
    //     this.height,
    //     this.margin
    //   );
    //   createTooltips();
    // },
    // // Will run every time a new variable is selected, or
    // // a parameter for the graph changes (such as scale type)
    // renderScatter() {
    //   // First remove everything before rendering
    //   this.svgElement.selectAll('*').remove();
    //   // Keep only data where all values for
    //   // the selected variables are positive.
    //   // TODO: logscales don't work for negative or zero. Find a solution.
    //   this.currentData = this.allData.filter(
    //     d =>
    //       d[this.xVar] > 0 &&
    //       d[this.yVar] > 0 &&
    //       d[this.radiusVar] > 0 &&
    //       d[this.colorVar] > 0 &&
    //       d[this.mapRadiusVar] > 0
    //   );
    //   this.dataToNotGraph = this.allData.filter(
    //     d =>
    //       d[this.xVar] <= 0 &&
    //       d[this.yVar] <= 0 &&
    //       d[this.radiusVar] <= 0 &&
    //       d[this.colorVar] <= 0 &&
    //       d[this.mapRadiusVar] <= 0
    //   );
    //   [
    //     this.xScale,
    //     this.yScale,
    //     this.radiusScale,
    //     this.colorScale,
    //   ] = createScales(
    //     this.width,
    //     this.height,
    //     this.pData,
    //     this.xVar,
    //     this.yVar,
    //     this.radiusVar,
    //     this.colorVar
    //   );
    //   [this.xAxis, this.yAxis] = drawAxes(
    //     this.svgElement,
    //     this.width,
    //     this.height,
    //     this.margin,
    //     this.xVarText,
    //     this.yVarText,
    //     this.xScale,
    //     this.yScale
    //   );
    //   drawCircles(
    //     this.svgElement,
    //     this.pData,
    //     this.xVar,
    //     this.yVar,
    //     this.radiusVar,
    //     this.colorVar,
    //     this.mapRadiusVar,
    //     this.xScale,
    //     this.yScale,
    //     this.radiusScale,
    //     this.colorScale,
    //     this.mapRadiusScale,
    //     this.xVarText,
    //     this.yVarText,
    //     this.radiusVarText,
    //     this.colorVarText,
    //     this.mapRadiusVarText,
    //     this.xFormat,
    //     this.yFormat,
    //     this.radiusFormat,
    //     this.colorFormat,
    //     this.mapRadiusFormat
    //   );
    //   this.tableHeaders = [
    //     {
    //       text: 'Metro',
    //       align: 'left',
    //       sortable: false,
    //       value: 'cbsaname15',
    //     },
    //     { text: this.xVarText, value: this.xVar },
    //     { text: this.yVarText, value: this.yVar },
    //     { text: this.radiusVarText, value: this.radiusVar },
    //     { text: this.colorVarText, value: this.colorVar },
    //   ];
    // },
    // renderMap() {
    //   drawMap();
    //   drawMapCircles();
    // },
  },
  watch: {
    // xVar() {
    //   this.xVarText = this.varsMetaArr.filter(
    //     elem => elem.name === this.xVar
    //   )[0].text;
    //   this.xFormat = this.varsMetaArr.filter(
    //     elem => elem.name === this.xVar
    //   )[0].format;
    // },
    // yVar() {
    //   this.yVarText = this.varsMetaArr.filter(
    //     elem => elem.name === this.yVar
    //   )[0].text;
    //   this.yFormat = this.varsMetaArr.filter(
    //     elem => elem.name === this.yVar
    //   )[0].format;
    // },
    // radiusVar() {
    //   this.radiusVarText = this.varsMetaArr.filter(
    //     elem => elem.name === this.radiusVar
    //   )[0].text;
    //   this.radiusFormat = this.varsMetaArr.filter(
    //     elem => elem.name === this.radiusVar
    //   )[0].format;
    // },
    // colorVar() {
    //   this.colorVarText = this.varsMetaArr.filter(
    //     elem => elem.name === this.colorVar
    //   )[0].text;
    //   this.colorFormat = this.varsMetaArr.filter(
    //     elem => elem.name === this.colorVar
    //   )[0].format;
    // },
    // mapRadiusVar() {
    //   this.mapRadiusVarText = this.varsMetaArr.filter(
    //     elem => elem.name === this.mapRadiusVar
    //   )[0].text;
    //   this.mapRadiusFormat = this.varsMetaArr.filter(
    //     elem => elem.name === this.mapRadiusVar
    //   )[0].format;
    // },
