const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm_password");

confirmPassword.addEventListener("input", event => {
  const first = password.value;
  const second = event.target.value;
  if (first === second) {
    confirmPassword.style.backgroundColor = "#e6ffde";
    console.log(true);
  } else {
    confirmPassword.style.backgroundColor = "rgba(228, 108, 108, 1)";
  }
});
