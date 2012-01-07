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
	$.widget("naxx.config_shutdown", $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Reboot',
				attr: {
					symbol:'text:reboot'
				},
				callback: function(){
					$.naxx.blockWarn('<div><span symbol="text:do_you_really_want_to_reboot_the_nvr">Do you really want to reboot the NVR?</span></div><button id="reboot" class="block" symbol="text:reboot"></button><button id="cancel" class="block" symbol="text:no"></button>');
					$('#reboot').button().click(function(){
						$.naxx.teleport.Exec($.naxx.path.raphael, 'exec_reboot', '', function(){
								var count = 0;
								$.unblockUI();
								$.naxx.blockWarn('<div id="desc" symbol="text:system_is_rebooting_you_will_be_redirected_to_web_page_after_120_sec">System is rebooting. You will be redirected to web page after 120 sec..</div><div>Click here to go to web page directly. <a href="http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'</a></div><div class="countdown"></div>');
								$('.countdown').progressbar({value: 0});
								i2 = setInterval(function(){
									count+=1;
									$('#desc').html($.naxx.stranslate('system_is_rebooting_you_will_be_redirected_to_web_page_after')+' '+(120-parseInt(count*1.2, 10))+$.naxx.stranslate('s'));
									$('.countdown').progressbar('option', 'value', count);
									if(count>=100)
									{
										$.unblockUI();
										document.location.assign('http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port);
									}
								}, 1000/1.2);
						}, function(){

						});
					});

					$('#cancel').button().click(function(){$.unblockUI()});
				}
			},
			{
				type: 'settingBtn',
				text: 'Reload',
				attr: {
					symbol:'text:reload'
				},
				callback: function(){
					$(':naxx-config_shutdown').config_shutdown('reload');
					return false;
				}
			}
		],
		initOther: function(){
			$.naxx.teleport.Export($.naxx.path.raphael, function(res){
				$.extend($.naxx.raphael, res);
			});
		},
		reload: function(){
			var self = this, element = $(this.element);
			$('span[name]', element).html('<img src="images/gif/pnotify-loader.gif" />');
			$.naxx.teleport.Exec($.naxx.path.raphael, 'exec_psutil', '', function(data){
				$('span[name]', element).html('-');
				$.each(data, function(name, value){
					$('span[name='+name+']').html(value);
				});
			});
		}
	});
})(jQuery);
