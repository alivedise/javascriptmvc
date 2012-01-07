steal('jquery/controller', 'jquery/view/ejs', 'mxui/layout/modal', 'mxui/layout/block', 'steal/less', 'mxui/form/input_watermark', 'lib/jquery-ui.js').then('./form.less').then('./views/init.ejs', function( $ ) {

	/**
	 *
	 * @class Naxx.Login.Form
	 *  
	 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
	 *
	 * Date: 2012-01-07 10:08:31
	 * Author: Alive Kuo (alive.kuo at vivotek.com, alegnadise at gmail.com)
	 *
	 */
	$.Controller('Naxx.Login.Form',
	/** @Static */
	{
		defaults: {}
	},
	/** @Prototype */
	{
		init: function() {
			this.element.html("//naxx/login/form/views/init.ejs", {
				message: "Hello World"
			}).mxui_layout_modal({
				overlay: true,
				of: $('#desktop')
			});
			$('#username').mxui_form_input_watermark({
				defaultText: 'username'
			});
			$('#password').mxui_form_input_watermark({
				defaultText: 'password'
			});
			$('#button').button();
		},
		'resize': function() {
			this.element.mxui_layout_modal('move');
		}
	})

});