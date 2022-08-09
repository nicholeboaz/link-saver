let myLinks = [];
const titleEl = document.getElementById("title-el");
const linkEl = document.getElementById("link-el");
const bodyEl = document.getElementById("body-el");
const xBtnEl = document.getElementsByClassName("x-container");
const quickBtn = document.getElementById("quick-btn");
const saveBtn = document.getElementById("save-btn");
const clearBtn = document.getElementById("clear-btn");
const modeBtn = document.getElementById("mode-btn");
const ulEl = document.getElementById("ul-el");
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));
const displayMode = localStorage.getItem("displayMode");
const updateLocalStorage = () => localStorage.setItem("myLinks", JSON.stringify(myLinks));
const renderDisplay = () => {
    if (displayMode) {
        bodyEl.className = displayMode;
    } else {
        localStorage.setItem("displayMode", "darkmode")
        location.reload();
    }
    bodyEl.className = displayMode;
}

renderDisplay();

if (linksFromLocalStorage) {
    myLinks = linksFromLocalStorage;
    render(myLinks);
}

titleEl.addEventListener("keyup", function (event) {     // listen for enter key in titleEl
    event.preventDefault();
    if (event.keyCode === 13) {
        linkEl.focus();
    }
})

linkEl.addEventListener("keyup", function (event) {      // listen for enter key in linkEl
    event.preventDefault();
    if (event.keyCode === 13) {
        saveBtn.click();
    }
})

modeBtn.addEventListener("click", function () {          // toggle display mode
    if (displayMode === "darkmode") {
        localStorage.setItem("displayMode", "lightmode")
    } else {
        localStorage.setItem("displayMode", "darkmode")
    }
    renderDisplay();
    location.reload();
})

quickBtn.addEventListener("click", function () {         // quick fill button
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        titleEl.value = tabs[0].title;
        linkEl.value = tabs[0].url;
    })
})

saveBtn.addEventListener("click", function () {         // save button
    let obj = {};
    if (linkEl.value) {                                 // check if URL exists
        if (titleEl.value) {                            // check if title exists 
            obj['title'] = titleEl.value;
            obj['url'] = linkEl.value;
        } else {                                        // if title doesn't exist: title = url 
            obj['title'] = linkEl.value;
            obj['url'] = linkEl.value;
        }
        myLinks.push(obj)
        titleEl.value = "";
        linkEl.value = "";
        updateLocalStorage();
        render(myLinks);
    }
    // problem for later: check if URL is valid
})

clearBtn.addEventListener("click", function () {        // clear button
    myLinks = [];
    updateLocalStorage();
    render(myLinks);
})

function render(links) {
    let listItems = "";
    for (i = 0; i < links.length; i++) {
        let newUrl = links[i]["url"];
        let newTitle = links[i]["title"];
        if (newTitle === "") {
            newTitle = newUrl;
        }
        listItems += `
        <li>
            <div class="li-container">
                <div class="title-container"><a href="${newUrl}">${newTitle}</a></div>
                <div id="${i}" class="x-container">&#10060;</div>
            </div>
        </li>
    `
    }
    ulEl.innerHTML = listItems;                                 // render the list items!!
    for (i = 0; i < xBtnEl.length; i++) {                       // remove individual list items with X button
        xBtnEl.item(i).addEventListener("click", function () {
            myLinks.splice(this.id, 1);
            updateLocalStorage();
            render(myLinks);
        })
    }
}

// nope button, for troubleshooting purposes
// const nope = document.getElementById("nope");
// nope.addEventListener("click", function() {
//     localStorage.clear();
//     location.reload();
// });

// <button id="nope" class="btn2">NOPE</button>