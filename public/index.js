const backEndUrl = "http://localhost:4000/api/users";

document.addEventListener("DOMContentLoaded", initialize);
const addUser = userDetails => {
  return axios
    .post(`${backEndUrl}/add`, userDetails)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

const loginUser = userDetails => {
  return axios
    .post(`${backEndUrl}/login`, userDetails)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err.response.data;
    });
};

const forgotPassword = requestEmail => {
  return axios
    .get(`${backEndUrl}/called/password/forgotpassword`, {
      headers: { requestEmail: requestEmail }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

const checkResetOtp = (id, otp) => {
  return axios
    .get(`${backEndUrl}/called/password/checkotp`, {
      headers: { id: id, otp: otp }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

const resetPassword = (id, newPassword) => {
  return axios
    .get(`${backEndUrl}/called/password/reset`, {
      headers: { id: id, newPassword: newPassword }
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return err;
    });
};

function initialize() {
  localStorage.removeItem("token");
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  const userDetails = {
    email: email,
    password: password
  };
  const loginResult = await loginUser(userDetails);

  if (loginResult.success === false) {
    alert(loginResult.message);
    return;
  }
  localStorage.setItem("token", loginResult.accessToken);
  window.location.href = "./expenses.html";
}

async function handleSignUpSubmit(event) {
  event.preventDefault();
  const username = document.querySelector("#name");
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm_password");
  if (password.value !== confirmPassword.value) {
    alert("Password does not match!");
    return;
  }
  const userDetails = {
    username: username.value,
    email: email.value,
    password: password.value
  };

  await addUser(userDetails);
  username.value = "";
  email.value = "";
  password.value = "";
  window.location.href = "./index.html";
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const requestEmail = document.querySelector("#forgot-email").value;

  const result = await forgotPassword(requestEmail);
  if (result.success == true) {
    localStorage.setItem("id", result.id);
    window.location.href = "./resetPassword.html";
  }
}

async function handleResetPassword(event) {
  event.preventDefault();
  const mainDiv = document.querySelector("#main_div");
  const id = localStorage.getItem("id");
  const otp = document.querySelector("#otp").value;
  const otpResult = await checkResetOtp(id, otp);
  if (otpResult.success == true) {
    const div = document.createElement("div");
    div.innerHTML = `
    <label>Enter new password:</label>
    <input id="password" type="password" placeholder="password" />
    <label>Confirm Password:</label>
    <input id="confirm_password" type="password" placeholder="Confirm password" />
    `;
    const button = document.createElement("button");
    button.innerText = "Reset";
    button.addEventListener("click", () => {
      passwordReset();
    });
    mainDiv.innerHTML = "";
    div.appendChild(button);
    mainDiv.appendChild(div);
  } else {
    alert("OTP does not match!");
  }
}

async function passwordReset() {
  const newPassword = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm_password");
  if (newPassword.value !== confirmPassword.value) {
    alert("Password does not match!");
    return;
  }
  if (confirmPassword.value == "") {
    alert("Please provide a password!");
    return;
  }
  const id = localStorage.getItem("id");

  const resetResult = await resetPassword(id, newPassword.value);
  if (resetResult.success == true) {
    window.location.href = "./index.html";
    return;
  }
}
