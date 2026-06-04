async function updateData() {
    const url = "https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=1";
    try {
        const response = await fetch(url);
        const data = await response.json();
        const f = data.feeds[0];
        if (f) {
            document.getElementById("alert").innerText = f.field1 == "2" ? "SAFE" : (f.field1 == "3" ? "MEDICAL" : "ALERT");
            document.getElementById("lat").innerText = f.field2;
            document.getElementById("lon").innerText = f.field3;
            document.getElementById("sat").innerText = f.field4;
            document.getElementById("gas").innerText = f.field5 + " ppm";
            document.getElementById("water").innerText = f.field6 + " cm";
            document.getElementById("quake").innerText = f.field7 + " m/s²";
            document.getElementById("node").innerText = f.field8;
        }
    } catch (e) { console.error(e); }
}
setInterval(updateData, 5000);
updateData();
