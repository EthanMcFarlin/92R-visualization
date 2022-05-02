class Map {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, geoJSONdata) {
		this.parentElement = parentElement;
		this.geoJSONdata = geoJSONdata;

		this.initVis();
	}

	/*
	 *  Initialize map
	 */
	initVis () {
		let vis = this;

		L.Icon.Default.imagePath = 'img/';

		vis.map = L.map(vis.parentElement).setView([40.0902, -95.7129], 4);

		L.tileLayer( 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
			subdomains: ['a','b','c']
		}).addTo(vis.map );

		vis.states = L.layerGroup().addTo(vis.map);

		let priceControl = L.control({position: 'bottomright'});

		vis.priceKey;

		priceControl.onAdd = function (map) {

			vis.priceKey = L.DomUtil.create('div', 'info price-key');

			vis.priceKey.innerHTML = '<i style="background: #3F6087"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #C5E4D9"></i>' + "> 2" + '<br>'

			return vis.priceKey;
		};

		priceControl.addTo(vis.map);

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis(variable_type) {
		let vis = this;

		// if (variable_type != "HPI_change") {
		// 	variable_type = "HPI";
		// }

		if (variable_type != "RegionDemo_Index" && variable_type != "CombinedCollection_Index" &&
			variable_type != "Analytical_Index" && variable_type != "RacialCollectionIndex" && variable_type != "HealthAgencies") {
			variable_type = "DataCollection_Index";
		}

		function activateHighlight(state) {
			let selected_state = state.target;

			selected_state.setStyle({
				fillOpacity: 0.4
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				selected_state.bringToFront();
			}

			MapBox.revealHover(selected_state.feature.properties);

		}

		function turnOffHighlight(state) {
			vis.stateBoundaries.resetStyle(state.target);

			MapBox.revealHover(state.target.feature.properties);

		}

		function onEachFeature(feature, layer) {

			let popupContent = "";

			if (variable_type == "DataCollection_Index") {
				popupContent += "<strong>Data Collection Index: </strong>"
				popupContent += feature.properties.DataCollection_Index
			} else if (variable_type == "RegionDemo_Index") {
				popupContent =  "<strong>Region Demo Index: </strong>";
				popupContent += feature.properties.RegionDemo_Index
			} else if (variable_type == "CombinedCollection_Index") {
				popupContent =  "<strong>Combined Collection Index: </strong>";
				popupContent += feature.properties.CombinedCollection_Index
			} else if (variable_type == "Analytical_Index") {
				popupContent =  "<strong>Analytical Index: </strong>";
				popupContent += feature.properties.Analytical_Index
			} else if (variable_type == "RacialCollectionIndex") {
				popupContent =  "<strong>Racial Collection Index: </strong>";
				popupContent += feature.properties.RacialCollectionIndex
			} else if (variable_type == "HealthAgencies") {
				popupContent =  "<strong>Health Agencies Index: </strong>";
				popupContent += feature.properties.HealthAgencies
			}

			// DataCollection_Index
			// RegionDemo_Index
			// CombinedCollection_Index
			// Analytical_Index
			// RacialCollectionIndex
			// HealthAgencies

			layer.on({
				mouseover: activateHighlight,
				mouseout: turnOffHighlight
			});

			layer.bindPopup(popupContent);

		}

		vis.stateBoundaries  = L.geoJson(vis.geoJSONdata, {
			style: styleLines,
			onEachFeature: onEachFeature,
			weight: 3,
			fillOpacity: 0.95
		}).addTo(vis.map);


		let MapBox = L.control();

		MapBox.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'MapStateInfo'); // create a div with a class "info"
			this.revealHover();
			return this._div;
		};

		MapBox.revealHover = function (state) {
			if (variable_type == "DataCollection_Index") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Data Collection Index:</span>' + ' ' + state.DataCollection_Index
					: 'Hover over a state</div>');
			} else if (variable_type == "RegionDemo_Index") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Region Demo Index:</span>' + ' ' + state.RegionDemo_Index
					: 'Hover over a state</div>');
			} else if (variable_type == "CombinedCollection_Index") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Combined Collection Index:</span>' + ' ' + state.CombinedCollection_Index
					: 'Hover over a state</div>');
			} else if (variable_type == "Analytical_Index") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Analytical Index:</span>' + ' ' + state.Analytical_Index
					: 'Hover over a state</div>');
			} else if (variable_type == "RacialCollectionIndex") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Racial Collection Index:</span>' + ' ' + state.RacialCollectionIndex
					: 'Hover over a state</div>');
			} else if (variable_type == "HealthAgencies") {
				this._div.innerHTML =  (state ?
					'<b><span class="MapValueContainer">' + "State: " + state.name + '</span></b><br /><div><span>' + ' Health Agencies Index:</span>' + ' ' + state.HealthAgencies
					: 'Hover over a state</div>');
			}

			// DataCollection_Index
			// RegionDemo_Index
			// CombinedCollection_Index
			// Analytical_Index
			// RacialCollectionIndex
			// HealthAgencies

		};

		MapBox.addTo(vis.map);

		function styleLines(d) {

			if (variable_type == "DataCollection_Index") {
				if (d.properties.DataCollection_Index > 3) {
					return {
						fillColor: "#65809F",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#C5E4D9",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else if (variable_type == "RegionDemo_Index") {
				if (d.properties.RegionDemo_Index > 4) {
					return {
						fillColor: "#3D6E47",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RegionDemo_Index > 3) {
					return {
						fillColor: "#75A663",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#BEDFAD",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else if (variable_type == "CombinedCollection_Index") {
				if (d.properties.CombinedCollection_Index > 8) {
					return {
						fillColor: "#A32D43",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.CombinedCollection_Index > 7) {
					return {
						fillColor: "#D55252",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.CombinedCollection_Index > 6) {
					return {
						fillColor: "#EC8D78",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#F6C3B8",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else if (variable_type == "Analytical_Index") {
				if (d.properties.Analytical_Index > 3) {
					return {
						fillColor: "#7B567B",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.Analytical_Index > 2) {
					return {
						fillColor: "#977197",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.Analytical_Index > 1) {
					return {
						fillColor: "#B68FA9",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.Analytical_Index > 0) {
					return {
						fillColor: "#D2ADC6",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#E9CEE4",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else if (variable_type == "RacialCollectionIndex") {
				if (d.properties.RacialCollectionIndex > 10) {
					return {
						fillColor: "#515A65",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 9) {
					return {
						fillColor: "#616872",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 8) {
					return {
						fillColor: "#6D787F",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 7) {
					return {
						fillColor: "#7E878C",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 6) {
					return {
						fillColor: "#8F969A",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 5) {
					return {
						fillColor: "#9FA6A8",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 4) {
					return {
						fillColor: "#B3B6B7",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.RacialCollectionIndex > 3) {
					return {
						fillColor: "#C5C6C8",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#D6D6D6",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			} else if (variable_type == "HealthAgencies") {
				if (d.properties.HealthAgencies > 7) {
					return {
						fillColor: "#98433C",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 6) {
					return {
						fillColor: "#AA5844",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 5) {
					return {
						fillColor: "#B76F4E",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 4) {
					return {
						fillColor: "#C1845E",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 3) {
					return {
						fillColor: "#C2855F",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 2) {
					return {
						fillColor: "#D19966",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 1) {
					return {
						fillColor: "#DEB078",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else if (d.properties.HealthAgencies > 0) {
					return {
						fillColor: "#E9C696",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				} else {
					return {
						fillColor: "#EBDDC3",
						weight: 1,
						opacity: 1,
						color: 'white',
						dashArray: '3',
						fillOpacity: 0.7
					}
				}
			}
		}

		if (variable_type == "DataCollection_Index") {
			vis.priceKey.innerHTML = '<i style="background: #3F6087"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #C5E4D9"></i>' + "> 2" + '<br>'
		} else if (variable_type == "RegionDemo_Index") {
			vis.priceKey.innerHTML = '<i style="background: #3D6E47"></i>' + "> 4" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #75A663"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #BEDFAD"></i>' + "> 2" + '<br>'
		} else if (variable_type == "CombinedCollection_Index") {
			vis.priceKey.innerHTML = '<i style="background: #A32D43"></i>' + "> 8" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D55252"></i>' + "> 7" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #EC8D78"></i>' + "> 6" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #F6C3B8"></i>' + "> 5" + '<br>'
		} else if (variable_type == "Analytical_Index") {
			vis.priceKey.innerHTML = '<i style="background: #7B567B"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #977197"></i>' + "> 2" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #B68FA9"></i>' + "> 1" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D2ADC6"></i>' + "> 0" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #E9CEE4"></i>' + "= 0" + '<br>'
		} else if (variable_type == "RacialCollectionIndex") {
			vis.priceKey.innerHTML = '<i style="background: #515A65"></i>' + "> 10" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #616872"></i>' + "> 9" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #6D787F"></i>' + "> 8" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #7E878C"></i>' + "> 7" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #8F969A"></i>' + "> 6" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #9FA6A8"></i>' + "> 5" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #B3B6B7"></i>' + "> 4" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #C5C6C8"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D6D6D6"></i>' + "> 2" + '<br>'
		} else if (variable_type == "HealthAgencies") {
			vis.priceKey.innerHTML = '<i style="background: #98433C"></i>' + "> 7" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #AA5844"></i>' + "> 6" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #B76F4E"></i>' + "> 5" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #C1845E"></i>' + "> 4" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #C2855F"></i>' + "> 3" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #D19966"></i>' + "> 2" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #DEB078"></i>' + "> 1" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #E9C696"></i>' + "> 0" + '<br>'
			vis.priceKey.innerHTML += '<i style="background: #EBDDC3"></i>' + "= 0" + '<br>'
		}


	}
}


