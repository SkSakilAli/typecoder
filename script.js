const landBtn = document.getElementById("mainbtn");
let selectedImage;
let selectedTime = "1 min";
let language = "C";



//Deleting all elements except header on button click
landBtn.addEventListener("click", () => {
    document.body.removeChild(document.getElementById("main"));
    document.body.removeChild(document.getElementById("languages"));
    const headerdiv = document.createElement("div");
    document.body.appendChild(headerdiv);
    headerdiv.setAttribute("id", "headerdiv");

    const navOne = document.createElement("a");
    headerdiv.append(navOne);
    navOne.setAttribute("id", "navOne");
    navOne.textContent = "Select Preferred Language";

    const navTwo = document.createElement("a");
    headerdiv.appendChild(navTwo);
    navTwo.setAttribute("id", "navTwo");
    navTwo.textContent = "Select Preferred Time";

    const navThree = document.createElement("a");
    headerdiv.appendChild(navThree);
    navThree.setAttribute("id", "navThree");
    navThree.textContent = 'Selected ' + language + "-" + selectedTime;

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

    //Selecting Time 
    const selectTime = document.createElement("ul");
    selectTime.setAttribute("id", "selectTime");
    belowHeader.appendChild(selectTime);

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



});
