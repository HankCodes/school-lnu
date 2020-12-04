const hanksWindowTemp = document.createElement('template')
hanksWindowTemp.innerHTML = `
<style>
    #hw-container {
    position: absolute;
    display: inline;
    margin: 0;
    padding: 0;
    background-color: white; 
    box-shadow: 0px 0px 7px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}


#top-bar {
    height: 30px;
    border-bottom: 1px solid rgb(192, 192, 192);
    min-width: 200px;
}

#topbar-icon{
    display: flex;
    align-items: center;
    float: left;
    height: inherit;
}

img { 
    height: 90%;
    margin: 0 3px;
}

#topbar-p {
    font-family: sans-serif;
    display: table-cell;
    vertical-align: middle;
    white-space: nowrap;
    margin: 0 10px;
    cursor: default;
}


#min-close {
    padding: 0;
    margin:0;
    float: right;
    width: 80px;
    height: inherit;
    font-size: 30px;  
    cursor: pointer;
}

#close, #min {
    display: inline-block;
    margin: 0;
    height: 30px;
    width: 40px;
    transition: background-color 0.3s;
}
#close:hover {
    background-color: rgb(255, 56, 56);
}

#close img:hover {
    filter: invert(1);
}
#close {
    float: right;
}


#close > img {
 padding: 7px;
 width: 50%;
 height: 50%;

}
.maximizedOrMinimized {
    background-image: url('js/hanks-window-element/images/minimize-icon.svg');
    background-repeat: no-repeat;
    background-size:40%;
    background-position: center;
}

#min:hover {
    background-color: lightgrey;  
}



#bottom-bar {
    border-top: 1px solid rgb(192, 192, 192);
    height: 30px; 
    width: 100%; 
}

</style>

<section id="hw-container">
<div id="top-bar">
    <div id="topbar-icon"><img src="" alt="" id="icon"><p id="topbar-p"></p></div>

    <div id="min-close">
        <div id="min" class="maximizedOrMinimized"></div>
        <div id="close"><img src="js/hanks-window-element/images/close-icon.svg"></div>
    </div>
</div>
<div id="content"></div>
<div id="bottom-bar"></div>
</section>
`
export { hanksWindowTemp }
