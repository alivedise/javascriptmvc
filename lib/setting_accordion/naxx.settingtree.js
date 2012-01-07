/* # 
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
 * Date: 2010-12-15 10:20:52
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.cameratree: use jquery treeview to generate a camera tree.
 *
 */

;(function($) {
	$.widget("naxx.settingtree", {
		/*Initial options Value of Layout*/
		options: {
			utility: ''
		},

		object: {
			$timer: null
		},
		
		_init : function(){
			var self = this;
			var element = $(this.element);

			element.addClass('settingtree');
			this.insertConfig();
		},

		destroy: function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.accordion('destroy');
			element.removeClass('settingtree').children().remove();
		},

		active: function(classid, spellid){
			var self = this, element = $(this.element);
			element.find('.ability').removeClass('ui-state-active');
			element.find('.ability[classid='+classid+'][spellid='+spellid+']').addClass('ui-state-active');
		},

		refresh: function(){
			var self = this, element = $(this.element);

			if(!element.hasClass('ui-accordion'))
			{
				element.accordion({
					clearStyle: true,
					autoHeight: false,
					collapsible: true,
					active: false
				});
				$('h3#settings_overview', element).unbind('click').bind('click', function(){
					if($.naxx.modified) {
						$.naxx.blockWarn('<span symbol="text:you_have_unsaved_change_to_settings_do_you_really_want_to_leave"></span><br/><button id="savenow" symbol="text:save_now"></button><button symbol="text:discard" id="discard" class="block"></button><button symbol="text:cancel" id="cancel" class="block"></button>');
						$('#discard').button().click(function(){
								$.naxx.modified = false;
								$('#settings_overview').trigger('click');
						});
						$('#cancel').button().click(function(){
								$.unblockUI();
						});
						return false;
					}
					$(this).addClass('ui-state-active').removeClass('ui-state-default').append('<span class="arrow" />');
					$('div.ability', element).removeClass('casting').find('.arrow').remove();
					$(':naxx-settings').settings();
				});
				$('h3#settings_overview').addClass('ui-state-active').removeClass('ui-state-default').append('<span class="arrow" />');
			}
		},

		insertConfig : function(){
			var self = this;
			var element = $(this.element);
			element.append('<h3 id="settings_overview"><a href="#"><span symbol="text:settings_overview"></span></a></h3><div class="content"></div>');
			for (var i = 0; i < self.options.utility.length; i++)
			{
				if (typeof(self.options.utility[i]) == 'undefined') continue;
				var $utility = self.options.utility[i];

				element.append('<h3><a href="#"><span class="'+self.options.utility[i].icon+' set_icon" index="'+i+'"></span><span symbol="'+$utility.symbol+'">'+$utility.content+'</span></a></h3><div class="content"></div>');
				for(var j = 0 ; j < $utility.ability.length; j++)
				{
					$('<div href="#" class="ability" classid="'+i+'" spellid="'+j+'"><span symbol="'+$utility.ability[j].symbol+'">'+$utility.ability[j].name+'</span></div>').appendTo(element.find('div.content').eq(i+1));
				}
			}

			element.find('.ability').mousedown(
				function(){
					var abi = $(this);
					if( $.naxx.modified && !$.naxx.discard && $('.settingCell div.clear').data('widget') && $('.settingCell div.clear').data('widget').modelChanged() ) {
						$.naxx.blockWarn('<span symbol="text:you_have_unsaved_change_to_settings_do_you_really_want_to_leave"></span><br/><button class="block" id="savenow" symbol="text:save_now" /></button><button symbol="text:discard" id="discard" class="block"></button><button symbol="text:cancel" id="cancel" class="block"></button>');
						$('#savenow').button().click(function(){
								$.naxx.discard = true;
								$('.settingCell div.clear').data('widget').apply();
								$.unblockUI();
						});
						$('#discard').button().click(function(){
								$.naxx.discard = true;
								abi.trigger('mousedown');
								$.naxx.discard = false;
						});
						$('#cancel').button().click(function(){
								$.unblockUI();
						});
						return false;
					}
					$.naxx.discard = false;
					$('h3#settings_overview', element).removeClass('ui-state-active').addClass('ui-state-default').find('.arrow').remove();
					$('div.ability', element).removeClass('casting').find('.arrow').remove();
					$(this).addClass('casting').append('<span class="arrow" />');
					$(':naxx-settings').settings('cast', $(this));
				}
			);

			self.refresh();
		}
	});
})(jQuery);
