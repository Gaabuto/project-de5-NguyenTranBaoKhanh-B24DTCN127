function loginAcc(e) {
  e.preventDefault();
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let email = document.getElementById("formGroupExampleInput").value;
  let password = document.getElementById("formGroupExampleInput2").value;
  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");
  let loginMessage = document.getElementById("loginMessage");

  emailError.textContent = "";
  passwordError.textContent = "";
  loginMessage.textContent = "";

  if (email === "" || password === "") {
    if (email === "") {
      emailError.textContent = "Email không được để trống";
    }
    if (password === "") {
      passwordError.textContent = "Mật khẩu không được để trống";
    }
    return;
  }

  let loginUser = users.findIndex((user) => user.email === email);
  if (loginUser !== -1) {
    if (users[loginUser].password === password) {
      loginMessage.textContent = "Đăng nhập thành công";
      localStorage.setItem("loginacc", JSON.stringify(users[loginUser].email));
      setTimeout(() => {
        window.location.href = "loggedIn.html";
      }, 500);
    } else {
      passwordError.textContent = "Mật khẩu sai, vui lòng nhập lại";
    }
  } else {
    emailError.textContent = "Email không tồn tại, vui lòng nhập lại";
  }
}

function loginPage(e) {
  e.preventDefault();
  window.location.href = "login.html";
}

function registerPage(e) {
  e.preventDefault();
  window.location.href = "register.html";
}

function checklogin() {
  let check = JSON.parse(localStorage.getItem("loginacc")) || "";
  if (check) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let acc = users.findIndex((user) => user.email === check);
    if (acc !== -1) {
      window.location.href = "loggedIn.html";
    } else {
      localStorage.removeItem("loginacc");
    }
  }
}

checklogin();
