// Changed results=5 so the script can capture recent history logs
const URL = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=5";

async function loadData() {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    const feeds = data.feeds;

    if (!feeds || feeds.length === 0) return;

    // 1. UPDATE MAIN CARDS (Using the absolute latest transmission entry)
    const latest = feeds[feeds.length - 1];

    // Translate Alert Numbers into Human-Readable Text
    let alertText = "Loading...";
    if (latest.field1 === "1") alertText = "🚨 HELP";
    else if (latest.field1 === "2") alertText = "✅ SAFE";
    else if (latest.field1 === "3") alertText = "🩺 MEDICAL";
    else if (latest.field1 === "4") alertText = "⚠️ SENSOR ALARM";

    // Set Main Dashboard Card Elements
    document.getElementById("alert").innerText = alertText;
    document.getElementById("lat").innerText   = latest.field2 || "N/A";
    document.getElementById("lon").innerText   = latest.field3 || "N/A";
    document.getElementById("sat").innerText   = latest.field4 || "0";
    document.getElementById("gas").innerText   = latest.field5 ? latest.field5 + " ppm" : "N/A";
    document.getElementById("water").innerText = latest.field6 ? latest.field6 + " cm" : "N/A";
    
    // Field 7 is now our Message ID tracker, Node ID remains Field 8
    document.getElementById("node").innerText  = latest.field8 || "N/A";

    // Format the hidden server timestamp into Indian Standard Time (IST)
    const timeReceived = new Date(latest.created_at).toLocaleTimeString('en-IN');


    // 2. GENERATE HISTORY (Populates a running log table if it exists in your HTML)
    const historyTable = document.getElementById("history-rows");
    if (historyTable) {
      historyTable.innerHTML = ""; // Wipe older duplicate steps
      
      // Reverse so the newest message sits right at the top of the history list
      [...feeds].reverse().forEach(entry => {
        const localTime = new Date(entry.created_at).toLocaleTimeString('en-IN');
        let entryAlert = "HELP";
        if (entry.field1 === "2") entryAlert = "SAFE";
        if (entry.field1 === "3") entryAlert = "MEDICAL";
        if (entry.field1 === "4") entryAlert = "SENSOR ALERT";

        const row = `
          <tr style="border-bottom: 1px solid #2e3b5e;">
            <td style="padding: 10px; color: #3b82f6;">#${entry.field7 || "N/A"}</td>
            <td>${localTime}</td>
            <td>Node ${entry.field8 || "N/A"}</td>
            <td>${entryAlert}</td>
            <td>${entry.field5 || "0"} ppm / ${entry.field6 || "0"} cm</td>
          </tr>
        `;
        historyTable.innerHTML += row;
      });
    }

  } catch (error) {
    console.log("Dashboard fetch error: ", error);
  }
}

// Initial immediate launch trigger
loadData();

// Refreshes the dashboard cards automatically every 15 seconds
setInterval(loadData, 15000);
