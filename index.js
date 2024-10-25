const inputArea = document.querySelector('.input-area');
const squircle = document.getElementById('arrow');
const header = document.getElementById('headerh1');
const arrow = document.getElementById('arrowsvg');
const chatarea = document.getElementById('chatarea')
const squirclebg = document.getElementById('squirclebg');
let firstClick = true; // Flag to track the first click
squircle.addEventListener('click', () => {
  if (firstClick) { // Check if it's the first click
    // Set the flag to false after the first click
    firstClick = false;

    header.classList.remove("header");
    chatarea.classList.remove("noinput");
    chatarea.classList.add("yeschat");
    header.classList.add("fadeoutup");
    inputArea.classList.add("wideinput");

    const fontSize = "16px";
    const fontFamily = "Lato"; // Specify the font family
    const text = inputArea.value;
    const requiredWidth = getTextWidth(text, `${fontSize} ${fontFamily}`);

    // Remove existing animation to reset it
    squirclebg.classList.remove("animate-width");

    // Update keyframes dynamically
    const styleSheet = document.styleSheets[0];
    let keyframes = Array.from(styleSheet.cssRules).find(rule => rule.name === 'widen');

    if (keyframes) {
      keyframes.deleteRule('to');
      keyframes.appendRule(`to { width: ${requiredWidth + 20}px; }`);
    }

    // Trigger animation
    setTimeout(() => {
      squirclebg.classList.add("animate-width");
    }, 910);

    squirclebg.classList.add("bganim");
    squircle.classList.remove("yesinput");
    arrow.classList.remove("rotate");
    squircle.classList.add("fadeout");
    inputArea.value = "";

    const childDiv = document.createElement("div");
    childDiv.textContent = text;
    childDiv.classList.add("message");

    chatarea.appendChild(childDiv);

    const emptyDiv = document.createElement('div');

    emptyDiv.classList.add('grow-space');

    chatarea.appendChild(emptyDiv);
  } else {
    const fontSize = "16px";
    const fontFamily = "Lato"; // Specify the font family
    const text = inputArea.value;
    const requiredWidth = getTextWidth(text, `${fontSize} ${fontFamily}`);

    const msgcontainer = document.createElement("div")
    msgcontainer.classList.add("message-container")
    chatarea.appendChild(msgcontainer);
    const childDiv = document.createElement("div");
    childDiv.textContent = text;
    childDiv.classList.add("message");
    msgcontainer.appendChild(childDiv);
    const childchildDiv = document.createElement("div");
    childchildDiv.classList.add("upcomingmsg");
    childchildDiv.style.width = `${requiredWidth + 20}px`
    msgcontainer.appendChild(childchildDiv)

    const emptyDiv = document.createElement('div');

    squirclebg.classList.add("bganim");
    squircle.classList.remove("yesinput");
    arrow.classList.remove("rotate");
    squircle.classList.add("arrowout");
    inputArea.value = "";
    emptyDiv.classList.add('grow-space');

    chatarea.appendChild(emptyDiv);
    chatarea.scroll({
        top: chatarea.scrollHeight,
        behavior: 'smooth' // This enables smooth scrolling
    });

  }
});

inputArea.addEventListener('input', () => {
  if (inputArea.value.length > 0) {
    squircle.classList.remove('fadeout');
    squircle.classList.remove('noinput');
    squircle.classList.add('yesinput');
    arrow.classList.add("rotate");
  }
  else {
    squircle.classList.remove('yesinput');
    arrow.classList.remove("rotate");
    squircle.classList.add('fadeout');
  }
});
function getTextWidth(text, font) {
    const canvas = document.createElement('canvas'); // Create a temporary canvas
    const context = canvas.getContext('2d'); // Get the 2D context
    context.font = font; // Set the desired font
    const metrics = context.measureText(text); // Measure the text
    return metrics.width; // Return the width
}