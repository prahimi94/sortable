import { fillTable } from './main.js'
import { filteredHeroes, setFilteredHeroes } from './getData.js';

const sortInvalid = (valA, valB) => {
  // Handle missing values by sorting them last
  const invalidA = valA === null || valA === undefined || valA === 'Unknown' || valA === '' || valA === '-' || valA === '0 kg' || valA === '0 cm';
  const invalidB = valB === null || valB === undefined || valB === 'Unknown' || valB === '' || valB === '-' || valB === '0 kg' || valB === '0 cm';
  
  if (invalidA && invalidB) return 0; // If both are invalid, they are equal
  if (invalidA) return 1; // Invalid values should always be at the end
  if (invalidB) return -1;
  
  return 'notInvalid';
}

const sortString = (valA, valB, isAscending) => {
  return isAscending ? valA.localeCompare(valB) : valB.localeCompare(valA);
}

const parseWeight = (value) => {
  if (!value) return null; // Treat empty values as invalid
  
  value = value.replace(",", "")
  const weightRegex = /(\d+(\.\d+)?)\s*(kg|tons)?/i;
  const match = value.match(weightRegex);
  
  if (!match) return null; // Return null if no valid number is found
  
  let num = parseFloat(match[1]) || 0;
  let unit = match[3] ? match[3].toLowerCase() : "kg"; // Default to kg
  
  // Convert tons to kg
  if (unit === "tons") {
    num *= 1000; // Convert tons to kg
  }
  
  return num; 
}

const parseHeight = (value) => {
  if (!value) return null; // Treat empty values as invalid
  
  const heightRegex = /(\d+(\.\d+)?)\s*(cm|m)?/i;
  const match = value.match(heightRegex);
  
  if (!match) return null; // Return null if no valid number is found
  
  let num = parseFloat(match[1]) || 0;
  let unit = match[3] ? match[3].toLowerCase() : "cm"; // Default to cm
  
  // Convert meters to cm
  if (unit === "m") {
    num *= 100; // Convert meters to cm
  }
  
  return num; 
}

const sortNumber = (valA, valB, isAscending, column) => {
  let numA, numB
  if (column == 'weight') {
    numA = parseWeight(valA)
    numB = parseWeight(valB)
  } else if (column == 'height') {
    numA = parseHeight(valA)
    numB = parseHeight(valB)
  } else {
    // Extract numerical values from weight strings
    numA = parseFloat(valA) || 0; // Default to 0 if parsing fails
    numB = parseFloat(valB) || 0; // Default to 0 if parsing fails
  }
  
  
  // Compare numerical values
  return isAscending ? numA - numB : numB - numA;
}

const sortData = (data, sortedByCol, isAscending) => {
  return data.slice().sort((a, b) => {
    let valA, valB, sortInvalidRes;
    
    switch (sortedByCol) {
      case 'name':
      valA = a.name;
      valB = b.name;
      break;
      
      case 'fullName':
      valA = a.biography.fullName;
      valB = b.biography.fullName;
      break;
      
      case 'race':
      valA = a.appearance.race;
      valB = b.appearance.race;
      break;
      
      case 'gender':
      valA = a.appearance.gender;
      valB = b.appearance.gender;
      break;
      
      case 'placeOfBirth':
      valA = a.biography.placeOfBirth;
      valB = b.biography.placeOfBirth;
      break;
      
      case 'alignment':
      valA = a.biography.alignment;
      valB = b.biography.alignment;
      break;
      
      case 'height':
      valA = a.appearance.height[1]; // Extract numerical height (e.g., "180 cm")
      valB = b.appearance.height[1];
      break;
      
      case 'weight':
      valA = a.appearance.weight[1]; // Extract numerical weight (e.g., "80 kg")
      valB = b.appearance.weight[1];
      break;
      
      case 'powerstats':
      valA = a.powerstats.strength; // Choose one powerstat for sorting
      valB = b.powerstats.strength;
      break;
      
      default:
      return 0; // If column name doesn't match, keep order
    }
    
    // Handle invalid values first
    sortInvalidRes = sortInvalid(valA, valB);
    if (sortInvalidRes !== 'notInvalid') {
      return sortInvalidRes;
    }
    
    // Choose the right sorting method
    if (sortedByCol === 'height' || sortedByCol === 'weight' || sortedByCol === 'powerstats') {
      return sortNumber(valA, valB, isAscending, sortedByCol);
    } else {
      return sortString(valA, valB, isAscending);
    }
  });
}

export const initSort = () => {
  let sortedByCol = 'nameHead'
  let isAscending = true
  const nameHeader = document.getElementById("nameHead")
  nameHeader.querySelector(".asc-sorted").classList.add("active")

  let sortedFilteredHeroes = sortData(filteredHeroes, sortedByCol.slice(0, -4), isAscending)
  setFilteredHeroes(sortedFilteredHeroes)

  const sortableHeaders = Array.from(document.getElementsByClassName("sortable"))
  sortableHeaders.forEach(header => {
    header.addEventListener("click", function() {
      const clickedHeader = this // The clicked header element
      const newSortedByCol = clickedHeader.id
      
      if(newSortedByCol == sortedByCol){
        isAscending = !isAscending
      } else {
        sortedByCol = newSortedByCol
        isAscending = true
      }
      
      const documentAscs = Array.from(document.getElementsByClassName("asc-sorted"))
      documentAscs.forEach(documentAsc => { documentAsc.classList.remove("active");})
      const documentDess = Array.from(document.getElementsByClassName("desc-sorted"))
      documentDess.forEach(documentDes => { documentDes.classList.remove("active");})
      
      
      // Toggle sorting state
      const asc = clickedHeader.querySelector(".asc-sorted")
      const desc = clickedHeader.querySelector(".desc-sorted")
      
      if (isAscending) {
        asc.classList.add("active") // Highlight ▼
      } else {
        desc.classList.add("active") // Highlight ▲
      }
      
      
      let sorted = sortData(filteredHeroes, sortedByCol.slice(0, -4), isAscending)
      setFilteredHeroes(sorted)
      fillTable(filteredHeroes);
    });
  });
}