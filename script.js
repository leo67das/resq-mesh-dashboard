const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

async function updateDashboard() {
  try {
    const url =
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("DATA:", data);

    // ================== FIXED FIELD MAPPING ==================
    document.getElementById("alert").innerText = data.field1 ?? "--";
    document.getElementById("lat").innerText   = data.field2 ?? "--";
    document.getElementById("lon").innerText   = data.field3 ?? "--";
    document.getElementById("sat").innerText   = data.field4 ?? "--";
    document.getElementById("gas").innerText   = data.field5 ?? "--";
    document.getElementById("water").innerText = data.field6 ?? "--";
    document.getElementById("quake").innerText = data.field7 ?? "--";
    document.getElementById("node").innerText  = data.field8 ?? "--";

    // ================== ALERT STATUS COLOR ==================
    const alertBox = document.getElementById("alert");

    let alertVal = (data.field1 || "").toUpperCase();

    if (alertVal === "SOS") {
      alertBox.style.color = "red";
      alertBox.style.fontWeight = "bold";
    }
    else if (alertVal === "MEDICAL") {
      alertBox.style.color = "orange";
      alertBox.style.fontWeight = "bold";
    }
    else if (alertVal === "SAFE") {
      alertBox.style.color = "green";
      alertBox.style.fontWeight = "bold";
    }
    else {
      alertBox.style.color = "black";
      alertBox.style.fontWeight = "normal";
    }

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}

// ⏱ auto refresh every 5 seconds
setInterval(updateDashboard, 5000);
updateDashboard();
