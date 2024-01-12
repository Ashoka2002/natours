/* eslint-disable */

import { showAlert } from "./alerts";

export async function login(email, password) {
  // if (!email || !password) return;
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      data: {
        email,
        password
      }
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in succesfull!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
}
