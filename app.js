import filteredRoutes from './filteredRoutes.js'
import config from './config.js'

function init() {
	const map = L.map('map').setView(
		config.map.defaultCoordinates,
		config.map.defaultZoom
	)

	L.tileLayer(config.mapbox.apiURL, {
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: config.mapbox.token,
	}).addTo(map)
}

init()
