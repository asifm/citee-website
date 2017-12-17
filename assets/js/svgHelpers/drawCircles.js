// import { select, selectAll } from 'd3-selection';
// import * as _ from 'lodash';
/**
 *
 *
 * @export
 * @param {Object} svgParams
 * @param {Object[]} data
 * @param {string[]} currentVars
 * @returns {SVGCircleElement[]}
 */

export function drawCircles(svgParams, data, currentVars) {
  const {
    x, y, radius, color,
  } = currentVars;

  const {
    svgG, xScale, yScale, radiusScale, colorScale,
  } = svgParams;

  const circles = svgG
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('pointer-events', 'all')
    .attr('class', 'dot')
    // prepend any letter (here 'a') to id because html id cannot start with a number
    .attr('id', d => `a${d.cbsa15}`)
    .attr('cx', d => xScale(d[x]))
    .attr('cy', d => yScale(d[y]))
    .attr('fill', d => colorScale(d[color]))
    .attr('opacity', '0.4')
    .attr('stroke-width', '1px')
    .attr('stroke-opacity', '0.7')
    .attr('stroke', 'black')
    .attr('r', 0);

  circles
    .transition()
    .duration(200)
    .attr('r', d => Math.round(radiusScale(d[radius])));

  return circles;
}
