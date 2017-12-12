import { scaleLog, scaleLinear, scaleSqrt, scaleSequential } from 'd3-scale';
import { min, max } from 'd3-array';

/**
 *
 * @param {Object<string, any>} svgParams
 * @param {Object[]} data
 * @param {Object<string, Object>} currentVars
 * @returns {Function[]}
 */
export function createScales(svgParams, data, currentVars) {
  /*
  TODO: negative functions have been filtered out.
  Otherwise logscales won't work. Find a solution.
  Possible solution: Convert negative functions to zero first;
  separately note this for user
  Or just show them separately in a table
 */
  const {
    xScaleType,
    xScaleRange,
    yScaleType,
    yScaleRange,
    radiusScaleType,
    radiusScaleRange,
    colorScaleType,
    colorScaleRange,
  } = svgParams;
  console.log(svgParams);
  /* TODO: Make it more general. Don't make assumptions
  about how many and what vars.
  Get more parameters from invoking function,
  rather than fixing here. */

  const {
    x, y, radius, color,
  } = currentVars;

  const scaleTypes = {
    log: scaleLog,
    linear: scaleLinear,
    sqrt: scaleSqrt,
    sequential: scaleSequential,
  };

  const xScale = scaleTypes[xScaleType]().range(xScaleRange);
  const yScale = scaleTypes[yScaleType]().range(yScaleRange);
  const radiusScale = scaleTypes[radiusScaleType]().range(radiusScaleRange);
  const colorScale = scaleTypes[colorScaleType]().range(colorScaleRange);

  // Set input domains based on min and max
  // Get the smallest non-zero number as min
  const minX = min(data, d => d[x] || Infinity);
  const minY = min(data, d => d[y] || Infinity);
  const minRadius = min(data, d => d[radius] || Infinity);
  const minColor = min(data, d => d[color] || Infinity);

  const maxX = max(data, d => d[x]);
  const maxY = max(data, d => d[y]);
  const maxRadius = max(data, d => d[radius]);
  const maxColor = max(data, d => d[color]);

  xScale.domain([minX, maxX]);
  yScale.domain([minY, maxY]);
  radiusScale.domain([minRadius, maxRadius]);
  colorScale.domain([minColor, maxColor]);

  return [xScale, yScale, radiusScale, colorScale];
}
