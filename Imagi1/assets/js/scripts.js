function passcheck() {
  //  var p1=document.getElementById("p1").value;
  // var p2=document.getElementById("p2").value;
  if (
    document.getElementById("p1").value == document.getElementById("p2").value
  ) {
    document.getElementById("msg").style.display = "block";
    document.getElementById("msg").style.color = "green";
    document.getElementById("msg").innerHTML = "Passwords matched";
  } else {
    document.getElementById("msg").style.display = "block";
    document.getElementById("msg").style.color = "red";
    document.getElementById("msg").innerHTML = "Passwords do not match";
  }
  //document.getElementById("msg").style.display="none";
}
function fun1() {
  document.getElementById("msg").style.display = "block";
}
function fun2() {
  document.getElementById("msg").style.display = "none";
}

// function focusfun()
// {
//   document.getElementById("message").style.display="block";
// }
// function blurfun()
// {
//   document.getElementById("message").style.display="none";
// }

function typefun() {
  var pass = document.getElementById("p1");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");

  var lowerCaseLetters = /[a-z]/g;
  if (pass.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
  }

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if (pass.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if (pass.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if (pass.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}

function clickfun() {
  var x = document.getElementById("p1");
  var y = document.getElementById("p2");
  if (x.type == "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
  if (y.type == "password") {
    y.type = "text";
  } else {
    y.type = "password";
  }
}

function clickfun2() {
  var x = document.getElementById("password");
  //var y=document.getElementById("p2");
  if (x.type == "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
