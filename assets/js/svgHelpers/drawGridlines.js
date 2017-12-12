import { axisBottom, axisLeft } from 'd3-axis';
import { select, selectAll } from 'd3-selection';

export function drawGridlines(svgParams) {
  const {
    width, height, scales, svgG,
  } = svgParams;
  const xScale = scales.x.function;
  const yScale = scales.y.function;
  // add the X gridlines
  svgG
    .append('g')
    .attr('class', 'grid x')
    .style('stroke-opacity', '0.2')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(xScale)
      .tickSize(-height)
      .tickFormat(''));

  // add the Y gridlines
  svgG
    .append('g')
    .attr('class', 'grid y')
    .style('stroke-opacity', '0.2')
    .call(axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(''));

  // TODO: use class isntead
  selectAll('.axis>.tick>text').each(function makeTickBigger(d, i) {
    select(this).style('font-size', '1.5em');
  });
}
