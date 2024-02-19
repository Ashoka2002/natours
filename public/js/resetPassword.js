import { showAlert } from "./alerts";

export async function resetPassword(data, token) {
  try {
    const res = await axios({
      method: "PATCH",
      url: `/api/v1/users/resetPassword/${token}`,
      data
    });

    if (res.data.status === "success") {
      showAlert("success", `Password successfully changed`);
    }
  } catch (err) {
    console.log(err);
    showAlert("error", err?.response?.data.message);
  }
}
