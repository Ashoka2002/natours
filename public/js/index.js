/*eslint-disable*/
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import { login, logout } from "./login";
import displayMap from "./leaflet";
import { updateSettings } from "./updateSettings";

//DOM ELEMENT
const logInForm = document.querySelector(".form--login");
const updateForm = document.querySelector(".form-user-data");
const updatePassword = document.querySelector(".form-user-password");
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
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });
}

if (updatePassword) {
  updatePassword.addEventListener("submit", async function(e) {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    //VALUES
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    console.log(passwordCurrent, passwordConfirm, password);
    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    document.querySelector(".btn--save-password").textContent = "SAVE PASSWORD";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}
