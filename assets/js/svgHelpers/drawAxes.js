import { axisBottom, axisLeft } from 'd3-axis';
import { selectAll } from 'd3-selection';
import { setTicks } from './setTicks';

// Important: Draw before drawing circles so circles are on top;
// that makes hover experience better
export function drawAxes(svgParams, varsMetaArr, currentVars) {
  // remove existing axes if any
  selectAll('.axis').remove();

  const {
    svgG, plotwidth, plotheight, margin, xScale, yScale, radiusScaleRange,
  } = svgParams;
  const { x, y } = currentVars;

  const xText = varsMetaArr.filter(elem => elem.name === x)[0].text;
  const yText = varsMetaArr.filter(elem => elem.name === y)[0].text;

  svgParams.xAxis = axisBottom(xScale);
  svgParams.yAxis = axisLeft(yScale);

  setTicks(svgParams);
  // Add the x Axis
  svgG
    .append('g')
    .attr('transform', `translate(0,${plotheight + radiusScaleRange[1]})`)
    .call(svgParams.xAxis)
    .attr('class', 'axis axis--x');

  // Add the y Axis
  svgG
    .append('g')
    .attr('transform', `translate(${-radiusScaleRange[1]},0)`)
    .call(svgParams.yAxis)
    .attr('class', 'axis axis--y');

  // text label for the x axis
  svgG
    .append('text')
    .attr('x', plotwidth / 2)
    .attr('y', plotheight + margin.bottom)
    .attr('dy', '-50px')
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .style('font-family', 'franklin-gothic-urw')
    .text(xText);

  // text label for the y axis
  svgG
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left)
    .attr('x', -plotheight / 2)
    .attr('dy', '50px')
    .style('font-size', '1.5em')
    .style('text-anchor', 'middle')
    .style('font-family', 'franklin-gothic-urw')
    .text(yText);
}
