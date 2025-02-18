(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();class x{#t={};on(t,e){this.#t[t]||(this.#t[t]=[]),this.#t[t].push(e)}emit(t,e){this.#t[t]&&this.#t[t].forEach(i=>i(e))}}class a extends x{#t;constructor(t,e){super(),this.#t=e,this.id=t,this.width=this.#t.width,this.height=this.#t.height,this.title=this.#t.title,this.content=this.#t.content,this.zIndex=this.#t.zIndex||1,this.isMinimized=e.isMinimized||!1,this.icon=e.icon||null,this.isDragging=!1,this.isResizing=!1,this.initialX=0,this.initialY=0,this.initialMouseX=0,this.initialMouseY=0,this.x=e.x||Math.min(Math.max(0,Math.random()*(window.innerWidth-this.width-100)),window.innerWidth-this.width),this.y=e.y||Math.min(Math.max(100,Math.random()*(window.innerHeight-this.height)-100),window.innerHeight-this.height),this.#e(),this.isMinimized&&this.minimize(),window.addEventListener("resize",this.handleResize.bind(this)),this.createResizeHandles()}#e(){this.element=document.createElement("div"),this.element.className="window",this.element.style.position="fixed",this.element.style.left=`${this.x}px`,this.element.style.top=`${this.y}px`,this.element.style.width=`${this.width}px`,this.element.style.height=`${this.height}px`,this.element.style.overflow="hidden",this.titleBar=document.createElement("div"),this.titleBar.className="window-title-bar title-bar",this.titleBar.style.cursor="move",this.titleBar.style.userSelect="none",this.titleBar.style.display="flex",this.titleBar.style.justifyContent="space-between",this.titleBar.style.padding="5px 8px",this.titleBar.style.alignItems="center",this.titleText=document.createElement("div"),this.titleText.className="window-title-bar-text title-bar-text",this.titleText.textContent=this.title,this.titleText.style.fontSize=this.#t.styles.titlebar_fontsize||"12px",this.titleBar.appendChild(this.titleText);const t=document.createElement("div");t.className="title-bar-controls",t.style.display="flex",this.minimizeButton=document.createElement("button"),this.minimizeButton.className="window-minimize-button",this.minimizeButton.ariaLabel="Minimize",this.minimizeButton.onclick=e=>{e.stopPropagation(),this.toggleMinimize()},t.appendChild(this.minimizeButton),this.closeButton=document.createElement("button"),this.closeButton.className="window-close-button",this.closeButton.ariaLabel="Close",this.closeButton.onclick=e=>{e.stopPropagation(),this.emit("close",this)},t.appendChild(this.closeButton),this.titleBar.appendChild(t),this.contentArea=document.createElement("div"),this.contentArea.className="window-content window-body",this.contentArea.innerHTML=this.content,this.titleBar.onmousedown=e=>{e.preventDefault(),this.startDrag(e)},this.element.appendChild(this.titleBar),this.element.appendChild(this.contentArea),this.element.onclick=()=>this.emit("focus",this)}createResizeHandles(){[{cursor:"nwse-resize",position:"top-left",dx:-1,dy:-1},{cursor:"nesw-resize",position:"top-right",dx:1,dy:-1},{cursor:"nesw-resize",position:"bottom-left",dx:-1,dy:1},{cursor:"nwse-resize",position:"bottom-right",dx:1,dy:1}].forEach(e=>{const i=document.createElement("div");switch(i.className=`resize-handle resize-${e.position}`,i.style.cssText=`
        position: absolute;
        background: transparent;
        z-index: 10;
        cursor: ${e.cursor};
      `,e.position){case"top-left":i.style.top="-5px",i.style.left="-5px",i.style.width="15px",i.style.height="15px";break;case"top-right":i.style.top="-5px",i.style.right="-5px",i.style.width="15px",i.style.height="15px";break;case"bottom-left":i.style.bottom="-5px",i.style.left="-5px",i.style.width="15px",i.style.height="15px";break;case"bottom-right":i.style.bottom="-5px",i.style.right="-5px",i.style.width="15px",i.style.height="15px";break}i.addEventListener("mousedown",s=>this.startResize(s,e.dx,e.dy)),this.element.appendChild(i)})}handleResize(){const t=Math.max(0,window.innerWidth-this.width),e=Math.max(0,window.innerHeight-this.height);this.x=Math.min(this.x,t),this.y=Math.min(this.y,e),this.updatePosition()}startDrag(t){this.isDragging=!0,this.initialX=this.x,this.initialY=this.y,this.initialMouseX=t.clientX,this.initialMouseY=t.clientY,this.emit("dragStart",this)}drag(t){if(!this.isDragging)return;const e=t.clientX-this.initialMouseX,i=t.clientY-this.initialMouseY;let s=this.initialX+e,n=this.initialY+i;s=Math.max(0,Math.min(s,window.innerWidth-this.width)),n=Math.max(0,Math.min(n,window.innerHeight-this.height)),this.x=s,this.y=n,this.updatePosition(),this.emit("drag",this)}dragEnd(){this.isDragging&&(this.isDragging=!1,this.emit("dragEnd",this))}toggleMinimize(){this.isMinimized?this.restore():this.minimize(),this.emit("minimize",this)}minimize(){this.isMinimized=!0,this.element.style.display="none"}restore(){this.isMinimized=!1,this.element.style.display="block"}updatePosition(){this.element.style.left=`${this.x}px`,this.element.style.top=`${this.y}px`}setZIndex(t){this.zIndex=t,this.element.style.zIndex=t}getState(){return{width:this.width,height:this.height,x:this.x,y:this.y,zIndex:this.zIndex,isMinimized:this.isMinimized,icon:this.icon,title:this.title,content:this.content,styles:this.#t.styles,events:this.#t.events}}destroy(){this.element.remove()}startResize(t,e,i){t.stopPropagation(),t.preventDefault(),this.isResizing=!0,this.initialWidth=this.width,this.initialHeight=this.height,this.initialX=this.x,this.initialY=this.y,this.initialMouseX=t.clientX,this.initialMouseY=t.clientY,this.resizeDirX=e,this.resizeDirY=i,document.addEventListener("mousemove",this.resize.bind(this)),document.addEventListener("mouseup",this.endResize.bind(this))}resize(t){if(!this.isResizing)return;const e=t.clientX-this.initialMouseX,i=t.clientY-this.initialMouseY;let s=this.initialWidth,n=this.height,o=this.x,r=this.y;this.resizeDirX!==0&&(s=Math.max(200,this.initialWidth+e*this.resizeDirX),this.resizeDirX<0&&(o=this.initialX+(this.initialWidth-s))),this.resizeDirY!==0&&(n=Math.max(100,this.initialHeight+i*this.resizeDirY),this.resizeDirY<0&&(r=this.initialY+(this.initialHeight-n))),o=Math.max(0,Math.min(o,window.innerWidth-s)),r=Math.max(0,Math.min(r,window.innerHeight-n)),this.width=s,this.height=n,this.x=o,this.y=r,this.element.style.width=`${this.width}px`,this.element.style.height=`${this.height}px`,this.updatePosition(),this.contentArea.style.height="calc(100% - 37px)"}endResize(){this.isResizing&&(this.isResizing=!1,this.emit("resize",this))}static parseMessageContent(t){const e=[];let i=0;const s=/```([\s\S]*?)```/g;let n;for(;(n=s.exec(t))!==null;)n.index>i&&e.push({type:"text",content:t.slice(i,n.index)}),e.push({type:"code",content:n[1].trim()}),i=n.index+n[0].length;return i<t.length&&e.push({type:"text",content:t.slice(i)}),e}async handleScripts(t){const e=[];for(const i of t){i.src===""&&e.push(i);try{const s=await fetch(i.src),n=document.createElement("script");n.textContent=await s.text(),e.push(n)}catch(s){console.error("Failed to load external script:",s)}}e.forEach(i=>this.contentArea.appendChild(i))}async fetchWindowContents(t,e){const i=this.title,s=this.content;this.title="Loading...";const n=HTMLImageElement();n.src=this.#t.styles?.loadingImage||"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMm42dHA0cWY3b3Y5Yzg5Z3k0Y210a2o4dDk2Z3o0dzBqdjhkZnhhMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu3XilJ5BOiSGic/giphy.gif",this.contentArea.innerHTML="",this.contentArea.appendChild(n);try{const o=await fetch(t);if(!o.ok)throw new Error(`HTTP error! status: ${o.status}`);const r=await o.text(),h=new DOMParser().parseFromString(r,"text/html");this.title=h.querySelector("title")?.textContent||i,this.content=h.querySelector("body")?.innerHTML||s;const l=Array.from(h.querySelectorAll("script")),d=new URL(t).origin;l.forEach(m=>{m.src.startsWith("/")&&(m.src=`${d}${m.src}`)}),await this.handleScripts(l)}catch(o){console.error("Failed to fetch window contents:",o),this.title=i,this.content=s}}}class f extends a{constructor(t,e){e.title=`Chat - ${e.channel}`,e.content='<div class="chat-container"></div>',super(t,e),this.username=e.username||this.getUsername(),this.channel=e.channel||"general",this.messages=this.loadCachedMessages()||[],this.setupChatUI(),this.connectWebSocket(),setTimeout(()=>{for(const i of this.messages)i.type==="message"&&this.displayMessage(i)},250),this.senderColor=e.senderColor||localStorage.getItem("senderColor")||"#e3f2fd",this.receiverColor=e.receiverColor||localStorage.getItem("receiverColor")||"#f5f5f5",this.addColorPickers()}loadCachedMessages(){const t=`chat-messages-${this.channel}`,e=localStorage.getItem(t);return e?JSON.parse(e):null}saveCachedMessages(){const t=this.messages.filter(i=>i.type==="message"&&i.username!=="System"),e=`chat-messages-${this.channel}`;localStorage.setItem(e,JSON.stringify(t.slice(-50)))}addColorPickers(){const t=document.createElement("div");t.className="chat-controls",t.innerHTML=`
      <div class="color-pickers">
        <div class="picker-group">
          <label>Your messages:</label>
          <input type="color" id="sender-color" value="${this.senderColor}">
        </div>
        <div class="picker-group">
          <label>Others' messages:</label>
          <input type="color" id="receiver-color" value="${this.receiverColor}">
        </div>
      </div>
    `,this.contentArea.querySelector(".chat-container").prepend(t);const i=t.querySelector("#sender-color"),s=t.querySelector("#receiver-color");i.addEventListener("change",n=>{this.senderColor=n.target.value,localStorage.setItem("senderColor",this.senderColor),this.updateMessageColors()}),s.addEventListener("change",n=>{this.receiverColor=n.target.value,localStorage.setItem("receiverColor",this.receiverColor),this.updateMessageColors()})}updateMessageColors(){this.contentArea.querySelectorAll(".chat-message").forEach(e=>{e.classList.contains("chat-message")&&(e.classList.contains("sent")?e.style.backgroundColor=this.senderColor:e.classList.contains("received")?e.style.backgroundColor=this.receiverColor:e.style.backgroundColor="#f9f9f9")})}updateMessageUsername(t,e){if(!t||!e||t===e)return;localStorage.setItem("chat-username",e),this.messages.forEach(s=>{s.username===t&&(s.username=e)}),this.saveCachedMessages(),this.contentArea.querySelectorAll(".chat-message").forEach(s=>{if(!s.classList.contains("chat-message"))return;const n=s.querySelector(".message-sender");n.textContent===t&&(n.textContent=e)})}setupChatUI(){const t=this.element.querySelector(".chat-container");t.style.cssText=`
      display: flex;
      flex-direction: column;
      max-height: 600px;
      max-width: 100%;
      width:100%;
      overflow-y: auto;
      overflow-x: hidden;
    `,this.messageContainer=document.createElement("div"),this.messageContainer.style.cssText=`
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
      background: #f9f9f9;
      margin-bottom: 10px;
      max-height: 350px;
      max-width: 300px;
    `,t.appendChild(this.messageContainer);const e=document.createElement("div");e.style.cssText=`
      flex: 1;
      padding: 10px;
      border-top: 1px solid #ddd;
      background: white;
    `,this.messageInput=document.createElement("textarea"),this.messageInput.style.cssText=`
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: none;
      margin-bottom: 8px;
      max-height: 300px;
      max-width: 250px;
      width: 100%;
    `,this.messageInput.placeholder="Type your message...",this.messageInput.rows=3;const i=document.createElement("button");i.textContent="Send",i.style.cssText=`
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 0rem;
    `,i.onclick=()=>this.sendMessage(),this.messageInput.onkeydown=o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),this.sendMessage())},e.appendChild(this.messageInput),e.appendChild(i),t.appendChild(e);const s=document.createElement("button");s.textContent="😊",s.style.cssText=`
      padding: 8px 16px;
      margin-right: 8px;
      margin-bottpm: 10px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `,s.onclick=()=>this.emit("toggleEmojis",this),e.insertBefore(s,e.lastChild);const n=document.createElement("button");n.textContent="New name",n.style.cssText=`
      padding: 8px 16px;
      margin-right: 8px;
      margin-bottpm: 10px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `,n.onclick=()=>this.changeUsername(),e.insertBefore(n,e.lastChild),this.messageInput=e.querySelector("textarea"),t.scrollTop=t.scrollHeight}parseMessageContent(t){const e=[];let i=0;const s=/```([\s\S]*?)```/g;let n;for(;(n=s.exec(t))!==null;)n.index>i&&e.push({type:"text",content:t.slice(i,n.index)}),e.push({type:"code",content:n[1].trim()}),i=n.index+n[0].length;return i<t.length&&e.push({type:"text",content:t.slice(i)}),e}displayMessage(t){const e=document.createElement("div");let i="#f9f9f9";t.username===this.username?i=this.senderColor:t.username==="System"&&t.username==="The Server"&&(i="#f9f9f9"),e.style.cssText=`
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 4px;
      background: ${i};
      border: 1px solid #ddd;
    `;const s=document.createElement("div");s.className="message-sender",s.style.cssText=`
      padding: 4px 8px;
      max-width: 180px;
      overflow-x: hidden;
      font-weight: bold;
      margin-bottom: 4px;
      color: #666;
    `,s.textContent=t.username,e.appendChild(s);const n=document.createElement("div");this.parseMessageContent(t.data).forEach(h=>{const l=document.createElement("div");h.type==="code"?l.style.cssText=`
          font-family: 'Fira Code', monospace;
          font-size: 0.95em;
          line-height: 1.4;
          white-space: pre-wrap;
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 12px;
          border-radius: 6px;
          margin: 8px 0;
          border-left: 4px solid #007acc;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          tab-size: 2;
          -moz-tab-size: 2;
        `:l.style.cssText=`
          margin: 4px 0;
          line-height: 1.5;
          max-width: 215px;
          overflow-x: hidden;
          overflow-wrap: break-word;
        `,l.textContent=h.content,n.appendChild(l)}),e.className="chat-message",t.username===this.getUsername()?e.classList.add("sent"):t.username==="System"||t.username==="The Server"?e.classList.add("system"):e.classList.add("received"),e.appendChild(n),this.messageContainer.appendChild(e),this.messageContainer.scrollTop=this.messageContainer.scrollHeight;const r=this.element.querySelector(".chat-container");r.scrollTop=r.scrollHeight}initEmojiSelector(){if(!this.emojiSelector)return;const t=this.element.getBoundingClientRect();this.emojiSelector.x=t.right+10,this.emojiSelector.y=t.top,this.emojiSelector.on("emojiSelected",({emoji:e})=>{const i=this.messageInput,s=i.selectionStart,n=i.selectionEnd,o=i.value;i.value=o.substring(0,s)+e+o.substring(n),i.focus(),i.selectionStart=i.selectionEnd=s+e.length}),this.emojiSelector.handleResize()}connectWebSocket(){this.ws=new WebSocket(""),this.ws.onopen=()=>{this.addSystemMessage("Connecting to chat server")},this.ws.onmessage=t=>{const e=JSON.parse(t.data);e.type!=="heartbeat"&&this.addMessage(e)},this.ws.onclose=()=>{this.addSystemMessage("Disconnected from chat server"),setTimeout(()=>this.connectWebSocket(),5e3)}}addMessage(t){this.messages.push(t),this.messages.length>50&&this.messages.shift(),t.type==="message"&&t.username!=="System"&&this.saveCachedMessages(),this.displayMessage(t)}addSystemMessage(t){const e={type:"system",data:t,username:"System"};this.addMessage(e)}sendMessage(){this.ws.readyState!==WebSocket.OPEN&&setTimeout(()=>this.connectWebSocket(),3e3);const t=this.messageInput.value.trim();if(!t)return;const e={type:"message",data:t,username:this.username,channel:this.channel,key:""};this.ws.send(JSON.stringify(e)),this.messageInput.value=""}changeChannel(t){this.channel=t,this.messages=this.loadCachedMessages()||[],this.setupChatUI(),this.addSystemMessage(`Switched to channel: ${t}`),this.connectWebSocket(),setTimeout(()=>{for(const e of this.messages)e.type==="message"&&this.displayMessage(e)},500)}destroy(){this.ws&&this.ws.close();const t=this.username,e=localStorage.getItem("chat-username");e&&t!==e&&(console.log(`name changed from ${t} to ${e}`),this.updateMessageUsername(t,e)),super.destroy()}getUsername(){let t=this.username;return t||(t=localStorage.getItem("chat-username")),t||(t=prompt("Please enter your username:"),t||(t="Anonymous-"+Math.floor(Math.random()*1e3)),localStorage.setItem("chat-username",t)),this.username=t,t}changeUsername(){const t=this.username,e=prompt("Enter new username:");return e&&e!==t&&this.updateMessageUsername(t,e),this.username=e,e}}class p extends a{constructor(t,e){super(t,e),this.categories={Smileys:["😀","😃","😄","😁","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘"],Gestures:["👍","👎","👌","✌️","🤞","🤜","🤛","👏","🙌","👐","🤲","🤝","🙏"],Heart:["❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💔","❣️","💕","💞","💓","💗","💖"],Animals:["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸"],Food:["🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥"]},this.setupUI()}setupUI(){this.element.style.overflowY="hidden",this.contentArea.style.overflowY="hidden";const t=document.createElement("div");t.style.cssText=`
      padding: 10px;
      height: 100%;
      overflow-y: auto;
    `;const e=document.createElement("div");e.style.cssText=`
      position: sticky;
      top: 0;
      background: white;
      padding: 5px 0;
      margin-bottom: 10px;
      z-index: 1;
    `;const i=document.createElement("input");i.type="text",i.placeholder="Search emojis...",i.style.cssText=`
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      max-width: 325px;
    `,e.appendChild(i),t.appendChild(e),Object.entries(this.categories).forEach(([s,n])=>{const o=document.createElement("div");o.className="emoji-category",o.style.marginBottom="20px";const r=document.createElement("h3");r.textContent=s,r.style.cssText=`
        margin: 0 0 10px 0;
        color: #666;
        font-size: 14px;
      `;const h=document.createElement("div");h.style.cssText=`
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 5px;
      `,n.forEach(l=>{const d=document.createElement("button");d.textContent=l,d.style.cssText=`
          font-size: 20px;
          padding: 5px;
          border: 1px solid #eee;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f0f0f0;
          }
        `,d.onclick=()=>{this.emit("emojiSelected",{emoji:l})},h.appendChild(d)}),o.appendChild(r),o.appendChild(h),t.appendChild(o),i.focus()}),i.oninput=s=>{const n=s.target.value.toLowerCase();t.querySelectorAll(".emoji-category").forEach(r=>{const h=r.querySelectorAll("button");let l=!1;h.forEach(d=>{const m=d.textContent.toLowerCase().includes(n);d.style.display=m?"block":"none",m&&(l=!0)}),r.style.display=l?"block":"none"})},this.contentArea.appendChild(t)}}class y{constructor(){this.listeners={}}on(t,e){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(e)}emit(t,e){this.listeners[t]&&this.listeners[t].forEach(i=>i(e))}}class w extends y{#t=null;#e=0;#s=0;#i=!1;#n=null;#o=null;constructor({onComplete:t=null,onReset:e=null,format:i="seconds"}={}){super(),this.#n=t,this.#o=e,this.format=i}start(t){if(!t||t<=0)throw new Error("Duration must be a positive number");if(this.#t!==null)throw new Error("Timer is already running");this.#s=t*1e3,this.#e=this.#s,this.#i=!1,this.#r()}stop(){this.#t&&(clearInterval(this.#t),this.#t=null),this.#e=0,this.#i=!1}reset(t=!1){const e=this.isRunning();this.#t&&(clearInterval(this.#t),this.#t=null),this.#e=this.#s,this.#i=!1,this.#o&&this.#o(this.#s/1e3),(t||e)&&this.#r()}pause(){this.#t&&!this.#i&&(clearInterval(this.#t),this.#t=null,this.#i=!0)}resume(){this.#i&&(this.#i=!1,this.#r())}getTimeRemaining(){return Math.ceil(this.#e/1e3)}getInitialDuration(){return this.#s/1e3}isRunning(){return this.#t!==null&&!this.#i}#r(){this.#t=setInterval(()=>{if(!this.#i){this.#e=Math.max(0,this.#e-100);const t=Math.ceil(this.#e/1e3);this.emit("tick",t),this.#e<=0&&(this.stop(),this.#n&&this.#n())}},100)}}class u extends a{constructor(t,e){super(t,e),this.timer=new w({onComplete:()=>{this.element.style.transition="opacity 0.5s ease-out",this.element.style.opacity="0",setTimeout(()=>this.emit("close",this),500)},format:"seconds"}),this.timer.on("tick",r=>this.updateTitleBarDisplay(r));const i=document.createElement("div");i.style.cssText=`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      text-align: center;
      background: linear-gradient(to bottom, #ffffff, #f7f7f7);
    `;const s=document.createElement("div");s.style.cssText=`
      font-size: 3em;
      margin-bottom: 10px;
    `,s.textContent=this.getAppropriateIcon(content.type);const n=document.createElement("div");n.style.cssText=`
      font-size: 1.25em;
      font-weight: bold;
      color: #374151;
      margin-bottom: 10px;
      line-height: 1.5;
    `,n.innerHTML=this.content,i.appendChild(s),i.appendChild(n),this.contentArea.appendChild(i),this.element.appendChild(this.contentArea),this.timer.start(15)}getAppropriateIcon(t){return t.toLowerCase()==="win"?"🏆":t.toLowerCase()==="time"?"⏰":t.toLowerCase()==="star"?"🌟":t.toLowerCase()==="warning"?"⚠️":"ℹ️"}updateTitleBarDisplay(t){this.titletextdiv=this.titleBar.getElementsByClassName("window-title-bar-text")[0],this.titletextdiv.textContent=`Closing in ${t}s`}}class b{constructor(t,e,i,s){t=t||"",e=e||"imagees/0.png",i=i||"images/0.png",this.element=document.createElement("div"),this.element.className="desktop-icon",this.image=document.createElement("img"),this.image.src=e,this.image.alt=t,this.label=document.createElement("span"),this.label.textContent=t,this.element.appendChild(this.image),this.element.appendChild(this.label),s&&this.element.addEventListener("dblclick",s),this.element.style.cssText=`
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      cursor: pointer;
      padding: 8px;
    `,this.element.addEventListener("mouseenter",()=>{this.image.src=i}),this.element.addEventListener("mouseleave",()=>{this.image.src=e}),this.image.style.cssText=`
      width: 60px;
      height: 60px;
      margin-bottom: 4px;
      border-radius: 4px;
      this.transition: all 0.5s;
    `,this.label.style.cssText=`
      color: white;
      text-align: center;
      font-size: 13px;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
      word-wrap: break-word;
      max-width: 76px;
    `}setPosition(t,e){this.element.style.left=`${t}px`,this.element.style.top=`${e}px`}}class v{constructor(){this.windows=new Map,this.icons=new Map,this.zIndexBase=1e3,this.username="Anonymous-"+Math.floor(Math.random()*1e3),this.background_color="#FAF9F6",this.taskbar_background_color="#c0c0c0",this.taskbar_text_color="#fff",this.windowTypes=new Map([[a.name,{width:600,height:400,icon:"",title:"Window",content:"",styles:{},events:{},savedstate:{}}],[f.name,{width:600,height:400,icon:"",title:"Chat",channel:"general",username:"Anonymous",content:"",styles:{},events:{toggleEmojis:()=>this.toggleEmojis(window),usernameChanged:i=>{this.username=i}},savedstate:{}}],[u.name,{width:300,height:200,icon:"",title:"Popup",content:"",styles:{},events:{},savedstate:{}}],[p.name,{width:300,height:400,icon:"",title:"Emojis",content:"",styles:{},events:{},savedstate:{}}]]);const t=document.createElement("link");t.href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap",t.rel="stylesheet",document.head.appendChild(t),this.environment=document.createElement("div"),this.environment.id="window-environment",this.environment.style.cssText=`
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: ${this.background_color};
      background-image: url('images/bg.png');
      background-size: cover;
      `,this.taskbar=document.createElement("div"),this.taskbar.id="taskbar",this.taskbar.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      max-width: 100vw;
      display: flex;
      min-height: 30px;
      align-items: center;
      padding: 0 10px;
      z-index: 9999;
      background-color: ${this.taskbar_background_color};
      color: ${this.taskbar_text_color};
      overflow: hidden;
      cursor: default;
      `,this.iconContainer=document.createElement("div"),this.iconContainer.id="icon-container",this.iconContainer.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 40px);
      z-index: ${this.zIndexBase-1};
      pointer-events: auto;
    `,this.environment.appendChild(this.iconContainer),this.addDefaultTaskbarIcons(),this.addDefaultIcons(),this.createScrollButtons(),this.notificationContainer=document.createElement("div"),this.notificationContainer.id="notification-container",this.notificationContainer.style.display="flex",this.notificationContainer.style.overflowX="hidden",this.notificationContainer.style.flexGrow=1,this.notificationContainer.style.height="25px",this.notificationContainer.style.minWidth="2px",this.notificationContainer.style.maxWidth="20vw",this.notificationContainer.style.boxShadow="rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset",this.notificationContainer.style.padding="2px 5px",this.notificationContainer.style.justifyContent="end",this.notificationContainer.style.marginLeft="auto",this.notificationContainer.style.alignItems="center",this.datetime=new Date;const e=document.createElement("div");e.textContent=this.datetime.toLocaleTimeString(),e.style.fontSize="14px",e.style.color="rgb(0, 0, 0)",e.style.fontFamily='"Pixelated MS Sans Serif", Arial',e.style.whiteSpace="nowrap",e.style.overflow="hidden",e.style.textOverflow="ellipsis",this.notificationContainer.appendChild(e),this.taskbar.appendChild(this.notificationContainer),setInterval(()=>{this.datetime.setSeconds(this.datetime.getSeconds()+1),e.textContent=this.datetime.toLocaleTimeString()},1e3),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.saveState=this.saveState.bind(this),document.addEventListener("mousemove",this.onMouseMove),document.addEventListener("mouseup",this.onMouseUp),window.addEventListener("beforeunload",this.saveState),document.body.appendChild(this.environment),this.environment.appendChild(this.taskbar)}createScrollButtons(){this.leftScrollButton=document.createElement("button"),this.leftScrollButton.innerHTML="&#10094;",this.leftScrollButton.style.cssText=`
      left: 0;
      top: 0;
      bottom: 0;
      min-width: 20px;
      background: ${this.taskbar_background_color};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      margin-left: auto;
      margin-right: 5px;
    `,this.leftScrollButton.addEventListener("click",()=>this.scroll(-200)),this.taskbar.appendChild(this.leftScrollButton),this.taskbarScrollContainer=document.createElement("div"),this.taskbarScrollContainer.id="taskbar-scroll-container",this.taskbarScrollContainer.style.display="flex",this.taskbarScrollContainer.style.overflowX="hidden",this.taskbarScrollContainer.style.flexGrow=1,this.taskbarScrollContainer.style.height="25px",this.taskbarScrollContainer.style.minWidth="0",this.taskbarScrollContainer.style.maxWidth="40vw",this.taskbarScrollContainer.style.boxShadow="rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset",this.taskbarScrollContainer.style.alignItems="center",this.taskbarScrollContainer.style.padding="2px 5px",this.taskbar.appendChild(this.taskbarScrollContainer),this.rightScrollButton=document.createElement("button"),this.rightScrollButton.innerHTML="&#10095;",this.rightScrollButton.style.cssText=`
      right: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      min-width: 12px;
      background: ${this.taskbar_background_color};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      margin-left: 5px;
      margin-right: auto;
    `,this.rightScrollButton.addEventListener("click",()=>this.scroll(200)),this.taskbar.appendChild(this.rightScrollButton),this.updateScrollButtons()}scroll(t){this.taskbarScrollContainer.scrollBy({left:t,behavior:"smooth"}),setTimeout(()=>this.updateScrollButtons(),50)}updateScrollButtons(){const t=this.taskbarScrollContainer,e=t.scrollLeft,i=t.scrollWidth,s=t.clientWidth;this.leftScrollButton.style.opacity=e>0?1:0,this.rightScrollButton.style.opacity=i>s&&e+s<i?1:0}addDefaultTaskbarIcons(){const t=this.createTaskbarIcon("Home",a,null);this.taskbar.appendChild(t);const e=this.createTaskbarIcon("Projects",a,null);this.taskbar.appendChild(e);const i=this.createTaskbarIcon("Posts",a,null);this.taskbar.appendChild(i);const s=this.createTaskbarIcon("Contact",a,null);this.taskbar.appendChild(s);const n=this.createTaskbarIcon("Source",a,null);this.taskbar.appendChild(n)}addIcon(t){console.log("Adding icon:",t.title);const e=new b(t.title,t.image,t.onhover,t.clickhandler);return e.setPosition(t.x,t.y),this.icons.set(t.title,e),this.iconContainer.appendChild(e.element),e}addDefaultIcons(){[{title:"Welcome",image:"images/clippy.gif",onhover:"images/clippy_closeup.gif",x:20,y:50,clickhandler:()=>this.newWindow(a,{title:"Welcome",content:"<img src = 'images/clippy.gif'/>",width:350,height:250})},{title:"Current Projects",image:"icons/win_controls/console.png",onhover:"icons/win_controls/console.png",x:20,y:175,content:"",clickhandler:()=>this.newWindow(a,{title:"Current Projects",content:"Projects go here!",width:600,height:400})},{title:"Music",image:"icons/win_controls/music.png",onhover:"icons/win_controls/music.png",x:20,y:300,clickhandler:()=>this.newWindow(a,{title:"Music",content:"Music goes here!",width:600,height:400})},{title:"Bonzi",image:"icons/bonzi.ico",onhover:"icons/bonzi.ico",x:20,y:425,clickhandler:()=>this.newWindow(a,{title:"Bonzi",content:"Literal malware!",width:600,height:400})}].forEach(e=>{this.addIcon(e)})}createTaskbarIcon(t,e,i){const s=document.createElement("button");return s.className="taskbar-item",s.style.padding="0 10px",s.style.cursor="pointer",s.whiteSpace="nowrap",s.style.display="flex",s.style.alignItems="center",s.style.fontSize="14px",s.style.whiteSpace="nowrap",s.style.minWidth="20px",s.style.textOverflow="ellipsis",s.style.overflow="hidden",s.textContent=t,s.onclick=()=>this.newWindow(e,i||this.windowTypes.get(e.name)),s}pinWindow(t){const e=document.createElement("button");e.className="taskbar-item",e.style.padding="0 10px",e.style.cursor="pointer",e.whiteSpace="nowrap",e.style.display="flex",e.style.alignItems="center",e.style.fontSize="14px",e.style.whiteSpace="nowrap",e.style.minWidth="20px",e.style.textOverflow="ellipsis",e.style.overflow="hidden",e.textContent=t.title,e.onclick=()=>t.toggleMinimize(),this.taskbarScrollContainer.appendChild(e),this.icons.set(t.id,e),this.updateScrollButtons()}removeWindow(t){console.log("Removing window:",t.id),this.windows.has(t.id)&&(this.windows.delete(t.id),this.environment.removeChild(t.element),this.taskbarScrollContainer.removeChild(this.icons.get(t.id)),this.icons.delete(t.id),t.destroy(),this.updateZIndices(),this.saveState(),this.updateScrollButtons())}newWindow(t=a,e={}){const i=this.createWindow(crypto.randomUUID(),t,e);this.pinWindow(i),this.bringToFront(i),this.updateZIndices(),this.saveState()}createWindow(t,e=a,i={}){if(this.windows.has(t))return console.error(`Window with id ${t} already exists. Skipping creation.`),this.windows.get(t);if(!this.windowTypes.has(e.name))console.error(`${e.name} class not registered in windowTypes`),e.prototype instanceof a?(console.warn("Window class is a subclass of Window - Registering new Type"),this.windowTypes.set(e,{width:i.width||600,height:i.height||400,title:i.title||"",icon:i.icon||"",styles:i.styles||{},events:i.events||{},savedstate:i.savedstate||{}})):(console.error("Window class is not a subclass of Window - Using default Window class."),e=a);else{const n=this.windowTypes.get(e.name);for(const o in n)i[o]=i[o]||n[o]}const s=new e(t,i);return Object.entries(i.events).forEach(([n,o])=>{s.on(n,o)}),s.on("close",n=>this.removeWindow(n)),s.on("focus",n=>this.bringToFront(n)),s.on("dragStart",()=>this.startDragging(s)),s.on("minimize",()=>this.saveState()),s.on("drag",()=>this.saveState()),s.on("dragEnd",()=>this.saveState()),s.on("popup",n=>this.newWindow(`${crypto.randomUUID()}-${t}`,n,u)),this.windows.set(s.id,s),this.environment.appendChild(s.element),this.updateZIndices(),this.saveState(),s}toggleEmojis(t){t.emojiSelector?(t.emojiSelector.emit("close"),t.emojiSelector=null):(t.emojiSelector=this.createWindow(`emoji-${this.id}`,"","",300,400,null,p),t.initEmojiSelector(),this.bringToFront(t.emojiSelector))}bringToFront(t){const e=Array.from(this.windows.values()),i=e.indexOf(t);i!==-1&&(e.splice(i,1),e.push(t),this.windows.clear(),e.forEach(s=>this.windows.set(s.id,s)),this.updateZIndices(),this.saveState())}updateZIndices(){let t=0;this.windows.forEach(e=>{e.setZIndex(this.zIndexBase+t),t++})}startDragging(t){this.currentlyDragging=t,this.bringToFront(t)}onMouseMove(t){this.currentlyDragging&&this.currentlyDragging.drag(t)}onMouseUp(t){this.currentlyDragging&&(this.currentlyDragging.dragEnd(t),this.currentlyDragging=null)}saveState(){const t={windows:Array.from(this.windows.values()).map(e=>({...e.getState(),className:e.constructor.name}))};localStorage.setItem("windowEnvironmentState",JSON.stringify(t))}clearSavedState(){localStorage.removeItem("windowEnvironmentState")}}localStorage.removeItem("windowEnvironmentState");const g=new v(!0);g.clearSavedState();const C={height:300,width:400,icon:null,title:"Environment Test",content:"<p>This is a test</p>"};g.newWindow(a,C);
