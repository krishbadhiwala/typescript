


interface fetchcurrency {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: Record<string, number>;
}

async function fetchdata(url: string): Promise<fetchcurrency | undefined> {
  try{
  const inputurl: string = url;
  const baseurl: string = `https://v6.exchangerate-api.com/v6/e9dbcbb88ee65ebf55cc7fff/latest/${inputurl}`;

  const response = await fetch(baseurl);
  const data: fetchcurrency = await response.json();

  return data;}
  catch{
    alert(`Something Went Wrong: ${Error}` );
    return undefined;
  }
}


const selectoption=get(".select-option") as HTMLSelectElement;
const selectoption1=get("#toCurrency") as HTMLSelectElement;
const error=get(".error") as HTMLSelectElement;
const swapbtn=get(".swap-btn") as HTMLSelectElement;
const inputbox=get(".input-box1234") as HTMLButtonElement;
const convert=get(".convert") as HTMLButtonElement;
const fromcurrency=get(".from-currency") as HTMLButtonElement;

async function fetchAndDisplay() { 
  showLoading();
  const data: fetchcurrency | undefined = await fetchdata("inr");
  if (data) {
    displaydata(data);
    hideLoading();
  }
  else{
    alert(`Something Went Wrong:` );
  }
}


swapbtn.addEventListener("click",()=>{

  if(selectoption && selectoption1){

    
    let temp: string = selectoption.value;
    selectoption.value = selectoption1.value;
    selectoption1.value = temp;

    calulation (Number(inputbox.value),selectoption.value,selectoption1.value);
    
    
    
  }
})

inputbox.addEventListener("input",()=>{
  
  calulation (Number(inputbox.value),selectoption.value,selectoption1.value);
  
  
})



async function calulation(no:number,op1:string,op2:string):Promise<void>{
  
  
    if(no && op1 &&op2){
      convert.innerHTML="loading...";
  error.innerHTML=""; 
      const baseamount = 0+no;
      const data : fetchcurrency| undefined = await fetchdata(op1);
        
            if(data){    
              const amount =data.conversion_rates[op2];
              if(amount){      
               const finalamount:number=baseamount*amount;
               const words:string = convertToWords(Math.ceil(baseamount*amount));
               convert.innerHTML=`${finalamount}`;
               error.innerHTML=`(${words})`;
              }
            } 
            else{
              alert(`Something Went Wrong: ${Error}` );
            }
     }

 
}


  function optionselction(){
if (selectoption) {
    selectoption.addEventListener("change", async function (): Promise<void> {
      const selectedCurrency = selectoption.value;
      calulation(Number(inputbox.value),selectedCurrency,selectoption1.value)
         })

  }
if (selectoption1) {
  selectoption1.addEventListener("change", async function (): Promise<void> {
      const selectedCurrency1 = selectoption1.value;

      calulation(Number(inputbox.value),selectoption.value,selectedCurrency1)
         })

  }
}
const loadingElement = get<HTMLDivElement>(".loading");
const maincontainer = get<HTMLDivElement>(".main-container");
const container = get<HTMLDivElement>(".container");

function showLoading() {
  if (loadingElement&& maincontainer &&container) {
    loadingElement.classList.remove("hide-loading");
    maincontainer.classList.add("hide-loading")
    container.style.height = "340px";
  }
}

function hideLoading() {
  if (loadingElement&& container&&    maincontainer) {
    loadingElement.classList.add("hide-loading");
    container.style.height = "auto ";
    maincontainer.classList.remove("hide-loading")
 }
}




async function displaydata(data: fetchcurrency): Promise<void> {
  try {
    const result = Object.keys(data.conversion_rates)
    let finalresult=`<option value="">Select Currency</option>`;
    finalresult+= result.map( function(item){
      return`<option value="${item}">${item}</option>`
    }).join("")
    if (selectoption && selectoption1) {
      selectoption.innerHTML = finalresult;
      selectoption1.innerHTML=finalresult;
    }
  } catch (e) {
    alert(`Something Went Wrong: ${e}` );
  }
}




function get<T extends HTMLElement>(selection: string): T | null {
  try {
    return document.querySelector(selection) as T;
  } catch (error) {
    console.log(error);
    return null;
  }
}

document.addEventListener("DOMContentLoaded", optionselction);
document.addEventListener("DOMContentLoaded", fetchAndDisplay);







function convertToWords(n:number):string {
  if (n === 0) 
      return "Zero";
  
  // Words for numbers 0 to 19
  const units = [
      "",        "One",       "Two",      "Three",
      "Four",    "Five",      "Six",      "Seven",
      "Eight",   "Nine",      "Ten",      "Eleven",
      "Twelve",  "Thirteen",  "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  
  // Words for numbers multiple of 10        
  const tens = [
      "",     "",     "Twenty",  "Thirty", "Forty",
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
  return  res.trim();
}


