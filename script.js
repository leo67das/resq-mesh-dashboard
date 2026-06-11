const CHANNEL_ID = "3398357";
const READ_API_KEY = "CVMGAOMLI4QV6W2J";

async function updateDashboard() {
  try {
    const url =
      `https://api.thingspeak.com/channels/${3398357}/feeds.json?api_key=${
CVMGAOMLI4QV6W2J}&results=1`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("HTTP ERROR:", res.status);
      return;
    }

    const json = await res.json();

    const feed = json.feeds?.[0];

    if (!feed) {
      console.error("No feed data");
      return;
    }

    document.getElementById("alert").innerText = feed.field1 ?? "--";
    document.getElementById("lat").innerText   = feed.field2 ?? "--";
    document.getElement
