<template lang="pug">
v-container(fluid)
  v-toolbar.secondary(dark)
    v-toolbar-title 
      h4 Metro Data Explorer

  //- top row for controls; alternatively, controls on the side of the scatter plot in a single column
  v-layout(row wrap).pa-3
    v-flex(lg7 md12).pa-3
      v-card.pa-2.card--raised.elevation-10
        svg#svg-scatter
          
   
    v-flex(lg3 md6).pa-3
      v-layout(row wrap)
        v-flex(lg12)
          //- select x and y variables
          v-card.pa-4.grey.lighten-4.card--raised
            v-chip(label).bigchip.amber.lighten-3.elevation-1 X Axis
            v-select(
              autocomplete
              dense
              :items="varsArr"
              v-model="xVar"
              item-value="name"
              item-text="text"
              @select="renderScatter()"
              ).mb-3

            v-chip(label).bigchip.orange.lighten-3.elevation-1 Y Axis
            v-select(
              autocomplete
              dense
              :items="varsArr"
              v-model="yVar"
              item-value="name"
              item-text="text"
              @select="renderScatter()"
              ).mb-3

            v-chip(label).bigchip.lime.lighten-3.elevation-1 Circle Radius
            v-select(
              autocomplete
              dense
              :items="varsArr"
              v-model="radiusVar"
              item-value="name"
              item-text="text"
              @select="renderScatter()"
              ).mb-3

            v-chip(label).bigchip.yellow.lighten-3.elevation-1 Circle Color
            span.caption &nbsp; yellow → low | blue → high
            v-select(
              autocomplete
              dense
              :items="varsArr"
              v-model="colorVar"
              item-value="name"
              item-text="text"
              @select="renderScatter()"
              ).mb-3

            //- TODO map
            //- v-chip(label).bigchip.red.lighten-2.elevation-3 Circle Radius on Map
            //- v-select(
            //-   autocomplete
            //-   dense
            //-   :items="varsArr"
            //-   v-model="mapRadiusVar"
            //-   item-value="name"
            //-   item-text="text"
            //-   @select="renderScatter()"
            //-   )
              
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
    v-flex(lg6)
    //- top and bottom metros
    v-flex(lg6)
      v-layout
        //- top 5
        v-flex(lg6)
        //- bottom 5
        v-flex(lg6)

</template>

<script>
// import * as d3 from 'd3';
// import * as axios from 'axios';
import {
  getParsedData,
  processData,
  metaDataArr,
  drawSvgScatter,
  createScales,
  drawAxes,
  drawCircles,
  drawMap,
  drawMapCircles,
  createTooltips,
  createDetailData,
} from '../../assets/js/dataExplorer';

const varsArr = metaDataArr.filter(elem => elem.include);

export default {
  data() {
    return {
      // TODO: Combine all similar attributs into an object for
      // easy passing of data
      svgScatterContainer: '#svg-scatter',
      svgScatter: null,
      width: 800,
      height: 800,
      margin: {
        top: 20,
        right: 20,
        bottom: 120,
        left: 120,
      },
      xScaleType: 'xlog',
      yScaleType: 'ylog',
      xScale: Function,
      yScale: Function,
      radiusScale: Function,
      colorScale: Function,
      mapRadiusScale: Function,
      xAxis: Function,
      yAxis: Function,
      filepath: '/data/data_explorer_12_6_17.csv',
      // pData => parsed and processed data
      pData: [],
      xVar: varsArr.filter(elem => elem.default === 'xAxis')[0].name,
      yVar: varsArr.filter(elem => elem.default === 'yAxis')[0].name,
      colorVar: varsArr.filter(elem => elem.default === 'color')[0].name,
      radiusVar: varsArr.filter(elem => elem.default === 'radius')[0].name,
      mapRadiusVar: varsArr.filter(elem => elem.default === 'mapRadius')[0]
        .name,
      xVarText: varsArr.filter(elem => elem.default === 'xAxis')[0].text,
      yVarText: varsArr.filter(elem => elem.default === 'yAxis')[0].text,
      colorVarText: varsArr.filter(elem => elem.default === 'color')[0].text,
      radiusVarText: varsArr.filter(elem => elem.default === 'radius')[0].text,
      mapRadiusVarText: varsArr.filter(elem => elem.default === 'mapRadius')[0]
        .text,
      xFormat: varsArr.filter(elem => elem.default === 'xAxis')[0].format,
      yFormat: varsArr.filter(elem => elem.default === 'yAxis')[0].format,
      colorFormat: varsArr.filter(elem => elem.default === 'color')[0].format,
      radiusFormat: varsArr.filter(elem => elem.default === 'radius')[0].format,
      mapRadiusFormat: varsArr.filter(elem => elem.default === 'mapRadius')[0]
        .format,
      selectedMetrosArr: [],
      selectedStatesArr: [],
      varsArr,
      varsNamesArr: varsArr.map(elem => elem.name),
      varsTextArr: varsArr.map(elem => elem.text),
      metrosArr: [],
      statesArr: [],
    };
  },
  methods: {
    renderSetup() {
      // select all metros and states on mount for display
      // TODO: figure out a way to select all without showing more than 3 or 5;
      // for now, not allowing multiple selection
      // this.selectedMetrosArr = this.metrosArr;
      // this.selectedStatesArr = this.statesArr; // it may not be necessary on mount
      this.svgScatter = drawSvgScatter(
        this.svgScatterContainer,
        this.width,
        this.height,
        this.margin
      );

      createTooltips();
      createDetailData();
    },

    renderScatter() {
      // First remove everything before rendering
      this.svgScatter.selectAll('*').remove();

      // Keep only data where all values for the selected variables are positive.
      // Otherwise logscales won't work. Find a solution.
      this.pData = this.pData.filter(d =>
          d[this.xVar] > 0 &&
          d[this.yVar] > 0 &&
          d[this.radiusVar] > 0 &&
          d[this.colorVar] > 0 &&
          d[this.mapRadiusVar] > 0);
      [
        this.xScale,
        this.yScale,
        this.radiusScale,
        this.colorScale,
      ] = createScales(
        this.width,
        this.height,
        this.pData,
        this.xVar,
        this.yVar,
        this.radiusVar,
        this.colorVar
      );

      // function drawAxes(svg, width, height, margin, xVar, yVar, xScale, yScale, varsArr) {
      [this.xAxis, this.yAxis] = drawAxes(
        this.svgScatter,
        this.width,
        this.height,
        this.margin,
        this.xVarText,
        this.yVarText,
        this.xScale,
        this.yScale
      );

      drawCircles(
        this.svgScatter,
        this.pData,
        this.xVar,
        this.yVar,
        this.radiusVar,
        this.colorVar,
        this.mapRadiusVar,
        this.xScale,
        this.yScale,
        this.radiusScale,
        this.colorScale,
        this.mapRadiusScale,
        this.xVarText,
        this.yVarText,
        this.radiusVarText,
        this.colorVarText,
        this.mapRadiusVarText,
        this.xFormat,
        this.yFormat,
        this.radiusFormat,
        this.colorFormat,
        this.mapRadiusFormat
      );
    },
    renderMap() {
      drawMap();
      drawMapCircles();
    },
  },
  watch: {
    xVar() {
      this.xVarText = this.varsArr.filter(elem => elem.name === this.xVar)[0].text;
      this.xFormat = this.varsArr.filter(elem => elem.name === this.xVar)[0].format;
    },
    yVar() {
      this.yVarText = this.varsArr.filter(elem => elem.name === this.yVar)[0].text;
      this.yFormat = this.varsArr.filter(elem => elem.name === this.yVar)[0].format;
    },
    radiusVar() {
      this.radiusVarText = this.varsArr.filter(elem => elem.name === this.radiusVar)[0].text;
      this.radiusFormat = this.varsArr.filter(elem => elem.name === this.radiusVar)[0].format;
    },
    colorVar() {
      this.colorVarText = this.varsArr.filter(elem => elem.name === this.colorVar)[0].text;
      this.colorFormat = this.varsArr.filter(elem => elem.name === this.colorVar)[0].format;
    },
    mapRadiusVar() {
      this.mapRadiusVarText = this.varsArr.filter(elem => elem.name === this.mapRadiusVar)[0].text;
      this.mapRadiusFormat = this.varsArr.filter(elem => elem.name === this.mapRadiusVar)[0].format;
    },
  },
  mounted() {
    getParsedData(this.filepath).then((data) => {
      this.pData = data.map(elem => processData(elem));
      console.log('from mounted', this.pData);
      this.metrosArr = this.pData.map(elem => elem.cbsaname15);
      this.statesArr = this.pData.map(elem => elem.state_name);
      this.renderSetup();
      this.renderScatter();
    });
  },
};
</script>

<style lang="scss" scoped>
.bigchip {
  font-size: 1.1em;
  // font-weight: bold;
}
</style>
