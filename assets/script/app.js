'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const input = select('input');
const search = select('.search');
const word = select('.word');
const phoneticsText = select('.phonetics-text');
const listen = select('.listen');
const partOfSpeech = select('.part-of-speech');
const meaning = select('.meaning');
const suchAs = select('.such-as');

let inputWord;

onEvent('load', window, () => {
    // input.value = '';
});

const options = {
    method: 'GET',
    mode: 'cors'
}

async function getWordInfo() {
    const URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`;

    try {
        const response = await fetch(URL, options);
        
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const wordInfo = await response.json();
        const meanings = wordInfo[0].meanings;
        const phonetics = wordInfo[0].phonetics;

        // console.log(phonetics);
        setWord(inputWord, phonetics);

    } catch(error) {
        suchAs.innerText = `Sorry pal, we couldn't find the word you're looking for`;
    }
}

let audio;

function setWord(str, arr) {
    word.innerText = str;
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].text !== '' && arr[i].audio !== '') {
            phoneticsText.innerText = arr[i].text;
            audio = new Audio(arr[i].audio);
            break;
        }
    }
}

function isValid(str) {
    if (str.match(/^[a-zA-Z]+$/) && str !== '') {
        return true;
    } else {
        suchAs.innerText = 'Input is invalid';
        suchAs.classList.add('invalid');
        return false;
    }
}

function searchFns() {
    inputWord = input.value.trim();
    getWordInfo();
    suchAs.innerText = 'Such as: moon, nature, sunset...';
    suchAs.classList.remove('invalid');
    input.blur();
}

onEvent('click', search, () => {
    if (isValid(input.value.trim())) {
        searchFns();
    }
});

onEvent('keydown', window, (event) => {
    if (event.key === 'Enter') {
        searchFns();
    }
})

onEvent('click', listen, () => {
    audio.play();
});