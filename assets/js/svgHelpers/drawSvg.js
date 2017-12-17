import { select } from 'd3-selection';

/**
 * Draws an svg element with given parameters
 * and two group elements from that svg element
 *
 * @export
 * @param {Object<string, any>} svgParams - parameters of SVG element
 * @returns {Selection[]} an array of three Selection elements
 */
export function drawSvg(svgParams) {
  const {
    containerId, width, height, margin,
  } = svgParams;

  const svg = select(containerId)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const svgG = svg
    .style('filter', 'url(#dropshadow)')
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  return [svg, svgG];
}
