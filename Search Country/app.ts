
interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, { official: string; common: string }>;
  };
  tld: string[];
  cca2: string;
  ccn3: string;
  cca3: string;
  independent: boolean;
  status: string;
  unMember: boolean;
  currencies: Record<string, { name: string; symbol: string }>;
  idd: {
    root: string;
    suffixes: string[];
  };
  capital: string[];
  altSpellings: string[];
  region: string;
  languages: Record<string, string>;
  translations: Record<string, { official: string; common: string }>;
  latlng: [number, number];
  landlocked: boolean;
  area: number;
  demonyms: Record<string, { f: string; m: string }>;
  flag: string;
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  population: number;
  car: {
    signs: string[];
    side: string;
  };
  timezones: string[];
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  coatOfArms: Record<string, string>;
  startOfWeek: string;
  capitalInfo: {
    latlng: [number, number];
  };
}

const result = get(".user-list") as HTMLUListElement;
const searchbox = get(".search-box") as HTMLInputElement;
const userlist = get(".user-list") as HTMLUListElement;
const view = get(".viewStorage") as HTMLButtonElement;
const clear = get(".clearStorage") as HTMLButtonElement;

function get<T extends HTMLElement>(selection: string): T | null {
  try {
    return document.querySelector(selection) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchdata(url: string): Promise<Country[] | undefined> {
  try {
    const response = await fetch(url);
    // if (!response) throw new Error("Country not found");
    const data: Country[] = await response.json();

    return data;
  } catch {
    userlist.innerHTML = "No results found";
    return;
  }
}

async function searchcounty(): Promise<undefined> {
  const url = `https://restcountries.com/v3.1/all`;

  const data = await fetchdata(url);
  if (typeof data === "undefined") {
    return undefined;
  }
  displaydata(data);
  search();
}

async function displaydata(data: Country[]): Promise<void> {
  try {
    const countrresult = data
      .map((item) => {
        const common1:string = item.name.common;
        const flag :string= item.flags.png;
        const location:string=item.maps.googleMaps;

        return ` <li><div class="user-data">
         <img src=${flag} alt=${common1} srcset="">
         <div>
         <a class="countylink"data-country="${common1}"   style =" color: inherit;  text-decoration:none"href= "https://en.wikipedia.org/wiki/${common1}"    target="_blank"><p>${common1}</p></a>
         </div>
         </div></li>`;
      })
      .join("");

    result.innerHTML = countrresult;
    searchbox.innerHTML = "";
    document.querySelectorAll(".countylink").forEach((link) => {
      link.addEventListener("click", (event) => {
        const currentTarget = event.currentTarget as HTMLElement;
        if (currentTarget) {
          const countryName: string | undefined = currentTarget.dataset.country;
          // console.log(countryName);
          addlocal(countryName);
          
        }
      });
    });
  } catch {
    userlist.innerHTML = "No results found";
  }
}

async function search(): Promise<void> {
  searchbox.addEventListener("input", async function (): Promise<void> {
    const qurey: string = searchbox.value.toLowerCase();
    const url1: string = `https://restcountries.com/v3.1/name/${qurey}`;
    const data = await fetchdata(url1);
    if (qurey.length === 0 || typeof data === "undefined") {
      userlist.innerHTML = "No results found";
      window.location.reload();
      return;
    }
    displaydata(data);
  });
}

function addlocal(value:string|undefined):void {
  // add to local storage
if(typeof value ==="undefined"){
  return;
}
  const county = value ;

  

  const saveddata :string|null =localStorage.getItem("county");
  
  let items:string[]|null = saveddata
    ? JSON.parse(saveddata)
    : [];
    if(items){
  items.push(county);
  // console.log(items);
  

  const uniqueItems = new Set();
  items = items.filter((item) => {
    const duplicate = uniqueItems.has(item);
    uniqueItems.add(item);
    return !duplicate;
  });

  localStorage.setItem("county", JSON.stringify(items));}
}



function viewStorage() :void{
  try {
    const saveddata :string|null =localStorage.getItem("county");
    if(saveddata){
    const per:string[] = JSON.parse(saveddata);

    let resultsHTML = "";
    per.map(async (item) => {
      const url1:string = `https://restcountries.com/v3.1/name/${item}?fullText=true`;
      const data = await fetchdata(url1);

if(data){
      resultsHTML += ` <li><div class="user-data">
             <img src=${data[0].flags.png} alt=${data[0].name.common} srcset="">
             <div>
             <a class="countylink"data-country="${data[0].name.common}"   style =" color: inherit;  text-decoration:none"href= "https://en.wikipedia.org/wiki/${data[0].name.common}"    target="_blank"><p>${data[0].name.common}</p></a>
             </div>
             </div></li>`;

      result.innerHTML = resultsHTML;}
    });}
    userlist.innerHTML = "No results found ";
    
  } catch (e){
    return ;
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
  const viewStorageBtn = document.getElementById("viewStorage")as HTMLButtonElement;
  const storageButtons = document.querySelector(".storage-buttons")as HTMLButtonElement;
  let backButton:HTMLButtonElement; 

  viewStorageBtn.addEventListener("click", () => {
    if (!backButton) {
      backButton = document.createElement("button")as HTMLButtonElement;
      backButton.innerHTML = `<i class="fas fa-arrow-left"></i> <span class="tooltip">Back</span>`;
      backButton.classList.add("storage-btn", "backButton");

      storageButtons.appendChild(backButton);

      viewStorageBtn.style.display = "none";
    }
  });

  storageButtons.addEventListener("click", (event) => {
    if ((event.target as Element).closest(".backButton")) {
      backButton.remove();
      window.location.reload();

      viewStorageBtn.style.display = "inline-block";
    }
  });
});
