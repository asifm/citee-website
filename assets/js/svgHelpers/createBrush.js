import { brush } from 'd3-brush';
import { event } from 'd3-selection';
// import { zoom } from './createZoom';

export function createBrush(svgParams) {
  const brushGenerator = brush();

  const g = svgParams.svgG
    .append('g')
    .attr('class', 'brush')
    .call(brushGenerator);
}
