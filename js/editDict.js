// default is empty
var dict = {}
var dictName = localStorage.getItem('CURRDICT')
if (dictName != null && dictName != "NEWDICT") {
    let strDict = localStorage.getItem(dictName)
    dict = JSON.parse(strDict)
    document.getElementById('dictName').value = dictName;
    // set up table
    var words = Object.keys(dict)
    words.sort()
    for (var i=0; i < words.length; i++) {
        updateTable(words[i])
    }
    document.getElementById('deleteDict').style.display = 'block'
    updateDictMessage()
    updateWordMessage()
}

var currWord = ""

function addToDict() {
    let word = document.getElementById('newWord').value
    let definition = document.getElementById('newDefinition').value
    
    if (word in dict && currWord != word) {
        document.getElementById('newWord').style.borderStyle = 'solid';
        updateWordMessage("That word is already in the dictionary");
        return
    }

    if (word == "" || word.match(/^[ ]+$/)) {
        // let user know input field is empty
        document.getElementById('newWord').style.borderStyle = 'solid';
        document.getElementById('newDefinition').style.borderStyle = 'none';
        updateWordMessage("Word cannot be empty");
        return
    }
    
    if (! word.match(/^[a-zA-Z0-9 -.']+$/)) {
        updateWordMessage("Invalid characters in word")
        document.getElementById('newWord').style.borderStyle = 'solid';
        document.getElementById('newDefinition').style.borderStyle = 'none';
        return false
    }

    if (definition == "") {
        document.getElementById('newWord').style.borderStyle = 'none';
        document.getElementById('newDefinition').style.borderStyle = 'solid';
        updateWordMessage("Definition cannot be empty");
        return
    }

    // if editing a word
    if (currWord != "") {
        var cell = document.getElementById(currWord + "Cell")
        cell = document.getElementById(currWord + "P")
        cell.innerText = word
        cell.id = word + "P"
        cell = document.getElementById(currWord + "Cell")
        cell.id = word + "Cell"
        cell.onclick = function(){
            updateInputs(word, definition)
            
        }
        delete dict[currWord]
        dict[word] = definition
        updateInputs()
        return
    } 

    // adding new word

    // add word to table
    updateTable(word)

    // add/update cuurrent dictionary
    dict[word] = definition
    
    // remove text in inputs 
    updateInputs()
}

function deleteFromDict() {
    var cell = document.getElementById(currWord + "Cell")
    
    cell.parentNode.removeChild(cell)
    delete dict[currWord]
    updateInputs()
    return
}

function updateTable(word) {
    var tbody = document.getElementById('dictTable').getElementsByTagName('tbody')[0];
    
    // Insert a row at the end of table
    var newRow = tbody.insertRow();
    
    // Insert a cell at the end of the row
    var newCell = newRow.insertCell();
    newCell.id = word + "Cell"
    newCell.style.cursor = 'pointer'
    newCell.onmouseover = function(){
        newCell.style.backgroundColor = "#77777733"
    };
    newCell.onmouseleave = function(){
        newCell.style.backgroundColor = "#00000000"
    };
    // on click show word and its definition
    newCell.onclick = function(){
        updateInputs(word, dict[word])
    }
    
    var newText = document.createElement("p")
    newText.id = word + "P"
    newText.innerText = word;
    newText.style.margin = 0;
    newCell.appendChild(newText);

    updateWordMessage("");

}

function saveDict() {
    // get name for dictionary
    if (document.getElementById('dictName').value == "") {
        // let user know name field is empty
        updateDictMessage("Please set a name for the dictionary")
        return false
    } else if (['DICTNAMES_PRESET', 'DICTNAMES_USER', 'CURRDICT', 'NEWDICT'].includes(document.getElementById('dictName').value)) {
        updateDictMessage("This dictionary name cannot be used")
        return false
    } else {
        dictName = document.getElementById('dictName').value
    }

    // add name to dictNames (if not already included)
    var dictNamesString = localStorage.getItem('DICTNAMES_USER')
    var dictNames = []
    if (dictNamesString != null) {
        dictNames = JSON.parse(dictNamesString)
    }
    if (!dictNames.includes(dictName)) {
        if (localStorage.getItem('CURRDICT') != 'NEWDICT') {
            // remove last dict
            const index = dictNames.indexOf(localStorage.getItem('CURRDICT'));
            if (index > -1) {
                dictNames.splice(index, 1);
            }
            localStorage.setItem('DICTNAMES_USER', JSON.stringify(dictNames))

            // remove actual dict from localStorage
            localStorage.removeItem(localStorage.getItem('CURRDICT'))
        }
        dictNames.push(dictName)
        localStorage.setItem('DICTNAMES_USER', JSON.stringify(dictNames))
        localStorage.setItem('CURRDICT', dictName)
    } else if (dictName != localStorage.getItem('CURRDICT')) { 
        // if not updating existing
        // let user know dictname exists already
        updateDictMessage("Dictionary name has already been used")
        return
    }
     
    localStorage.setItem(dictName, JSON.stringify(dict))
    
    updateDictMessage("Dictionary Saved!")

    document.getElementById('deleteDict').style.display = 'block'

    return true
}

function saveNPlay() {
    // if successfully saved
    if (saveDict()) {
        // set this to CURRDICT
        localStorage.setItem('CURRDICT', dictName)
        // switch to play game page
        window.location.replace("./game.html")
    }
}

function deleteDict() {
    // double check before leaving page

    if (confirm("Are you sure you want to delete this dictionary?")) {
        // remove from list of dict names
        var dictNamesString = localStorage.getItem('DICTNAMES_USER')
        var dictNames = []
        if (dictNamesString != null) {
            dictNames = JSON.parse(dictNamesString)
        }
        const index = dictNames.indexOf(dictName);
        if (index > -1) {
            dictNames.splice(index, 1);
        }
        localStorage.setItem('DICTNAMES_USER', JSON.stringify(dictNames))

        // remove actual dict from localStorage
        localStorage.removeItem(dictName)

        // switch to dictionary list page
        window.location.replace("./showDicts.html")
    }
}

function updateInputs(word="", definition="") {
    document.getElementById('newWord').value = word
    document.getElementById('newWord').style.borderStyle = 'none'
    document.getElementById('newDefinition').value = definition
    document.getElementById('newDefinition').style.borderStyle = 'none'

    currWord = word

    if (word == "") {
        document.getElementById('deleteFromDict').style.display = 'none'
    } else {
        document.getElementById('deleteFromDict').style.display = 'block'
    }
}

function updateWordMessage(message="") {
    document.getElementById('wordMessage').innerHTML = message
    updateDictMessage()
}

function updateDictMessage(message="") {
    document.getElementById('dictMessage').innerHTML = message
}


function limLength(elem, i) {
    if(elem.value.length > i) {
        elem.value = elem.value.substr(0, i);
    }
    // delete any message showing when starts typing
    updateDictMessage()
    updateWordMessage()
}
document.getElementById('dictName').onkeydown = function() {
    limLength(this, 16);
}
document.getElementById('dictName').onkeyup = function() {
    limLength(this, 16);
}
document.getElementById('newWord').onkeydown = function() {
    limLength(this, 16);
}
document.getElementById('newWord').onkeyup = function() {
    limLength(this, 16);
}