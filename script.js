const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

async function updateDashboard() {
  try {
    const url =
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

    const res = await fetch(url);
    const data = await res.json();

    const feed = data.feeds[0];

    console.log("FEED:", feed);

    document.getElementById("alert").innerText = feed.field1 || "--";
    document.getElementById("lat").innerText   = feed.field2 || "--";
    document.getElementById("lon").innerText   = feed.field3 || "--";
    document.getElementById("sat").innerText   = feed.field4 || "--";
    document.getElementById("gas").innerText   = feed.field5 || "--";
    document.getElementById("water").innerText = feed.field6 || "--";
    document.getElementById("quake").innerText = feed.field7 || "--";
    document.getElementById("node").innerText  = feed.field8 || "--";

    // ALERT COLOR FIX
    const a = (feed.field1 || "").toUpperCase();
    const box = document.getElementById("alert");

    if (a === "SOS") box.style.color = "red";
    else if (a === "MEDICAL") box.style.color = "orange";
    else if (a === "SAFE") box.style.color = "green";
    else box.style.color = "black";

  } catch (e) {
    console.error("Dashboard error:", e);
  }
}

setInterval(updateDashboard, 5000);
updateDashboard();
