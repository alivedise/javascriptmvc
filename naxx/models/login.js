steal('jquery/model', function() {

	/**
	 * @class Naxx.Login
	 * @parent index
	 * @inherits jQuery.Model
	 * Wraps backend login services.  
	 *  
	 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
	 *
	 * Date: 2012-01-07 10:31:31
	 * Author: Alive Kuo (alive.kuo at vivotek.com)
	 *
	 */
	$.Model('Naxx.Login',
	/* @Static */
	{
		findAll: function( param, success, error ) {
			$.ajax({
				url: '/fcgi-bin/system.login',
				data: param,
				success: success,
				error: error
			});
		},
		findOne: "/logins/{id}.json",
		create: "/logins.json",
		update: "/logins/{id}.json",
		destroy: "/logins/{id}.json"
	},
	/* @Prototype */
	{});

})