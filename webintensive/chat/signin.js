let contact = document.getElementById("contact");

contact.onsubmit = (e) => {
  e.preventDefault();

  let txtEmail = contact.txtEmail.value;
  let txtPassword = contact.txtPassword.value;

  if (txtEmail.length < 4) {
    setText("#siEmail", "email is not valid");
  }
  if (txtPassword.length < 6) {
    setText("#siPassword", "password is not valid");
  }
  if (txtEmail && txtPassword) {
    firebase
      .auth()
      .signInWithEmailAndPassword(txtEmail, txtPassword)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        if (user.emailVerified) {
          open("./index.html","_self")
        } else {
          sweetAlert("error", "must verigied your email ");
        }
        // ...
      })
      .catch((error) => {
        var errorMessage = error.message;
        sweetAlert("error".errorMessage);
      });
  }
};

let setText = (query, content) => {
  document.querySelector(query).innerHTML = content;
};

let sweetAlert = (icon, content) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: icon,
    title: content,
  });
};
