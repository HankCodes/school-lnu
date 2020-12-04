
const chatLayoutTemp = document.createElement('template')
chatLayoutTemp.innerHTML = `
<style id="chatStyle">
#chatContainer {
    width: 400px;
    height: 600px;
    background-color: #EEEE;
    font-family: sans-serif;
}

#chatTopBar {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: inherit;
    height: 30px;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
}

#chatUsernameDiv {
    width: 200px;
    text-align: center;
}

#chatUsernameP {
    margin: 0;
}
#dropbtn {
    cursor: pointer;
    width: 100px;
    height: 29px;
    background-color: orange;
    color: white;
    border: none;
}
#dropbtn:hover {
  background-color: rgb(255, 187, 41);

}



/* Dropdown Content (Hidden by Default) */
#dropdown-content {
  display: none;
  position: absolute;
  top: 30px;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

#chatContent {
    overflow: auto;
    box-sizing: border-box;
    padding: 0 10px;
    width: inherit;
    height: 430px;
    text-align: center;
}
.dropdownItem {
  cursor: pointer;
  width: 100%;
  padding: 20px 10px;
  background-color: #fafafa;
  margin: 0;
}

.dropdownItem:hover {
  background-color: #fdfdfd;
}

#chatForm {
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    width: 90%;
    margin: 10px auto;
    padding: 10px;
    background-color: #eeEE;
  
    box-shadow: 
                -8px -8px 12px 0 rgba(255, 255, 255, 0.9),
                8px 8px 12px 0 rgba(0, 0, 0, .3);
    border-radius: 10px;
}

textarea {
    width: 90%;
    height: 90px;
    border-radius: 5px;
    resize: none;
    border: none;
}

#chatSendBtn {
  margin: 0 0 0 5px;
    width: 20%;
    height: 30px;
    border: none;
    background-color: rgb(70, 110, 190);
    color: white;
    font-weight: 400;
    cursor: pointer;
    border-radius: 2px;
}

.msgContainer {
    padding: 0;
    margin: 5px auto;
    width: 90%;
    height: auto;
    display: flex;
    flex-direction: column;
}

.username, .serverUsername {
    margin: 0;
    font-family: sans-serif;
    font-size: 12px;
}

.serverUsername {
  text-align: left;
}

.serverMessage {
    margin: 10px 25px;
    max-width: 80%;
    background-color: rgb(70, 110, 190);
    color: white;
    padding: 10px;
    font-family: sans-serif;
    border-radius: 0px 25px 25px 25px;
    word-wrap: break-word;
}

.userMessage {
  margin: 10px 25px;
    max-width: 80%;
    background-color: lightgreen;
    padding: 10px;
    border-radius: 25px 0px 25px 25px;
    word-wrap: break-word;
    font-family: sans-serif;
}



</style>
<section id="chatContainer">
    <div id="chatTopBar">
        <button id="dropbtn">Options</button>
        <div id="dropdown-content">
            <p id="changeName" class="dropdownItem">Change Name</p>
            <p id="notifics" class="dropdownItem">Notifications on/off</p>
        </div>
        <div id="chatUsernameDiv"><p id="chatUsernameP">User</p>
        </div>
    </div>
    <main>
        <div id="chatContent">
        </div>
        <form id="chatForm">
        <textarea autofocus name="chatMessage" form="chatForm"></textarea>
        <input  id="chatSendBtn" form="chatForm" type="submit" value="Send">
        </form>
    </main>
</section>
`

const serverMessageTemp = document.createElement('template')
serverMessageTemp.innerHTML = `
<div class="msgContainer">
    <p class="serverUsername"></p>
    <p class="serverMessage"></p>
</div>
`

const userMessageTemp = document.createElement('template')
userMessageTemp.innerHTML = `
<div class="msgContainer">
    <p class="username"></p>
    <p class="userMessage"></p>
 
</div>
`
const logInTemp = document.createElement('template')
logInTemp.innerHTML = `
<style id="logInStyle">
#logInBg {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #EEEE;
}
#logInField {
  height: 25px;
}

#logInContainer {
  height: 200px;
  width: 90%;
  background-color: #EEEE;
  border-radius: 5px;
  font-family: sans-serif;
  text-align: center;
  box-shadow: 
                -10px -10px 15px 0 rgba(255, 255, 255, 0.9),
                10px 10px 15px 0 rgba(0, 0, 0, .3);
}

#logInBtn {
  margin: 10px auto;
  display: block;
    width: 50px;
    height: 30px;
    border: none;
    background-color: rgb(70, 110, 190);
    color: white;
    font-weight: 400;
    cursor: pointer;
    border-radius: 2px;
}
</style>
<div id="logInBg">
  <div id="logInContainer">
    <h2 id="enterUsername">Enter username</h2>
    <form id="logInForm">
    <input autofocus type="text" id="logInField" form="logInForm" placeholder="Username">
    <input  id="logInBtn" form="logInForm" type="submit" value="Enter">
    </form>
  </div>
</div>
`

export { chatLayoutTemp, serverMessageTemp, userMessageTemp, logInTemp }
