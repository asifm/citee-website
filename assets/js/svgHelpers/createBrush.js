import { brush } from 'd3-brush';
import { event } from 'd3-selection';
import { createZoom } from './createZoom';

export function createBrush(svgParams, currentVars) {
  const {
    xScale, yScale, svgG, plotwidth, plotheight, svgGCircles,
  } = svgParams;
  console.log('svgGCircles: ', svgGCircles);

  // save the domains so that we can get back to previous
  // state when zoom reverses
  const xDomain = xScale.domain();
  const yDomain = yScale.domain();

  let idleTimeout;
  const idleDelay = 350;

  const brushGenerator = brush().extent([[0, 0], [plotwidth, plotheight]]);

  const g = svgG
    .append('g')
    .attr('class', 'brush')
    .call(brushGenerator);

  function idled() {
    idleTimeout = null;
  }

  function brushended() {
    const s = event.selection;
    if (!s) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, idleDelay));
      xScale.domain(xDomain);
      yScale.domain(yDomain);
      // todo reset grid and ticks
    } else {
      xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xScale));
      yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yScale));
      // todo reset grid and ticks
      svgG.select('.brush').call(brushGenerator.move, null);
    }
    createZoom(svgParams, currentVars);
  }
  brushGenerator.on('end', brushended);
  // svgG.on('click', brushended);
}
