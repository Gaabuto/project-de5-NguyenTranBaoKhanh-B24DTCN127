let users = JSON.parse(localStorage.getItem("users")) || [];

function CreatAcc(e) {
  e.preventDefault();
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;
  let firstNameError = document.getElementById("firstNameError");
  let lastNameError = document.getElementById("lastNameError");
  let emailError = document.getElementById("emailError");
  let passwordError = document.getElementById("passwordError");
  let confirmPasswordError = document.getElementById("confirmPasswordError");
  let registerMessage = document.getElementById("registerMessage");
  //reset
  firstNameError.textContent = "";
  lastNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  registerMessage.textContent = "";

  if (firstName === "" || lastName === "") {
    if (firstName === "") {
      firstNameError.textContent = "First Name không được để trống";
    }
    if (lastName === "") {
      lastNameError.textContent = "Last Name không được để trống";
    }
    return;
  }

  let emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    emailError.textContent = "Email không đúng định dạng";
    return;
  }

  let userIndex = users.findIndex((user) => user.email === email);
  if (userIndex !== -1) {
    emailError.textContent = "Email đã tồn tại. Vui lòng chọn email khác";
    return;
  }

  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    passwordError.textContent =
      "Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số";
    return;
  }

  if (password !== confirmPassword) {
    confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp";
    return;
  }

  users.push({
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
  });
  localStorage.setItem("users", JSON.stringify(users));
  registerMessage.textContent = "Đăng ký thành công";
  setTimeout(() => {
    window.location.href = "login.html";
  }, 900);
}

function loginPage(e) {
  e.preventDefault();
  window.location.href = "login.html";
}

function registerPage(e) {
  e.preventDefault();
  window.location.href = "register.html";
}
