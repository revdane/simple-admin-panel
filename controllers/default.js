//var FirebasePaginator = require('firebase-paginator');
var firebase = require('firebase');
var async = require("async");
const excel = require('node-excel-export');

var config = {
	projectId : 'Adminpanel-Dev-Firebase',
	apiKey : "XXXXXXXXXXXX",
	authDomain : "XXXXXXXXXXXX",
	databaseURL : "XXXXXXXXXXXX",
	storageBucket : "XXXXXXXXXXXX"
};

firebase.initializeApp(config);

exports.install = function() {
	ROUTE('/', view_index);
	ROUTE('/view', view_view);

	ROUTE('/faq', view_faq, [ 'authorize' ]);
	ROUTE('/editfaq', view_editfaq, [ 'authorize' ]);
	ROUTE('/setfaq', view_setfaq, [ 'post' ]);
	ROUTE('/addfaq', view_addfaq, [ 'authorize' ]);
	ROUTE('/pushnewfaq', view_pushnewfaq, [ 'post' ]);
	ROUTE('/removefaq', view_removefaq, [ 'authorize' ]);

	ROUTE('/categories', view_categories, [ 'authorize' ]);
	ROUTE('/addcategory', view_addcategory, [ 'authorize' ]);
	ROUTE('/editcategory', view_editcategory, [ 'authorize' ]);
	ROUTE('/setcategory', view_setcategory, [ 'post' ]);
	ROUTE('/pushnewcategory', view_pushnewcategory, [ 'post' ]);
	ROUTE('/removecategory', view_removecategory, [ 'authorize' ]);

	ROUTE('/contest', view_contest, [ 'authorize' ]);
	ROUTE('/addcontest', view_addcontest, [ 'authorize' ]);
	ROUTE('/pushnewcontest', view_pushnewcontest, [ 'post' ]);
	ROUTE('/editcontest', view_editcontest, [ 'authorize' ]);
	ROUTE('/setcontest', view_setcontest, [ 'post' ]);
	ROUTE('/removecontest', view_removecontest, [ 'authorize' ]);

	ROUTE('/ads', view_ads, [ 'authorize' ]);
	ROUTE('/addad', view_addad, [ 'authorize' ]);
	ROUTE('/editad', view_editad, [ 'authorize' ]);
	ROUTE('/setad', view_setad, [ 'post' ]);
	ROUTE('/pushnewad', view_pushnewad, [ 'post' ]);
	ROUTE('/removead', view_removead, [ 'authorize' ]);

	ROUTE('/announces', view_announces, [ 'authorize' ]);
	ROUTE('/removeannounces', view_removeannounces, [ 'authorize' ]);

	ROUTE('/user', view_user, [ 'authorize' ]);
	ROUTE('/removeUser', view_removeUser, [ 'authorize' ]);
	ROUTE('/useractiveposts', view_useractiveposts, [ 'authorize' ]);
	ROUTE('/useroutgoingbids', view_useroutgoingbids, [ 'authorize' ]);
	ROUTE('/userincomingbids', view_userincomingbids, [ 'authorize' ]);

	ROUTE('/export', view_export, [ 'authorize' ]);
	ROUTE('/massdelete', view_massdelete, [ 'post' ]);

	F.route('/', view_logged, [ 'authorize' ]);
	F.route('/', json_login, [ 'post', '*User' ]);
	F.route('/logout/', logout, [ 'authorize' ]);
};
/* Intial action */
function view_index() {
	var self = this;
	self.view('index', {
		email : '@'
	});
}

/* Announces ACTIONS STARTS HERE */
function view_announces() {
	var self = this;
	firebase.database().ref('user-product').once('value').then(
			function(snapshot) {
				var List = snapshot.val();
				self.repository.list = List;
				self.view('admin/announces');

			});
}

function view_removeannounces() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('user-product/' + id).remove();

	return self.res.redirect('/announces');
}

/* Announces ACTIONS ENDS HERE */
/* ADS ACTIONS STARTS HERE */
function view_ads() {
	var self = this;
	firebase.database().ref('ads').once('value').then(function(snapshot) {
		var List = snapshot.val();
		console.log(List);
		self.repository.list = List;
		self.view('admin/ads');
	});

}

function view_addad() {
	var self = this;
	self.view('admin/ad-create');
}

function view_pushnewad() {
	var self = this;
	var database = firebase.database().ref('ads');
	database.push({
		"ad_title" : self.body.ad_title,
		"ad_url" : self.body.ad_url,
		"ad_desc" : self.body.ad_desc,
		"ad_validfrom" : self.body.ad_validfrom,
		"ad_validto" : self.body.ad_validto,
		"ad_fromtime" : self.body.ad_fromtime,
		"ad_totime" : self.body.ad_totime,
		"ad_file_url" : self.body.file_url,
		"ad_per_swipe" : self.body.ad_per_swipe
	});

	return self.res.redirect('/ads');

}
function view_editad() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('ads/' + id).once('value').then(function(snapshot) {
		var ads = snapshot.val();
		self.repository.data = ads;
		self.repository.id = id;

		self.view('admin/ad-create');
	});
}
function view_setad() {

	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('ads/' + id).set({
		"ad_title" : self.body.ad_title,
		"ad_url" : self.body.ad_url,
		"ad_desc" : self.body.ad_desc,
		"ad_validfrom" : self.body.ad_validfrom,
		"ad_validto" : self.body.ad_validto,
		"ad_fromtime" : self.body.ad_fromtime,
		"ad_totime" : self.body.ad_totime,
		"ad_file_url" : self.body.file_url,
		"ad_per_swipe" : self.body.ad_per_swipe
	}, function(error) {
		if (error) {
			// console.log(error)
		} else {
			// console.log("Data saved successfully!")
		}
	});
	return self.res.redirect('/ads');
}
function view_removead() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('ads/' + id).remove();

	return self.res.redirect('/ads');
}

/* ADS ACTIONS ENDS HERE */
/* CONTESTS ACTIONS STARTS HERE */
function view_contest() {
	var self = this;
	firebase.database().ref('contest').once('value').then(function(snapshot) {
		var List = snapshot.val();
		console.log(List);
		self.repository.list = List;
		self.view('admin/contest');
	});
}
function view_addcontest() {
	var self = this;
	self.view('admin/contest-create');

}
function view_pushnewcontest() {
	var self = this;
	console.log(self.body);
	var database = firebase.database().ref('contest');
	database.push({
		"contest_title" : self.body.contest_title,
		"contest_validfrom" : self.body.contest_validfrom,
		"contest_validto" : self.body.contest_validto,
		"contest_file_url" : self.body.file_url
	});

	return self.res.redirect('/contest');

}
function view_editcontest() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('contest/' + id).once('value').then(
			function(snapshot) {
				var ads = snapshot.val();
				self.repository.data = ads;
				self.repository.id = id;

				self.view('admin/contest-create');
			});
}
function view_setcontest() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('contest/' + id).set({
		"contest_title" : self.body.contest_title,
		"contest_validfrom" : self.body.contest_validfrom,
		"contest_validto" : self.body.contest_validto,
		"contest_file_url" : self.body.file_url
	}, function(error) {
		if (error) {
			// console.log(error)
		} else {
			// console.log("Data saved successfully!")
		}
	});
	return self.res.redirect('/contest');
}
function view_removecontest() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('contest/' + id).remove();

	return self.res.redirect('/contest');
}
/* CONTESTS ACTIONS ENDS HERE */

/* CATEGORY ACTIONS STARTS HERE */
function view_categories() {

	var self = this;
	firebase.database().ref('category').once('value').then(function(snapshot) {
		var categoryList = snapshot.val();
		// console.log(faqList);
		self.repository.categoryList = categoryList;
		self.view('admin/categories');
	});

}
function view_addcategory() {
	var self = this;
	self.view('admin/category-create');
}
function view_pushnewcategory() {
	var self = this;
	var database = firebase.database().ref('category');
	database.push({
		"dk" : self.body.category_dk,
		"en" : self.body.category_en,
		"icon" : self.body.icon,
		"background" : self.body.background
	});
	return self.res.redirect('/categories');
}
function view_editcategory() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('category/' + id).once('value').then(
			function(snapshot) {
				var category = snapshot.val();
				self.repository.category = category;
				self.view('admin/category-edit');
			});

}
function view_setcategory() {

	var self = this;
	var id = self.query.id; // $_GET["id"]
	console.log(self.body);
	firebase.database().ref('category/' + id).set({
		"dk" : self.body.category_dk,
		"en" : self.body.category_en,
		"icon" : self.body.icon,
		"background" : self.body.background
	}, function(error) {
		if (error) {
			// console.log(error)
		} else {
			// console.log("Data saved successfully!")
		}
	});
	return self.res.redirect('/categories');
}
function view_removecategory() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('category/' + id).remove();

	return self.res.redirect('/categories');
}
/* CATEGORY ACTIONS ENDS HERE */

/* FAQ ACTIONS START HERE */
function view_faq() {
	var self = this;
	firebase.database().ref('faq').once('value').then(function(snapshot) {
		var faqList = snapshot.val();
		self.repository.faqList = faqList;
		self.view('admin/faq');
	});
}
function view_addfaq() {
	var self = this;
	self.view('admin/faq-create');
}
function view_pushnewfaq() {
	var self = this;
	var database = firebase.database().ref('faq');
	database.push({
		answer : {
			dk : self.body.answer_dk,
			en : self.body.answer_en
		},
		question : {
			dk : self.body.question_dk,
			en : self.body.question_en
		}

	});
	return self.res.redirect('/faq');
}
function view_setfaq() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	// console.log(self.body.question_en );
	firebase.database().ref('faq/' + id).set({
		answer : {
			dk : self.body.answer_dk,
			en : self.body.answer_en
		},
		question : {
			dk : self.body.question_dk,
			en : self.body.question_en
		}
	}, function(error) {
		if (error) {
			// console.log(error)
		} else {
			// console.log("Data saved successfully!")
		}
	});
	return self.res.redirect('/faq');
}
function view_editfaq() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	firebase.database().ref('faq/' + id).once('value').then(function(snapshot) {
		var faq = snapshot.val();
		self.repository.faq = faq;
		self.view('admin/faq-edit');
	});

}
function view_removefaq() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('faq/' + id).remove();

	return self.res.redirect('/faq');
}
/* FAQ ACTIONS ENDS HERE */
/* USER ACTIONS STARTS HERE */
/*
 * function view_user() { var self = this;
 * 
 * firebase.database().ref('user-data').once('value').then(function(snapshot) {
 * var userList = snapshot.val(); //console.log(userList); delete
 * userList['0BkFJWawfHYm2wF2FThXgaYtJfJ2']; self.repository.userList =
 * userList; self.view('admin/user'); }); }
 */
function view_user() {
	var self = this;
	var data = {
		"userList" : [],
		"counter" : []
	};
	firebase.database().ref('user-data').once('value').then(function(snapshot) {
		var userList = snapshot.val();
		data.userList.push(userList);
		delete userList['0BkFJWawfHYm2wF2FThXgaYtJfJ2'];
		getCounter(userList, data, function(response) {
			self.repository.userList = userList;
			self.repository.counterList = data;
			self.view('admin/user');
		});
	});

	function getCounter($userList, data, done) {
		var keys = Object.keys($userList);
		async.each(keys, function(key, done) {
			firebase.database().ref('counter/' + key).once('value').then(
					function(counterSnapshot) {
						counterData = counterSnapshot.val();
						data.counter.push(counterData);
						done();
					});
		}, done);
	}
}

function view_removeUser() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var database = firebase.database().ref('user-data/' + id).remove();

	return self.res.redirect('user');
}

function view_useractiveposts() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var response = {};
	firebase.database().ref().child("user-product").child(id).orderByChild(
			"status").equalTo(0).once('value').then(function(snapshot) {
		response['list'] = snapshot.val();
		return self.json(response);
	});
}
function view_useroutgoingbids() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var response = {};
	firebase.database().ref('bid-outgoing/' + id).orderByChild("status")
			.equalTo(1).once('value').then(function(snapshot) {
				response['list'] = snapshot.val();
				return self.json(response);
			});
}
function view_userincomingbids() {
	var self = this;
	var id = self.query.id; // $_GET["id"]
	var response = {};
	firebase.database().ref('bid-incoming/' + id).orderByChild("status")
			.equalTo(1).once('value').then(function(snapshot) {
				response['list'] = snapshot.val();
				return self.json(response);
			});
}

function view_logged() {
	var self = this;
	// self.plain('You are logged as {0}. To unlogged remove cookie __user or
	// click http://{1}:{2}/logout/'.format(self.user.email, F.ip, F.port));

	firebase.database().ref('faq').once('value').then(function(snapshot) {
		var faqList = snapshot.val();
		console.log(faqList);
		console.log(Object.keys(faqList).length);

		self.repository.faqList = faqList;
		self.view('admin/faq');
	});
}
function view_view() {
	var self = this;
	firebase.database().ref('faq').once('value').then(function(snapshot) {
		// var username = (snapshot.val() && snapshot.val().username) ||
		// 'Anonymous';
		console.log(snapshot.val());
	});
	self.view('admin/announces');
}
function json_login() {
	var self = this;
	self.body.$workflow('login', self, self.callback());
}

function logout() {
	var self = this;
	self.res.cookie(F.config.cookie, '', new Date().add('-1 year'));
	self.redirect('/');
}

function view_massdelete() {
	var self = this;
	var table = self.query.table; // $_GET["table"]
	var key = self.body.key;
	console.log(key);
	console.log(table);
	var response = {};
	var database = firebase.database().ref(table + '/' + key).remove();
	response['list'] = 'OK';
	return self.json(response);

}
/* USER ACTIONS ENDS HERE */

function view_export() {
	var self = this;

	var ref = self.query.ref;

	getModel(ref, function(specification, dataset) {
		const report = excel.buildExport([ {
			name : 'Report', // <- Specify sheet name (optional)
			specification : specification, // <- Report specification
			data : dataset
		} ]);

		self.res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		self.res.setHeader("Content-Disposition", "attachment; filename="
				+ "Report.xlsx");

		return self.res.send(report);
	});
}

function getModel(ref, cb) {
	const styles = {
		headerDark : {
			fill : {
				fgColor : {
					rgb : '00dbc5'
				}
			}
		}
	};

	switch (ref) {
	case "category":
		categoryExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
		break;
	case "user-product":
		announcesExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
		break;
	case "faq":
		faqExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
		break;
	case "user-data":
		userExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
	case "ads":
		adsExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
		break;
	case "contest":
		contestExport(styles, function(specification, dataset) {
			cb(specification, dataset);
		});
		break;
	}
}

function contestExport(styles, cb) {
	firebase.database().ref('contest').once('value').then(function(snapshot) {
		var list = snapshot.val();
		// Here you specify the export structure
		const specification = {
			contest_title : {
				displayName : 'Contest Title',
				headerStyle : styles.headerDark,
			},
			contest_file_url : {
				displayName : 'File Url',
				headerStyle : styles.headerDark,
			},
			contest_validfrom : {
				displayName : 'Valid From',
				headerStyle : styles.headerDark,
			},
			contest_validto : {
				displayName : 'Valid To',
				headerStyle : styles.headerDark,
			},
		}

		const dataset = []

		for ( var key in list) {
			dataset.push({
				contest_title : list[key].contest_title,
				contest_file_url : list[key].contest_file_url,
				contest_validfrom : list[key].contest_validfrom,
				contest_validto : list[key].contest_validto,
			});
		}
		cb(specification, dataset);
	});
}

function adsExport(styles, cb) {
	firebase.database().ref('ads').once('value').then(function(snapshot) {
		var list = snapshot.val();
		// Here you specify the export structure
		const specification = {
			ad_title : {
				displayName : 'Ad Title',
				headerStyle : styles.headerDark,
			},
			ad_url : {
				displayName : 'URL',
				headerStyle : styles.headerDark,
			},
			ad_file_url : {
				displayName : 'Video/Image URL',
				headerStyle : styles.headerDark,
			},
			ad_validfrom : {
				displayName : 'Valid From',
				headerStyle : styles.headerDark,
			},
			ad_validto : {
				displayName : 'Valid To',
				headerStyle : styles.headerDark,
			},
			ad_fromtime : {
				displayName : 'Everyday From',
				headerStyle : styles.headerDark,
			},
			ad_totime : {
				displayName : 'Everyday To',
				headerStyle : styles.headerDark,
			}
		}

		const dataset = []

		for ( var key in list) {
			dataset.push({
				ad_title : list[key].ad_title,
				ad_url : list[key].ad_url,
				ad_file_url : list[key].ad_file_url,
				ad_validfrom : list[key].ad_validfrom,
				ad_validto : list[key].ad_validto,
				ad_fromtime : list[key].ad_fromtime,
				ad_totime : list[key].ad_totime
			});
		}
		cb(specification, dataset);
	});
}

function userExport(styles, cb) {
	const dataset = []

	firebase.database().ref('user-data').once('value').then(
			function(snapshot) {
				var list = snapshot.val();
				// Here you specify the export structure
				const specification = {
					firstName : {
						displayName : 'First Name',
						headerStyle : styles.headerDark,
					},
					city : {
						displayName : 'City',
						headerStyle : styles.headerDark,
					},
					// active_bids : {
					// displayName : 'Active Bids',
					// headerStyle : styles.headerDark,
					// },
					// active_posts : {
					// displayName : 'Active Posts',
					// headerStyle : styles.headerDark,
					// },
					created : {
						displayName : 'User Since',
						headerStyle : styles.headerDark,
					}
				}

				for ( var key in list) {
					var value = {
						firstName : "",
						city : "",
						// active_bids : 0,
						// active_posts : 0,
						created : "",
					};

					value.firstName = list[key].firstName;

					if ((typeof list[key].contactInfo != 'undefined')
							&& (list[key].contactInfo.city != '')) {
						value.city = list[key].contactInfo.city;
					}

					value.created = new Date(list[key].created);
					dataset.push(value);
				}

				cb(specification, dataset);
			});
}

function faqExport(styles, cb) {
	firebase.database().ref('faq').once('value').then(function(snapshot) {
		var list = snapshot.val();
		// Here you specify the export structure
		const specification = {
			question_en : {
				displayName : 'Question (EN)',
				headerStyle : styles.headerDark,
			},
			question_dk : {
				displayName : 'Question (DK)',
				headerStyle : styles.headerDark,
			},
			answer_en : {
				displayName : 'Answer (EN)',
				headerStyle : styles.headerDark,
			},
			answer_dk : {
				displayName : 'Answer (DK)',
				headerStyle : styles.headerDark,
			}
		}

		const dataset = []

		for ( var key in list) {
			dataset.push({
				question_en : list[key].question.en,
				question_dk : list[key].question.dk,
				answer_en : list[key].answer.en,
				answer_dk : list[key].answer.dk
			});
		}
		cb(specification, dataset);
	});
}

function announcesExport(styles, cb) {
	firebase
			.database()
			.ref('user-product')
			.once('value')
			.then(
					function(snapshot) {
						var list = snapshot.val();
						// Here you specify the export structure
						const specification = {
							brandName : {
								displayName : 'Brand Name (EN)',
								headerStyle : styles.headerDark,
							},
							price : {
								displayName : 'Price',
								headerStyle : styles.headerDark,
							},
							city : {
								displayName : 'City',
								headerStyle : styles.headerDark,
							},
							created : {
								displayName : 'Created Time',
								headerStyle : styles.headerDark,
							},
							description : {
								displayName : 'Description',
								headerStyle : styles.headerDark,
							}
						}

						const dataset = []

						for ( var key in list) {
							for ( var childKey in list[key]) {
								var value = {
									brandName : "",
									price : "",
									city : "",
									created : "",
									description : ""
								};

								if (typeof list[key][childKey] != "undefined") {

									if ((typeof list[key][childKey].brandName !== 'undefined')
											&& (list[key][childKey].brandName !== '')
											&& (typeof list[key][childKey].typeName !== 'undefined')
											&& (list[key][childKey].typeName !== '')) {
										value.brandName = list[key][childKey].brandName.en
												+ " "
												+ list[key][childKey].typeName.en;
									}
									value.price = list[key][childKey].price;

									if ((typeof list[key][childKey].contactInfo != 'undefined')
											&& (list[key][childKey].contactInfo.city != '')) {
										value.city = list[key][childKey].contactInfo.city;
									}

									value.created = new Date(
											list[key][childKey].created);

									value.description = list[key][childKey].description;

									dataset.push(value);
								}
							}
						}
						cb(specification, dataset);
					});
}

function categoryExport(styles, cb) {
	firebase.database().ref('category').once('value').then(function(snapshot) {
		var categoryList = snapshot.val();
		// Here you specify the export structure
		const specification = {
			id : {
				displayName : 'ID',
				headerStyle : styles.headerDark,
			},
			title_en : {
				displayName : 'Category Title (EN)',
				headerStyle : styles.headerDark,
			},
			title_dk : {
				displayName : 'Category Title (DK)',
				headerStyle : styles.headerDark,
			}
		}

		const dataset = []

		for ( var key in categoryList) {
			dataset.push({
				id : key,
				title_en : categoryList[key].en,
				title_dk : categoryList[key].dk
			});
		}
		cb(specification, dataset);
	});
}
