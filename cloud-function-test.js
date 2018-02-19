import * as axios from 'axios';

async function fetchmyfun() {
    const response = await axios.post('https://us-central1-write-cafe.cloudfunctions.net/first-cloud-fun', {
        message: 'it\'s a message',
    });
    return response;
}

fetchmyfun()
    .then(resp => resp.data)
    .then(console.log);
