async function updateData() {
    // This URL format is the officially supported structure for private channels
    const url = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=6GBC1E77JVBWJXA6&results=1";
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("400 Error");
        
        const data = await response.json();
        const f = data.feeds[0];
        
        document.getElementById("alert").innerText = f.field1 || "--";
        document.getElementById("lat").innerText = f.field2 || "0";
        document.getElementById("lon").innerText = f.field3 || "0";
        document.getElementById("sat").innerText = f.field4 || "0";
        document.getElementById("gas").innerText = (f.field5 || "0") + " ppm";
        document.getElementById("water").innerText = (f.field6 || "0") + " cm";
        document.getElementById("quake").innerText = (f.field7 || "0") + " m/s²";
        document.getElementById("node").innerText = f.field8 || "--";
    } catch (e) {
        document.getElementById("alert").innerText = "Check Key";
    }
}
setInterval(updateData, 5000);
updateData();
