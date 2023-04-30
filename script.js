import { data } from "./assets/data.js";
import { Keyboard } from "./assets/keyboard.js";

const buttonText = "Очистить поле ввода";
const txtInfo = `Клавиатура создана для операционной системы Windows. \n Для переключения языка нажмите: SHIFT + ALT`;
  let keyboard = [] ;
  let textField = '';
  let  btn_clear = '';
  let keyboardWrapper = null;
  // let buttons = [];

window.onload = function () {
 if (data) {
    generateContent();
 } 
  
   keyboardWrapper.addEventListener("mousedown", event => {
     if (event.target.className === "k-key") {
       handlePress(event, keyboard, textField);
     }
   });

   document.addEventListener("click", event => handleRelease(event, keyboard));
  };
function generateContent() {
     keyboardWrapper = createElement("div", "wrapper");
    document.body.appendChild(keyboardWrapper);

     textField = createElement("textarea", "textarea");
    keyboardWrapper.appendChild(textField);

    keyboard = new Keyboard(data, keyboardWrapper);  
    btn_clear = createElement("button", "button__clear");
    btn_clear.textContent = buttonText;
    keyboardWrapper.append(btn_clear);

    const infoField = createElement("div", "info");
    infoField.textContent = txtInfo;
    keyboardWrapper.append(infoField);
}
export function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
}

function handlePress(event, keyboard) {
  keyboard.changeState(event.target.dataset.keyCode, event.type);
}

function handleRelease(event, keyboard) {
  const code = event.target.dataset.keyCode || "";
  keyboard.changeState(code, event.type);
}


