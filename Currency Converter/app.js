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
function fetchdata(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const inputurl = url;
            const baseurl = `https://v6.exchangerate-api.com/v6/e9dbcbb88ee65ebf55cc7fff/latest/${inputurl}`;
            const response = yield fetch(baseurl);
            const data = yield response.json();
            return data;
        }
        catch (_a) {
            alert(`Something Went Wrong: ${Error}`);
            return undefined;
        }
    });
}
const selectoption = get(".select-option");
const selectoption1 = get("#toCurrency");
const error = get(".error");
const swapbtn = get(".swap-btn");
const inputbox = get(".input-box1234");
const convert = get(".convert");
const fromcurrency = get(".from-currency");
function fetchAndDisplay() {
    return __awaiter(this, void 0, void 0, function* () {
        showLoading();
        const data = yield fetchdata("inr");
        if (data) {
            displaydata(data);
            hideLoading();
        }
        else {
            alert(`Something Went Wrong:`);
        }
    });
}
swapbtn.addEventListener("click", () => {
    if (selectoption && selectoption1) {
        let temp = selectoption.value;
        selectoption.value = selectoption1.value;
        selectoption1.value = temp;
        calulation(Number(inputbox.value), selectoption.value, selectoption1.value);
    }
});
inputbox.addEventListener("input", () => {
    calulation(Number(inputbox.value), selectoption.value, selectoption1.value);
});
function calulation(no, op1, op2) {
    return __awaiter(this, void 0, void 0, function* () {
        if (no && op1 && op2) {
            convert.innerHTML = "loading...";
            error.innerHTML = "";
            const baseamount = 0 + no;
            const data = yield fetchdata(op1);
            if (data) {
                const amount = data.conversion_rates[op2];
                if (amount) {
                    const finalamount = baseamount * amount;
                    const words = convertToWords(Math.ceil(baseamount * amount));
                    convert.innerHTML = `${finalamount}`;
                    error.innerHTML = `(${words})`;
                }
            }
            else {
                alert(`Something Went Wrong: ${Error}`);
            }
        }
    });
}
function optionselction() {
    if (selectoption) {
        selectoption.addEventListener("change", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const selectedCurrency = selectoption.value;
                calulation(Number(inputbox.value), selectedCurrency, selectoption1.value);
            });
        });
    }
    if (selectoption1) {
        selectoption1.addEventListener("change", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const selectedCurrency1 = selectoption1.value;
                calulation(Number(inputbox.value), selectoption.value, selectedCurrency1);
            });
        });
    }
}
const loadingElement = get(".loading");
const maincontainer = get(".main-container");
const container = get(".container");
function showLoading() {
    if (loadingElement && maincontainer && container) {
        loadingElement.classList.remove("hide-loading");
        maincontainer.classList.add("hide-loading");
        container.style.height = "340px";
    }
}
function hideLoading() {
    if (loadingElement && container && maincontainer) {
        loadingElement.classList.add("hide-loading");
        container.style.height = "auto ";
        maincontainer.classList.remove("hide-loading");
    }
}
function displaydata(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = Object.keys(data.conversion_rates);
            let finalresult = `<option value="">Select Currency</option>`;
            finalresult += result.map(function (item) {
                return `<option value="${item}">${item}</option>`;
            }).join("");
            if (selectoption && selectoption1) {
                selectoption.innerHTML = finalresult;
                selectoption1.innerHTML = finalresult;
            }
        }
        catch (e) {
            alert(`Something Went Wrong: ${e}`);
        }
    });
}
function get(selection) {
    try {
        return document.querySelector(selection);
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
document.addEventListener("DOMContentLoaded", optionselction);
document.addEventListener("DOMContentLoaded", fetchAndDisplay);
function convertToWords(n) {
    if (n === 0)
        return "Zero";
    // Words for numbers 0 to 19
    const units = [
        "", "One", "Two", "Three",
        "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven",
        "Twelve", "Thirteen", "Fourteen", "Fifteen",
        "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    // Words for numbers multiple of 10        
    const tens = [
        "", "", "Twenty", "Thirty", "Forty",
        "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const multiplier = ["", "Thousand", "Million", "Billion"];
    let res = "";
    let group = 0;
    // Process number in group of 1000s
    while (n > 0) {
        if (n % 1000 !== 0) {
            let value = n % 1000;
            let temp = "";
            // Handle 3 digit number
            if (value >= 100) {
                temp = units[Math.floor(value / 100)] + " Hundred ";
                value %= 100;
            }
            // Handle 2 digit number
            if (value >= 20) {
                temp += tens[Math.floor(value / 10)] + " ";
                value %= 10;
            }
            // Handle unit number
            if (value > 0) {
                temp += units[value] + " ";
            }
            // Add the multiplier according to the group
            temp += multiplier[group] + " ";
            // Add the result of this group to overall result
            res = temp + res;
        }
        n = Math.floor(n / 1000);
        group++;
    }
    // Remove trailing space
    return res.trim();
}
