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
    navThree.textContent = 'Selected '+ language+"-" +selectedTime;

    const belowHeader = document.createElement("div");
    belowHeader.setAttribute("id", "belowHeader");
    document.body.appendChild(belowHeader);
    const selectLanguage = document.createElement("ul");
    selectLanguage.setAttribute("id","selectLanguage");
    belowHeader.appendChild(selectLanguage);
    const selectLanguageC = document.createElement("li");
    selectLanguage.appendChild(selectLanguageC);


});
