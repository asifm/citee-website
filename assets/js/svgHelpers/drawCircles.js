// import { select, selectAll } from 'd3-selection';
import * as _ from 'lodash';
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
    xScale, yScale, radiusScale, colorScale,
  } = svgParams;

  console.log(xScale, yScale);
  const circles = svgParams.svgG
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d[x]))
    .attr('cy', d => yScale(d[y]))
    .attr('fill', d => colorScale(d[color]))
    .attr('opacity', '0.4')
    .attr('stroke-width', '0.5')
    .attr('stroke', 'black')
    .attr('r', 0);

  circles
    .transition()
    .duration(200)
    .attr('r', d => radiusScale(d[radius]));

  return circles;
}
