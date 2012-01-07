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
 * Date: 2010-11-18 10:27:25
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config: construct config pages.
 *
 */

;(function($) {
	$.widget("naxx.config_ping", $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Test',
				attr: {
					symbol: 'text:test'
				},
				callback: function(self){
					$(':naxx-config_ping').config_ping('ping');
					return false;
				}
			}
		],
		initOther: function(){
			var self = this, element = $(this.element);
			element.find('input.ip').ipaddress({cidr: false});
		},
		ping: function(){
			var self = this, element = $(this.element);
			if(!self.check()) return;
			var loader = $.pnotify({
							pnotify_title: '<span style="color: green;" symbol="text:test_processing">Test processing</span><img src="images/gif/stream-loader-3.gif" />',
							pnotify_addclass: 'stack-bottomright',
							pnotify_history: false,
							//pnotify_hide: false,
							pnotify_delay: 24000,
							pnotify_stack: stack_bottomright
			});
			$.naxx.teleport.System('ping '+$('#address', element).val()+' -c 3', function(data){
					if(data.output.search(' 100% packet loss')>=0)
					{
						var title = '<span style="color: red;" symbol="text:connection_test_result_fail">Connection test result: fail.</span>'
						var type = 'error';
					}
					else if(data.output.search(' 0% packet loss')>=0){
						var title = '<span style="color: green;" symbol="text:connection_test_result_success">Connection test result: success.</span>'
						var type = 'notice';
					}
					else
					{
						var title = '<span style="color: orange;" symbol="text:connection_test_result_unstable">Connection test result: unstable.</span>'
						var type = 'warn';
					}
					$.pnotify_remove_all();
					$.pnotify({
							pnotify_title: title,
							pnotify_addclass: 'stack-bottomright',
							pnotify_text: '<span>'+data.output.replace(/\n/g, '<br/>')+'</span>',
							pnotify_type: type,
							pnotify_history: false,
							//pnotify_hide: false,
							pnotify_stack: stack_bottomright
					});
			})
		}
	});
})(jQuery);
