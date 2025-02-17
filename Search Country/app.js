"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const result = get(".user-list");
const searchbox = get(".search-box");
const userlist = get(".user-list");
const view = get(".viewStorage");
const clear = get(".clearStorage");
function get(selection) {
    try {
        return document.querySelector(selection);
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
function fetchdata(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            // if (!response) throw new Error("Country not found");
            const data = yield response.json();
            return data;
        }
        catch (_a) {
            userlist.innerHTML = "No results found";
            return;
        }
    });
}
function searchcounty() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://restcountries.com/v3.1/all`;
        const data = yield fetchdata(url);
        if (typeof data === "undefined") {
            return undefined;
        }
        displaydata(data);
        search();
    });
}
function displaydata(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const countrresult = data
                .map((item) => {
                const common1 = item.name.common;
                const flag = item.flags.png;
                const location = item.maps.googleMaps;
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
                    const currentTarget = event.currentTarget;
                    if (currentTarget) {
                        const countryName = currentTarget.dataset.country;
                        // console.log(countryName);
                        addlocal(countryName);
                    }
                });
            });
        }
        catch (_a) {
            userlist.innerHTML = "No results found";
        }
    });
}
function search() {
    return __awaiter(this, void 0, void 0, function* () {
        searchbox.addEventListener("input", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const qurey = searchbox.value.toLowerCase();
                const url1 = `https://restcountries.com/v3.1/name/${qurey}`;
                const data = yield fetchdata(url1);
                if (qurey.length === 0 || typeof data === "undefined") {
                    userlist.innerHTML = "No results found";
                    window.location.reload();
                    return;
                }
                displaydata(data);
            });
        });
    });
}
function addlocal(value) {
    // add to local storage
    if (typeof value === "undefined") {
        return;
    }
    const county = value;
    const saveddata = localStorage.getItem("county");
    let items = saveddata
        ? JSON.parse(saveddata)
        : [];
    if (items) {
        items.push(county);
        // console.log(items);
        const uniqueItems = new Set();
        items = items.filter((item) => {
            const duplicate = uniqueItems.has(item);
            uniqueItems.add(item);
            return !duplicate;
        });
        localStorage.setItem("county", JSON.stringify(items));
    }
}
function viewStorage() {
    try {
        const saveddata = localStorage.getItem("county");
        if (saveddata) {
            const per = JSON.parse(saveddata);
            let resultsHTML = "";
            per.map((item) => __awaiter(this, void 0, void 0, function* () {
                const url1 = `https://restcountries.com/v3.1/name/${item}?fullText=true`;
                const data = yield fetchdata(url1);
                if (data) {
                    resultsHTML += ` <li><div class="user-data">
             <img src=${data[0].flags.png} alt=${data[0].name.common} srcset="">
             <div>
             <a class="countylink"data-country="${data[0].name.common}"   style =" color: inherit;  text-decoration:none"href= "https://en.wikipedia.org/wiki/${data[0].name.common}"    target="_blank"><p>${data[0].name.common}</p></a>
             </div>
             </div></li>`;
                    result.innerHTML = resultsHTML;
                }
            }));
        }
        userlist.innerHTML = "No results found ";
    }
    catch (e) {
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
    const storageButtons = document.querySelector(".storage-buttons");
    let backButton;
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
