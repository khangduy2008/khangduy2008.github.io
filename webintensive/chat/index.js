let clock = document.querySelector("#real_time");

let getRealTime = () => {
  let date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let d = days[date.getUTCDay()];
  
  let h_ = "";
  let m_ = "";
  let s_ = "";

  if (h < 10) {
    h_ = "0" + h;
  } else {
    h_ = h;
  }
  if (m < 10) {
    m_ = "0" + m;
  } else {
    m_ = m;
  }
  if (s < 10) {
    s_ = "0" + s;
  } else {
    s_ = s;
  }

  let time = h_ + ":" + m_ + ":" + s_ + " " + d;

  return time;
};


setInterval(function () {
  clock.innerHTML = getRealTime();
}, 1000);

window.onload = init

async function init(){
  firebase.auth().onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
      loadConversations(user.email)
      handleConversationChange(user.email)

    } else {
      sweetAlert("warning","you need to login to chat")
      setTimeout(function(){ open("./signin.html","_self") }, 3000);
    }
  });
}

let loadConversations = async (email) =>{
  let currenEmail = email.trim()
  document.querySelector("#currentEmail").innerHTML = currenEmail
  let result = await firebase.firestore().collection('chat').where('user', 'array-contains', currenEmail).get()

  let data = getDataFromDocs(result.docs)
  console.log(data);
  rederChat(data[0],currenEmail)
  rederListUsers(data, currenEmail)
};

let rederChat = (data,email) =>{
  let dom = document.querySelector(".chat_content")
  let chat_name = document.querySelector("#currentName")
  let chat_id = document.querySelector("#currentId")
  chat_name.innerHTML= data.name
  chat_id.innerHTML=data.id
  dom.innerHTML=''

  for(let i = 0; i < data.messages.length; i++) {
    let chatClass='message'
    if(data.messages[i].owner == email){
     chatClass = "message owner"   
    }
    let html = `<div class="${chatClass}">
    <div class="message_info">
      <span>${data.messages[i].owner}</span>
      <span>${data.messages[i].time}</span>
    </div>
    <span class="content_m">${data.messages[i].content}</span>
  </div>`
  dom.innerHTML +=html
  }

      
      
}
let rederListUsers = (data,email)=> {
  let dom = document.querySelector(".userlist")
  dom.innerHTML = ""
  for(let i =0; i<data.length; i++){
    let html = ` <div id="c${data[i].id}" class="user">
    <span><img id="ava" src="${data[i].img}">${data[i].name} </span>
    <span>${data[i].createAt}</span>
</div>`

dom.innerHTML +=html
  }
  for(let i =0; i<data.length; i++){
    let user = document.querySelector(`#c${data[i].id}`)
    user.onclick = ()=>{
      rederChat(data[i],email)
    }
  }
}
 


 let getDataFromDoc = (doc)=>{
  let data = doc.data()
  data.id = doc.id
  return data

};

let getDataFromDocs = (docs)=>{
 let result =[]
 for(let doc of docs){
     let data = getDataFromDoc(doc)
     result.push(data)
  }
 return result
};

let signOut = ()=>{
  firebase.auth().signOut().then(() => {
    open("./signin.html","_self")
  }).catch((error) => {
    sweetAlert("error",error)
  });

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

let formInputMessage = document.querySelector("#sent_message");
formInputMessage.onsubmit = (e) => {
e.preventDefault();
let currentEmail = document.querySelector("#currentEmail").innerHTML;
let currentId = document.querySelector("#currentId").innerHTML;

let message = formInputMessage.m.value;

updateMessage(message, currentEmail, currentId);
formInputMessage.m.value = "";
};

let updateMessage = async (messageContent, currenEmail, currentId) => {
let message = {
  content: messageContent,
  owner: currenEmail,
  time: getRealTime(),
};

await firebase
  .firestore()
  .collection("chat")
  .doc(currentId)
  .update({
    messages: firebase.firestore.FieldValue.arrayUnion(message),
  });
};

let handleConversationChange = async (email) => {
let skipRun = true;
let currentEmail = email;
console.log(currentEmail);
firebase
  .firestore()
  .collection("chat")
  .where("user", "array-contains", currentEmail)
  .onSnapshot(function (snapshot) {
    if (skipRun) {
      skipRun = false;
      return;
    }

    let docChanges = snapshot.docChanges();
    for (let docChange of docChanges) {
      let type = docChange.type;
      let conversationDoc = docChange.doc;
      let conversation = getDataFromDoc(conversationDoc);

      if (type == "modified") {
        
        rederChat(conversation, currentEmail);
      }
      if (type == "added") {
        setTimeout(function () {location.reload();}, 5000);
      }
    }
  });
};

let formInput = document.querySelector("#add")
let btn = document.querySelector("#btn")
btn.addEventListener("click", ()=>{
  let name = formInput.name.value
  let email = formInput.email.value.toLowerCase()

  console.log(name);
  console.log(email);

  addNewConversation(name, friendEmai)
})

let addNewConversation = async (chatName, friendEmai)=>{
  let currenEmail = document.querySelector("#currentEmail").innerHTML
  let newUsers = [friendEmai,currenEmail ]
  // code upload ảnh lên firebase
  const ref = await firebase.storage().ref();
  const file = document.querySelector("#photo").files[0];

  const metadata = {
    contentType: file.type,
  };
  const name = file.name;
  const imgUploaded = ref.child(name).put(file, metadata);

  imgUploaded
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
     let conversation = {
      createAt: getRealTime(),
      img: url,
      messages: [],
      name: chatName,
      user: newUsers
     }
     addConversation(conversation)
    })
    .catch((err) => {
      alert(err);
    });
}

let addConversation = async (data)=>{
  await firebase.firestore().collection("chat").add(data)
}