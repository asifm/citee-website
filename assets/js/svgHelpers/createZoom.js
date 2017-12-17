// https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6

export function createZoom(svgParams, currentVars) {
  const {
    svgG, xScale, yScale, xAxis, yAxis,
  } = svgParams;

  const { x, y } = currentVars;
  const t = svgG.transition().duration(750);
  svgG
    .select('.axis--x')
    .transition(t)
    .call(xAxis);
  svgG
    .select('.axis--y')
    .transition(t)
    .call(yAxis);

  svgG
    .selectAll('circle')
    .transition(t)
    .attr('cx', d => xScale(d[x]))
    .attr('cy', d => yScale(d[y]));
}
