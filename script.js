const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

let previousAlert = "";

async function updateDashboard() {

    try {

        const url =
        `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("HTTP Error");
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

        document.getElementById("node").innerText =
            feed.field8 || "--";

        document.getElementById("time").innerText =
            new Date(feed.created_at).toLocaleString();

        const status = document.getElementById("status");
        status.innerText = "ONLINE";
        status.className = "online";

        const alertBox = document.getElementById("alert");
        const sosBanner = document.getElementById("sosBanner");

        const alertText = (feed.field1 || "").toUpperCase();

        if (
            alertText.includes("SOS") ||
            alertText.includes("EMERGENCY") ||
            alertText.includes("HELP")
        ) {

            alertBox.className = "alert-sos";
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

            alertBox.className = "alert-normal";
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
