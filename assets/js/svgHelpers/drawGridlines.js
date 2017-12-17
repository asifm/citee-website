import { axisBottom, axisLeft } from 'd3-axis';
import { select, selectAll } from 'd3-selection';

export function drawGridlines(svgParams) {
  // remove existing grid if any
  selectAll('.grid').remove();

  const {
    plotwidth, plotheight, xScale, yScale, svgG,
  } = svgParams;
  // add the X gridlines
  svgG
    .append('g')
    .attr('class', 'grid x')
    .style('stroke-opacity', '0.1')
    .attr('transform', `translate(0,${plotheight})`)
    .call(axisBottom(xScale)
      .tickSize(-plotheight)
      .tickFormat(''));

  // add the Y gridlines
  svgG
    .append('g')
    .attr('class', 'grid y')
    .style('stroke-opacity', '0.2')
    .call(axisLeft(yScale)
      .tickSize(-plotwidth)
      .tickFormat(''));

  // TODO: use class isntead
  selectAll('.axis>.tick>text').each(function makeTickBigger(d, i) {
    select(this).style('font-size', '1.5em');
  });
}
