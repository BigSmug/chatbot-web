const inputArea = document.querySelector(".input-area");
const squircle = document.getElementById("arrow");
const header = document.getElementById("headerh1");
const arrow = document.getElementById("arrowsvg");
const chatarea = document.getElementById("chatarea");
const squirclebg = document.getElementById("squirclebg");
const uniqueId = generateUniqueId();
let firstClick = true; // Flag to track the first click
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
        body: JSON.stringify({ id: uniqueId }), // Include the unique ID in the body
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("Conversation Created:", data); // Log the response data
      });
  })
  .catch((error) => console.error("Error:", error));

squircle.addEventListener("click", () => {
  if (firstClick) {
    // Check if it's the first click
    // Set the flag to false after the first click
    sendMessage(key, uniqueId, inputArea.value);
    fetchMessages(uniqueId, key);
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
    let keyframes = Array.from(styleSheet.cssRules).find(
      (rule) => rule.name === "widen"
    );

    if (keyframes) {
      keyframes.deleteRule("to");
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

    const emptyDiv = document.createElement("div");

    emptyDiv.classList.add("grow-space");

    chatarea.appendChild(emptyDiv);
  } else {
    const fontSize = "16px";
    const fontFamily = "Lato"; // Specify the font family
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

    chatarea.appendChild(emptyDiv);
    chatarea.scroll({
      top: chatarea.scrollHeight,
      behavior: "smooth", // This enables smooth scrolling
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
  const canvas = document.createElement("canvas"); // Create a temporary canvas
  const context = canvas.getContext("2d"); // Get the 2D context
  context.font = font; // Set the desired font
  const metrics = context.measureText(text); // Measure the text
  return metrics.width; // Return the width
}
// Function to send a message in a conversation
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
let previousData = null; // Store the previous data

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
      // Check if data has changed
      if (previousData == null) {
        previousData = data;
      }
      if (JSON.stringify(data) !== JSON.stringify(previousData)) {
        console.log("Messages have changed:", data);
        previousData = data; // Update previousData with new data
      } else {
        console.log("No changes detected in messages.");
        // Continue polling after a delay
        setTimeout(() => fetchMessages(conversationId, key), 2000);
      }
    })
    .catch((error) => console.error("Error fetching messages:", error));
}

function generateUniqueId() {
  return `id_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
