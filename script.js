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

        document.getElementById("quake").innerText =
            feed.field7 || "--";

        const magnitude = parseFloat(feed.field8 || 0);

        let quakeText = "Normal";

        if (magnitude >= 2 && magnitude < 4) {
            quakeText = `Weak (${magnitude.toFixed(1)} M)`;
        }
        else if (magnitude >= 4 && magnitude < 6) {
            quakeText = `Strong (${magnitude.toFixed(1)} M)`;
        }
        else if (magnitude >= 6) {
            quakeText = `Severe (${magnitude.toFixed(1)} M)`;
        }

        const quakeBox = document.getElementById("quakeLevel");

        quakeBox.innerText = quakeText;

        if (magnitude < 2) {
            quakeBox.style.color = "lime";
        }
        else if (magnitude < 4) {
            quakeBox.style.color = "yellow";
        }
        else if (magnitude < 6) {
            quakeBox.style.color = "orange";
        }
        else {
            quakeBox.style.color = "red";
        }

        const status = document.getElementById("status");
        status.innerText = "ONLINE";
        status.className = "online";

        const alertText = (feed.field1 || "").toUpperCase();

        const sosBanner = document.getElementById("sosBanner");

        if (
            alertText.includes("SOS") ||
            alertText.includes("HELP") ||
            alertText.includes("EMERGENCY") ||
            alertText.includes("EARTHQUAKE")
        ) {

            sosBanner.style.display = "block";

            if (previousAlert !== alertText) {

                try {

                    const audio = new Audio(
                        "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
                    );

                    audio.play();

                } catch (e) {}

                previousAlert = alertText;
            }

        } else {

            sosBanner.style.display = "none";
        }

    }
    catch (error) {

        console.error(error);

        const status = document.getElementById("status");

        status.innerText = "OFFLINE";
        status.className = "offline";
    }
}

updateDashboard();

setInterval(updateDashboard, 5000);
