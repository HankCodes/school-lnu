const desktopMain = document.createElement('template')
desktopMain.innerHTML = `
<style id="desktopMainStyle">
    :host {
        overflow: hidden;
    }
    #main {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background-image: url('../image/spa-background.jpg');
        background-size: cover;
    }

    .not-bg {
  position: absolute;
  bottom: -100px;
  right: 20px;
  width: 250px;
  height: 100px;
  text-align: center;
  font-family: sans-serif;
  background-color: white;
  box-shadow: 0px 0px 7px 5px rgba(0, 0, 0, 0.1);
  font-size: 10px;
  color: #222;
  justify-content: center;
  align-items: center;
  z-index: 20;
  translate: opacity 2s;
  
}

h2 {
  margin: 30px;
  }

h2:hover {
cursor: pointer;
}

#close {
  float: right;
 height: 20px;
 width: 30px;
 transition: background-color 0.2s;
}

#closeButton {
  padding-top: 1px; 
  height: 90%;
}

#close:hover {
  background-color: rgb(253, 56, 56);
}

#close img:hover {
  filter: invert(1);
}
</style>
<main id="main">

</main>
`

const notificationTemp = document.createElement('template')
notificationTemp.innerHTML = `
<div id="close"><img id ="closeButton" src="js/hanks-window-element/images/close-icon.svg"></div>
  <h2 id="notification">Enable chat notifications</h2>
`

export { desktopMain, notificationTemp }
