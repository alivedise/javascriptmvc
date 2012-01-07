/* 
 * Copyright (c) 2010 Vivotek Inc. All rights reserved.
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
 * Date: 2010-11-18 11:00:24
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.emap: create emap block
 *
 */

;(function($) {
	$emap = $.widget("naxx-emap.minimap", {	//integrate with mouse event widget
		options : {
			map_path: ''
		},

		object : {
			$sourcemap : null,
			$screen : null,
			$minimap : null
		},

		reposMiniscreen : function(scale, bSmallShift)
		{
			var self = this, element = $(this.element);
			var leftTimer = - self.object.$sourcemap.position().left/self.object.$sourcemap.width();
			var topTimer = - self.object.$sourcemap.position().top/self.object.$sourcemap.height();

			$('.sizer', element).text(Number((scale+1)*100).toFixed(2)+'%');
			$('.slider', element).slider('value', scale*100);

			if (bSmallShift != null && bSmallShift)
			{
				self.object.$screen.css({top : 100*topTimer+'%', left : 100*leftTimer+'%'})
					.width(100*1/(1+scale)+'%')
					.height(100*1/(1+scale)+'%');
			}
			else
			{
				this.object.$screen.stop().animate({
					top:  100*topTimer+'%',
					left: 100*leftTimer+'%',
					width:  100/(scale+1)+'%',
					height:  100/(scale+1)+'%'});
			}
		},

		refresh: function(){
			var self = this, element = $(this.element);
			this.options.map_path = self.object.$sourcemap.emap('option', 'map_path');
		},
		
		/*Overriding initial function*/
		_init : function() {
    		var self = this, element = $(this.element);
			element.addClass('ui-corner-all minimap').append('<img class="miniback" src='+this.options.map_path+' /><div class="miniscreen ui-corner-all" symbol="title:drag_emap_view"></div>');

			this.object.$minimap = element.find('.minimap');
			this.object.$sourcemap = $('.emapback');
			this.object.$screen = element.find('.miniscreen');

			$('<span></span>').vivobutton({
				name: 'show',
				type: 'emappip',
				attr: {
					symbol: 'title:show_minimap'
				},
				callback: function(self, element)
				{
					$(':naxx-emap-minimap').animate({width: 210, height: 180});
					$(':naxx-vivobutton.hide').show();
					element.hide();
					return false;
				}
			}).appendTo(element);
			
			$('<span></span>').vivobutton({
				name: 'hide',
				type: 'emappip',
				attr: {
					symbol: 'title:hide_minimap'
				},
				callback: function(self, element)
				{
					$(':naxx-emap-minimap').animate({width: 20, height: 20});
					$(':naxx-vivobutton.show').show();
					element.hide();
					return false;
				}
			}).appendTo(element);

			this.object.$screen.draggable({
				cursor: 'move',
				containment: '.minimap',
				stop : function (e, ui){
					var leftDiffer = $(this).position().left;
					var topDiffer = $(this).position().top;
					var leftTimer = self.object.$sourcemap.width()/element.width();
					var topTimer = self.object.$sourcemap.height()/element.height();
					self.object.$sourcemap.stop().animate({left : -leftTimer*leftDiffer, top: -topTimer*topDiffer});
				}
			}).css('position', 'absolute');

			element.show();
    	}
   });
})(jQuery);
