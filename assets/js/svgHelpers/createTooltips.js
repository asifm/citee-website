import { format } from 'd3-format';
import { select, event as d3Event } from 'd3-selection';
import 'd3-selection-multi';

export function createTooltips(circles, varsMetaArr) {
  const tooltip = select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('class', 'card elevation-24 pa-4 tooltip-viz');

  circles.on('mouseover', (d) => {
    tooltip
      .html('')
      .style('visibility', 'visible')
      .html(() => `<h3>${d.cbsaname15}</h3>
              <br><strong>${format(xFormat)(d[xVar])}</strong> ${xVarText}
              <br><strong>${format(yFormat)(d[yVar])}</strong> ${yVarText}
              <br><strong>${format(radiusFormat)(d[radiusVar])}</strong> ${
  radiusVarText
}
              <br><strong>${format(colorFormat)(d[colorVar])}</strong> ${
  colorVarText
}
              <br><strong>${format(mapRadiusFormat)(d[mapRadiusVar])}</strong> ${mapRadiusVarText}`);
  });

  circles.on('mousemove', () =>
    tooltip
      .style('top', `${d3Event.pageY - 52}px`)
      .style('left', `${d3Event.pageX + 18}px`));

  circles.on('mouseout', () => tooltip.style('visibility', 'hidden'));
}
