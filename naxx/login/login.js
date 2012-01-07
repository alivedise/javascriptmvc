steal('jquery/controller', 'jquery/view/ejs', 'naxx/models', 'naxx/login/form', 'naxx/taskbar', 'mxui/layout/split', 'external/layout', 'mxui/layout/fill').then('./login.less').then('./views/init.ejs', function( $ ) {

	/**
	 * @class Naxx.Login
	 *
	 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
	 *
	 * Date: 2012-01-07 10:13:37
	 * Author: Alive Kuo (alive.kuo at vivotek.com, alegnadise at gmail.com)
	 *
	 */
	$.Controller('Naxx.Login',
	/** @Static */
	{
		defaults: {},
		xml: null
	},
	/** @Prototype */
	{
		init: function() {
			var self = this;
			$.ajax({
				url: 'translator.xml',
				dataType: 'xml'
			}).done(function( xml ) {
				self.xml = xml;
				Naxx.Models.User.login('', function() {}, function() {
					steal.dev.log('login fail');
					//self.element.html("//naxx/login/views/init.ejs",{}).mxui_layout_fill({parent: document.body}).resize().mxui_layout_split().resize(function(){$('#taskbar').height(54)}).find('.splitter').remove().layout({
					self.element.html("//naxx/login/views/init.ejs", {}).mxui_layout_fill().layout({
						slidable: false,
						closable: false,
						south__size: 54,
						south__paneSelector: '#taskbar',
						center__paneSelector: '#desktop',
						spacing_open: 0,
						showOverflowOnHover: false,
						spacing_closed: 0,
						center__onresize_end: function() {
							$('#desktop').resize();
						}
					});
					$('#login_form').naxx_login_form();
					$('#taskbar').naxx_taskbar();
				});
			});
		}
	})

});