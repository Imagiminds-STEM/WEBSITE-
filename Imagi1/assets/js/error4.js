const loginForm = document.getElementById("users-form");
const errorsDiv = document.getElementById("error4-div");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password.value;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "/api/users/login",
      { name, email, password },
      config
    );

    var para = document.createElement("P");
    para.innerText = "You have changed your details";
    para.style.color = "black";
    para.style.margin = "10px auto";
    para.style.background = "white";
    errorsDiv.appendChild(para);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        var para = document.createElement("P");
        var t = document.createTextNode(error.msg);
        para.style.color = "white";
        para.style.margin = "10px auto";
        para.style.background = "black";
        para.appendChild(t);
        errorsDiv.appendChild(para);
      });
    }
  }
});