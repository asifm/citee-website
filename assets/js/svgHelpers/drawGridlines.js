import { axis } from 'd3-scale';
import 'd3-selection-multi';

export function drawGridlines() {
  // add the X gridlines
  svgGElem
    .append('g')
    .attr('class', 'grid x')
    .style('stroke-opacity', '0.2')
    .attr('transform', `translate(0,${height})`)
    .call(axisBottom(xScale)
      .tickSize(-height)
      .tickFormat(''));

  // add the Y gridlines
  svgGElem
    .append('g')
    .attr('class', 'grid y')
    .style('stroke-opacity', '0.1')
    .call(axisLeft(yScale)
      .tickSize(-width)
      .tickFormat(''));

  // TODO: use class isntead
  //   d3.selectAll('.axis>.tick>text').each(function makeTickBigger(d, i) {
  //     d3.select(this).style('font-size', '1.5em');
  //   });
}
