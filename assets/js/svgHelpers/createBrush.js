// https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6

import { brush } from 'd3-brush';


export function createBrush(svgParams) {
  const {
    svgG, plotwidth, plotheight,
  } = svgParams;


  const brushGenerator = brush().extent([[-40, -40], [plotwidth + 40, plotheight + 40]]);

  svgG
    .append('g')
    .attr('class', 'brush')
    .call(brushGenerator);

  return brushGenerator;
}

