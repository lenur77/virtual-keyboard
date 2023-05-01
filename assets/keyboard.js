import { createElement } from "../script.js";
import { changeColorKeys } from "../assets/changeColorHSL.js";
// import { data } from "./data.js";

export class Keyboard {
  constructor(keysArray, view) {
    this.language = this.getLanguage();
    this.keysArray = keysArray;
    this.view = view;
    this.capsLockPressed = false;
    this.pressedKey = [];
    this.createKeyboard();
  }

  createKeyboard() {
    const keyboardInit = createElement("div", "keyboard");
    this.view.append(keyboardInit);

    this.keysArray.forEach(keyObject => {
      const kKey = document.createElement("div");
      kKey.dataset.keyCode = keyObject.code;
      if (keyObject.classes) kKey.classList = keyObject.classes;
      kKey.innerHTML = keyObject.isSpecial ? keyObject.name : keyObject[this.language];
      keyboardInit.append(kKey);
      if (keyObject.classes && !keyObject.isSpecial) {
        const span = document.createElement("span");
        span.classList.add("k-key__span");
        span.innerHTML = keyObject[`${this.language}Shift`];
        kKey.append(span);
      }
    });
  }

  getButtonInfo(el) {
    return this.keysArray.filter(key => key.code === el.dataset.keyCode)[0];
  }

  pressKeyAction(code, event) {
    switch (code) {
      case "CapsLock":
        if (["mousedown", "keydown"].includes(event)) {
          this.capsLockPressed = !this.capsLockPressed;
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
      ? this.capsLockPressed
      : this.pressedKey.some(key => key.includes(keyName));
  }

  updateKeys() {
    let kKeys = document.querySelectorAll(".k-key");
    kKeys.forEach(kKey => {
      let { code, isSpecial, [this.language]: text } = this.getButtonInfo(kKey);
      let updatedText = text;
      if (!isSpecial) {
        if (
          (!this.isKeyPressed("AltLeft") && this.isKeyPressed("Shift")) ||
          (this.isKeyPressed("Shift") && this.isKeyPressed("CapsLock"))
        ) {
          updatedText = this.getButtonInfo(kKey)[`${this.language}Shift`];
        } else if (this.isKeyPressed("CapsLock")) {
          updatedText = text.toUpperCase();
        }

        document.querySelector(`[data-key-code=${code}]`).innerHTML = updatedText;
      }
    });
  }

  typeOnKeyboard(kKey, text) {
    let textField = document.querySelector(".textarea");
    let data = this.getButtonInfo(kKey);
    let cursorPosition = textField.selectionStart;
    let textBeginning = text.slice(0, cursorPosition);
    let textEnding = text.slice(cursorPosition);
    let typedOnKeyboard = "";

    if (data.isSpecial) {
      switch (data.code) {
        case "Backspace":
          textBeginning = textBeginning.slice(0, -1);
          cursorPosition -= 1;
          break;
        case "Tab":
          typedOnKeyboard = "\t";
          cursorPosition += 1;
          break;
        case "Delete":
          textEnding = textEnding.slice(1);
          break;
        case "Enter":
          typedOnKeyboard = "\n";
          cursorPosition += 1;
          break;
        case "Space":
          typedOnKeyboard = " ";
          cursorPosition += 1;
          break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
          this.moveCursor(data.code);
          cursorPosition = textField.selectionStart;
          break;

        default:
          typedOnKeyboard = "";
      }
    } else {
      let isShiftKeyPressed = this.isKeyPressed("Shift");
      let isCapsKeyPressed = this.isKeyPressed("CapsLock");
      typedOnKeyboard = data[this.language];

      if (isShiftKeyPressed) {
        typedOnKeyboard = data[`${this.language}Shift`];
      } else if (isCapsKeyPressed) {
        typedOnKeyboard = typedOnKeyboard.toUpperCase();
      }
      cursorPosition += 1;
    }

    textField.value = textBeginning + typedOnKeyboard + textEnding;
    textField.setSelectionRange(cursorPosition, cursorPosition);
  }

  setLanguage(language = this.language) {
    localStorage.setItem("language", language);
    return this;
  }

  getLanguage() {
    let currentLang = "en";
    if (!localStorage.getItem("language")) {
      this.setLanguage(currentLang);
    } else {
      currentLang = localStorage.getItem("language");
    }
    return currentLang;
  }

  switchLanguage() {
    if (this.isKeyPressed("ControlLeft") && this.isKeyPressed("AltLeft")) {
      this.language = this.language === "en" ? "ru" : "en";
      this.setLanguage(this.language);
    }
  }

  moveCursor(keyCode) {
    let textField = document.querySelector(".textarea");
    let direction =
      keyCode === "ArrowLeft" || keyCode === "ArrowRight"
        ? "horizontally"
        : keyCode === "ArrowUp" || keyCode === "ArrowDown"
        ? "vertically"
        : null;

    if (!direction) {
      throw new Error("Invalid keyCode");
    }

    const goHorizontally = () => {
      let shifting = textField.selectionStart;
      shifting += keyCode === "ArrowLeft" ? -1 : 1;
      textField.setSelectionRange(shifting, shifting);
    };

    const goVertically = () => {
      let cursorPosition = textField.selectionEnd;
      let prevLine = textField.value.lastIndexOf("\n", cursorPosition);
      let nextLine = textField.value.indexOf("\n", cursorPosition + 1);

      if (nextLine === -1) {
        return;
      }

      cursorPosition += keyCode === "ArrowUp" ? -prevLine : nextLine;
      textField.setSelectionRange(cursorPosition, cursorPosition);
    };

    direction === "horizontally" ? goHorizontally() : goVertically();

    return this;
  }

  activateKeys() {
    let kKeys = this.view.querySelectorAll(".k-key");
    kKeys.forEach(kKey => {
      let keyCode = kKey.dataset.keyCode;
      let isKeyPressed = this.pressedKey.includes(keyCode);
      kKey.classList.toggle("--active", isKeyPressed);
      changeColorKeys("--active");
    });
    if (this.capsLockPressed) {
      let capslockButton = this.view.querySelector('[data-key-code="CapsLock"]');
      capslockButton.classList.add("--active");
      changeColorKeys("--active");
    }
  }

  changeState(code, type) {
    this.pressKeyAction(code, type);
    this.activateKeys();
    this.updateKeys();
    this.switchLanguage();
  }
}
