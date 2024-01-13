/*eslint-disable*/
import { showAlert } from "./alerts";

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://localhost:3000/api/v1/users/updateMyPassword"
        : "http://localhost:3000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data
    });
    if (res.data.status === "success") {
      showAlert("success", `${type.split("")[0].toUpperCase() + type.slice(1)} updated successfully!`);
      location.reload();
    }
  } catch (err) {
    console.log(err.response);
    showAlert("error", err.response.data.message);
  }
};
