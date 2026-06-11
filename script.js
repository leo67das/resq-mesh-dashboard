setInterval(async () => {
  const url = "https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds/last.json";

  const res = await fetch(url);
  const data = await res.json();

  document.getElementById("alert").innerText = data.field1;
  document.getElementById("lat").innerText = data.field2;
  document.getElementById("lon").innerText = data.field3;
  document.getElementById("sat").innerText = data.field4;
  document.getElementById("quake").innerText = data.field5;

}, 15000);
