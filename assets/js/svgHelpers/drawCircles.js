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
  } = _.reduce(
    currentVars,
    (result, value, key) => {
      result[key] = value.name;
      return result;
    },
    {},
  );
  const xScale = svgParams.scales.x.function;
  const yScale = svgParams.scales.y.function;
  const radiusScale = svgParams.scales.radius.function;
  const colorScale = svgParams.scales.color.function;

  console.dir(svgParams);

  const circles = svgParams.svgSvgFilter

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
