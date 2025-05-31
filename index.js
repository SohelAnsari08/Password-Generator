const inputSlider = document.querySelector("[data-lengthSlider]"); //data-lengthSlider
const lengthDisplay = document.querySelector('[data-lengthNumber]'); //data-lengthNumber
const passsowordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');//generateButton
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()-_+=[]{}\|;:.,<>/?';

//initially
let password = "";  //putting password empty
let passwordLength = 10;  //default value to 10
handleSlider();
let checkCount = 0; 
//set strenght circle color to grey
setIndicator("#ccc");

//set paswordlength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max- min)) + "% 100%"
}

//set indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`  //shadow
}


function getRndInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;    
}

function generateRandomNumber(){
    return getRndInteger(0,9);
} 

function generateLowercase(){
    return  String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return  String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    // const randNum = getRndInteger(0, symbols.length);
    // return symbols.charAt[randNum];  //give what symbol is present at that index
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols.charAt(randomIndex);

}

 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator('#0f0');
    }

    else if ( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator('#ff0');
    }

    else{
        setIndicator('#f00');
    }

}


//to copy the password
async function copyContent() {
    try{
        await navigator.clipboard.writeText(passsowordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000); 
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length -1; i>0; i--){
        // random J, find out using random function
        const j = Math.floor(Math.random() * (i+1));
        // swap number at i  and j index 
        const temp = array[i];
        array[i] = array[j];
        array[j] =temp;
    }
    let str ="";
    array.forEach((el) => (str += el));
    return str;
}


function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( function(checkbox) {
        if(checkbox.checked)
            checkCount++;
        // handleSlider();
    });

    //special
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
} 

allCheckBox.forEach( function(checkbox) {
    checkbox.addEventListener('change', handleCheckBoxChange);
    
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passsowordDisplay.value)
        copyContent();
});


generateBtn.addEventListener('click', () => {
    // none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }


    // let's start the journey to find new password
    // remove old password
    password ='';

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    
    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition 
    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passsowordDisplay.value = password;

    //calculate strength
    calcStrength();

}); 













