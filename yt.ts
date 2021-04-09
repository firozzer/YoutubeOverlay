// all global variables are 'var' instead of let or const because the delete command works only on var
var isFullScreen = false;
var extensionActivated = false;
var resCheckerID:number;
var chordsTALeftPaddingNonFS = chordsTALeftPaddingNonFSOnExit;
var chordsTALeftPaddingFS = "0px";
var thisIsThe1stExitAfterFS = true;

var activateExtension = () => { 
  console.log("YouTube Overlay activated.");
  let scriptElemForASBtn = document.createElement("style");
  let innardsForASBtn = styleForAsBtn;
  scriptElemForASBtn.innerHTML = innardsForASBtn;
  document.head.appendChild(scriptElemForASBtn);
  
  const videoElem = document.querySelector("video");
  const vidBottomPanel = document.querySelector(".ytp-chrome-bottom");
  const progBarPadding = document.querySelector(".ytp-progress-bar-padding");
  
  const getIdealChordsDivStyles = (isFullScreen:boolean) => {
    let vidDims = videoElem.getBoundingClientRect();
    let progBarPaddingDims = progBarPadding.getBoundingClientRect();
    if (isFullScreen){
      console.log("fullscreen detected")
      thisIsThe1stExitAfterFS = true;
      chordsTALeftPaddingNonFS = chordsTA.style.paddingLeft; // saving this for next nonFS
      chordsTA.style.paddingLeft = chordsTALeftPaddingFS; // assigning this from prev FS
      return `overflow: hidden; position: absolute; z-index: 1111; width: 100vw; height: ${progBarPaddingDims.y - vidDims.y + (progBarPaddingDims.height/2)}px`;
    } else {
      try {
        if(thisIsThe1stExitAfterFS) 
          chordsTALeftPaddingFS = chordsTA.style.paddingLeft;
          chordsTA.style.paddingLeft = chordsTALeftPaddingNonFS;
          thisIsThe1stExitAfterFS = false;
      } catch {} // saving this for next FS. on first run it obsly won't be able to find chordsTA.
      return `overflow: hidden; position: absolute; z-index: 1111; left: ${vidDims.x}px; top: ${vidDims.y}px; width: ${vidDims.width}px; height: ${progBarPaddingDims.y - vidDims.y + (progBarPaddingDims.height/2)}px`;
    }
  }
    
  
  // creating the chords div 
  let chordsDiv = document.createElement('div');
  chordsDiv.style.cssText = getIdealChordsDivStyles(isFullScreen);
  chordsDiv.setAttribute("id", "chordsDiv");

  let htmlInnards = `
  <div id="chordsCtrls" onmouseover="unhideChordsCtrls();" onmouseout="hideChordsCtrls();" style="z-index: 1112; height: ${vidBottomPanel.getBoundingClientRect().height}px; position: absolute; display: inline-block;">
      <a id="asBtn" onclick="toggleAutoScroll()" class="btn-flip" data-back="Turn on" data-front="Auto-Scroll Off"></a>
      <a id="decTxtSize" class="btn noselect" onclick="decTxtSize();">Tᵀ</a>
      <a id="incTxtSize" class="btn noselect" onclick="incTxtSize();">ᵀT</a>
      <a id="decIndent" class="btn noselect" onclick="decIndent();">¶-</a>
      <a id="incIndent" class="btn noselect" onclick="incIndent();">¶+</a>

  </div>
  <textarea id="chordsTA" spellcheck="false" style=" white-space: pre; overflow-wrap: normal; overflow-x: scroll; font-family: Roboto Mono,monospace; background-color: rgba(0, 0, 0, 0.35); color: white; height: 100%; width: 100%; font-size: ${window.screen.height*0.026}px;" placeholder="\nPaste your chords/lyrics in here!">
  `
  
  chordsDiv.innerHTML = htmlInnards;

  document.body.appendChild(chordsDiv);

  chordsTA.value = lyricsOnExit; // doing in convoluted way because i cant fig it out :S
  if (chordsTA.value === "undefined") chordsTA.value = "";
  chordsTA.scrollTop = lyricsLocOnExit;
  chordsTA.style.fontSize = lyricsSizeOnExit;
  chordsTA.style.paddingLeft = chordsTALeftPaddingNonFS;
  console.log("Lyrics reinstated, if any.");

  
  // hiding the scrollbar of chords div & textarea
  let styleForScrollbarHiding = `#chordsDiv::-webkit-scrollbar, #chordsTA::-webkit-scrollbar {height: 0; width: 0;}`;
  let styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styleForScrollbarHiding;
  document.head.appendChild(styleSheet);

  // auto sizing of chords div
function resCheck() {
    let vidDims = videoElem.getBoundingClientRect();
    let chordsDims = chordsDiv.getBoundingClientRect();
    let requisiteHtForChordsDiv =  vidDims.height - vidBottomPanel.getBoundingClientRect().height- (progBarPadding.getBoundingClientRect().height/2);
    if (((chordsDims.x !== vidDims.x || chordsDims.width !== vidDims.width) && chordsDims.x !== 0) || (chordsDims.x === 0 && chordsDims.x !== vidDims.x)) { // base cond's latter gets True when exiting from FS. Base's former's former checks in non fullScn mode if x or width is wrong.
      if (isFullScreen && vidDims.y === 0) return;
      console.log("Video dimensions changed detected, redrawing overlay.");
      isFullScreen = vidDims.y === 0 ? true : false;
      chordsDiv.style.cssText = getIdealChordsDivStyles(isFullScreen);
    }
  }
  resCheckerID = setInterval(resCheck, 2000);

  // addding my JS functions to the youtube HTML webpage/DOM
  let s = document.createElement('script');
  // TODO: add "scriptName.js" to web_accessible_resources in manifest.json
  s.src = chrome.runtime.getURL('funcsTBInsertedIntoDOM.js');
  (document.head || document.documentElement).appendChild(s);
}


var styleForAsBtn = `
#asBtn {
    opacity: 1;
    outline: 0;
    color: #FFFFFF;
    line-height: 40px;
    position: relative;
    text-align: center;
    letter-spacing: 1px;
    display: inline-block;
    text-decoration: none;
    text-transform: uppercase;
    font-size: small;
    font-weight: bold;
  }
  #asBtn:hover:after {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
  #asBtn:hover:before {
    opacity: 0;
    transform: translateY(50%) rotateX(90deg);
  }
  #asBtn:after {
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    color: #000000;
    background: #BCBCBC;
    display: block;
    transition: 0.25s;
    position: absolute;
    content: attr(data-back);
    transform: translateY(-50%) rotateX(90deg);
  }
  #asBtn:before {
    top: 0;
    left: 0;
    opacity: 1;
    color: #FFFFFF;
    background: #323237;
    display: block;
    padding: 0 5px;
    line-height: 40px;
    transition: 0.25s;
    position: relative;
    content: attr(data-front);
    transform: translateY(0) rotateX(0);
  }

  /* CSS for other buttons */
  .btn{
    display: inline-block;
    color: #FFFFFF;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
    font-weight: bold;
    background-image: -webkit-linear-gradient(#666666 0%, #323237  100%);
    background-image: linear-gradient(#666666 0%, #323237 100%);
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.66);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.28);
    font-size: x-large;
    cursor: pointer;
  }
  .btn:active{
    color: #000000;
  } 
  .btn:hover {
    text-align: center;
    opacity: 1;
    background-image: -webkit-linear-gradient(#999999 0%, #323237 100%);    
    background-image: linear-gradient(#999999 0%, #323237 100%);
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
  }

  #incTxtSize, #decTxtSize{
    font-size: large;
  }

  #chordsCtrls>*{
    transition: transform 0.1s linear;
  }

  textarea::placeholder {
    color: white;
    opacity: 0.8;
    font-size: 4vh;
  }

  #contentContainer.tp-yt-app-drawer[swipe-open].tp-yt-app-drawer::after{
    visibility: hidden;
  }
`
// the last css property above is hiding a thin left side vertical area which otherwise causes chordsCtrls not to show up if mouse is on extreme left. Also causes difficulty clicking SpeedDn button.

if (!document.querySelector("#chordsDiv")){
  activateExtension();
} else {
  console.log("YouTube Overlay deactivated");
  var lyricsOnExit = chordsTA.value;
  var lyricsLocOnExit = chordsTA.scrollTop;
  var lyricsSizeOnExit = chordsTA.style.fontSize;
  var chordsTALeftPaddingNonFSOnExit = chordsTA.style.paddingLeft; // won't be possible to save FS padding unless i deactivate extension with an X btn. Due to scope prob.
  document.querySelector("#chordsDiv").remove();
  clearInterval(resCheckerID);
  delete window.resCheckerID;
}