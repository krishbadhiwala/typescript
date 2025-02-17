const result = get(".user-list");
const searchbox = get(".search-box");
const userlist = get(".user-list");
const view = get(".viewStorage");
const clear = get(".clearStorage");


function get(selection) {
  try {
    const element = document.querySelector(selection);
    return element;
  } catch (error) {
    console.log(error);
  }
}
async function fetchdata(url) {
  try {
    const response = await fetch(url);
    // if (!response) throw new Error("Country not found");
    const data = await response.json();
    console.log(data);
    
    return data;
  } catch {
    userlist.innerHTML = "No results found";
  }
}

async function searchcounty() {
  const url = `https://restcountries.com/v3.1/all`;
  const data = await fetchdata(url);
  displaydata(data);
  search();
}

async function displaydata(data) {
  try {
    const countrresult = data
      .map((item) => {
        const common1 = item.name.common;
        const flag = item.flags.png;

        return ` <li><div class="user-data">
         <img src=${flag} alt=${common1} srcset="">
         <div>
         <a class="countylink"data-country="${common1}"   style =" color: inherit;  text-decoration:none"href= "https://www.google.com/search?q=${common1}"    target="_blank"><p>${common1}</p></a>
         </div>
         </div></li>`;
      })
      .join("");
    result.innerHTML = countrresult;
    searchbox.innerHTML = "";
    document.querySelectorAll(".countylink").forEach((link) => {
      link.addEventListener("click", (event) => {
        const countryName = event.currentTarget.dataset.country;
        addlocal(countryName);
      });
    });
  } catch {
    userlist.innerHTML = "No results found";
  }
}

async function search() {
  searchbox.addEventListener("input", async function () {
    const qurey = searchBox.value.toLowerCase();
    const url1 = `https://restcountries.com/v3.1/name/${qurey}`;
    const data = await fetchdata(url1);
    if (qurey.length === 0) {
      userlist.innerHTML = "No results found";
      window.location.reload();
      return;
    }
    displaydata(data);
  });
}

function addlocal(value) {
  // add to local storage

  const county = { value };
  let items = localStorage.getItem("county")
    ? JSON.parse(localStorage.getItem("county"))
    : [];

  items.push(county);

  const uniqueItems = new Set();
  items = items.filter((item) => {
    const duplicate = uniqueItems.has(item.value);
    uniqueItems.add(item.value);
    return !duplicate;
  });

  localStorage.setItem("county", JSON.stringify(items));
}

  function viewStorage() {
  try {
    const per = JSON.parse(localStorage.getItem("county"));
   

    let resultsHTML = '';
       per.map(async (item)=>{
            // console.log(item.value);
            const url1 = `https://restcountries.com/v3.1/name/${item.value}?fullText=true`;
            const data =  await  fetchdata(url1);
            // console.log(data);
            // console.log(data[0].name.common);
            
          
             
    
       resultsHTML+=` <li><div class="user-data">
             <img src=${data[0].flags.png} alt=${ data[0].name.common} srcset="">
             <div>
             <a class="countylink"data-country="${  data[0].name.common}"   style =" color: inherit;  text-decoration:none"href= "https://www.google.com/search?q=${ data[0].name.common}"    target="_blank"><p>${ data[0].name.common}</p></a>
             </div>
             </div></li>`;
            
             result.innerHTML=resultsHTML;
            
    })




  } catch (e) {
    userlist.innerHTML = "No results found ";
    return;
  }
}

function clearStorage() {
  localStorage.clear();
  window.location.reload();
}



document.addEventListener("DOMContentLoaded", searchcounty);
view.addEventListener("click", viewStorage);
clear.addEventListener("click", clearStorage);



document.addEventListener("DOMContentLoaded", () => {
  const viewStorageBtn = document.getElementById("viewStorage");
  // const clearStorageBtn = document.getElementById("clearStorage");
  const storageButtons = document.querySelector(".storage-buttons");
  let backButton; // Declare outside to access globally

  viewStorageBtn.addEventListener("click", () => {

      if (!backButton) {

          backButton = document.createElement("button");
          backButton.innerHTML = `<i class="fas fa-arrow-left"></i> <span class="tooltip">Back</span>`;
          backButton.classList.add("storage-btn", "backButton");

          storageButtons.appendChild(backButton);

          viewStorageBtn.style.display = "none";
      }
  });


  storageButtons.addEventListener("click", (event) => {
      if (event.target.closest(".backButton")) {

          backButton.remove();
          window.location.reload();


   
          viewStorageBtn.style.display = "inline-block";
      }
  });
});
