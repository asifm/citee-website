// transpiled to es-modern using https://lebab.io/try-it
// working version with d3 v4 http://blockbuilder.org/asifm/22d6ab34d10b19114f5ef6dc4e34efd1
// cartesian fisheye https://stackoverflow.com/questions/42694544/modify-cartesian-distortion-for-d3js-v4
// magnifying glass http://bl.ocks.org/micahstubbs/ac5a286191c96aaefead809ce2c5bba2 (v3)
// cartesian example somewhere in this page view-source:https://bost.ocks.org/mike/fisheye/#cartesian

import * as d3 from 'd3';

d3.fisheye = () => {
  let radius = 200;
  let power = 2;
  let k0;
  let k1;
  let center = [0, 0];

  class fisheye {
    constructor(d) {
      const dx = d[0] - center[0];
      const dy = d[1] - center[1];
      const dd = Math.sqrt(dx * dx + dy * dy);
      if (dd >= radius) return d;
      const k = k0 * (1 - Math.exp(-dd * k1)) / dd * 0.75 + 0.25;
      return [center[0] + dx * k, center[1] + dy * k];
    }

    static radius(_) {
      if (!arguments.length) return radius;
      radius = +_;
      return rescale();
    }

    static power(_) {
      if (!arguments.length) return power;
      power = +_;
      return rescale();
    }

    static center(_) {
      if (!arguments.length) return center;
      center = _;
      return fisheye;
    }
  }

  function rescale() {
    k0 = Math.exp(power);
    k0 = k0 / (k0 - 1) * radius;
    k1 = power / radius;
    return fisheye;
  }

  return rescale();
};
