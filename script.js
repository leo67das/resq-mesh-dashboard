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

        const magnitude = parseFloat(feed.field8);

        let quakeLevel = "--";

        if (!isNaN(magnitude)) {

            if (magnitude < 2) {
                quakeLevel = `Normal (${magnitude})`;
            }
            else if (magnitude < 4) {
                quakeLevel = `Weak (${magnitude})`;
            }
            else if (magnitude < 6) {
                quakeLevel = `Strong (${magnitude})`;
            }
            else {
                quakeLevel = `Severe (${magnitude})`;
            }
        }

        document.getElementById("quakeLevel").textContent =
            quakeLevel;

        const status = document.getElementById("status");
        status.textContent = "ONLINE";
        status.className = "online";

        const alert = (feed.field1 || "").toUpperCase();

        if (
            alert.includes("SOS") ||
            alert.includes("FLOOD") ||
            alert.includes("EARTHQUAKE") ||
            alert.includes("GAS")
        ) {
            document.getElementById("sosBanner").style.display = "block";
        } else {
            document.getElementById("sosBanner").style.display = "none";
        }

    } catch (err) {

        document.getElementById("status").textContent = "OFFLINE";
        document.getElementById("status").className = "offline";

        console.error(err);
    }
}

updateDashboard();
setInterval(updateDashboard, 5000);
