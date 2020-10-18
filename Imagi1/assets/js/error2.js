const registerationForm = document.getElementById("reg-form");
var errors = document.getElementById("error2-div");

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
    var t = document.createTextNode("You have registered successfully");
    para.appendChild(t);
    errors.appendChild(para);

    setTimeout(20, () => {
      window.location.href = "http://localhost:5000";
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        alert(error.msg);
      });
    }
  }
});
