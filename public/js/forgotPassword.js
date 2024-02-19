import { showAlert } from "./alerts";

export async function forgotPassword(email) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/forgotPassword",
      data: { email }
    });

    if (res.data.status === "success") {
      showAlert("success", `Check you email inbox`);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err?.response?.data.message);
  }
}
