let prompt=document.querySelector("#prompt")
let chatcontainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let submitbtn =document.querySelector("#submit")

let imageinput=document.querySelector("#image input")

const Api_url="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key= AIzaSyB2CBLGHocgt19WNn3n_0qkdSXOoEWsGcI"
let user={
    message:null,
    file:{
      mime_type: null,
            data:null
    }

    }
    async function generateresponse(aichatbox){


        let text=aichatbox.querySelector(".ai-chat-area")
        let requestoption={
            method:"POST",
            headers:{'Content-Type': 'application/json'},
            body:JSON.stringify({
                "contents": [
                  {
                    "parts": [
                      { "text": user.message},(user.file.data?[{"inline_data":user.file}]:[])
                    ]
                  }
                ]
              })   
        }
       try {
        let response=  await fetch(Api_url,requestoption)
        let data =await response.json()
        let apiresponse =data.candidates[0].content.parts[0].text;
        console.log(apiresponse);
        text.innerHTML=apiresponse

       }
       catch(error){
          console.log(error);
       }
       finally{
        chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})
       }
        
        let response=fetch(Api_url,requestoption)
    }

function createchatbox(html,classes){
    let div =document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}


function handlechatresponse(message){
    user.message=message
    let html=`<img src="user-image1.png" alt=""id="userimage"width="50">
      <div class="user-chat-area">
      ${user.message}
      ${user.file.data?`<img src="data:${user.file.mime_type};based64,${user.file.data}" 
      class="choseimg"/>`:""}
      </div>`
      prompt.value=""
      let userchatbox=createchatbox(html,"user-chat-box")
      chatcontainer.appendChild(userchatbox)
      chatcontainer.scrollTo({top:chatcontainer.scrollHeight,behavior:"smooth"})
      setTimeout(()=>{
          let html=`<img src="ai-image.jpg" alt=""id="aiimage"width="60">
    <div class="ai-chat-area">
    <img src="loading.webp" alt=""class="load"width="50px">
    </div>`
    let aichatbox=createchatbox(html,"ai-chat-box")
    chatcontainer.appendChild(aichatbox)
    generateresponse(aichatbox)


      },300)

}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatresponse(prompt.value)
       
    }
   
    
})
imageinput.addEventListener("change",()=>{
  const file =imageinput.files[0]
  if(!file) return
  let reader=new FileReader()
  reader.onload=(e)=>{
   let base64string=e.target.result.split(",")[1]
   user.file={
    mime_type:file.type,
    data:base64string
   }
  
  }
  reader.readAsDataURL(file)
})

imageinput.addEventListener("change",()=>{
  const file=imageinput.file
  if(!file)return
  let reader=new FileReader()
  reader.onload=(e)=>{
   console.log(e)
    
  }
  reader.readAsDataURL(file)
})
imagebtn.addEventListener("click",()=>{
  imagebtn.querySelector("input").click()
})

submitbtn.addEventListener("click",()=>{
   if(prompt.value.trim()==="")return;
   handlechatresponse(prompt.value);
});