const URL = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=1";

async function loadData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    
    if (!data.feeds || data.feeds.length === 0) {
      console.log("No data feeds found on ThingSpeak yet.");
      return;
    }
    
    const feed = data.feeds[0];
    console.log("Latest Feed Data Received:", feed);

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
    
    // Update elements safely if they exist on the page
    if(document.getElementById("alert")) document.getElementById("alert").innerText = alertText;
    if(document.getElementById("lat"))   document.getElementById("lat").innerText = feed.field2 || "N/A";
    if(document.getElementById("lon"))   document.getElementById("lon").innerText = feed.field3 || "N/A";
    if(document.getElementById("sat"))   document.getElementById("sat").innerText = feed.field4 || "N/A";
    if(document.getElementById("gas"))   document.getElementById("gas").innerText = feed.field5 ? feed.field5 + " ppm" : "N/A";
    if(document.getElementById("water")) document.getElementById("water").innerText = feed.field6 ? feed.field6 + " cm" : "N/A";

    // 2. MPU6050 Vibration Data -> Earthquake Card (Field 7)
    if (document.getElementById("quake")) {
      if (feed.field7) {
        let vibration = parseFloat(feed.field7);
        if (vibration > 12.0 || vibration < 7.0) {
          document.getElementById("quake").innerText = vibration.toFixed(1) + " m/s² (SHAKE)";
        } else {
          document.getElementById("quake").innerText = vibration.toFixed(1) + " m/s² (STABLE)";
        }
      } else {
        document.getElementById("quake").innerText = "N/A";
      }
    }

    // 3. Message ID Token & Clock -> Node ID Card (Field 8)
    if (document.getElementById("node")) {
      const msgID = feed.field8 || "0"; 
      const localTime = new Date(feed.created_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      document.getElementById("node").innerText = `#${msgID} @ ${localTime}`;
    }

  } catch (error) {
    console.log("Error loading dashboard metrics: ", error);
  }
}

// Run immediately on page load
loadData();

// Check for updates automatically every 15 seconds
setInterval(loadData, 15000);
