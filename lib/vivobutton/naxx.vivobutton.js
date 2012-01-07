/* # 
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
 * Date: 2011-04-26 13:20:27
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.vivobutton : create vivobuttons
 *
 */

;(function($) {
	$.widget("naxx.vivobutton", {
		options : {
			callback: null,
			deactive_callback: null,
			subjector: '',
			type: '',
			text: '',
			attr: {
			},
			name: '',
			status: 'normal',
			control: null,
			initStatus: 'normal',
			symbols: {
				active_symbol: '',
				normal_symbol: '',
				disable_symbol: ''
			},
			animate: false//control target selector
		},

		_create : function(){
			var self = this, element = $(this.element);
			if (self.options.text != '')
			{
				element.append('<div class="vivotext">'+self.options.text+'</div>');
			}
			if (typeof(self.options.attr.symbol) != 'undefined')
			{
				if(self.options.attr.symbol.split(':')[0] == 'title')
				{
					element.attr('title', $.naxx.stranslate(self.options.attr.symbol.split(':')[1]));
				}
			}
			element.addClass('normal')
			.addClass(self.options.type)
			.addClass(self.options.name)
			.attr(self.options.attr)
			.data('status', 'normal')
			.hover(function(){
				if( element.data('status') == 'disable' ) return false;
				element.removeClass('normal active');
				element.addClass('hover');
			},
			function(){
				if( element.data('status') == 'disable' || element.hasClass('disable')){
					element.data('status', 'disable');
					element.addClass('disable');
					element.removeClass('hover active');
					return false;
				}
				element.removeClass('hover');
				if( element.data('status') == 'normal' )
					element.addClass('normal');
				else if( element.data('status') == 'active' )
					element.addClass('active');
			});

			element.mousedown(function(){
				if( element.data('status') == 'disable' ) return false;
				if( element.data('status') == 'active' && self.options.deactive_callback == false ) return false;
				var status = element.data('status');
				$(self.options.subjector).removeClass('active').addClass('normal').data('status', 'normal');
				element.removeClass('normal hover active');
				element.addClass('press');                
				element.data('status', status);
			})
			.mouseup(function(){
				if( element.data('status') == 'disable' ) return false;
				if( element.data('status') == 'active' && self.options.deactive_callback == false ) return false;
				element.removeClass('press');
				if( element.data('status') == 'normal'){
					element.addClass('active').data('status', 'active');
					if(self.options.symbols.active_symbol != '')
						element.attr('symbol', self.options.symbols.active_symbol);
					if(self.options.callback == null || self.options.callback(self, element) == false)
					{
						element.removeClass('normal active').addClass('normal');
						element.data('status', 'normal');
					}
				}
				else if(element.data('status') == 'active'){ 
					if(self.options.symbols.normal_symbol != '')
						element.attr('symbol', self.options.symbols.active_symbol);
					element.addClass('normal').data('status', 'normal');
					if(self.options.deactive_callback == null) return;
					self.options.deactive_callback(self, element);
				}
			})
			if(self.options.callback != null)
			element.click(function(){
					return false;
			});
		},

		disable : function(){
			var self = this, element = $(this.element);
			if(self.options.animate && element.data('status')!='disable')
			{
				element.removeClass('normal').addClass('disable').css({opacity: 0});
				element.stop().animate({opacity: '1'}, 2000);
			}
			else
				element.removeClass('normal').addClass('disable');
			element.data('status', 'disable');
			if(self.options.symbols.disable_symbol != '')
				element.attr('symbol', self.options.symbols.disable_symbol);
			if(self.options.symbols.disable_symbol != '')
			{
				element.attr('symbol', self.options.symbols.disable_symbol);
				element.attr('title', $.naxx.stranslate(self.options.symbols.disable_symbol.split(':')[1]));
			}
		},
		
		enable : function(){
			var self = this, element = $(this.element);
			if(self.options.animate && element.data('status')!='normal')
			{
				element.removeClass('disable').addClass('normal').css({opacity: 0});
				element.stop().animate({opacity: '1'}, 2000);
			}
			else
				element.removeClass('disable active').addClass('normal');
			element.data('status', 'normal');
			if(self.options.symbols.normal_symbol != '')
			{
				element.attr('symbol', self.options.symbols.normal_symbol);
				element.attr('title', $.naxx.stranslate(self.options.symbols.normal_symbol.split(':')[1]));
			}
		},

		active: function(){
			var self = this, element = $(this.element);
			try{
				$(self.options.subjector).vivobutton('deactive');
			}
			catch(e)
			{
			}
			element.data('status', 'active').removeClass('hover normal press disable').addClass('active');
			if(self.options.symbols.active_symbol != '')
				element.attr('symbol', self.options.symbols_active_symbol);
		},

		deactive: function(){
			var self = this, element = $(this.element);
			if (element.data('status') == 'disable') return;
			element.data('status', 'normal').removeClass('hover active press disable').addClass('normal');
		},
		
		destroy : function(){
			$(this.element).children().unbind().remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
		},


		_init : function(){
			var self = this, element = $(this.element);
			switch(self.options.initState)
			{
				case 'normal':
				case 'active':
				case 'disable':
					element.removeClass('normal,disable,active,hover,press').addClass(self.options.initState);
					element.data('status', self.options.initState);
					if(self.options.symbols.disable_symbol != '')
					{
						element.attr('symbol', self.options.symbols.disable_symbol);
						element.attr('title', $.naxx.stranslate(self.options.symbols.disable_symbol.split(':')[1]));
					}
					break;
				default:
					element.removeClass('normal,disable,active,hover,press').addClass('normal');
					element.data('status', 'normal');
					if(self.options.symbols.normal_symbol != '')
					{
						element.attr('symbol', self.options.symbols.normal_symbol);
						element.attr('title', $.naxx.stranslate(self.options.symbols.normal_symbol.split(':')[1]));
					}
					break;
			}

		}

	});
})(jQuery);
