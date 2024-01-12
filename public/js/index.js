/*eslint-disable*/
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import { login, logout } from "./login";
import displayMap from "./leaflet";

//DOM ELEMENT
const logInForm = document.querySelector(".form");
const logoutButton = document.querySelector(".nav__el--logout");

//DELEGATION
if (document.getElementById("map")) {
  const locations = JSON.parse(document.getElementById("map").dataset.locations);
  displayMap(locations);
}
if (logInForm) {
  logInForm.addEventListener("submit", function(e) {
    e.preventDefault();
    //VALUES
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    login(email, password);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
