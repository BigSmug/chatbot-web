const inputArea = document.querySelector(".input-area");
const inputcont = document.querySelector(".input-container");
const squircle = document.getElementById("arrow");
const header = document.getElementById("headerh1");
const arrow = document.getElementById("arrowsvg");
const chatarea = document.getElementById("chatarea");
const squirclebg = document.getElementById("squirclebg");
const uniqueId = generateUniqueId();
let firstClick = true;
let key;
fetch(
  "https://chat.botpress.cloud/2a625ce9-3286-4fa0-8174-506c7e0980a8/users",
  {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "guest" }),
  }
)
  .then((response) => response.json())
  .then((data) => {
    key = data.key;
    console.log("Key:", key);
    fetch(
      "https://chat.botpress.cloud/2a625ce9-3286-4fa0-8174-506c7e0980a8/conversations",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-user-key": key,
        },
        body: JSON.stringify({ id: uniqueId }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Conversation Created:", data);
      });
  })
  .catch((error) => console.error("Error:", error));

squircle.addEventListener("click", () => {
  if (firstClick) {
    sendMessage(key, uniqueId, inputArea.value);
    fetchMessages(uniqueId, key);
    firstClick = false;

    header.classList.remove("header");
    chatarea.classList.remove("noinput");
    chatarea.classList.add("yeschat");
    header.classList.add("fadeoutup");
    inputArea.classList.add("wideinput");

    const fontSize = "16px";
    const fontFamily = "Lato";
    const text = inputArea.value;
    const requiredWidth = getTextWidth(text, `${fontSize} ${fontFamily}`);

    squirclebg.classList.remove("animate-width");

    const styleSheet = document.styleSheets[0];
    let keyframes = Array.from(styleSheet.cssRules).find(
      (rule) => rule.name === "widen"
    );

    if (keyframes) {
      keyframes.deleteRule("to");
      keyframes.appendRule(`to { width: ${requiredWidth + 20}px; }`);
    }

    setTimeout(() => {
      squirclebg.classList.add("animate-width");
      inputcont.style.position = "fixed";
    }, 910);

    squirclebg.classList.add("bganim");
    squircle.classList.remove("yesinput");
    arrow.classList.remove("rotate");
    squircle.classList.add("fadeout");
    inputArea.value = "";
    const msgcontainer = document.createElement("div");
    msgcontainer.classList.add("message-container");
    chatarea.appendChild(msgcontainer);
    const childDiv = document.createElement("div");
    childDiv.textContent = text;
    childDiv.classList.add("message");

    chatarea.appendChild(childDiv);

    const emptyDiv = document.createElement("div");

    emptyDiv.classList.add("grow-space");

    chatarea.appendChild(emptyDiv);
    const responsecontainer = document.createElement("div");
    responsecontainer.classList.add("response-container");
    const circleload = document.createElement("div");
    circleload.classList.add("loading");
    const chatbotlogo = document.createElement("img");
    chatbotlogo.src =
      "https://em-content.zobj.net/source/apple/271/robot_1f916.png";
    chatbotlogo.classList.add("chatbot-icon");
    chatarea.appendChild(emptyDiv);
    emptyDiv.appendChild(responsecontainer);
    responsecontainer.appendChild(chatbotlogo);
    setTimeout(() => {
      responsecontainer.appendChild(circleload);
      setTimeout(() => {
        circleload.style.opacity = "1";
      }, 10);
    }, 1000);
  } else {
    sendMessage(key, uniqueId, inputArea.value);
    fetchMessages(uniqueId, key);
    const fontSize = "16px";
    const fontFamily = "Lato";
    const text = inputArea.value;
    const requiredWidth = getTextWidth(text, `${fontSize} ${fontFamily}`);

    const msgcontainer = document.createElement("div");
    msgcontainer.classList.add("message-container");
    chatarea.appendChild(msgcontainer);
    const childDiv = document.createElement("div");
    childDiv.textContent = text;
    childDiv.classList.add("message");
    msgcontainer.appendChild(childDiv);
    const childchildDiv = document.createElement("div");
    childchildDiv.classList.add("upcomingmsg");
    childchildDiv.style.width = `${requiredWidth + 20}px`;
    msgcontainer.appendChild(childchildDiv);

    const emptyDiv = document.createElement("div");

    squirclebg.classList.add("bganim");
    squircle.classList.remove("yesinput");
    arrow.classList.remove("rotate");
    squircle.classList.add("arrowout");
    inputArea.value = "";
    emptyDiv.classList.add("grow-space");
    const responsecontainer = document.createElement("div");
    responsecontainer.classList.add("response-container");
    const circleload = document.createElement("div");
    circleload.classList.add("loading");
    const chatbotlogo = document.createElement("img");
    chatbotlogo.src =
      "https://em-content.zobj.net/source/apple/271/robot_1f916.png";
    chatbotlogo.classList.add("chatbot-icon");
    chatarea.appendChild(emptyDiv);
    emptyDiv.appendChild(responsecontainer);
    responsecontainer.appendChild(chatbotlogo);
    setTimeout(() => {
      responsecontainer.appendChild(circleload);
      setTimeout(() => {
        circleload.style.opacity = "1";
      }, 10);
    }, 1000);
    chatarea.scroll({
      top: chatarea.scrollHeight,
      behavior: "smooth",
    });
  }
});

inputArea.addEventListener("input", () => {
  if (inputArea.value.length > 0) {
    squircle.classList.remove("fadeout");
    squircle.classList.remove("noinput");
    squircle.classList.add("yesinput");
    arrow.classList.add("rotate");
  } else {
    squircle.classList.remove("yesinput");
    arrow.classList.remove("rotate");
    squircle.classList.add("fadeout");
  }
});
function getTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}
function sendMessage(key, conversationId, messageText) {
  fetch(
    "https://chat.botpress.cloud/2a625ce9-3286-4fa0-8174-506c7e0980a8/messages",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-user-key": key,
      },
      body: JSON.stringify({
        payload: {
          type: "text",
          text: messageText,
        },
        conversationId: conversationId,
      }),
    }
  )
    .then((response) => response.json())
    .then((messageData) => {
      console.log("Message Sent:", messageData);
    })
    .catch((error) => console.error("Error sending message:", error));
}
let previousData = null;
let timeoutId;

function fetchMessages(conversationId, key) {
  fetch(
    `https://chat.botpress.cloud/2a625ce9-3286-4fa0-8174-506c7e0980a8/conversations/${encodeURIComponent(
      conversationId
    )}/messages`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-user-key": key,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (previousData == null) {
        previousData = data;
      }
      if (data !== previousData) {
        console.log("Messages have changed:", data);
        previousData = data;
        clearTimeout(timeoutId);

        typewriter(data);
        previousData = null;
      } else {
        console.log("No changes detected in messages.");
        timeoutId = setTimeout(() => fetchMessages(conversationId, key), 2000);
      }
    })
    .catch((error) => console.error("Error fetching messages:", error));
}
function typewriter(data) {
  // Select all response-container elements
  const responseContainers = chatarea.querySelectorAll(".response-container");

  // Select the last response-container
  const responseContainer = responseContainers[responseContainers.length - 1];

  // Select the loading div within the last response-container
  const loadingDiv = responseContainer.querySelector(".loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }
  console.log("removed");
  const typewritercont = document.createElement("div");
  const typewritertxt = document.createElement("span");
  const circle = document.createElement("span");
  const text = data.messages[0].payload.text;
  responseContainer.appendChild(typewritercont);
  typewritertxt.classList.add("typewriter-text");
  typewritercont.appendChild(typewritertxt);
  typewritercont.appendChild(circle);

  function typewriterEffect(text, element) {
    element.innerHTML = "";
    text.split("").forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "fade-in";
      span.textContent = char;
      element.appendChild(span);
      setTimeout(() => {
        span.style.opacity = "1";
      }, i * 10); // Adjust timing for speed
    });
  }

  typewriterEffect(text, typewritertxt);
}
function generateUniqueId() {
  return `id_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
