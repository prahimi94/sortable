import { fillTable } from './main.js';
import { initialData, filteredHeroes, setFilteredHeroes } from './getData.js';
const activeFilters = {};

export function initSearch() {

const searchAll = document.getElementById('searchAll'); // searchbox
  
  if (searchAll) {
    searchAll.addEventListener('input', function (event) {
      activeFilters["all"] = event.target.value.toLowerCase(); // Store search value
      applyFilters(); // Apply all filters together
    });
  }
//column searchers listeners
const columnSearchInput = document.querySelectorAll('.column-search');
columnSearchInput.forEach(input => {
  input.addEventListener('input', function(event) {
    const field= event.target.dataset.field; // "data-field in index"
    activeFilters[field] = event.target.value.toLowerCase();
    applyFilters();
   })
});
}


function applyFilters() {
  let updatedHeroes = filteredHeroes ; // reset to full data
  updatedHeroes = initialData
  // Apply all active filters
  Object.entries(activeFilters).forEach(([field, searchText]) => {
    if (searchText) {
        updatedHeroes = filterHeroes(field, searchText, updatedHeroes);
      }
  });
//   console.log('updatedHeroes are: ', updatedHeroes)
//   if (updatedHeroes.length === 0) {
//     updatedHeroes = initialData
//   }
  setFilteredHeroes(updatedHeroes)
  fillTable();
}

function filterHeroes(field, searchText, data) {
  const searchTextLower = searchText.toLowerCase();

  return data.filter(hero => {

    if (field === "all"){
      return Object.values(hero).some(value => {
        if (typeof value === "object") {
            return Object.values(value).some(subValue =>
            String(subValue).toLowerCase().includes(searchTextLower)
          );
        }
        return String(value).toLowerCase().includes(searchTextLower);
      });
        } else {
            const fieldValue = getNestedValue(hero, field);
        return fieldValue && String(fieldValue).toLowerCase().includes(searchTextLower);
        }
    });
}

function getNestedValue(obj, field) {
  const parts = field.split('.');
  return parts.reduce((acc, part) => {
    if (acc && part in acc) { //if accumulator (acc) and the current part exist return part, otherwise - null
      return acc[part];
    }
    return undefined; // maybe better to use "null" ?
  }, obj);
}
