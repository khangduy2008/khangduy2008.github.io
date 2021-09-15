let contact = document.getElementById("contact")

contact.onsubmit = (e)=>{
     e.preventDefault();
     setText("#suEmail" , "")
     setText("#suPassword" , "")
     setText("#sucfPassword", "")
let txtEmail = contact.txtEmail.value
let txtPassword = contact.txtPassword.value
let txtcfPassword = contact.txtcfPassword.value
console.log(txtcfPassword);

if(!txtEmail){
     setText("#suEmail" , "email is required") 
}
if(!txtPassword){
     setText("#suEmail" , "password is required")
}else if(txtPassword.length < 6){
     setText("#suPassword", "password length must be at leasl 6 character")  
}

if(!txtcfPassword){
     setText("#sucfPassword", "confirm password is required")
}else if(txtcfPassword != txtPassword){
     setText("#sucfPassword" , "confirm password not matched")   
}else{
     firebase
     .auth()
     .createUserWithEmailAndPassword(txtEmail, txtPassword)
     .then((userCredential) => {
       // Signed in
       var user = userCredential.user;
       firebase.auth().currentUser.sendEmailVerification();
       sweetAlert("success", "Successfully, please check your email");
       // ...
     })
     .catch((error) => {
       var errorMessage = error.message;
       sweetAlert("error", errorMessage);
     });
}

}

let setText = (query,content)=>{
     document.querySelector(query).innerHTML = content
}


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
   
