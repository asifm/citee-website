export function setTicks(scales, xAxis, yAxis) {
  // for sideeffect; no return
  const xScale = scales.x.function;
  const yScale = scales.y.function;

  // Set ticks format based on largest value
  // (use current domains to get the value)
  if (xScale.domain()[1] < 100) {
    console.log('inside seeticks');
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
