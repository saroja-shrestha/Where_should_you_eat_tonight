

let myMap = L.map("map", {
  center: [29.4252, -98.4946],
  zoom: 12
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Assemble the API query URL.
let url = "/api/restaurants";
let data = d3.json(url)

// Get the data with d3.
data.then(function (response) {
  // Create a new marker cluster group.
  let markers = L.markerClusterGroup();
  let listNames = [];
  let listScores = [];
  const restaurantList = document.getElementById("restaurantList");

  // Sort the restaurants by score in descending order
  var sortedRestaurants = response.sort(function (a, b) {
    return b.score - a.score;
  });
  // Determine the number of top restaurants you want to keep
  var topN = 10;
  // Keep only the top N restaurants
  var topRestaurants = sortedRestaurants.slice(0, topN);

  // Loop through the data.
  for (let i = 0; i < response.length; i++) {
    // Get the latitude and longitude from the location property.
    let lat = response[i].lat;
    let lng = response[i].lng;

    // Check if latitude and longitude exist.
    if (lat && lng) {
      // Create the HTML content for the popup.
      let popup = `<h3>${response[i].name}</h3>
        <p>Score: ${response[i].score}</p>
        <p>Price Range: ${response[i].price_range}</p>`;
      if (topRestaurants.includes(response[i])) {
        listNames.push(response[i].name);
        listScores.push(response[i].score);
      }
      const option = document.createElement('option');
      option.value = response[i].name;
      option.innerHTML = response[i].name;
      option.dataset.category = response[i].category;
      option.dataset.priceRange = response[i].price_range;
      option.dataset.address = response[i].address;
      restaurantList.append(option)


      // Add a new marker to the cluster group, and bind a popup.
      let marker = markers.addLayer(L.marker([lat, lng]).bindPopup(popup));
      markers.addLayer(marker);


      // Add our marker cluster layer to the map.
      myMap.addLayer(markers);
    }
  }


  const chart = new Chart(document.getElementById('badCanvas1'), {
    type: 'bar',
    data: {
      labels: listNames,
      datasets: [
        {
          label: 'Top restaurants by scores',
          data: listScores,
          backgroundColor: '#ffb677'
        }
      ]
    },
    options: {
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Restaurant Names'
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Score'
          }
        }]
      }
    }
  });

  restaurantList.addEventListener("change", function (event) {
    const address = this.options[this.selectedIndex].getAttribute('data-address');
    document.getElementById('address').innerHTML = address;
    const priceRange = this.options[this.selectedIndex].getAttribute('data-price-range');
    document.getElementById('priceRange').innerHTML = priceRange;
    const category = this.options[this.selectedIndex].getAttribute('data-category');
    document.getElementById('category').innerHTML = category;
  });


});

