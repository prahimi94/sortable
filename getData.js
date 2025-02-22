import { fillTable } from './main.js'
import { initSort } from './sort.js'
import { initSearch } from './search.js'
export let filteredHeroes
export let initialData
export function setFilteredHeroes(value) {
  filteredHeroes = value
}

export async function getData() {
  const url = "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const json = await response.json();
    return json
  } catch (error) {
    console.error(error.message);
    return []
  }
}


document.addEventListener("DOMContentLoaded", async function () {
  try {
    initialData = await getData();
    filteredHeroes = initialData;
    fillTable();
    initSearch()  
    initSort();
  } catch (error) {
    console.error(error.message)
  }
});