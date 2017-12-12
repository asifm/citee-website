import { scaleLog, scaleLinear, scaleSqrt, scaleSequential } from 'd3-scale';
import { min, max } from 'd3-array';
import { rgb } from 'd3-color';

/**
 *
 * @param {Object<string, any>} svgParams
 * @param {Object[]} data
 * @param {string[]} currentVars
 * @returns {Function[]}
 */
export function createScales(svgParams, data, currentVars) {
  // TODO: add linear scale

  /*
  TODO: negative functions have been filtered out.
  Otherwise logscales won't work. Find a solution.
  Possible solution: Convert negative functions to zero first;
  separately note this for user
  Or just show them separately in a table
 */
  const { width, height, scales } = svgParams;

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

  scales.x.function = scaleTypes[scales.x.type]().range([25, width - 25]);
  scales.y.function = scaleTypes[scales.y.type]().range([height - 25, 25]);
  scales.radius.function = scaleTypes[scales.radius.type]().range([3, 20]);
  scales.color.function = scaleTypes[scales.color.type]().range([
    rgb(scales.color.lowEnd),
    rgb(scales.color.highEnd),
  ]);

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

  scales.x.function.domain([minX, maxX]);
  scales.y.function.domain([minY, maxY]);
  scales.radius.function.domain([minRadius, maxRadius]);
  scales.color.function.domain([minColor, maxColor]);

  return [
    scales.x.function,
    scales.y.function,
    scales.radius.function,
    scales.color.function,
  ];
}
