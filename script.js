const landBtn = document.getElementById("mainbtn");
let funMainPage;


//Deleting all elements except header on button click
landBtn.addEventListener("click", funMainPage = () => {
    let language = "C";
    let time = 0;
    let timeLimit = 60;
    let timerState = false;   
    let n = 0;
    let randomCode = [];
    let randomCodeWords = [];
    let wordNumber = 0;
    let characterNumber = 0;
    let wordCorrect = 0;
    let wordIncorrect = 0;
    let wordState = true;
    let characterCorrect = 0;
    let characterIncorrect = 0;
    let numberOfLines = 0;
    let textContentAbove = "";
    let keypressCapture;
    let timeUpdate;

    document.body.removeChild(document.getElementById("main"));
    document.body.removeChild(document.getElementById("languages"));
    const headerdiv = document.createElement("div");
    document.body.appendChild(headerdiv);
    headerdiv.setAttribute("id", "headerdiv");

    const navOne = document.createElement("button");
    headerdiv.append(navOne);
    navOne.setAttribute("id", "navOne");
    navOne.textContent = "Select Preferred Language";

    const navTwo = document.createElement("button");
    headerdiv.appendChild(navTwo);
    navTwo.setAttribute("id", "navTwo");
    navTwo.textContent = "Select Preferred Time";

    const navThree = document.createElement("a");
    headerdiv.appendChild(navThree);
    navThree.setAttribute("id", "navThree");
    navThree.textContent = 'Selected: Language- ' + language + " Time- 1 min";

    const belowHeader = document.createElement("div");
    belowHeader.setAttribute("id", "belowHeader");
    document.body.appendChild(belowHeader);
    const selectLanguage = document.createElement("div");
    selectLanguage.setAttribute("id", "selectLanguage");
    belowHeader.appendChild(selectLanguage);
    const selectLanguageC = document.createElement("img");
    selectLanguage.appendChild(selectLanguageC);
    selectLanguageC.setAttribute("src", "assets/c-logo.png");
    selectLanguageC.setAttribute("class", "langimg");

    const selectLanguageJs = document.createElement("img");
    selectLanguage.appendChild(selectLanguageJs);
    selectLanguageJs.setAttribute("src", "assets/javascript-logo.png");
    selectLanguageJs.setAttribute("class", "langimg");

    const selectLanguagePython = document.createElement("img");
    selectLanguage.appendChild(selectLanguagePython);
    selectLanguagePython.setAttribute("src", "assets/python-logo-only.png");
    selectLanguagePython.setAttribute("class", "langimg");


    const selectLanguageJava = document.createElement("img");
    selectLanguage.appendChild(selectLanguageJava);
    selectLanguageJava.setAttribute("src", "assets/java-logo.png");
    selectLanguageJava.setAttribute("class", "langimg");

    selectLanguage.setAttribute("hidden", "true");

    //Selecting Time 
    const selectTime = document.createElement("ul");
    selectTime.setAttribute("id", "selectTime");
    belowHeader.appendChild(selectTime);
    selectTime.setAttribute("hidden", "true");

    const selectTimeOneMin = document.createElement("li");
    selectTime.appendChild(selectTimeOneMin);
    selectTimeOneMin.setAttribute("id", "selectTimeOneMin");
    selectTimeOneMin.setAttribute("class", "time");
    selectTimeOneMin.textContent = "1 Minute - 60 Seconds";


    const selectTimeTwoMin = document.createElement("li");
    selectTime.appendChild(selectTimeTwoMin);
    selectTimeTwoMin.setAttribute("id", "selectTimeTwoMin");
    selectTimeTwoMin.setAttribute("class", "time");
    selectTimeTwoMin.textContent = "2 Minute - 120 Seconds";


    const selectTimeThreeMin = document.createElement("li");
    selectTime.appendChild(selectTimeThreeMin);
    selectTimeThreeMin.setAttribute("id", "selectTimeThreeMin");
    selectTimeThreeMin.setAttribute("class", "time");
    selectTimeThreeMin.textContent = "3 Minute - 180 Seconds";


    const selectTimeFiveMin = document.createElement("li");
    selectTime.appendChild(selectTimeFiveMin);
    selectTimeFiveMin.setAttribute("id", "button");
    selectTimeFiveMin.setAttribute("class", "time");
    selectTimeFiveMin.textContent = "5 Minute - 300 Seconds";

    //Genrating Input div 
    const inputDiv = document.createElement("div");
    inputDiv.setAttribute("id", "inputDiv");
    document.body.appendChild(inputDiv);

    const inputDivCode = document.createElement("div");
    inputDivCode.setAttribute("id", "inputDivCode");
    inputDivCode.setAttribute("class", "inputDivElement");
    inputDiv.appendChild(inputDivCode);

    const inputDivKey = document.createElement("div");
    inputDivKey.setAttribute("id", "inputDivKey");
    inputDivKey.setAttribute("class", "inputDivElement");
    inputDiv.appendChild(inputDivKey);
    inputDivKey.textContent = "";

    inputDivCode.textContent = "Fetching Code For You ..";

    const timerElement = document.createElement("span");
    timerElement.setAttribute("id", "timerElement");
    inputDiv.appendChild(timerElement);
    timerElement.textContent = "Typing Not Started";

    const resultDiv = document.createElement("div");
    resultDiv.setAttribute("id", "resultDiv");

    const whichKeyPress = document.createElement("span");
    whichKeyPress.setAttribute("id", "whichKeyPress");
    inputDiv.appendChild(whichKeyPress);
    whichKeyPress.textContent = "Enter";




    //Event Listeners
    let selectLanguageState = false;
    let selectTimeState = false;
    navOne.addEventListener("click", () => {
        if (!selectLanguageState) {
            selectLanguage.style = "display:grid";
            selectLanguageState = true;
        }
        else { selectLanguage.style = "display:none;"; selectLanguageState = false; }


    });

    navTwo.addEventListener("click", () => {
        if (!selectTimeState) {
            selectTime.style = "display:grid";
            selectTimeState = true;
        }
        else { selectTime.style = "display:none;"; selectTimeState = false; }
        //event Listeners for Individual options of the Listeners
        selectTimeOneMin.addEventListener("click", () => {
            timeLimit = 60; selectTime.setAttribute("hidden", "true");
        });
        selectTimeOneMin.addEventListener("click", () => { timeLimit = 60; selectTime.style = "display:none"; navThree.textContent = "Selected: " + "Language - " + language + " Time - 1 min"; });
        selectTimeTwoMin.addEventListener("click", () => { timeLimit = 120; selectTime.style = "display:none;"; navThree.textContent = "Selected: " + "Language - " + language + " Time - 2 min"; });
        selectTimeThreeMin.addEventListener("click", () => { timeLimit = 180; selectTime.style = "display:none;"; navThree.textContent = "Selected: " + "Language - " + language + " Time - 3 min"; });
        selectTimeFiveMin.addEventListener("click", () => { timeLimit = 300; selectTime.style = "display:none;"; navThree.textContent = "Selected: " + "Language - " + language + " Time - 5 min"; });





    });

    //Random Code codeGeneration
    async function randomC() {
        randomCode = await import("/jsmodules/codeGenerationC.js")
        randomCode = randomCode.randomCodeC.split("\n");
        //console.log(randomCode);
        document.getElementById("inputDivCode").textContent = randomCode[0] + "\n" + randomCode[1] + "\n" + randomCode[2] + "\n" + randomCode[3];
        console.log("first Function");
        //console.log(randomCode);

    }
    async function fix() {
        await randomC();
        await randomCodeWordUpdate();
    }
    fix();


    //Update visible code 
    function updateCode() {
        n++;
        inputDivCode.textContent = randomCode[n] + "\n" + randomCode[n + 1] + "\n" + randomCode[n + 2] + "\n" + randomCode[n + 3];
        //randomCodeWordUpdate();

    }
    async function randomCodeWordUpdate() {
        console.log("1\n", randomCode);
        console.log("Second Function");
        randomCodeWords = await randomCode[n].split(" ");
        wordNumber = 0;
    }

    //Event Listeners for keypress
    addEventListener("keypress", keypressCapture = (event) => {
        document.getElementById("whichKeyPress").textContent = event.key;
        if (!timerState) { timer(); timerState = true; }

        let key = event.key;
        if (key == "Enter") {
            numberOfLines++;
            wordState ? wordCorrect++ : wordIncorrect++;
            wordState = true;
            updateCode();
            randomCodeWordUpdate();
            wordNumber = 0;
            characterNumber = 0;
            inputDivKey.textContent = "";
            textContentAbove = "";
            inputDivKey.style = "color:green";

        }
        else if (key == " ") {
            console.log(characterNumber, randomCodeWords[wordNumber].length);
            if (!(characterNumber < randomCodeWords[wordNumber].length)) {
                wordState ? wordCorrect++ : wordIncorrect++;
                wordState = true;
                wordNumber++;
                characterNumber = 0;
                textContentAbove = textContentAbove + " ";
                inputDivKey.textContent = textContentAbove;
                inputDivKey.style = "color:green";
            }

        }
        else {
            if (randomCodeWords[wordNumber][characterNumber] == event.key) {
                characterCorrect++;
                textContentAbove = textContentAbove + event.key;
                inputDivKey.textContent = textContentAbove;
                characterNumber++;

            }
            else {
                inputDivKey.style = "color:red;"
                characterIncorrect++;
                wordState = false;
            };

        }
        console.log("key", event.key);
    });
    function timer() {
        const setIntervalId = setInterval(timeUpdate = () => {
            time++;
            if (time === timeLimit) {
                removeEventListener("keypress", keypressCapture);
                clearInterval(setIntervalId);
                timerElement.textContent = "Time Out - Scroll Down To View Result";
                timerElement.style = "background-color: green;";
                whichKeyPress.style = "display:none";
                createResult();
                console.log(wordCorrect, " ", wordIncorrect);
                console.log(characterCorrect, characterIncorrect);
                console.log(numberOfLines);
            }
            else {
                timerElement.textContent = "Time : 0" + time + " Seconds Out Of " + timeLimit + " Seconds";

            }
        }, 1000);
    }

    function createResult() {

        const resultDiv = document.createElement("div");
        resultDiv.setAttribute("id", "resultDiv");
        document.body.appendChild(resultDiv);

        const characterPerMin = document.createElement("div");
        characterPerMin.setAttribute("id", "characterPerMin");
        resultDiv.appendChild(characterPerMin);
        const characterPerMinValue = document.createElement("span");
        characterPerMin.appendChild(characterPerMinValue);
        const characterPerMinText = document.createElement("span");
        characterPerMin.appendChild(characterPerMinText);

        characterPerMinValue.textContent = (characterCorrect + characterIncorrect) / (timeLimit / 60);
        characterPerMinText.textContent = " Characters Per Minute";

        characterPerMinValue.style="font-size:300%;font-weight: bold;";

        const wordPerMin = document.createElement("div");
        wordPerMin.setAttribute("id", "wordPerMin");
        resultDiv.appendChild(wordPerMin);
        const wordPerMinValue = document.createElement("span");
        wordPerMin.appendChild(wordPerMinValue);
        const wordPerMinText = document.createElement("span");
        wordPerMin.appendChild(wordPerMinText);
        wordPerMinValue.style="font-size:300%;font-weight: bold;";

        wordPerMinValue.textContent = (wordCorrect + wordIncorrect) / (timeLimit / 60);
        wordPerMinText.textContent = " Words Per Minute";

        const sentencePerMin = document.createElement("div");
        sentencePerMin.setAttribute("id", "sentencePerMin");
        resultDiv.appendChild(sentencePerMin);
        const sentencePerMinValue = document.createElement("span");
        sentencePerMin.appendChild(sentencePerMinValue);
        const sentencePerMinText = document.createElement("span");
        sentencePerMin.appendChild(sentencePerMinText);
        sentencePerMinValue.style="font-size:300%;font-weight: bold;"; 

        sentencePerMinValue.textContent = numberOfLines / (timeLimit / 60);
        sentencePerMinText.textContent = " Lines Per Minute";

        const accuracydiv = document.createElement("div");
        accuracydiv.setAttribute("id", "accuracydiv");
        resultDiv.appendChild(accuracydiv);
        const accuracydivValue = document.createElement("span");
        accuracydiv.appendChild(accuracydivValue);
        const accuracydivText = document.createElement("span");
        accuracydiv.appendChild(accuracydivText);

        accuracydivValue.textContent = Math.round((characterCorrect*100)/ (characterCorrect + characterIncorrect))+"%";
        accuracydivText.textContent = " Accuracy";
        accuracydivValue.style="font-size:600%;font-weight: bold;";

/*        const retryBtn = document.createElement("button");
        retryBtn.setAttribute("id","retryBtn");
        retryBtn.textContent=" Retake ";
        resultDiv.appendChild(retryBtn);
        retryBtn.addEventListener("click", funMainPage());

  Retake button planned for latter
*/


    }
    //END
});




