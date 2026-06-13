const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

async function updateDashboard() {

    try {

        const response = await fetch(
            `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`
        );

        const feed = await response.json();

        document.getElementById("alert").textContent =
            feed.field1 || "--";

        document.getElementById("lat").textContent =
            feed.field2 || "--";

        document.getElementById("lon").textContent =
            feed.field3 || "--";

        document.getElementById("sat").textContent =
            feed.field4 || "--";

        document.getElementById("gas").textContent =
            feed.field5 || "--";

        document.getElementById("water").textContent =
            feed.field6 || "--";

        document.getElementById("messageSignal").textContent =
            feed.field7 || "--";

        const alertType = (feed.field1 || "").toUpperCase();
        const magnitude = parseFloat(feed.field8 || 0);

        let quakeText = "No Seismic Activity";

        if (alertType === "EARTHQUAKE") {

            if (magnitude < 2) {
                quakeText = `Normal (${magnitude.toFixed(1)} M)`;
            }
            else if (magnitude < 4) {
                quakeText = `Weak (${magnitude.toFixed(1)} M)`;
            }
            else if (magnitude < 6) {
                quakeText = `Strong (${magnitude.toFixed(1)} M)`;
            }
            else {
                quakeText = `Severe (${magnitude.toFixed(1)} M)`;
            }
        }

        document.getElementById("quakeLevel").textContent =
            quakeText;

        const status = document.getElementById("status");
        status.textContent = "ONLINE";
        status.className = "online";

        const banner = document.getElementById("sosBanner");

        if (
            alertType === "SOS" ||
            alertType === "FLOOD" ||
            alertType === "GAS_LEAK" ||
            alertType === "EARTHQUAKE"
        ) {
            banner.style.display = "block";
            banner.textContent = `🚨 ${alertType} ALERT 🚨`;
        }
        else {
            banner.style.display = "none";
        }

    }
    catch (err) {

        document.getElementById("status").textContent = "OFFLINE";
        document.getElementById("status").className = "offline";

        console.error(err);
    }
}

updateDashboard();
setInterval(updateDashboard, 5000);
