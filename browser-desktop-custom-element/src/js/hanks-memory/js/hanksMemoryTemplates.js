
// Templates for the games various pages.

// Global style.
const globalStyle = document.createElement('template')
globalStyle.innerHTML = `
<style>
#button-container {
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
}
.button{
  cursor: pointer;
  text-align: center;
  padding: 5px;
  font-size: 20px;
  font-family: sans-serif;
  margin: 10px auto;
  width: 150px;
  background-color: #FFF200;
  border: none;
  border-radius: 10px;
  position: relative;
  transition: transform 0.1s,
              background-color 0.2s;
}

.button:hover {
  transform: scaleX(1.1);
  background-color: #FFF683;
}

</style>
`
// Main template for showing the game
const memoryGameTemp = document.createElement('template')
memoryGameTemp.innerHTML = `
<style>
#main-container {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    background-image: url('js/hanks-memory/image/hanks-memory-bg.png');
}

#game-header {
    text-align: center;
    font-size: 50px;
    font-family: 'Courier New', Courier, monospace;
    color: white;
}

#brick-section {
    display: grid;
    max-width: 90%;
    margin: 0 auto;
    background-color: #363A3F;
}


#brick-section div {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

#brick-section:focus {
  border: 2px solid red;
}

img {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.aside {
  display: none;
}

.right {
  border: 2px solid #FFF200;
  
}
#button-container {
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
}
</style>

<section id="main-container">
    <div id="game-header">
        <div id="clock">Good Luck!</div>
    </div>
    <div id="brick-section">

    </div>
        <div id="button-container">
          <button id="startButton" class="button">START</button>
          <button id="sizeButton" class="button">SIZE</button>
    </div>
</section>
`
// The startpage (index) of the game
const indexTemp = document.createElement('template')
indexTemp.innerHTML = `
 
<style id="index-style">

#index-content {
  background-image: url('js/hanks-memory/image/hanks-memory-bg.png');
  width: 100%;
  height: 100%;
  text-align:center;
}
img {
  margin-top: 20px;
 width: 90%;
}

#sizes {
  width: 50%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
}

 p {
   margin: 20px auto;
   color: white;
   font-family: sans-serif;
   width: 80%;
 }

.button-box{
  cursor: pointer;
  text-align: center;
  padding: 5px;
  font-size: 3vw;
  font-family: sans-serif;
  margin: 1vw auto;
  width: 200px;
  background-color: #FFF200;
  border: none;
  border-radius: 10px;
  position: relative;
  transition: transform 0.1s,
              background-color 0.2s;
}

.button-box:hover {
  transform: scaleX(1.1);
  background-color: #FFF683;
}

</style>
<div id="index-content">
  <img src="js/hanks-memory/image/hanks-memory-logo.svg" alt="Hanks memory logo">
  <p>Find all matching cards in the shortest time and with the fewest clicks possible.</p>
  <p>Choose size:</p>
  <div id="sizes">
  <button id="22" class="button-box" value="2x2">2x2</button>
  <button id="42" class="button-box" value="4x2">4x2</button>
  <button id="44" class="button-box" value="4x4">4x4</button>
  </div>
</div>
`

// The winnerpage
const winTemp = document.createElement('template')
winTemp.innerHTML = `
<style>
  #winnerPage {
    background-image: url('js/hanks-memory/image/hanks-memory-bg.png');
    text-align: center;
    width: 100%;
    height: 100%;
  }
  img {
    width: 90%;
    margin-top: 25px;
  }

  h1 {
    color: #FFF200;
  }
  p {
    color: white;
    font-size: 20px;
    font-family: sans-serif;
  }
</style>
<div id="winnerPage">
<img src="js/hanks-memory/image/hanks-memory-logo.svg" alt="Hanks memory logo">
  <p>You made it in: <span id="showTotalTime"></span> <br> and <span id="totalClicks"></span> clicks.</p>

  <div id="button-container">
          <button id="startButton" class="button">Try Again</button>
          <button id="sizeButton" class="button">size</button>
  </div>
</div>
`

export { globalStyle, memoryGameTemp, indexTemp, winTemp }
