
    var map = L.map("map").setView([coordinate.latitude, coordinate.longitude], 14);

    // Add OpenStreetMap tiles
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add a marker with popup
    var marker = L.marker([coordinate.latitude, coordinate.longitude])
      .addTo(map)
      .bindPopup("Open in Google Map")
      .openPopup();

      var circle = L.circle([coordinate.latitude, coordinate.longitude], {
    color: 'green',
    fillColor: '#59d444',
    fillOpacity: 0.5,
    radius: 300
}).addTo(map);
      
 marker.on("click", function () {
  window.open(`https://www.google.com/maps?q=${coordinate.latitude},${coordinate.longitude}`, `_blank`);
});