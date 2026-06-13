const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

let previousAlert = "";

async function updateDashboard() {

    try {

        const url =
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("ThingSpeak Connection Failed");
        }

        const data = await response.json();

        if (!data.feeds || data.feeds.length === 0) {
            return;
        }

        const feed = data.feeds[0];

        document.getElementById("alert").innerText =
            feed.field1 || "--";

        document.getElementById("lat").innerText =
            feed.field2 || "--";

        document.getElementById("lon").innerText =
            feed.field3 || "--";

        document.getElementById("sat").innerText =
            feed.field4 || "--";

        document.getElementById("gas").innerText =
            feed.field5 || "--";

        document.getElementById("water").innerText =
            feed.field6 || "--";

        document.getElementById("messageSignal").innerText =
            feed.field7 || "--";

        const magnitude = Number(feed.field8);

        const quakeBox = document.getElementById("quakeLevel");

        if (isNaN(magnitude)) {

            quakeBox.innerText = "No Data";
            quakeBox.style.color = "white";

        } else if (magnitude < 2) {

            quakeBox.innerText =
                `Normal (${magnitude.toFixed(1)} M)`;
            quakeBox.style.color = "lime";

        } else if (magnitude < 4) {

            quakeBox.innerText =
                `Weak (${magnitude.toFixed(1)} M)`;
            quakeBox.style.color = "yellow";

        } else if (magnitude < 6) {

            quakeBox.innerText =
                `Strong (${magnitude.toFixed(1)} M)`;
            quakeBox.style.color = "orange";

        } else {

            quakeBox.innerText =
                `Severe (${magnitude.toFixed(1)} M)`;
            quakeBox.style.color = "red";
        }

        const status = document.getElementById("status");
        status.innerText = "ONLINE";
        status.className = "online";

        const alertText =
            (feed.field1 || "").toUpperCase();

        const sosBanner =
            document.getElementById("sosBanner");

        if (
            alertText.includes("SOS") ||
            alertText.includes("HELP") ||
            alertText.includes("EMERGENCY") ||
            alertText.includes("EARTHQUAKE") ||
            alertText.includes("FLOOD")
        ) {

            sosBanner.style.display = "block";

            if (previousAlert !== alertText) {

                previousAlert = alertText;
            }

        } else {

            sosBanner.style.display = "none";
        }

    }
    catch (error) {

        console.error(error);

        const status =
            document.getElementById("status");

        status.innerText = "OFFLINE";
        status.className = "offline";
    }
}

updateDashboard();
setInterval(updateDashboard, 5000);
