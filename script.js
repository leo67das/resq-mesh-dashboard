async function updateData() {
    // This is the direct, official ThingSpeak data endpoint
    const url = "https://api.thingspeak.com/channels/3398357/feed.json?api_key=6GBC1E77JVBWJXA6";
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Connection Failed");
        
        const data = await response.json();
        const f = data.channel; // Sometimes the feed object is wrapped
        const entry = data.feeds[0]; // Accessing the latest entry
        
        document.getElementById("alert").innerText = entry.field1 || "--";
        document.getElementById("lat").innerText = entry.field2 || "0";
        document.getElementById("lon").innerText = entry.field3 || "0";
        document.getElementById("sat").innerText = entry.field4 || "0";
        document.getElementById("gas").innerText = (entry.field5 || "0") + " ppm";
        document.getElementById("water").innerText = (entry.field6 || "0") + " cm";
        document.getElementById("quake").innerText = (entry.field7 || "0") + " m/s²";
        document.getElementById("node").innerText = entry.field8 || "--";
    } catch (e) {
        console.error("Error:", e);
        document.getElementById("alert").innerText = "Key/Data Error";
    }
}
setInterval(updateData, 5000);
updateData();
