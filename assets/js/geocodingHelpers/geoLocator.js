import * as axios from 'axios';

async function getGeoFromLonLat(lon, lat, sumlevs) {
  const endpoint = `https://api.censusreporter.org/1.0/geo/search?lat=${lat}&lon=${lon}&sumlevs=${
    sumlevs
  }`;
  const response = await axios.get(endpoint);
  return response;
}

const mapboxToken = 'pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA';
// const mapboxToken =
// 'pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg';

async function getGeoFromAddress(addressQuery, onlyZip) {
  const address = onlyZip === true ? `Zip code ${addressQuery}` : addressQuery;

  const endpoint = `https://api.tiles.mapbox.com/v4/geocode/mapbox.places/${
    address
  }.json?access_token=${mapboxToken}&country=us`;
  const response = await axios.get(endpoint);
  return response;
}

export { getGeoFromLonLat, getGeoFromAddress };
