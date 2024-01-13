/*eslint-disable*/
import { showAlert } from "./alerts";

export const updateSettings = async (email, name) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://localhost:3000/api/v1/users/updateMe",
      data: {
        email,
        name
      }
    });
    if (res.data.status === "success") {
      showAlert("success", "Data updated successfully!");
      location.reload();
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};
