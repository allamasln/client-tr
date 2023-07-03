import filteredRoutes from './filteredRoutes.js'
import config from './config.js'

function init() {
	const map = L.map('map').setView(
		config.map.defaultCoordinates,
		config.map.defaultZoom
	)

	const stopIcon = L.icon({
		iconUrl: 'stop.png',

		iconSize: [38, 38], // size of the icon
	})

	L.tileLayer(config.mapbox.apiURL, {
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: config.mapbox.token,
	}).addTo(map)

	fetch('https://transportes-irlanda.onrender.com/api/realtime/vehicles')
		.then((response) => response.json())
		.then(async (data) => {
			const route = data.find(
				(d) => d.vehicle.trip.route_id === filteredRoutes[0].id
			)

			const tripId = route.vehicle.trip.trip_id

			fetch('https://transportes-irlanda.onrender.com/api/shapes/' + tripId)
				.then((response) => response.json())
				.then((data) => {
					const latlngs = data.map((item) => [
						item.shape_pt_lat,
						item.shape_pt_lon,
					])
					const polyline = L.polyline(latlngs, { color: 'red' }).addTo(map)

					map.fitBounds(polyline.getBounds())

					fetch(
						'https://transportes-irlanda.onrender.com/api/stops/trip/' + tripId
					)
						.then((response) => response.json())
						.then((data) => {
							data.forEach((item) => {
								L.marker([item.stop.stop_lat, item.stop.stop_lon], {
									icon: stopIcon,
								}).addTo(map)
							})

							const marker = L.marker([
								route.vehicle.position.latitude,
								route.vehicle.position.longitude,
							]).addTo(map)

							setInterval(() => {
								fetch(
									'https://transportes-irlanda.onrender.com/api/realtime/vehicles'
								)
									.then((response) => response.json())
									.then(async (data) => {
										const route = data.find(
											(d) => d.vehicle.trip.route_id === filteredRoutes[0].id
										)

										marker.setLatLng([
											route.vehicle.position.latitude,
											route.vehicle.position.longitude,
										])
									})
							}, 5000)
						})
				})
		})
}

init()
