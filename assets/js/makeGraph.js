// This file is for testing
import * as d3 from 'd3';
// import * as _ from 'lodash';

const fillscale = d3
  .scaleLinear()
  .domain([0, 1000])
  .range([0, 255])
  .clamp(true);

const randomRedValue = Math.round(Math.random() * 255);

export const dummy = 34;
export function makeGraph() {
  const canvas = d3
    .select('#canvas')
    .attr('width', '1000px')
    .attr('height', '1000px');

  const rect = canvas.append('rect');

  function mousemove() {
    rect.attr('width', d3.event.pageX);
    rect.attr('height', d3.event.pageY);
    const fillval = `${d3.rgb(
      randomRedValue,
      Math.round(fillscale(d3.event.pageX)),
      Math.round(fillscale(d3.event.pageY)),
    )}`;
    console.log(fillval);
    rect.attr('fill', fillval);
  }

  rect
    .attr('height', 100)
    .attr('width', 800)
    .attr('fill', 'purple');

  d3.select('body').on('mousemove', mousemove);
}
