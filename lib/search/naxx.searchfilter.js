/* 
 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
 *
 * +-----------------------------------------------------------------+
 * | THIS SOFTWARE IS FURNISHED UNDER A LICENSE AND MAY ONLY BE USED |
 * | AND COPIED IN ACCORDANCE WITH THE TERMS AND CONDITIONS OF SUCH  |
 * | A LICENSE AND WITH THE INCLUSION OF THE THIS COPY RIGHT NOTICE. |
 * | THIS SOFTWARE OR ANY OTHER COPIES OF THIS SOFTWARE MAY NOT BE   |
 * | PROVIDED OR OTHERWISE MADE AVAILABLE TO ANY OTHER PERSON. THE   |
 * | OWNERSHIP AND TITLE OF THIS SOFTWARE IS NOT TRANSFERRED.        |
 * |                                                                 |
 * | THE INFORMATION IN THIS SOFTWARE IS SUBJECT TO CHANGE WITHOUT   |
 * | ANY PRIOR NOTICE AND SHOULD NOT BE CONSTRUED AS A COMMITMENT BY |
 * | VIVOTEK INC.                                                    |
 * +-----------------------------------------------------------------+
 *
 * Date: 2011-05-21 16:11:58
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.eventlist.js: create eventlist
 *
 */

;(function($) {
	$.widget("naxx.searchfilter", {
		options : {
			channel: 0,
			event_data: []
		},
		
		_create : function(){
			var self = this, element = $(this.element);
			element.addClass('searchfilter');
			element.append('<div class="container"><div><span symbol="text:Filter"></span></div><hr/><div><span symbol="text:event_type"></span></div><div><span symbol="text:channel"></span><hr/></div><div><span symbol="text:time"></span><hr/></div><div></div></div>');
		},

		_init : function(){
			var self = this, element = $(this.element);
		},

		match : function(){
			var self = this, element = $(this.element);
		},

		toggle : function(){
		},
	
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.children().remove();
			element.removeClass('searchfilter');
		}
	});
})(jQuery);
