
const form = document.querySelector('form');
const chatContainer = document.getElementById('chat-container')
let elementHtml = ''

function setUniqueId() {
    const date = (new Date()).getTime();
    const random = Math.random(1,1000).toString(16);
    return `id-${date}-${random}`
}

function getUserMsg(prompt) {
    return `
        <div class="chat-box grey-bg">
           <div>
              <img src="./assets/user.svg" />
           </div>
           <div>
             ${prompt}
           </div>
        </div>
    `
}

function getAIMsg(uniqueId) {
    return `
        <div class="chat-box dark-bg">
           <div>
              <img src="./assets/ai.svg" />
           </div>
           <div id="${uniqueId}"></div>
        </div>
    `
}


let loaderInterval = null
function loader(uniqueIdEle) {
    loaderInterval =  setInterval(() => {
        if(uniqueIdEle.innerHTML === '...') {
            uniqueIdEle.innerHTML = ''
        } else {
            uniqueIdEle.innerHTML += '.'
        }
    }, 200)
}

function typeResponseHtml(answer, uniqueId) {
   
    let timeInterval = null
    let i = 0
    const idEle = document.getElementById(uniqueId)
    console.log(idEle)

    timeInterval = setInterval(() => {
        console.log(i, answer.length)

        if(i < answer.length) {
            idEle.innerHTML += answer.charAt(i);
            i++
            console.log(i, answer.charAt(i))
        } else {
            clearInterval(timeInterval)
        }
    }, 20)
}

// 监听提交事件
function SubmitEvent() {
    const formData = new FormData(form)
    console.log(formData.get('prompt'));

    // 获取到用户输入的信息
    const prompt = formData.get('prompt');
    chatContainer.innerHTML += getUserMsg(prompt)
    // 重置form信息
    form.reset(); 

    // 获取AI回答的内容框, 并且写入到container中去
    const uniqueId = setUniqueId()
    const responseHtml = getAIMsg(uniqueId) //获取到要展示到页面的html片段
    chatContainer.innerHTML += responseHtml
    //将视图滚动到最新一条消息位置
    chatContainer.scrollTop = chatContainer.scrollHeight; 
    // 开始展示loading效果，并且调用接口返回信息
    const uniqueIdEle = document.getElementById(uniqueId)
    loader(uniqueIdEle)


    // 获取openAi返回的信息
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
        
    }
    postData('https://openaicodex-1b3s.onrender.com', { prompt: prompt })
    .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call\
        // 使用定时器实现打字效果
        typeResponseHtml(data.result || '', uniqueId)
    }).finally(() => {
        clearInterval(loaderInterval) // 清除loader定时器
    });

 
  

    // const result = {
    //     ok: true,
    //     data: '124'
    // }
    // 
    // if(result.ok) {
    //     // 使用定时器实现打字效果
    //     typeResponseHtml(result.data, uniqueId)
    // } else {

    // }
}
form.addEventListener('keyup', function(e) {
    e.preventDefault();
    if(e.keyCode === 13) {
        SubmitEvent()
    }
})
form.addEventListener('submit', function(e) {
    e.preventDefault();
    SubmitEvent()
})