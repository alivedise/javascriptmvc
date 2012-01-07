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
	$.widget("naxx.config_update", $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Upload',
				attr: {
					symbol: 'text:upgrade'
				},
				callback: function(self, element){
					$(':naxx-config_update').config_update('upgrade', false);
					return false;
				}
			}
		],
		upload: null,
		initOther: function(){
			var self = this, element = $(this.element);
			var count = 0;
			$('#upgrade').button();
			$.naxx.teleport.Export($.naxx.path.raphael, function(res){
				$.extend($.naxx.raphael, res);
			});
			self.upload = $('#upgrade').upload({
					name: 'send_file',
					param: {'send_path': 'firmware.img'},
					action: '/fcgi-bin/system.upgrade',
					autoSubmit: false,
					enctype: 'multipart/form-data',
					onSelect: function(){
						var a = self.upload.filename().split('\'');
						if(a.length == 0) var filename = self.upload.filename()
						else var filename = a[a.length-1];
					$('#localname').text(filename);
						//$('#upgrade').val($.naxx.stranslate('select_firmware_file')+':'+self.upload.filename());
						//$('#upgrade').button('refresh').width('auto');
					},
					onComplete: function(result){
							var result = eval('('+result+')');
								if(result.result)
								{
									count = 0;
									$.unblockUI();
									$.naxx.blockWarn('<div id="desc" symbol="text:system_is_rebooting_you_will_be_redirected_to_web_page_after_120_sec">System is rebooting. You will be redirected to web page after 120 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'</a></u></a></div><div class="countdown"></div>');
									$('.countdown').progressbar({value: 0});
									i2 = setInterval(function(){
										count+=1;
										$('#desc').html($.naxx.stranslate('system_is_rebooting_you_will_be_redirected_to_web_page_after')+' '+(120-parseInt(count*1.2, 10))+$.naxx.stranslate('s'));
										$('.countdown').progressbar('option', 'value', count);
										if(count>=100)
										{
											$.unblockUI();
											window.location.href = '';
										}
									}, 1000/1.2);
								}
								else
								{
									$.unblockUI();
									$.pnotify({
										pnotify_title: '<span symbol="text:server_fail">Operation failed.</span>',
										pnotify_type: 'error',
										pnotify_text: '<span symbol="text:server_is_down_now"></span>',
										pnotify_addclass: 'stack-bottomright',
										pnotify_history: false,
										pnotify_stack: stack_bottomright
									});
								}
					}
				});
		},

		upgrade: function(){
			var self = this, element = $(this.element);
			if(self.upload!=null)
			{
				$.naxx.blockWarn('<span>Uploading</span><img src="images/gif/comet_progress.gif" />');
				if(self.upload.filename() == '')
				{
					$.blockWarn('<span symbol="text:please_select_a_firmware_file_first"></span><button id="ok" symbol="text:ok"></span');
					$('#ok').addlClass('block').button().clicl(
						function(){
							$.unblockUI();
						}
					);
				}
				else
					self.upload.submit();
			}
		}
	});
})(jQuery);
