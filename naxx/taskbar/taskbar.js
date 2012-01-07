steal('jquery/controller', 'jquery/view/ejs', 'lib/jquery-ui.js', 'steal/less').then('./taskbar.less').then('./views/init.ejs', function( $ ) {

	/**
	 *
	 * @class Naxx.Taskbar
	 *  
	 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
	 *
	 * Date: 2012-01-07 10:08:31
	 * Author: Alive Kuo (alive.kuo at vivotek.com, alegnadise at gmail.com)
	 *
	 */
	$.Controller('Naxx.Taskbar',
	/** @Static */
	{
		defaults: {}
	},
	/** @Prototype */
	{
		init: function() {
			this.element.html("//naxx/taskbar/views/init.ejs", {
				message: "Hello World"
			});
			$('#languageselector').button();
		}
	})

});