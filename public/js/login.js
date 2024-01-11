/* eslint-disable */

async function login(email, password) {
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
    console.log(res);
  } catch (err) {
    console.log(err.response.data);
  }
}

const form = document.querySelector(".form").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  login(email, password);
});
