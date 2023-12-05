/* global Module */

/* Magic Mirror
 * Module: MMM-SE-Reputation
 *
 * By Michiel Schouten
 * MIT Licensed.
 */

Module.register("MMM-SE-Reputation", {
	defaults: {
		updateInterval: 1 * 60 * 1000,
		animationSpeed:  1000,
		userId: "",
		site: "stackoverflow",
		access_token: "",
	},

	//requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		var lastUpdate = this.getDate();
		var totalRecords = null;
		var recordsJson;
		var pageSetup;
		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData("&filter=!Lewuc(5)R7)tVLuxE1D0Tg");
		setInterval(function() {
			console.log("SE: domUpdate");
			self.updateDom();
		}, this.config.updateInterval);
	},


	getDate: function() {
		var today = new Date();
		var hour = String(today.getHours()).padStart(2, '0');
		var minute = String(today.getMinutes() + 1).padStart(2, '0'); //January is 0!

		return hour + ":" + minute;
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function(filter = "", pageSetup = "") {
		var self = this;
//https://chielchiel.github.io/MMM-SE-Reputation/?code=pYEs(SJQuk53eYt3ebElbQ))
		var apiBase = "https://api.stackexchange.com";
		var totalChange = apiBase + "/2.2/users/" + this.config.userId +  "/reputation-history/full/?site=" + this.config.site;
		totalChange = totalChange + pageSetup;
		totalChange = totalChange + "&key=2rc7G)AiEvdk6q6TS08GGg((&access_token=" + this.config.access_token;
		totalChange = totalChange + filter;

		var retry = true;
		console.log(totalChange);

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", totalChange, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					let result = JSON.parse(this.response);
					result.filter = filter;
					console.log(result);
					self.processData(result);
				} else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
		 //dataRequest.send("key=2rc7G%29AiEvdk6q6TS08GGg%28%28&access_token=FDeXMTE2CNpzTPFVa1StEw%29%29");
		//dataRequest.send();

	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			console.log("standard");
			self.getData();
		}, nextLoad);
	},

	getDom: function() {
		var self = this;
		self.data.header = this.config.site + " STATS";
		console.log("dom?");
		// create element wrapper for show into the module
		var wrapper = document.createElement('div');

		this.canvas = document.createElement("canvas");
		this.canvas.id = "SE-Chart";

		wrapper.appendChild(this.canvas);

		let alignMent = self.data.position.includes("left") ? "left" : "right";

		if (this.dataRequest) {
			var totalReputation = 1;
			var reputationData = new Array();
			var reputationLabels = new Array();
			for (var reputationItem of this.dataRequest) {
				totalReputation += reputationItem.reputation_change;
				reputationLabels.push(new Date(reputationItem.creation_date * 1000));
				reputationData.push(totalReputation);
			}


			var myLineChart = new Chart(this.canvas, {
				type: 'line',
				title: 'hello',
				data: {
					labels: reputationLabels,
					datasets: [{
						backgroundColor: "rgba(255, 255, 255, 0.1)",
						borderColor: "rgba(255, 255, 255, 1)",
						data: reputationData,
						fill: "start",
						lineTension: "0.1",
						pointRadius: 0,
					}]
				},
				options: {
					title: {
						display: true,
						fontColor: 'red',
					},
					legend: {
						display: false,
						labels: {
							fontColor: 'rgb(255, 99, 132)'
						}
					},
					scales: {
						yAxes: [{
							gridLines: {
								color: "rgba(255, 255, 255, 0.3)",
							},
							position: alignMent,
						}],
						xAxes: [{
							ticks: {
								callback: function(value) {
										return value.getDate() + "/" + (value.getMonth() + 1) + " '" + String(value.getFullYear()).substring(2, 4);
								}
							}
						}],
					}
				}
			});

		} else {
			console.log("no data");
		}


		// Data from helper
		if (this.dataNotification) {
			console.log("notification");
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML = this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
		return wrapper;
	},

	getScripts: function() {
		return [
			"modules/MMM-SE-Reputation/chartjs/Chart.bundle.min.js",
		];
	},

	getStyles: function() {
		return [
			"MMM-SE-Reputation.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
		};
	},

	processData: function(data) {
		var self = this;
		if (data.filter == "&filter=!Lewuc(5)R7)tVLuxE1D0Tg") { //First check
			if (data.total != null) {
				this.totalRecords = data.total;
				Log.log(this.paginate(this.totalRecords));
				this.pageSetup = this.paginate(this.totalRecords);
			}
			// TODO: request first page
			//console.log(this.pageSetup[1]) // 61;
			this.getData("&filter=!)s-s.dGJ.5)siJpoc0uw", "&page=1&pagesize=" + this.pageSetup[1])

		} else if (data.filter == "&filter=!)s-s.dGJ.5)siJpoc0uw") { //normal data
			this.page = data.page;
			console.log(this.pageSetup + "; len: " + this.pageSetup.length); //[1: 100, 2:100, 3:33]

			if (this.page == this.pageSetup.length - 1) {

				if (this.recordsJson == null) {
					this.recordsJson = data.items;
				} else {
					this.recordsJson = this.recordsJson.concat(data.items);
				}

				this.dataRequest = this.recordsJson.reverse();
				this.loaded = true;
				//console.log("recordsJson:" + this.recordsJson + ";dataRequest: " + this.dataRequest);
				self.updateDom(self.config.animationSpeed);
			} else {
				this.recordsJson = this.recordsJson.concat(data.items);
				this.getData("&filter=!)s-s.dGJ.5)siJpoc0uw", "&page=" + (this.page + 1) +"&pagesize=" + this.pageSetup[this.page + 1])
			}



		}




		if (this.loaded === false) {
			this.lastUpdate = this.getDate();
			self.updateDom(self.config.animationSpeed);
		}


		// the data if load
		// send notification to helper
		//this.sendSocketNotification("MMM-SE-Reputation-NOTIFICATION_TEST", data);
	},

	paginate: function(total) {
		//let total = 233;
		let lastPage =  total % 100; //33
		let isLastPageEmpty = (lastPage == 0);
		let pages = (isLastPageEmpty) ? Math.floor(total / 100) : Math.floor(total / 100) + 1; //3
		//console.log("pages" + pages);


		let pageOrder = new Array();
		for (var i = 1; i <= (pages); i++) {
			let itemsOnPage = 100;
			if (i == pages && !isLastPageEmpty) { //3 == 3
				itemsOnPage = lastPage;
			}
			pageOrder[i] = itemsOnPage;
		}
		//console.log("totalpage" + JSON.stringify(pageOrder));
		//console.log("totalpage2" + pageOrder);
		return pageOrder;
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-SE-Reputation-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
