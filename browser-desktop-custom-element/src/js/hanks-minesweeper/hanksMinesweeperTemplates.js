// Main style

const mainStyleTemp = document.createElement('template')
mainStyleTemp.innerHTML = `
<style>
.background {
  background-color: #B6C1BF;
  width: 100%;
  height: 100%;
  text-align:center;
  font-family: sans-serif;
}

#buttonContainer {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
}

.button-box{
  cursor: pointer;
  text-align: center;
  padding: 5px;
  font-size: 20px;
  font-family: sans-serif;
  margin: 2px auto;
  width: 200px;
  background-color: #156D67;
  color: white;
  border: none;
  position: relative;
  transition: background-color 0.2s;
}

.button-box:hover {
  background-color: #1B877C;
}
</style>
`

// First page on the app, where you choose size of the board.
const setSizePageTemp = document.createElement('template')
setSizePageTemp.innerHTML = `
<style id="index-style">


img {
  position: relative;
  left: -10px;
  width: 100%;
  height: 90%;
}

#sizes {
  width: 200px;
  margin: 0 auto;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  position: relative;
}

 p {
   color: #333;
   font-family: sans-serif;
   margin: 0;
 }



</style>
<section id="setSizeBg" class="background">
    <div id="head">
    <img src="js/hanks-minesweeper/images/minesweeper-logo.svg" alt="minesweeper-logo">
    <p>Clear the board without hitting any mines</p>
    <p>Choose size:</p>
    </div>
    <div id="sizes">
        <button class="button-box" value="6x6">6x6</button>
        <button class="button-box" value="12x12">12x12</button>
        <button class="button-box" value="16x16">16x16</button>
  </div>
</section>
`

// The page where the game takes place.
const gameBoardTemp = document.createElement('template')
gameBoardTemp.innerHTML = `
<style>

#gameBoard {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 20px;
  display: grid;
}

h1 {
  margin: 0;
  padding: 20px;
}
#clock {
  font-family: courir;
  font-size: 35px;
}

.hidden {
  box-sizing: border-box;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  font-family: courir;
  font-size: 20px;
  width: 30px;
  height: 30px;
  background-color: rgb(190, 190, 190);
  border-top: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid grey;
  border-left: 1px solid grey;
}

.flipped {
  background-color: rgb(189, 187, 187);
  border: none;
  
}

.mine {
  background-image: url('js/hanks-minesweeper/images/mine_1.svg');
  background-size: 70%;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid grey;
  background-color: #D86C6C;
}

.flagged {
  background-image: url('js/hanks-minesweeper/images/minesweeper-flag.svg');
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
}

.hidden:hover {
  background-color: rgb(211, 209, 209);
}

#buttonContainer {
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
  margin: 0;
}
</style>
<section id="gameBoardBg" class="background">
    <div id="head">
        <h1>Game on!</h1>
        <div id="clock">-:-</div>
    </div>

    <div id="gameBoard">

    </div>

    <div id="buttonContainer">
        <button id="reset" class="button-box">Start over</button>
        <button id="size" class="button-box" >Change size</button>
    </div>
</section>
`
const endPageTemp = document.createElement('template')
endPageTemp.innerHTML = `
<style>
#endPageBg {
  background-image: url('js/hanks-minesweeper/images/mine_1.svg'); 
   background-repeat: no-repeat;
  background-size: contain;
  background-position: left;
  color: #FFE9B3;  
}


h1 {
  margin: 0;
  padding: 20px;
  font-size: 50px;
  font-weight: 600;
  
  text-shadow: 2px 2px #999898;
}

p, #clock {
  font-size: 20px;
  margin: 0;
}
#buttonContainer {
  padding: 50px;
}

</style>
<section id="endPageBg" class="background">
    <div id="head">
        <h1>You made it!</h1>
        <p>You finished in:</p>
        <div id="clock"></div>
    </div>

    <div id="buttonContainer">
        <button id="size" class="button-box" >Again!</button>
    </div>
</section>
`
export { mainStyleTemp, setSizePageTemp, gameBoardTemp, endPageTemp }
