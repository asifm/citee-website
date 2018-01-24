import * as axios from 'axios';

async function getGeoLevelsForLonLat(
    lon, lat, sumlevs
) {
    const endpoint = `https://api.censusreporter.org/1.0/geo/search?lat=${ lat }&lon=${
        lon
    }&sumlevs=${ sumlevs }`;
    const response = await axios.get( endpoint );
    return response;
}

const mapboxToken =
  'pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA';
// const mapboxToken =
// 'pk.eyJ1IjoiYXNpZm0iLCJhIjoiNmJkZmNhNmUwZWI4YmMwMTM
// 2Y2Y4NjQ4NjM0Nzg1MWEifQ.SntXBB_ZwOFBy5GbtmbeZg';

async function getDetailForAddress( query ) {
    const endpoint = `https://api.tiles.mapbox.com/v4/geocode/mapbox.places/${
        query
    }.json?access_token=${ mapboxToken }&country=us`;
    const response = await axios.get( endpoint );
    return response;
}

async function getDetailForZip( zip ) {
    // Assume the provided zip is valid. Handle error downstream.

    const query = `Zip code ${ zip }`;
    const endpoint = `https://api.tiles.mapbox.com/v4/geocode/mapbox.places/${
        query
    }.json?access_token=${ mapboxToken }&country=us`;
    const response = await axios.get( endpoint );
    return response;
}

export { getGeoLevelsForLonLat, getDetailForAddress, getDetailForZip };
