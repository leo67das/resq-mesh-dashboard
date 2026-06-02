const URL =
"https://api.thingspeak.com/channels/3398357/feeds.json?api_key=CVMGAOMLI4QV6W2J&results=1";

async function loadData(){

try{

const response = await fetch(URL);
const data = await response.json();

const feed = data.feeds[0];

document.getElementById("alert").innerText =
feed.field1 || "N/A";

document.getElementById("lat").innerText =
feed.field2 || "N/A";

document.getElementById("lon").innerText =
feed.field3 || "N/A";

document.getElementById("sat").innerText =
feed.field4 || "N/A";

document.getElementById("gas").innerText =
feed.field5 || "N/A";

document.getElementById("water").innerText =
feed.field6 || "N/A";

document.getElementById("quake").innerText =
feed.field7 || "N/A";

document.getElementById("node").innerText =
feed.field8 || "N/A";

}
catch(error){

console.log(error);

}

}

loadData();

setInterval(loadData,15000);

