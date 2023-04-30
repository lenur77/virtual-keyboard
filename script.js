import { data } from "./assets/data.js";

const buttonText = "Очистить поле ввода";
const txtInfo = `Клавиатура создана для операционной системы Windows. \n Для переключения языка нажмите: SHIFT + ALT`;

window.addEventListener("load", () => {
  const keyboardWrapper = createElement("div", "wrapper");
  document.body.appendChild(keyboardWrapper);

  const textField = createElement("textarea", "textarea");
  keyboardWrapper.appendChild(textField);

  new Keyboard(data, keyboardWrapper);

  const btn_clear = createElement("button", "button__clear");
  btn_clear.textContent = buttonText;
  keyboardWrapper.append(btn_clear);

  const infoField = createElement("div", "info");
  infoField.textContent = txtInfo;
  keyboardWrapper.append(infoField);
});

class Keyboard {
  constructor(keysArray, view) {
    this.language = "en";
    this.keysArray = keysArray;
    this.view = view;
    this.capslockPressed = false;
    this.pressed = [];
    this.createKeyboard();
  }

  createKeyboard() {
    const keyboardInit = createElement("div", "keyboard");
    this.view.append(keyboardInit);

    this.keysArray.forEach(keyObject => {
      const button = document.createElement("div");
      button.dataset.keyCode = keyObject.code;
      if (keyObject.classes) button.classList = keyObject.classes;
      button.innerHTML = keyObject.isSpecial ? keyObject.name : keyObject[this.language];
      keyboardInit.append(button);
      //   console.log(this.view)
    });
  }
}

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.classList.add(className);
  return element;
}
