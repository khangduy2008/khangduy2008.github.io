let fromFeedback = document.getElementById("contact")

fromFeedback.onsubmit = (e)=>{
   e.preventDefault();




let name = fromFeedback.txtName.value
let email = fromFeedback.txtEmail.value
let phone = fromFeedback.txtPhone.value
let message = fromFeedback.txtMsg.value


let data = {
    name : name,
    email : email,
    phone : phone,
    message : message
}



$.ajax({
    url: './sendEmail.php',
    method: 'POST',
    dataType: 'json',
    data: data,
    success: function (data) {
        sweetAlert(data.status, data.response);
    }
});

return false

}




function sweetAlert(icon, content) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: content
    })
}








