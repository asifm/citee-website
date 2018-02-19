// import axios from 'axios';
// for quokka, otherwise not needed
import fetch from 'isomorphic-fetch'; // eslint-disable-line 
import * as d3 from 'd3';

async function getData(sourceFile) {
    const data = await d3.json(sourceFile);
    return data;
}

getData('https://api.census.gov/data.json') // use this in production
// getData('~/assets/data/govDataCatalog.json')
    .then(response => {
        processData(response.dataset);
    });

function processData(allData) {
    const filtered = allData
        .filter(el => el.title.match(/ACS|American\sCommunity/g))
        .sort((a, b) => a.c_vintage - b.c_vintage)
        .map(el => `${ el.c_vintage }: ${ el.title } // ${ el.accrualPeriodicity }`);
    return filtered;
}
