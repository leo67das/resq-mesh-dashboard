async function updateData() {
    // Using your new Read API Key: CVMGAOMLI4QV6W2J
    const url = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=1";
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not fetch data");
        
        const data = await response.json();
        
        // If data.feeds is empty, the hardware hasn't sent data yet
        if (!data.feeds || data.feeds.length === 0) {
            document.getElementById("alert").innerText = "No Data Yet";
            return;
        }

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
        console.error(e);
        document.getElementById("alert").innerText = "Error";
    }
}
setInterval(updateData, 5000);
updateData();
