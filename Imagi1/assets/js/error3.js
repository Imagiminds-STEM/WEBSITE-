const loginForm = document.getElementById("courses-form");
const errorsDiv = document.getElementById("error3-div");

loginForm.addEventListener("enrol", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "/api/users/login",
      { email },
      config
    );

    var para = document.createElement("P");
    para.innerText = "You have enrolled successfully";
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
