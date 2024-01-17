/* eslint-disable */

import { showAlert } from "./alerts";

export async function login(email, password) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
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

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout"
    });
    showAlert("success", "Logged-out successfully");
    if (res.data.status === "success") location.assign("/");
  } catch (err) {
    showAlert("error", "Cannot logged out! Try again");
  }
};
