// preset dictionaries
let dicts = {"animals":{"cat": "🐈 best animal that meows", 
                        "dog": "🐶 best animal that barks",
                        "giraffe": "🦒 very tall animal", 
                        "unicorn": "🦄 magical animal(?) that looks like a horse and poops rainbows", 
                        "bee": "🐝 small insects that make honey", 
                        "fox": "🦊 animal of the dog family, smaller than wolves\nwhat does the _ _ _ say?", 
                        "dolphin": "🐬 small whales that can be taught to do tricks", 
                        "turtle": "🐢 shelled animal that moves veeeeeeery slooooooowly", 
                        "penguin": "🐧 birds that can't fly", 
                        "owl": "🦉 nocturnal birds, delivers letters for wizards", 
                        "sheep": "🐑 helps us sleep by letting us count them"},

            "body": {"eyes": "parts of your body used to see",
                    "ears": "parts of your body used to hear",
                    "nose": "part of your body used to smell", 
                    "mouth": "part of your body used to speak",
                    "teeth": "parts of your body used to chew your food", 
                    "legs": "parts of your body used to walk or run", 
                    "hands": "parts of your body used to play rock paper scissors"},

            "polygons": {"triangle": "three sided polygon", 
                        "quadrilateral": "four sided polygon",
                        "pentagon": "five sided polygon", 
                        "hexagon": "six sided polygon", 
                        "heptagon": "seven sided polygon",
                        "octagon": "eight sided polygon"},
        
            "numbers": {"one": "the number 1", 
                        "two": "the number 2",
                        "three": "the number 3",
                        "four": "the number 4",
                        "five": "the number 5",
                        "six": "the number 6",
                        "seven": "the number 7",
                        "eight": "the number 8",
                        "nine": "the number 9",
                        "ten": "the number 10",
                        "twenty": "the number 20",
                        "fifty": "the number 50",
                        "one hundred": "the number 100",
                        "one thousand": "the number 1000"}};

// add dictionaries to storage if first visit 
if (localStorage.getItem('animals') == null) {

    var names = Object.keys(dicts);
    for (var i=0; i < names.length; i++) {
        localStorage.setItem(names[i], JSON.stringify(dicts[names[i]]))
    }
    localStorage.setItem("DICTNAMES_PRESET", JSON.stringify(names))
    localStorage.setItem("CURRDICT", "animals")
}


function clearCurr() {
    localStorage.setItem('CURRDICT', "NEWDICT")
}

function playDict(dictName) {
    localStorage.setItem('CURRDICT', dictName)
    window.location.replace("./game.html")
}

function editDict(dictName) {
    localStorage.setItem('CURRDICT', dictName)
    window.location.replace("./editDict.html")
}

function showDicts(type) {

    // let user know which button has been pressed 
    var button = document.getElementById("show" + type + "Button")
    button.style.setProperty('color', '#cca0bb', 'important')
    button.style.backgroundColor = '#cca0bb22'
    button.style.borderStyle = 'solid'
    button.style.cursor = 'default'

    var otherButton = ""
    if (type == "PRESET") {
        otherButton = "showUSERButton"
    } else if (type == "USER") {
        otherButton = "showPRESETButton"
    } else {
        console.log("invalid type of dictionary")
        return 
    }
    otherButton = document.getElementById(otherButton)
    otherButton.style.color = '#000000'
    otherButton.style.backgroundColor = '#cca0bb'
    otherButton.style.borderStyle = 'none'
    otherButton.style.cursor = 'pointer'


    // get dictionaries 
    var keys = localStorage.getItem('DICTNAMES_' + type)
    keys = JSON.parse(keys)

    if (keys == null || keys.length == 0) {
        document.getElementById('showDictsDiv').innerHTML = 
        `<div class="setup-list-dictionary" style="display: flex; margin-bottom: 20px;">
        <h3 style="width:100%; font-size: 1.2rem; text-align: center;">No saved dictionaries</h3>
        </div>`
        document.getElementById('createDictDiv').style.display = "flex"
        return
    }

    // order alphabetically
    keys.sort();

    var innerText = ""
    document.getElementById('showDictsDiv').innerHTML = ""
    for (var i=0; i< keys.length;i++) {
        // create option for each dictionaries 
        
        innerText += 
        `<div class="setup-list-dictionary" style="display: flex; margin-bottom: 20px;">
            <div style="flex-basis: 66.66%;">
                <h3 style="text-align: center;">`+ keys[i] +`</h3>
            </div>`
            
        if (type == 'PRESET') { 
            innerText += 
        `   <div style="flex-basis: 33.33%; display:flex; margin: auto;">
                <button class="button" onclick="playDict('`+keys[i]+`')" style="width:80%; background-color:#cca0bb !important; border-color: #cca0bb !important; margin-left: 10%; padding-top: 15px !important; padding-bottom: 15px !important;">Play</button>
            </div>
        </div>`
        } else {
            innerText += 
        `   <div style="flex-basis: 33.33%;">
                <button class="button" onclick="playDict('`+keys[i]+`')" style="width:90%; border-color: #cca0bb !important; margin-left: 5%; margin-top: 5%; padding-top: 10px !important; padding-bottom: 10px !important;">Play</button>
                <button class="button" onclick="editDict('`+keys[i]+`')" style="width:80%; border-color: #cca0bb !important; margin: 10%;">Edit</button>
            </div>
        </div>`
        }

        document.getElementById('showDictsDiv').innerHTML = innerText
    
    }

    if (type == "PRESET"){
        document.getElementById('createDictDiv').style.display = "none"
    } else if (type == "USER") {
        document.getElementById('createDictDiv').style.display = "flex"
    }
}

// show preset dicts by defalut
showDicts("PRESET")