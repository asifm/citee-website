import { format } from 'd3-format';
import { select, event as d3Event } from 'd3-selection';

export function createTooltips(circles, currentVars, varsMetaArr, svgParams) {
  const {
    x, y, radius, color,
  } = currentVars;

  const xFormat = varsMetaArr.filter(elem => elem.name === x)[0].format;
  const yFormat = varsMetaArr.filter(elem => elem.name === y)[0].format;
  const radiusFormat = varsMetaArr.filter(elem => elem.name === radius)[0].format;
  const colorFormat = varsMetaArr.filter(elem => elem.name === color)[0].format;

  const xText = varsMetaArr.filter(elem => elem.name === x)[0].text;
  const yText = varsMetaArr.filter(elem => elem.name === y)[0].text;
  const radiusText = varsMetaArr.filter(elem => elem.name === radius)[0].text;
  const colorText = varsMetaArr.filter(elem => elem.name === color)[0].text;

  const tooltip = select('body')
    .append('div')
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .attr('class', 'card elevation-24 pa-4 tooltip-viz');

  circles.on('mouseover', (d) => {
    // TODO: implement bounce transition
    // prepend any letter (here 'a') to id because html id cannot start with a number
    select(`#a${d.cbsa15}`)
      .attr('stroke-width', '20x')
      .transition()
      .duration(500)
      .attr('stroke-width', '1px');

    tooltip
      .html('')
      .style('visibility', 'visible')
      .html(() => `<h3>${d.cbsaname15}</h3>
              <br><strong>${format(xFormat)(d[x])}</strong> ${xText}
              <br><strong>${format(yFormat)(d[y])}</strong> ${yText}
              <br><strong>${format(radiusFormat)(d[radius])}</strong> ${radiusText}
              <br><strong>${format(colorFormat)(d[color])}</strong> ${colorText}`);
  });

  circles.on('mousemove', () =>
    tooltip
      .style('top', `${d3Event.pageY - 52}px`)
      .style('left', `${d3Event.pageX + 18}px`));

  circles.on('mouseout', () => tooltip.style('visibility', 'hidden'));
}

// "dev-debug": "node --inspect .nuxt/server.js"
