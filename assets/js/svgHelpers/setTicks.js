/**
 *
 *
 * @export
 * @param {any} xScale
 * @param {any} yScale
 * @param {any} xAxis
 * @param {any} yAxis
 */
export function setTicks(svgParams) {
  // for sideeffect; no return

  const {
    xScale, yScale, xAxis, yAxis,
  } = svgParams;

  // Set ticks format based on largest value
  // (use current domains to get the value)
  if (xScale.domain()[1] < 100) {
    xAxis.ticks(5, '0.1f');
  } else {
    xAxis.ticks(5, '0.2s');
  }

  if (yScale.domain()[1] < 100) {
    yAxis.ticks(5, '0.1f');
  } else {
    yAxis.ticks(5, '0.2s');
  }
}
