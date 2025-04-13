function loginPage(e) {
  e.preventDefault();
  window.location.href = "login.html";
}

function registerPage(e) {
  e.preventDefault();
  window.location.href = "register.html";
}

function unlogin(e) {
  e.preventDefault();
  window.location.href = "unLogin.html";
  localStorage.removeItem("loginacc");
}

function checklogin() {
  let check = JSON.parse(localStorage.getItem("loginacc")) || "";
  if (!check) {
    window.location.href = "unLogin.html";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let acc = users.findIndex((user) => user.email === check);
  if (acc === -1) {
    localStorage.removeItem("loginacc");
    window.location.href = "unLogin.html";
    return;
  }

  let welcome = document.getElementById("welcomeback");
  let hello = document.getElementById("hi");
  let statusAcc = users[acc];
  if (hello) {
    hello.innerHTML = `Hi, ${statusAcc.lastName} ${statusAcc.firstName}`;
  }
  if (welcome) {
    welcome.innerHTML = `Chào mừng bạn đã quay lại học, ${statusAcc.lastName} ${statusAcc.firstName}!`;
  }
}

function connectQuiz(e) {
  e.preventDefault();
  window.location.href = "quiz.html";
}

checklogin();
