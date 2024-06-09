"use strict";

const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getBtn = document.querySelector(".container button");
const exIcon = document.querySelector(".reverse");
const amountEl = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

const API_KEY = "0c356af7d4c81015043245ae"; //API keys are used to track and control how the API is being used, 
//as well as to identify the source of API requests, Authentication:API keys are commonly used in web development, mobile app development, 
//and other software projects where applications need to interact with external services or data sources via APIs.
// They serve as a simple and effective mechanism for authentication and access control in API-based systems.

[fromCurrency, toCurrency].forEach((select, i) => {
  for (let curcode in Country_List) {
    const selected =
      (i === 0 && curcode === "USD") || (i === 1 && curcode === "GBP")
        ? "selected"
        : "";

    select.insertAdjacentHTML(
      "beforeend",
      ` <option value="${curcode}" ${selected}>${curcode}</option>`,
    );
  }

  // event in select and option
  select.addEventListener("change", () => {
    const code = select.value;
    const imgTag = select.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`;
  });
});

// get data from api
async function getExchangeRate() {
  const amountValue = amountEl.value;
  exRateTxt.textContent = "Please Wait................";

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`,
    );
    const result = await response.json();

    const exRate = result.conversion_rates[toCurrency.value];
    const totalExRate = amountValue * exRate.toFixed(2);
    exRateTxt.textContent = `${amountValue} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    console.log(exRate);
  } catch (error) {
    exRateTxt.textContent = "Something Went Wrong";
  }
}

window.addEventListener("DOMContentLoaded", getExchangeRate);
getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exIcon.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [
    toCurrency.value,
    fromCurrency.value,
  ];
  [fromCurrency, toCurrency].forEach((select) => {
    const code = select.value;
    const imgTag = select.parentElement.querySelector("img");
    imgTag.src = `https://flagcdn.com/48x36/${Country_List[
      code
    ].toLowerCase()}.png`;
  });

  getExchangeRate();
});

amountEl.addEventListener("keyup", () => {
  getExchangeRate();
});