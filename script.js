import { data } from "./assets/data.js";
import { Keyboard } from "./assets/keyboard.js";

const buttonText = "Очистить поле ввода";
const txtInfo = `Клавиатура создана для операционной системы Windows. \n Для переключения языка нажмите: SHIFT + ALT`;
let keyboard = [];
let textField = "";
let btn_clear = "";
let keyboardWrapper = null;

window.onload = function () {
  if (data) {
    generateContent();
  }

  keyboardWrapper.addEventListener("mousedown", event => {
    if (event.target.classList.contains("k-key")) {
      handlePress(event, keyboard, textField);
    }
  });
  document.addEventListener("click", event => handleRelease(event, keyboard));
  document.addEventListener("keydown", event => handleComputerKey(event, keyboard, textField));
  document.addEventListener("keyup", event => handleComputerKey(event, keyboard, textField));

  btn_clear.addEventListener("click", event => {
    if (event.target.className === "button__clear") {
      handleClick(textField);
    }
      textField.focus();
      textField.addEventListener("blur", () => textField.focus());
      window.addEventListener("blur", () => handleWindowBlur(keyboard));
  });
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

function handlePress(event, keyboard, textField) {
  keyboard.changeState(event.target.dataset.keyCode, event.type);
  keyboard.typeOnKeyboard(event.target, textField.value);
}

function handleRelease(event, keyboard) {
  const code = event.target.dataset.keyCode || "";
  keyboard.changeState(code, event.type);
}

function handleComputerKey(event, keyboard, textField) {
  event.preventDefault();
  let key = keyboard.view.querySelector(`[data-key-code="${event.code}"]`);
  if (key) {
    keyboard.changeState(event.code, event.type);
    if (event.type === "keydown") {
      keyboard.typeOnKeyboard(key, textField.value);
    }
  }
}

function handleClick(textField) {
  textField.value = "";
}

function handleWindowBlur(keyboard) {
  if (keyboard.pressedKey.includes("CapsLock")) {
    keyboard.pressedKey = ["CapsLock"];
  } else {
    keyboard.pressedKey = [];
  }
  keyboard.activateKeys();
}
