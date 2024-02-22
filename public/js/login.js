/* eslint-disable */

import { showAlert } from "./alerts";

export async function signupOrLogin(data, type = "login") {
  if (type === "singup")
    if (data.password !== data.passwordConfirm)
      return showAlert("error", "Password and confirm password not matching!");

  try {
    const res = await axios({
      method: "POST",
      url: `/api/v1/users/${type}`,
      data: type === "signup" ? data : { email: data.email, password: data.password }
    });

    if (res.data.status === "success") {
      showAlert("success", `${type} succesfull!`);
      window.setTimeout(() => {
        location.assign("/overview");
      }, 1500);
    }
  } catch (err) {
    showAlert(
      "error",
      err?.response?.data?.message.startsWith("E11000") ? "Email address alredy exist!" : err?.response?.data.message
    );
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
