steal('jquery/model', function() {

	/**
	 * @class Naxx.Models.Accesslist
	 * @parent index
	 * @inherits jQuery.Model
	 * Wraps backend accesslist services.  
	 */
	$.Model('Naxx.Models.Accesslist',
	/* @Static */
	{
		findAll: "/accesslists.json",
		findOne: "/accesslists/{id}.json",
		create: "/accesslists.json",
		update: "/accesslists/{id}.json",
		destroy: "/accesslists/{id}.json"
	},
	/* @Prototype */
	{});

})