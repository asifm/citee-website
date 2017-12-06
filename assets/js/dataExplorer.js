import * as d3 from 'd3';
import * as axios from 'axios';

/**
 * Converts strings to numbers where appropriate
 *
 * @param {object} d row of data parsed from csv
 * @returns {object} a row of data with numbers as numbers, not strings
 */
function processData(d) {
  return {
    business_starts_2014_per10K: +d.business_starts_2014_per10K,
    business_exits_2014_per10K: +d.business_exits_2014_per10K,
    cagr01to15: +d.cagr01to15,
    cagr10to15: +d.cagr10to15,
    cbsa15: d.cbsa15,
    cbsaname15: d.cbsaname15,
    census_region: d.census_region,
    employed: +d.employed_count,
    fips_state: d.fips_state,
    fortune1000_count: +d.fortune1000_count,
    gini: +d.gini,
    gini_moe: +d.gini_moe,
    gmp_billion_usd: +d.gmp_billion_usd,
    gmp_per_cap_usd: +d.gmp_per_cap_usd,
    inc5000_count: +d.inc5000_count,
    jobs_created_2014_per1K: +d.jobs_created_2014_per1K,
    labor_force_count: +d.labor_force_count,
    lat: +d.lat,
    long: +d.long,
    patents_count: +d.patents_count,
    patents_count_top_class: +d.patents_count_top_class,
    patents_per10K: +d.patents_per10K,
    population14: +d.pop14,
    restaurants_count: +d.restaurants_count,
    restaurants_per10K: +d.restaurants_per10K,
    unicorns_count: +d.unicorns_count,
    unemployment_percent: +d.unemployment_percent / 100,
    unemployed_count: +d.unemployed_count,
    unicorns_per1M: +d.unicorns_per1M,
    inc5000_per1M: +d.inc5000_per1M,
    fortune1000_per1M: +d.fortune1000_per1M,
    top_patent_class_percent: +d.top_patent_class_percent,
    women_in_workforce_percent: +d.women_in_workforce_percent,
    top_patent_class: d.top_patent_class,
    state_abbr: d.state_abbr,
    state_name: d.state_name,
  };
}

/**
 * First parses CSV and then processes rows (converts to correct types)
 *
 * @param {any} filepath Path to the csv file
 * @returns {object} Data with correct types
 */
async function getParsedData(filepath) {
  const response = await axios.get(filepath);
  const parsedData = d3.csvParse(response.data);
  return parsedData;
}

function drawSvgScatter(container, width, height, margin) {
  const svg = d3
    .select(container)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('filter', 'url(#dropshadow)')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  return svg;
}

// TODO: add linear scale
// TODO: Add color scale
// TODO: Add map circle radius scale
function createScales(width, height, data, xVar, yVar, radiusVar, colorVar) {
  // TODO: negative values have been filtered out. Otherwise logscales won't work. Find a solution.
  const radiusScale = d3.scaleSqrt().range([3, 20]);
  const xScale = d3.scaleLog().range([25, width - 25]);
  const yScale = d3.scaleLog().range([height - 25, 25]);
  const colorScale = d3.scaleLog().range([d3.rgb('#FFD500'), d3.rgb('#007AFF')]);
  // const colorScale = d3.scaleLog(d3.interpolatePlasma);

  d3.scaleLinear().range(['red', 'blue']);
  // Scale based on the range of the data
  const minX = d3.min(data, d => d[xVar] || Infinity);
  const minY = d3.min(data, d => d[yVar] || Infinity);
  const minRadius = d3.min(data, d => d[radiusVar] || Infinity);
  const minColor = d3.min(data, d => d[colorVar] || Infinity);

  const maxX = d3.max(data, d => d[xVar]);
  const maxY = d3.max(data, d => d[yVar]);
  const maxRadius = d3.max(data, d => d[radiusVar]);
  const maxColor = d3.max(data, d => d[colorVar]);

  xScale.domain([minX, maxX]);
  yScale.domain([minY, maxY]);
  radiusScale.domain([minRadius, maxRadius]);
  colorScale.domain([minColor, maxColor]);

  return [xScale, yScale, radiusScale, colorScale];
}

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    Axis, ticks, texts
    Draw before drawing circles so circles are on top; makes hover experience better
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */

// To be
function setTicks(xScale, yScale, xAxis, yAxis) {
  // for sideeffect; no return
  // Set ticks format based on largest value (use current domains to get the value)
  if (xScale.domain()[1] < 100) {
    xAxis.ticks(5, '0.2f');
  } else {
    xAxis.ticks(5, '0.2s');
  }

  if (yScale.domain()[1] < 100) {
    yAxis.ticks(5, '0.2f');
  } else {
    yAxis.ticks(5, '0.2s');
  }
}

function drawAxes(svg, width, height, margin, xVarText, yVarText, xScale, yScale) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  setTicks(xScale, yScale, xAxis, yAxis);
  // Add the x Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .style('font-family', 'Open Sans')
    .style('font-size', '0.8em')
    .style('stroke-opacity', 1)
    .style('stroke-width', '3.5px');
  // .attr('class', 'axis axis--x');

  // Add the y Axis
  svg
    .append('g')
    .call(yAxis)
    .style('font-family', 'Open Sans')
    .style('font-size', '0.8em')
    .style('stroke-opacity', 1)
    .style('stroke-width', '3.5px');
  // .attr('class', 'axis axis--y');

  // text label for the x axis
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .attr('dy', '-55px')
    .style('font-size', '1.3em')
    .style('text-anchor', 'middle')
    .style('font-family', 'Open Sans')
    .text(xVarText);

  // text label for the y axis
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left)
    .attr('x', -height / 2)
    .attr('dy', '55px')
    .style('font-size', '1.3em')
    .style('text-anchor', 'middle')
    .style('font-family', 'Open Sans')
    .text(yVarText);

  // add the X gridlines
  svg
    .append('g')
    .attr('class', 'grid x')
    .style('stroke-opacity', '0.2')
    .attr('transform', `translate(0,${height})`)
    .call(d3
      .axisBottom(xScale)
      .tickSize(-height)
      .tickFormat(''));

  // add the Y gridlines
  svg
    .append('g')
    .attr('class', 'grid y')
    .style('stroke-opacity', '0.1')
    .call(d3
      .axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(''));

  return [xAxis, yAxis];
}

function drawCircles(
  svg,
  data,
  xVar,
  yVar,
  radiusVar,
  colorVar,
  mapRadiusVar,
  xScale,
  yScale,
  radiusScale,
  colorScale,
  mapRadiusScale,
  xVarText,
  yVarText,
  radiusVarText,
  colorVarText,
  mapRadiusVarText,
  xFormat,
  yFormat,
  radiusFormat,
  colorFormat,
  mapRadiusFormat
) {
  const circles = svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d[xVar]))
    .attr('cy', d => yScale(d[yVar]))
    .attr('r', d => radiusScale(d[radiusVar]))
    .attr('fill', d => colorScale(d[colorVar]))
    .attr('opacity', '0.4')
    .attr('stroke-width', '0.5')
    .attr('stroke', 'black');
  // .append('g');

  const tooltip = d3
    .select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('font-size', '14px')
    .style('padding', '10px')
    .style('line-height', '18px')
    .style('border-radius', '3px')
    .attr('class', 'tooltip-viz card elevation-24');

  circles.on('mouseover', (d) => {
    tooltip
      .html('')
      .style('visibility', 'visible')
      .html(() => `<h4>${d.cbsaname15}</h4>
                  <br><strong>${d3.format(xFormat)(d[xVar])}</strong> ${xVarText}
                  <br><strong>${d3.format(yFormat)(d[yVar])}</strong> ${yVarText}
                  <br><strong>${d3.format(radiusFormat)(d[radiusVar])}</strong> ${radiusVarText}
                  <br><strong>${d3.format(colorFormat)(d[colorVar])}</strong> ${colorVarText}
                  <br><strong>${d3.format(mapRadiusFormat)(d[mapRadiusVar])}</strong> ${
  mapRadiusVarText
}`);
  });

  circles.on('mousemove', () =>
    tooltip.style('top', `${d3.event.pageY - 52}px`).style('left', `${d3.event.pageX + 18}px`));

  circles.on('mouseout', () => tooltip.style('visibility', 'hidden'));
}

function drawMap() {}
function drawMapCircles() {}
function createTooltips() {}
function createDetailData() {}

/*
name: name of the varialbe
text: text to display to user
type: number or category, etc. (to use to convert to correct tyep when parsing)
format: format to show to user (use d3.format to do this)
include: whether to include in the scatter or not
default: default var for x axis, y axis, etc.
*/
const metaDataArr = [
  {
    name: 'cagr01to15',
    text: 'Annual Growth Rate 2001–15',
    type: 'number',
    format: ',.1%',
    include: true,
  },
  {
    name: 'cagr10to15',
    text: 'Annual Growth Rate 2010–15',
    type: 'number',
    format: ',.1%',
    include: true,
    default: 'mapRadius',
  },
  {
    name: 'business_starts_2014_per10K',
    text: 'Business starts in 2014 per 10K people',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'gmp_billion_usd',
    text: 'Gross Metropolitan Product (Bn USD)',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'gmp_per_cap_usd',
    text: 'Gross Metropolitan Product per Capita (USD)',
    type: 'number',
    format: ',.0f',
    include: false,
  },
  {
    name: 'gini',
    text: 'Inequality (Gini index)',
    type: 'number',
    format: '.2f',
    include: true,
  },
  {
    name: 'jobs_created_2014_per1K',
    text: 'Jobs created in 2014 per 1K people',
    type: 'number',
    format: ',.0f',
    include: true,
    default: 'color',
  },
  {
    name: 'fortune1000_count',
    text: 'Fortune 1000 Companies',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'fortune1000_per1M',
    text: 'Fortune 1000 per 1M people',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'inc5000_count',
    text: 'Inc 5000 Companies',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'inc5000_per1M',
    text: 'Inc 5000 per 1M people',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'patents_count',
    text: 'Total patents',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'patents_per10K',
    text: 'Patents per 10K people',
    type: 'number',
    format: ',.0f',
    include: true,
    default: 'yAxis',
  },
  {
    name: 'restaurants_per10K',
    text: 'Restaurants per 10K people',
    type: 'number',
    format: ',.0f',
    include: true,
    default: 'xAxis',
  },
  {
    name: 'unicorns_count',
    text: 'Unicorns',
    type: 'number',
    format: ',.0f',
    include: false,
  },
  {
    name: 'unicorns_per1M',
    text: 'Unicorns per 1M people',
    type: 'number',
    format: ',.0f',
    include: false,
  },
  {
    name: 'population14',
    text: 'Population',
    type: 'number',
    format: ',.0f',
    include: true,
  },
  {
    name: 'unemployed_count',
    text: 'Unemployed population',
    type: 'number',
    format: ',.0f',
    include: false,
  },
  {
    name: 'unemployment_percent',
    text: 'Unemployment Rate (Feb 2017)',
    type: 'number',
    format: ',.1%',
    include: true,
    default: 'radius',
  },
  {
    name: 'women_in_workforce_percent',
    text: 'Women in Workforce (%)',
    type: 'number',
    format: ',.0%',
    include: false,
  },
];
export {
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
};
