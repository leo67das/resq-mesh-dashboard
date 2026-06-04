const URL = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=1";

async function loadData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    
    if (!data.feeds || data.feeds.length === 0) return;
    const feed = data.feeds[0];

    // 1. Translate Alert Type (Field 1)
    let alertText = "Loading...";
    if (feed.field1 === "1") {
      alertText = "🚨 HELP";
    } else if (feed.field1 === "2") {
      alertText = "✅ SAFE";
    } else if (feed.field1 === "3") {
      alertText = "🩺 MEDICAL";
    } else if (feed.field1 === "4") {
      alertText = "⚠️ SENSOR ALARM";
    } else {
      alertText = feed.field1 || "N/A";
    }
    document.getElementById("alert").innerText = alertText;

    // 2. Map standard location and environment metrics
    document.getElementById("lat").innerText = feed.field2 || "N/A";
    document.getElementById("lon").innerText = feed.field3 || "N/A";
    document.getElementById("sat").innerText = feed.field4 || "N/A";
    document.getElementById("gas").innerText = feed.field5 ? feed.field5 + " ppm" : "N/A";
    document.getElementById("water").innerText = feed.field6 ? feed.field6 + " cm" : "N/A";

    // 3. EARTHQUAKE CARD: Displays MPU6050 Vibration Vector from Field 7
    if (feed.field7) {
      let vibration = parseFloat(feed.field7);
      // 9.8 m/s² is normal static Earth gravity. Sudden changes mean shaking.
      if (vibration > 12.0 || vibration < 7.0) {
        document.getElementById("quake").innerText = vibration.toFixed(1) + " m/s² (SHAKE)";
      } else {
        document.getElementById("quake").innerText = vibration.toFixed(1) + " m/s² (STABLE)";
      }
    } else {
      document.getElementById("quake").innerText = "N/A";
    }

    // 4. REPURPOSED NODE ID CARD: Displays Message ID & Local Time (IST)
    const msgID = feed.field8 || "0"; 
    const localTime = new Date(feed.created_at).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Injects the tracking token directly into your existing Node ID card layout
    document.getElementById("node").innerText = `#${msgID} @ ${localTime}`;

  } catch (error) {
    console.log("Error updating dashboard parameters: ", error);
  }
}

// Initial immediate launch trigger
loadData();

// Continually pull fresh updates every 15 seconds
setInterval(loadData, 15000);
