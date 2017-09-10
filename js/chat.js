var chatHtml = `
  <div class="chatapp collapsed">
    <ul class="chatlist">
      <div id="chat-items">
      </div>
      <li id="ellipsis" class="hidden"></li>
    </ul>
    <div id="chatinput">
      <input type="text"></input>
      <input type="button" class="btn" value="Send"></input>
    </div>
  </div>
<a id="chat-toggle" href="#" title="Chat Now!"></a>
`

var css = `* {
  box-sizing: border-box;
}
iframe {
  margin: 0;
  border: 0;
}
body,
html {
  background-color: #eee;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
body,
p,
table,
div,
span,
input,
html,
body {
  font-family: 'Open Sans', sans-serif;
}
.chatapp {
  background: white;
  width: 350px;
  height: 100%;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  font-size: 100%;
}
.chatapp input {
  font-size: 100%;
  padding: 0.5rem 1rem;
  min-width: 0;
}
#chat-toggle {
  text-decoration: none;
  color: white;
  background: #ffea01;
  display: block;
  width: 50px;
  height: 50px;
  font-size: 30px;
  line-height: 50px;
  text-align: center;
  position: fixed;
  right: 5px;
  bottom: calc(50% - 25px);
  border-radius: 100%;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border: solid 1px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-weight: black;
}
#chat-toggle::after {
  content: '💬';
}
.chatapp:not(.collapsed) ~ #chat-toggle {
  transform: translateX(-350px);
}
.chatapp.collapsed {
  transform: translateX(350px);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0);
}
@media all and (max-width: 400px) {
  .chatapp.collapsed {
    transform: translateX(250px);
  }
  .chatapp:not(.collapsed) ~ #chat-toggle {
    transform: translateX(-250px);
  }
  .chatapp {
    width: 250px;
  }
}
input {
  border: solid 1px rgba(0, 0, 0, 0.2);
}
#chatinput {
  width: 100%;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  background: white;
  z-index: 1;
}
#chatinput input[type="text"] {
  flex: 1 1 auto;
  border-right: none;
}
#chatinput input[type="button"] {
  flex: 0 0 auto;
}
.chatlist {
  list-style-type: none;
  margin: 0;
  padding: 0;
  flex: 1 1 auto;
  overflow-y: scroll;
  overflow-x: hidden;
}
.chatlist li {
  display: block;
  margin: 1rem;
  position: relative;
  padding: 1rem;
  border: solid 1px rgba(0, 0, 0, 0.2);
  margin-left: 5rem;
  background: #ffea01;
}
.chatlist li.me {
  margin-left: 1rem;
  background: white;
}
.chatlist li:last-child {
  animation: slidein 0.3s ease;
}
.chatlist li .duckicon {
  background: #ffea01;
  border: solid 1px rgba(0, 0, 0, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 100%;
  position: absolute;
  left: -75px;
  top: 0;
  transform: rotateZ(90deg);
  z-index: 0;
}
.chatlist li .duckicon::after {
  position: absolute;
  content: "";
  border: solid 2px black;
  background: white;
  border-bottom: solid 4px black;
  border-right: solid 4px black;
  width: 4px;
  height: 4px;
  border-radius: 100px;
  top: 13px;
  left: 13px;
}
.chatlist li .duckicon::before {
  z-index: -10;
  position: absolute;
  content: "";
  background: #ffae01;
  width: 0;
  height: 0;
  right: 9px;
  top: -11px;
  border: 10px solid #ffae01;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 6px;
  transform: scaleX(0.7) rotateZ(45deg);
}
@keyframes slidein {
  from {
    left: 300px;
  }
  to {
    left: 0;
  }
}
.btn {
  background-color: #ffea01;
}
#ellipsis {
  border: none;
  color: #aaa;
  margin: 1rem;
  background: white;
}
#ellipsis::after {
  content: "Your duck is typing...";
}
#ellipsis::before {
  content: "";
}
.hidden {
  display: none !important;
}
`

var s = document.createElement('style');
s.type = "text/css";
s.innerHTML = css;
// js

document.addEventListener('DOMContentLoaded',function(){
 
document.head.appendChild(s);
document.body.innerHTML = document.body.innerHTML + chatHtml;

console.log("1")

var chatScrollElement = document.querySelector('.chatlist');
var textInput = document.querySelector('#chatinput input[type="text"]');
var chatList = document.querySelector('#chat-items');
var ellipsis = document.querySelector('#ellipsis');

document.querySelector('#chatinput input[type="button"]').addEventListener('click',send);
document.querySelector('#chatinput input[type="text"]').addEventListener('keyup',function(e){
  if (e.keyCode == 13){
    send();
    return false;
  }
})

function send(){
  var text = textInput.value;
  if (!text){ return }
  textInput.value = '';
  chatList.innerHTML = chatList.innerHTML + '<li class="me">'+text+'</li>';
  setTimeout(type,1000);
  setTimeout(quack,3000);
  scroll();
}

function type(){
  ellipsis.classList.remove('hidden');
  scroll();
}

function quack(){
  
  function mog(){
    var m = ['🍞','🥖','🌊','💧','🦆'];
    return m[Math.floor(Math.random()*m.length)];
  }
  // generate string
  var s = '';
  var r = Math.random();
  if (r > 0.5){
    s= s + "Quack";
  }else if (r > 0.05){
    s = s + 'quack'
  }else{
    s = s + mog();
  }
  
  var len = Math.random()*8;
  for (var i = 1; i < len; i ++){
    var n = Math.random();
    if (n < 0.7){
      s+=' quack';      
    }else if (n < 0.95){
      s +='-quack'
    }else{
      s+= ' '+ mog();
    }
  }
  var exprs = ['?','!','!!!','?!','.','.','','',''];
  s = s + exprs[Math.floor(Math.random()*exprs.length)];
  if (Math.random() > 0.9){
    s = s.toUpperCase();
  }
  
  // dom update
  ellipsis.classList.add('hidden');
  chatList.innerHTML = chatList.innerHTML + '<li><div class="duckicon"></div>'+s+'</li>';
  scroll();
}

function scroll(){
  chatScrollElement.scrollTop = 10000000;
}

// toggle
var toggleSpent = false;
document.querySelector('#chat-toggle').addEventListener('click',function(e){
  document.querySelector('.chatapp').classList.toggle('collapsed')
  if (!toggleSpent){
    toggleSpent = true;
  
  setTimeout(type,500);
  setTimeout(quack,2000);
  }
});
 
});
