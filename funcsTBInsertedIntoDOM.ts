console.log("Loading essential funcs needed for YouTube Overlay extension.")

clearInterval(asIntervalID); // cannot clear this from yt.ts because yt.ts runs in a sandbox. So need to clear it here, if it exists, on startup. Thankfully doesn't throw error even if doesn't exist.
clearTimeout(hideChordsCtrlsTimeoutID);

var asSpeeds = {1: 250, 2: 150, 3: 100, 4: 90, 5: 75, 6: 60, 7: 50, 8: 40, 9: 30};

var chordsCtrls:HTMLDivElement = document.querySelector("#chordsCtrls");
var chordsTA:HTMLTextAreaElement = document.querySelector("#chordsTA");
var asBtn:HTMLButtonElement = document.querySelector("#asBtn");
var autoScrollSpeed = 250;
var asIntervalID = 0;
function toggleAutoScroll() {
    if(asIntervalID){
        clearInterval(asIntervalID);
        asIntervalID = 0;
        console.log("Stopped autoscroll.");
        document.querySelector("#speedUp").remove(); document.querySelector("#speedDn").remove();
        setAttributes(asBtn, {"data-front": `Auto-Scroll Off`, 'data-back': 'Turn On'});
        return;
    }
    
    // create speed + - buttons
    let speedUp = document.createElement("a");
    speedUp.textContent = "+";
    setAttributes(speedUp, {'id': 'speedUp', 'class': 'btn noselect', 'onclick': 'speedUpAS();'});
    document.querySelector("#chordsCtrls").insertBefore(speedUp,document.querySelector("#decTxtSize"));
    let speedDn = document.createElement("a");
    speedDn.textContent = "-";
    setAttributes(speedDn, {'id': 'speedDn', 'class': 'btn noselect', 'onclick': 'speedDnAS();'});
    document.querySelector("#chordsCtrls").insertBefore(speedDn,asBtn);;

    setAttributes(asBtn, {"data-front": `Speed: ${getKeyByValue(asSpeeds,autoScrollSpeed)}`, 'data-back': 'Turn Off'});

    asIntervalID = setInterval(_=>{chordsTA.scrollBy(0, 1)}, autoScrollSpeed);
    console.log("Started autoscroll.")
}

var speedUpAS = () => {
    console.log("Speeding up autoscroll")
    let asBtnText = asBtn.getAttribute('data-front');
    let newSpeed:number = parseInt(asBtnText.charAt(asBtnText.length - 1))+1;
    if (newSpeed in asSpeeds){
        clearInterval(asIntervalID);
        autoScrollSpeed = asSpeeds[newSpeed];
        asIntervalID = 0;
        asBtn.setAttribute('data-front', `Speed: ${getKeyByValue(asSpeeds, autoScrollSpeed)}`);
        asIntervalID = setInterval(_=>{chordsTA.scrollBy(0, 1)}, autoScrollSpeed);
    }
}

var speedDnAS = () => {
    console.log("Speeding down autoscroll")
    let asBtnText = asBtn.getAttribute('data-front');
    let newSpeed:number = parseInt(asBtnText.charAt(asBtnText.length - 1))-1;
    if (newSpeed in asSpeeds){
        clearInterval(asIntervalID);
        autoScrollSpeed = asSpeeds[newSpeed];
        asIntervalID = 0;
        asBtn.setAttribute('data-front', `Speed: ${getKeyByValue(asSpeeds, autoScrollSpeed)}`);
        asIntervalID = setInterval(_=>{chordsTA.scrollBy(0, 1)}, autoScrollSpeed);
    }
}  

var incTxtSize = () => {
    let currFontSize = parseFloat(chordsTA.style.fontSize);
    let newFontSize = currFontSize += 1;
    chordsTA.style.fontSize = `${newFontSize}px`;
}

var decTxtSize = () => {
    let currFontSize = parseFloat(chordsTA.style.fontSize);
    let newFontSize = currFontSize -= 1;
    chordsTA.style.fontSize = `${newFontSize}px`;
}

var unhideChordsCtrls = () => {
    clearTimeout(hideChordsCtrlsTimeoutID);
    let childrenOfchordsCtrlsDiv:any = chordsCtrls.getElementsByTagName("*");
    for (let index = 0; index < childrenOfchordsCtrlsDiv.length; index++) {
        childrenOfchordsCtrlsDiv[index].style.transform = "translate(0,0)";
    }
}

var hideChordsCtrlsTimeoutID = 0;
var hideChordsCtrls = () => {
    hideChordsCtrlsTimeoutID = setTimeout(() => {        
        let childrenOfchordsCtrlsDiv:any = chordsCtrls.getElementsByTagName("*");
        for (let index = 0; index < childrenOfchordsCtrlsDiv.length; index++) {
            childrenOfchordsCtrlsDiv[index].style.transform = "translate(0,-100%)";
        }
    }, 2000);
}

hideChordsCtrlsTimeoutID = setTimeout(() => { //hide the controls after initially showing them for 4 secs
    hideChordsCtrls();
}, 4000);

var decIndent = () => {
    let newLeftPadding = (parseInt(chordsTA.style.paddingLeft) - 50);
    if (!newLeftPadding) newLeftPadding = 0; // this catches NaN on first run, as it is not set. Also doesn't allow to go less than 0 somehow, luckily.
    chordsTA.style.paddingLeft = `${newLeftPadding}px`;
}

var incIndent = () => {
    let newLeftPadding = (parseInt(chordsTA.style.paddingLeft) + 50);
    if (!newLeftPadding) newLeftPadding = 50; // this catches NaN on first run, as it is not set. 
    if (newLeftPadding > document.querySelector("#chordsDiv").getBoundingClientRect().width) return;
    chordsTA.style.paddingLeft = `${newLeftPadding}px`;
}

// following funcs stolen from SO for finding a key by its value & setting attributes multiple at a time.
function getKeyByValue(object:object, value:Number) {
    return Object.keys(object).find(key => object[key] === value);
  }

function setAttributes(el:HTMLElement, attrs:object) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
}
}