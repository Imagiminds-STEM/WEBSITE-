const registerationForm = document.getElementById("reg-form");

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
    console.log(res.data);
    alert("You have been registered successfully");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        alert(error.msg);
      });
    }
  }
});
