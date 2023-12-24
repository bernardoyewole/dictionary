'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const options = {
    method: 'GET',
    mode: 'cors'
}

async function getRates() {
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/word`;

    try {
        const response = await fetch(URL, options);
        
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const rates = await response.json();
        console.log(rates);

    } catch(error) {
        console.log(error.message);
    }
}

// getRates();