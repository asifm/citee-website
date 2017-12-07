<template lang="pug">

  v-container(fluid).pa-0
    v-card.pa-0.orange.opacity-8
      v-layout(row wrap)
        v-flex(lg3 xs6).pa-3
          v-btn.lime X Axis
          v-select(
            autocomplete
            dense
            :items="varsArr"
            v-model="xVar"
            item-value="name"
            item-text="text"
            @select="renderScatter()"
            ).text--white

        v-flex(lg3 xs6).pa-3
          v-btn.lime Y Axis
          v-select(
                autocomplete
                dense
                :items="varsArr"
                v-model="yVar"
                item-value="name"
                item-text="text"
                @select="renderScatter()"
                )
      
        v-flex(lg3 xs6).pa-3
          v-btn.lime Radius
          v-select(
                autocomplete
                dense
                :items="varsArr"
                v-model="radiusVar"
                item-value="name"
                item-text="text"
                @select="renderScatter()"
                )
      
        v-flex(lg3 xs6).pa-3
          v-btn.lime Color
          v-select(
                autocomplete
                dense
                :items="varsArr"
                v-model="colorVar"
                item-value="name"
                item-text="text"
                @select="renderScatter()"
                )
        
  
    v-layout(row wrap).pa-0
      v-flex(lg7 md12).pa-0
        v-card.pa-2.card--raised.elevation-24.indigo.darken-4
          svg#svg-scatter
            //- TODO: apply the filter to circles and lines only. not on text
            //- create a separate svg element for this purpose
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
            :headers="headers"
            :items="pData")
      
          template(slot="items" slot-scope="props")
            td {{ props.item.cbsaname15 }}
            td(class="text-xs-right") {{ props.item[xVar] }}
            td(class="text-xs-right") {{ props.item[yVar] }}
            td(class="text-xs-right") {{ props.item[radiusVar] }}
            td(class="text-xs-right") {{ props.item[colorVar] }}
        
    
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
  createZoomBrush,
} from '../../assets/js/dataExplorer';

const varsArr = metaDataArr.filter(elem => elem.include);

export default {
  data() {
    return {
      headers: [],

      // TODO: Combine all similar attributs into an object for
      // easy passing of data
      svgScatterContainer: '#svg-scatter',
      svgScatter: null,
      circlesG: null,
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
    },

    renderScatter() {
      // First remove everything before rendering
      this.svgScatter.selectAll('*').remove();

      // Keep only data where all values for the selected variables are positive.
      // Otherwise logscales won't work. Find a solution.
      this.pData = this.pData.filter(
        d =>
          d[this.xVar] > 0 &&
          d[this.yVar] > 0 &&
          d[this.radiusVar] > 0 &&
          d[this.colorVar] > 0 &&
          d[this.mapRadiusVar] > 0
      );
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
      this.headers = [
        {
          text: 'Metro',
          align: 'left',
          sortable: false,
          value: 'cbsaname15',
        },
        { text: this.xVarText, value: this.xVar },
        { text: this.yVarText, value: this.yVar },
        { text: this.radiusVarText, value: this.radiusVar },
        { text: this.colorVarText, value: this.colorVar },
      ];
    },
    renderMap() {
      drawMap();
      drawMapCircles();
    },
  },
  watch: {
    xVar() {
      this.xVarText = this.varsArr.filter(
        elem => elem.name === this.xVar
      )[0].text;
      this.xFormat = this.varsArr.filter(
        elem => elem.name === this.xVar
      )[0].format;
    },
    yVar() {
      this.yVarText = this.varsArr.filter(
        elem => elem.name === this.yVar
      )[0].text;
      this.yFormat = this.varsArr.filter(
        elem => elem.name === this.yVar
      )[0].format;
    },
    radiusVar() {
      this.radiusVarText = this.varsArr.filter(
        elem => elem.name === this.radiusVar
      )[0].text;
      this.radiusFormat = this.varsArr.filter(
        elem => elem.name === this.radiusVar
      )[0].format;
    },
    colorVar() {
      this.colorVarText = this.varsArr.filter(
        elem => elem.name === this.colorVar
      )[0].text;
      this.colorFormat = this.varsArr.filter(
        elem => elem.name === this.colorVar
      )[0].format;
    },
    mapRadiusVar() {
      this.mapRadiusVarText = this.varsArr.filter(
        elem => elem.name === this.mapRadiusVar
      )[0].text;
      this.mapRadiusFormat = this.varsArr.filter(
        elem => elem.name === this.mapRadiusVar
      )[0].format;
    },
  },
  mounted() {
    getParsedData(this.filepath).then(data => {
      this.pData = data.map(elem => processData(elem));
      this.metrosArr = this.pData.map(elem => elem.cbsaname15);
      this.statesArr = this.pData.map(elem => elem.state_name);
      this.renderSetup();
      this.renderScatter();
      createZoomBrush();
    });
  },
};
</script>

<style lang="scss" scoped>

</style>
