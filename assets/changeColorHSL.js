export function changeColorKeys(el) {
  const randomColor = getRandomPastelColor();
  document.documentElement.style.setProperty(el, randomColor);

  function getRandomPastelColor() {
    return `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.9)`;
  }
}
