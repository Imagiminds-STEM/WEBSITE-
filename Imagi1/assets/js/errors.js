const loginForm = document.getElementById("login-form");

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
    alert("You have been logged in successfully");
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        alert(error.msg);
      });
    }
  }
});

const registerationForm = document.getElementById("reg-form");

registerationForm.addEventListener("submit", async (e) => {
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
