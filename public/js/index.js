/*eslint-disable*/
import "core-js/stable";
import "regenerator-runtime/runtime.js";
import displayMap from "./leaflet";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { logout, signupOrLogin } from "./login";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";

//DOM ELEMENT
const logInForm = document.querySelector(".form--login");
const signUpForm = document.querySelector(".form--signup");
const forgotPassForm = document.querySelector(".form--forgot-password");
const resetPassForm = document.querySelector(".form--reset-password");
const updateForm = document.querySelector(".form-user-data");
const updatePassword = document.querySelector(".form-user-password");
const logoutButton = document.querySelector(".nav__el--logout");
const bookButton = document.getElementById("book-tour");

//DELEGATION
if (document.getElementById("map")) {
  const locations = JSON.parse(document.getElementById("map").dataset.locations);
  displayMap(locations);
}

if (logInForm) {
  const btn = document.getElementById("loginBtn");
  logInForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    //VALUES
    btn.textContent = "Please wait...";
    btn.disabled = true;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await signupOrLogin({ email, password });
    btn.disabled = false;
    btn.textContent = "Log in";
  });
}

if (signUpForm) {
  const btn = document.getElementById("signup-btn");
  signUpForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    //VALUES
    btn.textContent = "Signing up...";
    btn.disabled = true;

    const name = document.getElementById("name").value;
    const email = document.getElementById("sign-email").value;
    const password = document.getElementById("sign-password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    await signupOrLogin({ name, email, password, passwordConfirm }, (type = "signup"));

    btn.disabled = false;
    btn.textContent = "Sign up";
  });
}

if (forgotPassForm) {
  const btn = document.getElementById("loginBtn");
  forgotPassForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    //VALUES
    btn.textContent = "Please wait...";
    btn.disabled = true;
    const email = document.getElementById("email").value;
    await forgotPassword(email);
    btn.disabled = false;
    btn.textContent = "Log in";
  });
}

if (resetPassForm) {
  const btn = document.getElementById("signup-btn");
  resetPassForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    //VALUES
    btn.textContent = "Reseting...";
    btn.disabled = true;
    const token = window.location.href.split("/")[4];
    const password = document.getElementById("sign-password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    await resetPassword({ password, passwordConfirm }, token);

    btn.disabled = false;
    btn.textContent = "Reset";
  });
}

if (updateForm) {
  const savingBtn = document.getElementById("save-setting");
  updateForm.addEventListener("submit", async function(e) {
    savingBtn.textContent = "Saving...";
    savingBtn.disabled = true;

    e.preventDefault();
    //VALUES
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    await updateSettings(form, "data");

    savingBtn.disabled = false;
    savingBtn.textContent = "Save settings";
  });
}

if (updatePassword) {
  const saveBtn = document.querySelector(".btn--save-password");
  updatePassword.addEventListener("submit", async function(e) {
    e.preventDefault();
    saveBtn.textContent = "Updating...";
    saveBtn.disabled = true;
    //VALUES
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, "password");

    saveBtn.disabled = false;
    saveBtn.textContent = "SAVE PASSWORD";

    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

if (bookButton) {
  bookButton.addEventListener("click", async e => {
    e.target.textContent = "Processing...";
    e.target.disabled = true;
    const { tourId } = e.target.dataset;
    await bookTour(tourId);
    e.target.disabled = false;
    e.target.textContent = "Book tour now!";
  });
}
