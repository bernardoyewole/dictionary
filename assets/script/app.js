'use strict';

import { onEvent, select, selectAll, create, print } from "./utils.js";

const input = select('input');
const search = select('.search');
const word = select('.word');
const phoneticsText = select('.phonetics-text');
const listen = select('.listen');
const content = select('.content');
const suchAs = select('.such-as');

let inputWord;

onEvent('load', window, () => {
    input.value = '';
    inputWord = 'winter';
    getWordInfo();
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

        setWord(inputWord, phonetics);
        appendMeanings(meanings);
    } catch(error) {
        suchAs.innerText = `Sorry, we couldn't find the word you're looking for`;
    }
}

let audio;
let audioAvailable = false;
let phoneticsAvailable = false;

function setWord(str, arr) {
    word.innerText = str.toLowerCase();

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty('text') && arr[i].text !== '') {
            phoneticsText.innerText = arr[i].text;
            phoneticsAvailable = true;
            break;
        }
    }

    for (let i = 0; i < arr.length; i++) {
        if(arr[i].hasOwnProperty('audio') && arr[i].audio !== '') {
            audio = new Audio(arr[i].audio);
            audioAvailable = true;
            listen.style.display = 'block';
            break;
        }
    }

    audioAvailable ? '' : listen.style.display = 'none';
    phoneticsAvailable ? '' : phoneticsText.innerText = '';
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
    audioAvailable = false;
    phoneticsAvailable = false;
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
});

onEvent('click', listen, () => {
    audio.play();
});

let meaningBox;
let meaningHeading;
let paragraph;
let count = 0;

function appendMeanings(arr) {
    selectAll('.meaning-container').forEach(container => content.removeChild(container));
    arr.forEach(obj => {
        meaningBox = create('section');
        meaningBox.classList.add('meaning-container');
        meaningHeading = create('p');
        meaningHeading.innerText = obj.partOfSpeech;
        meaningHeading.classList.add('part-of-speech');
        meaningBox.appendChild(meaningHeading);
        content.appendChild(meaningBox);

        obj.definitions.forEach(obj => {
            count++;
            paragraph = create('p');
            paragraph.innerText = `${count}. ${obj.definition}`;
            meaningBox.appendChild(paragraph);
            if (obj.hasOwnProperty('example')) {
                let exampleParag = create('p');
                exampleParag.innerText = obj.example;
                exampleParag.classList.add('example');
                meaningBox.appendChild(exampleParag);
            }
        });
        count = 0;
    });
}