var chatHtml = `
  <div class="chatapp collapsed">
    <ul class="chatlist">
      <div id="chat-items">
      </div>
      <li id="ellipsis" class="hidden"></li>
    </ul>
    <div id="chatinput">
      <input type="text"></input>
      <a class="btn" value="Send"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94a60.5 60.5 0 0 0 18.445-8.986a.75.75 0 0 0 0-1.218A60.5 60.5 0 0 0 3.478 2.404"/></svg></a>
    </div>
  </div>
<a id="chat-toggle" href="#" title="Chat Now!"><span class="chat-icon"></span></a>
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
.btn,
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
.chatapp input, .chatapp .btn {
  font-size: 100%;
  padding: 0.5rem 1rem;
  min-width: 0;
}
#chat-toggle {
  text-decoration: none;
  color: white;
  background: transparent;
  display: block;
  width: 50px;
  height: 50px;
  font-size: 50px;
  line-height: 0;
  text-align: center;
  position: fixed;
  right: 5px;
  bottom: calc(50% - 25px);
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  font-weight: black;
  color:#ffea01;
  filter:drop-shadow(rgba(0,0,0,0.15) 0 3px 4px);
}
.chat-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m.28-8.675c1.028.711 2.332 1.134 3.744 1.134q.527 0 1.039-.077c.117.048.23.107.369.187q.45.264 1.2.81c.409.299.988.01.988-.493v-1.461q.315-.204.595-.442C25.345 22.025 26 20.715 26 19.31c0-.925-.28-1.79-.772-2.537a8 8 0 0 1-.627 1.53q.157.485.159 1.007c0 1.034-.488 2.01-1.352 2.742a4.7 4.7 0 0 1-.717.499a.61.61 0 0 0-.311.531v.624c-.593-.38-1-.559-1.31-.559a1 1 0 0 0-.104.009a5.7 5.7 0 0 1-2.602-.17a11.5 11.5 0 0 1-2.083.34zm-7.466-2.922a9 9 0 0 0 1.044.765v2.492c0 .63.725.99 1.236.616c1.41-1.03 2.39-1.612 2.635-1.67q.85.135 1.728.135c5.2 0 9.458-3.607 9.458-8.12c0-4.514-4.259-8.121-9.458-8.121S6 10.107 6 14.62c0 2.21 1.03 4.271 2.814 5.783m4.949.666c-.503 0-1.238.355-2.354 1.104v-1.437a.77.77 0 0 0-.39-.664a8 8 0 0 1-1.196-.833C8.37 18.01 7.55 16.366 7.55 14.62c0-3.61 3.516-6.588 7.907-6.588c4.392 0 7.907 2.978 7.907 6.588s-3.515 6.589-7.907 6.589q-.796 0-1.564-.13a1 1 0 0 0-.13-.01m-2.337-4.916c.685 0 1.24-.55 1.24-1.226c0-.677-.555-1.226-1.24-1.226s-1.24.549-1.24 1.226s.555 1.226 1.24 1.226m4.031 0c.685 0 1.24-.55 1.24-1.226c0-.677-.555-1.226-1.24-1.226s-1.24.549-1.24 1.226s.555 1.226 1.24 1.226m4.031 0c.685 0 1.24-.55 1.24-1.226c0-.677-.555-1.226-1.24-1.226s-1.24.549-1.24 1.226s.555 1.226 1.24 1.226'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
#chat-toggle::after{
  content:"";
  position:absolute;
  top:.05em;
  left:.05em;
  z-index:-1;
  display:block;
  border-radius:100%;
  background:black;
  width:0.9em;
  height:0.9em;
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
input, .btn {
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
#chatinput .btn{
  line-height:0;
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
  background: #ffea01;
  border-radius: .7rem;
}
.chatlist li.me {
  margin-left: 4rem;
  margin-right: 1rem;
  background: white;
}
.chatlist li:not(.me){
  margin-left: 1rem;
  margin-right: 4rem;
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
  opacity: 0;
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
  cursor: pointer;
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

document.querySelector('#chatinput .btn').addEventListener('click',send);
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
