const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

async function updateDashboard() {
  try {
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

    const res = await fetch(url);
    const json = await res.json();

    const feed = json.feeds && json.feeds.length > 0 ? json.feeds[0] : null;

    if (!feed) {
      console.log("No feed data");
      return;
    }

    console.log("LIVE FEED:", feed);

    // SAFE DOM UPDATE (prevents undefined crashes)
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val ?? "--";
    };

    set("alert", feed.field1);
    set("lat", feed.field2);
    set("lon", feed.field3);
    set("sat", feed.field4);
    set("gas", feed.field5);
    set("water", feed.field6);
    set("quake", feed.field7);
    set("node", feed.field8);

    // ALERT COLOR
    const alertBox = document.getElementById("alert");
    if (alertBox) {
      const a = (feed.field1 || "").toUpperCase();

      if (a === "SOS") {
        alertBox.style.color = "red";
        alertBox.style.fontWeight = "bold";
      } 
      else if (a === "MEDICAL") {
        alertBox.style.color = "orange";
        alertBox.style.fontWeight = "bold";
      } 
      else if (a === "SAFE") {
        alertBox.style.color = "green";
        alertBox.style.fontWeight = "bold";
      } 
      else {
        alertBox.style.color = "black";
        alertBox.style.fontWeight = "normal";
      }
    }

  } catch (err) {
    console.error("THING ERROR:", err);
  }
}

// 🔥 CRITICAL FIX: wait for HTML to load
window.addEventListener("load", () => {
  updateDashboard();
  setInterval(updateDashboard, 5000);
});
