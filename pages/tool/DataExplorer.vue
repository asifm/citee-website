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
import { separatePosNeg } from '../../assets/js/dataHelpers/separatePosNeg';

import { drawSvg } from '../../assets/js/svgHelpers/drawSvg';
import { createScales } from '../../assets/js/svgHelpers/createScales';
import { setTicks } from '../../assets/js/svgHelpers/setTicks';
import { drawAxes } from '../../assets/js/svgHelpers/drawAxes';
import { drawGridlines } from '../../assets/js/svgHelpers/drawGridlines';
import { drawCircles } from '../../assets/js/svgHelpers/drawCircles';
import { createTooltips } from '../../assets/js/svgHelpers/createTooltips';
import { createBrush } from '../../assets/js/svgHelpers/createBrush';
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

// Separately declared as need to refer
// from within scatterParams object
const width = 700;
const height = 700;

// All params related to scatter chart
const scatterParams = {
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
  radiusScaleType: 'sqrt',
  radiusScaleRange: [4, 15],
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

      // currently selected variable names; inited with defaults
      currentVars: {
        x: defaultVars['x'],
        y: defaultVars['y'],
        radius: defaultVars['radius'],
        color: defaultVars['color']
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
      selectedStatesArr: []

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

      // TODO: sort data before drawing circles: big to small
      const circles = drawCircles(
        scatterParams,
        this.dataToGraph,
        this.currentVars
      );
      createTooltips(circles, this.currentVars, this.varsMetaArr);
      createBrush(scatterParams);
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
  },
  filters: {
    shortenMetroName(metroName) {
      return metroName.substr(0, metroName.length - 11);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>


