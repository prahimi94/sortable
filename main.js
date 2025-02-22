import { getData } from './getData.js'

export async function fillTable() {

    const heroesData = await getData(); // Wait for the data
    let tableRows = '';
  
    for (const hero of heroesData) {
      tableRows += `<tr>
        <td><img src="${hero.images.xs}"></td>
        <td>${hero.name}</td>
        <td>${hero.biography.fullName || "Unknown"}</td>
        <td>${hero.powerstats || "Unknown"}</td>
        <td>${hero.appearance.race}</td>
        <td>${hero.appearance.gender}</td>
        <td>${hero.appearance.height}</td>
        <td>${hero.appearance.weight}</td>
        <td>${hero.biography.placeOfBirth}</td>
        <td>${hero.biography.alignment}</td>
      </tr>`;
    }
  
    const myTable = document.querySelector("table tbody"); // Select the table body
    if (myTable) {
      myTable.innerHTML = tableRows; // Set the table rows
    } else {
      console.error("Table not found!");
    }
  }
  
  // Call the function after the page loads
  document.addEventListener("DOMContentLoaded", fillTable);
  