import { axisBottom, axisLeft } from 'd3-axis';
import 'd3-selection-multi';
import { setTicks } from './setTicks';

// Important: Draw before drawing circles so circles are on top;
// that makes hover experience better
export function drawAxes(svgG, svgParams, varsMetaObj, currentVars) {
  const {
    width, height, margin, xScale, yScale,
  } = svgParams;
  const { x, y } = currentVars;

  const xAxis = axisBottom(xScale);
  const yAxis = axisLeft(yScale);

  // const xScale = scales.x.function;
  // const yScale = scales.y.function;
  setTicks(xScale, yScale, xAxis, yAxis);

  // Add the x Axis
  svgG
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .attr('class', 'axis axis--x');

  // Add the y Axis
  svgG
    .append('g')
    .call(yAxis)
    .attr('class', 'axis axis--y');

  // text label for the x axis
  svgG
    .append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom)
    .attr('dy', '-50px')
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .style('font-family', 'franklin-gothic-urw')
    .text(x.text);

  // text label for the y axis
  svgG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left)
    .attr('x', -height / 2)
    .attr('dy', '50px')
    .style('font-size', '2em')
    .style('text-anchor', 'middle')
    .style('font-family', 'franklin-gothic-urw')
    .text(y.text);

  return [xAxis, yAxis];
}
