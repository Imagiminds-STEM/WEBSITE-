const userForm = document.getElementById("user-form");
const errorsDiv = document.getElementById("error5-div");

userForm.addEventListener("submit", async (e) => {
  e.preventDefault();
 
  const e = e.target.email.value;
  const pwd = e.target.password.value;
  const name = e.target.name.value;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "/api/users/savechanges",
      {  e, pwd, name },
      config
    );
     console.log(res.data);
    var para = document.createElement("P");
    para.innerText = "User page";
    para.style.color = "black";
    para.style.margin = "10px auto";
    para.style.background = "white";
    errorsDiv.appendChild(para);
    window.location.href = "http://localhost:5000/";
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
