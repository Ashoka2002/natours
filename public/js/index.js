/*eslint-disable*/
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import { login, logout } from "./login";
import displayMap from "./leaflet";
import { updateSettings } from "./updateSettings";

//DOM ELEMENT
const logInForm = document.querySelector(".form--login");
const updateForm = document.querySelector(".form-user-data");
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
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (updateForm) {
  updateForm.addEventListener("submit", function(e) {
    e.preventDefault();
    //VALUES
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    updateSettings(email, name);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
