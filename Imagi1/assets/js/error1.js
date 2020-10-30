const loginForm = document.getElementById("login-form");
const errorsDiv = document.getElementById("error1-div");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
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
      { email, password },
      config
    );

    var para = document.createElement("P");
    para.innerText = "You have been logged in successfully";
    para.style.color = "black";
    para.style.margin = "10px auto";
    para.style.background = "white";
    errorsDiv.appendChild(para);
    var query = "https://imagiminds.herokuapp.com/userlogin?";
    query+=encodeURIComponent('email') + '=' + encodeURIComponent(email);
    window.location.href=query;
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
