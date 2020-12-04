const popupStyle = document.createElement('template')
popupStyle.innerHTML = `
<style class="popupStyle">

#popup-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
}

#popup-window {
    width: 500px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
}

#popup-window > p {
   font-family: sans-serif;
    margin: 0 50px;
}

#popup-Form {
    text-align: center; 
}

#popup-header {
    text-align: center;
    font-family: serif;
    font-style: italic;
    font-size: 50px;
    padding: 5px 0 0 0;
    margin: 20px;
}

label {
    text-align: center;
    display: block;
    font-size: 20px;
    margin: 0;
    font-family: sans-serif;
}

#userId-Field {
    border-color: grey;
    border: 2px solid grey;
    border-radius: 7px;
    margin: 15px auto; 
    font-size: 16px;
    padding: 7px 5px;

}

</style>
`

const gameHeaderStyle = document.createElement('template')
gameHeaderStyle.innerHTML = `
<style id="gameHeaderStyle">

#header {
width: 50%;
margin: 40px auto;
text-align: center;
}

#headerH1, #insertName {
    padding: 0 5px;
    display: inline-block;
    font-size: 50px;
    font-family: serif;
    font-style: italic;  
}

#game-rules > p {
    max-width: 500px;
    margin: 0 auto;
    padding: 0 0 30px 0;
    font-family: sans-serif;
    font-size: 20px
}

.button {
  background-color: rgb(70, 158, 87);
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 25px auto;
  text-decoration: none;
  display: block;
  font-size: 16px;
  border-radius: 10px;
  transition-duration: 0.3s;
}

.button:hover {
    cursor: pointer;
    background-color:rgb(99, 141, 97);
}

#question {
    display: block;
    text-align: center;
    font-size: 30px;
    font-family: sans-serif;
}
#clock {
    margin: 2px 15px;
    font-family: sans-serif;
}
#time-container{
    display: none;
    text-align: center;
    font-size: 30px;
    width: 70%;
    margin: 0 auto;
}

#time-meter {
    border-radius: 5px;
    border: 1px solid grey;
    display:inline-block;
    width: 50%;
    height: 30px;
    background-color: white;
}

#left {
   float: left;
   width: 100%;
    height: 30px;
    border-radius: 5px;
    background-color: green;
}

</style>
`

const textQuestionStyle = document.createElement('template')
textQuestionStyle.innerHTML = `
<style id="textQuestionStyle">
#textQuestion {
    text-align: center;
}
#question {
    margin: 30px auto;
}
#questionField {
    max-width: 500px;
    border-color: grey;
    border: 2px solid grey;
    border-radius: 7px;
    margin: 20px 0; 
    font-size: 20px;
    padding: 7px 5px;
}
</style>
`

const radioQuestionStyle = document.createElement('template')
radioQuestionStyle.innerHTML = `
<style id="radioQuestionStyle">
    #radioQuestion {
        margin: 0 auto;
        
}
    #radioQuestion > div {
        font-size: 20px; 
        text-align: center;
    }


    .labelradio {
        padding: 0 30px;
    }
</style>
`

const resultPageStyle = document.createElement('template')
resultPageStyle.innerHTML = `
<style id="resultPageStyle">
    #highscore-container {
        text-align: center;
    }
    #highscore-header {
        font-family: serif;
        font-size: 30px;
        font-style: italic;
    }

    #highscore-header p {
    text-align: center;
    }
    #display-highscore {
        text-align: center;
        width: 50%;
        margin: 0 auto;
    }

    #display-highscore h2 {
        font-size: 30px;
        font-family: sans-Serif;
    }

    #score-container {
        margin: 0 auto;
        width: 70%;
        margin: 0 0 0 30%;
    }

    p {
        font-family: sans-serif;
        text-align: left;
        display: inline-block;
        width: 50%;
    }

    #highscore-list {
        margin: 10px auto;
        padding: 0;
        list-style-type: none;
    
    }


    #highscore-list span {
        text-align: left;
        display: inline-block;
        width: 50%;
        font-family: sans-serif;
        padding: 5px 0;
    }


.button {
    background-color: rgb(70, 158, 87);
    border: none;
    color: white;
    padding: 15px 32px;
    margin: 25px auto;
    text-decoration: none;
    display: block;
    font-size: 16px;
    border-radius: 10px;
    transition-duration: 0.2s;
}

.button:hover {
    cursor: pointer;
    background-color:rgb(99, 141, 97);
}
</style>
`
export { popupStyle, gameHeaderStyle, textQuestionStyle, radioQuestionStyle, resultPageStyle }
