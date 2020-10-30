const registerationForm = document.getElementById("reg-form");
const errorsDiv = document.getElementById("error2-div");

registerationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const email = e.target.email.value;
  const password = e.target.password1.value;

  // console.log(e.target.name.value);
  // console.log(e.target.email.value);
  // console.log(e.target.password1.value);

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );
    // console.log(res.data);

    var para = document.createElement("P");
    para.innerText = "You have been registered successfully";
    para.style.color = "black";
    para.style.margin = "10px auto";
    para.style.background = "white";
    errorsDiv.appendChild(para);
    window.location.href = "https://imagiminds.herokuapp.com/";
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
