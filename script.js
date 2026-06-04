async function loadData() {
    try {
        // Targeted single-feed secure endpoint to perfectly handle your verified private credentials
        const liveURL = "https://api.thingspeak.com/channels/3398357/feeds/last.json?api_key=9WWD5Y74FM6LVWCH&nocache=" + new Date().getTime();
        
        const response = await fetch(liveURL);
        
        if (!response.ok) {
            console.error("Server authentication failed. Status Code:", response.status);
            if (document.getElementById("alert")) {
                document.getElementById("alert").innerText = "Auth Error (" + response.status + ")";
            }
            return;
        }

        const feed = await response.json();
        
        if (!feed || Object.keys(feed).length === 0) {
            console.log("Channel verified, but active data frame is empty.");
            return;
        }
        
        console.log("Telemetry Cleanly Extracted:", feed);

        // 1. Alert Logic Mapping
        if (document.getElementById("alert")) {
            let statusText = "Pending";
            if (feed.field1 === "1") statusText = "🚨 HELP";
            else if (feed.field1 === "2") statusText = "✅ SAFE";
            else if (feed.field1 === "3") statusText = "🩺 MEDICAL";
            else if (feed.field1 === "4") statusText = "⚠️ SENSOR ALARM";
            else if (feed.field1) statusText = feed.field1; 
            document.getElementById("alert").innerText = statusText;
        }

        // 2. Position Matrices
        if (document.getElementById("lat")) document.getElementById("lat").innerText = feed.field2 || "0.000000";
        if (document.getElementById("lon")) document.getElementById("lon").innerText = feed.field3 || "0.000000";
        if (document.getElementById("sat")) document.getElementById("sat").innerText = feed.field4 || "0";

        // 3. Sensor Core Processing
        if (document.getElementById("gas")) {
            if (feed.field5) {
                document.getElementById("gas").innerText = isNaN(feed.field5) ? feed.field5 : feed.field5 + " ppm";
            } else {
                document.getElementById("gas").innerText = "0 ppm";
            }
        }

        if (document.getElementById("water")) {
            document.getElementById("water").innerText = feed.field6 ? feed.field6 + " cm" : "0 cm";
        }

        // 4. Vibration Diagnostics
        if (document.getElementById("quake")) {
            if (feed.field7 && !isNaN(feed.field7)) {
                let vib = parseFloat(feed.field7);
                if (vib > 12.0 || vib < 7.0) {
                    document.getElementById("quake").innerText = vib.toFixed(1) + " m/s² [SHAKE]";
                } else {
                    document.getElementById("quake").innerText = vib.toFixed(1) + " m/s² [STABLE]";
                }
            } else {
                document.getElementById("quake").innerText = feed.field7 || "0.0 m/s²";
            }
        }

        // 5. Message Metadata Tracking
        if (document.getElementById("node")) {
            if (feed.created_at) {
                const localTime = new Date(feed.created_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                });
                if (feed.field8) {
                    document.getElementById("node").innerText = `#${feed.field8} @ ${localTime}`;
                } else {
                    document.getElementById("node").innerText = `Live @ ${localTime}`;
                }
            } else {
                document.getElementById("node").innerText = feed.field8 || "--";
            }
        }

    } catch (error) {
        console.error("Dashboard core loop execution error:", error);
    }
}

// Initial pull on system startup
loadData();
// Poll data stream seamlessly every 5 seconds
setInterval(loadData, 5000);
