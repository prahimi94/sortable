
import { getData } from './getData.js';
import { filteredHeroes } from './getData.js';

let currentPage = 1;
let pageSize = 20; // Default page size

export async function fillTable() {
  const myTable = document.querySelector("table");
  const myTBody = document.querySelector("tbody");
  const nothingFoundH = document.querySelector("#nothingFound");

  let heroesData = filteredHeroes
    if (!heroesData || heroesData.length === 0) {
        console.error("No data available");
        myTBody.style.display= 'none'
        nothingFoundH.style.display= 'block'
        return;
    } else {
      myTBody.style.display= 'contents'
      nothingFoundH.style.display= 'none'
    } 

    const totalItems = heroesData.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // ensure currentPage is within valid range
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    // slice data for pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = heroesData.slice(startIndex, startIndex + pageSize);

    console.log("Displaying data:", paginatedData);

    let tableRows = '';
    
    for (const hero of paginatedData) {
      tableRows += `<tr>
        <td><img src="${hero.images.xs}"></td>
        <td>${hero.name || "-"}</td>
        <td>${hero.biography.fullName || "-"}</td>
        <td>
          intelligence: ${hero.powerstats.intelligence || "-"}
          </br>
          strength: ${hero.powerstats.strength || "-"}
          </br>
          speed: ${hero.powerstats.speed || "-"}
          </br>
          durability: ${hero.powerstats.durability || "-"}
          </br>
          power: ${hero.powerstats.power || "-"}
          </br>
          combat: ${hero.powerstats.combat || "-"}
        </td>
        <td>${hero.appearance.race || "-"}</td>
        <td>${hero.appearance.gender || "-"}</td>
        <td>${hero.appearance.height[0] || "-"} ft</br>${hero.appearance.height[1]}</td>
        <td>${hero.appearance.weight[0] || "-"}</br>${hero.appearance.weight[1]}</td>
        <td>${hero.biography.placeOfBirth || "-"}</td>
        <td>${hero.biography.alignment || "-"}</td>
      </tr>`;
    }

    const myTableBody = document.querySelector("table tbody");
    if (myTableBody) {
        myTableBody.innerHTML = tableRows;
    } else {
        console.error("Table not found!");
    }

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = `
        <button onclick="changePage(-1)" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
        <span>Page ${currentPage} of ${totalPages}</span>
        <button onclick="changePage(1)" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
    `;
}

window.changePage = function(step) {
    currentPage += step;
    fillTable()
};

window.changePageSize = function(size) {
    pageSize = parseInt(size);
    currentPage = 1; // Reset to first page
    fillTable()
};
