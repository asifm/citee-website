import * as axios from 'axios';

async function getGeoFromLonLat(lon, lat, sumlevs) {
  const endpoint = `https://api.censusreporter.org/1.0/geo/search?lat=${lat}&lon=${lon}&sumlevs=${
    sumlevs
  }`;
  const response = await axios.get(endpoint);
  return response;
}

async function getGeoFromAddress(address) {
  const mapboxToken =
    'pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg';
  const endpoint = `https://api.tiles.mapbox.com/v4/geocode/mapbox.places/${
    address
  }.json?access_token=${mapboxToken}&country=us`;
  const response = await axios.get(endpoint);
  return response;
}

export { getGeoFromLonLat, getGeoFromAddress };
