import { createElement } from "../script.js";

export class Keyboard {
  constructor(keysArray, view) {
    this.language = "ru";
    this.keysArray = keysArray;
    this.view = view;
    this.capslockPressed = false;
    this.pressedKey = [];
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
    });
  }

  getButtonInfo(button) {
    return this.keysArray.filter(key => key.code === button.dataset.keyCode)[0];
  }

  pressKeyAction(code, event) {
    switch (code) {
      case "CapsLock":
        if (["mousedown", "keydown"].includes(event)) {
          this.capslockPressed = !this.capslockPressed;
        }
        break;

      default:
        switch (event) {
          case "keydown":
          case "mousedown":
            this.addToPressedKey(code);
            break;
          case "keyup":
          case "click":
            this.removeFromPressedKey(code);
            break;
        }
    }
  }

  addToPressedKey(code) {
    if (!this.isKeyPressed(code)) {
      this.pressedKey.push(code);
    }
  }

  removeFromPressedKey(code) {
    if (this.isKeyPressed(code)) {
      this.pressedKey.splice(this.pressedKey.indexOf(code), 1);
    }
  }

  isKeyPressed(keyName) {
    return keyName === "CapsLock"
      ? this.capslockPressed
      : this.pressedKey.some(key => key.includes(keyName));
  }

  typeOnKeyboard(button, text) {
    const data = this.getButtonInfo(button);
    let textField = document.querySelector(".textarea");
    let cursorPosition = textField.selectionStart;
    let textBeginning = text.slice(0, cursorPosition);
    let textEnding = text.slice(cursorPosition);
    let typedOnKeyboard = "";

    typedOnKeyboard = data[this.language];

    textField.value = textBeginning + typedOnKeyboard + textEnding;
    textField.setSelectionRange(cursorPosition, cursorPosition);
  }

  activateKeys() {
    const buttons = this.view.querySelectorAll(".k-key");
    buttons.forEach(button => {
      const keyCode = button.dataset.keyCode;
      const isKeyPressed = this.pressedKey.includes(keyCode);
      button.classList.toggle("--active", isKeyPressed);
    });
    if (this.capslockPressed) {
      const capslockButton = this.view.querySelector('[data-key-code="CapsLock"]');
      capslockButton.classList.add("--active");
    }
  }

  changeState(code, type) {
    this.pressKeyAction(code, type);
    this.activateKeys();
  }
}
