Module.register("MMM-Bluebikes", {
	defaults: {
		BaseURL: 'https://gbfs.bluebikes.com/gbfs/en/station_status.json',  //this is the url for Boston Bluebikes
		station_number: "187",  //see station_list.txt
		show_eBikes: false,  //currently none in Boston
		reload: 3,  // minutes to reload counts
	},
	
	getStyles: function () {
			return ["font-awesome.css", "MMM-Bluebikes.css"];
	},

	start: function () {
			Log.info("Starting module: " + this.name);
			this.loaded = false;
			var bikes_available = ''
			var ebikes = ''
			var renting = ''
			this.getData();

			var self = this;

		// Schedule updates
			setInterval(function () {
				self.getData();
				self.updateDom();
			},
		this.config.reload * 60 * 1000 );
	},

	getDom: function() {
		if (renting != 1) {
			var element = document.createElement("div")
			element.innerHTML = 'Not Renting Bikes'
			return element
		} else {
			//create table
			var table = document.createElement("table")
			table.className = "large"
			
			//create row for regular bikes
			var row = document.createElement("tr")
			table.appendChild(row)

				//create icon cell
				var iconcell = document.createElement("td")
				iconcell.className = "fa fa-bicycle blue"
				row.appendChild(iconcell)

				//create count cell
				var countcell = document.createElement("td")
				countcell.innerHTML = bikes_available
				countcell.className = "align-left bright"			
				row.appendChild(countcell)
			

			if (this.config.show_eBikes == true) {
				//create ebike row
				var row2 = document.createElement("tr")
				table.appendChild(row2)

					//create icon cell
					var iconcell2 = document.createElement("td")
					iconcell2.className = "fa fa-bicycle green"
					row2.appendChild(iconcell2)

					//create count cell
					var countcell2 = document.createElement("td")
					countcell2.innerHTML = ebikes
					countcell2.className = "align-left bright"				
					row2.appendChild(countcell2)
			}

	  		return table
		}
	},

  	getData: function() {
		
		var station_number_var = this.config.station_number
		var bb_url = this.config.BaseURL
		renting = ''
		bikes_available = ''
		ebikes = ''
		
		function findStation(station) {
			return station.legacy_id == station_number_var;
		}

		fetch(bb_url)
			.then(response => {
				return response.json();
			})
			.then(stations => {
				station_payload = stations.data.stations.find(findStation)
				//console.log(station_payload)
				renting = station_payload.is_renting
				bikes_available = station_payload.num_bikes_available
				//console.log(bikes_available)
				ebikes = station_payload.num_ebikes_available
				//console.log(ebikes)
				this.updateDom();
			})
	},
})
