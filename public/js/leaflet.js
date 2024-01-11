/* eslint-disable */
const locations = JSON.parse(document.getElementById("map").dataset.locations);

var map = L.map("map", { zoomControl: false });

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  crossOrigin: ""
}).addTo(map);

//cutom marker
// const icon = L.icon({
//   iconUrl: "/img/pin.png",
//   iconSize: [32, 44], // size of the icon
//   iconAnchor: [16, 44], // point of the icon which will correspond to marker's location
//   popupAnchor: [0, -46] // point from which the popup should open relative to the iconAnchor
// });

const points = [];
locations.forEach(loc => {
  points.push([loc.coordinates[1], loc.coordinates[0]]);
  L.marker([loc.coordinates[1], loc.coordinates[0]], {})
    .addTo(map)
    .bindPopup(`<p style={font-size: "20px"}>Day ${loc.day}: ${loc.description}</p>`, { autoClose: false })
    .openPopup();
});

const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);

map.scrollWheelZoom.disable(); //to disable zoom by mouse wheel
