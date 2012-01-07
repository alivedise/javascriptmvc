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
	$.widget("naxx.config_protocol", $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_protocol').config_protocol('savePost');
					return false;
				}
			}
		],

		savePost: function(){
			var self = this, element = $(this.element);
			var count = 0;
			var model = self.getCurrentModel();

			var max = 30;
			if(self.check()){
				var desc = '<div id="desc" symbol="text:network_is_reseting_you_will_be_redirected_to_web_page_after_30_sec">Network is reseting. You will be redirected to web page after 30 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+window.location.hostname+':'+model.http_port+'">http://'+window.location.hostname+':'+model.http_port+'</a></u></b></div><div class="countdown"></div>';
				$.naxx.blockWarn(desc);
			
				if($('.countdown').length>0)
				{
					$('.countdown').progressbar({value: 0});
					i2 = setInterval(function(){
						count+=1;
						$('#desc').html($.naxx.stranslate('network_is_reseting_you_will_be_redirected_to_web_page_after')+' '+(30-count)+$.naxx.stranslate('s'));
						try
						{
							$('.countdown').progressbar('option', 'value', count*3.33333);
						}
						catch(e)
						{
						
						}
						if(count>=30)
						{
							clearInterval(i2);
							document.location.assign('http://'+window.location.hostname+':'+model.http_port);
						}
					}, 1000);
				}
				$.naxx.teleport.Import($.naxx.path.raphael+self.options.path, model,
				function(){
				},
				function(res){
						clearInterval(i2);
						$.unblockUI();
						$.pnotify({
							pnotify_title: '<span symbol="text:saving_error">Saving error!</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_type: 'error',
							pnotify_text: res.responseText,
							pnotify_history: false,
							pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
						});
				});
			}
			else
			{
				$.blockWarn('<div symbol="text:there_is_something_wrong_in_the_form_please_check_it_again"></div><button id="ok" class="block" symbol="text:ok" />');
			}
			$('#ok').button().click(function(){
				$.unblockUI();
			});
		},

		validate: function(){
			var self = this, element = $(this.element);
			var pass = true;

			if( ($('#http_port').val() == '') || ($('#http_port').val() < 1025 && $('#rtsp_port').val() != 80) || $('#http_port').val()>65535 || $('#http_port').val() == $('#rtsp_port').val() || $('#http_port').val() == $.naxx.raphael.network.relay_port)
			{
				self.addAlertIcon($('#http_port'));
				pass = false;
			}
			else
			{
				self.removeAlertIcon($('#http_port'));
			}
			if(($('#http_port').val() == '') || ($('#rtsp_port').val() < 1025 && $('#rtsp_port').val() != 554) || $('#rtsp_port').val()>65535 || $('#rtsp_port').val() == $('#http_port').val() || $('#rtsp_port').val() == $.naxx.raphael.network.relay_port)
			{
				self.addAlertIcon($('#rtsp_port'));
				pass = false;
			}
			else
			{
				self.removeAlertIcon($('#rtsp_port'));
			}
			return pass;
		},

		reloadPrivate: function(){
			$.naxx.teleport.Export($.naxx.path.raphael+'/network', function(res){
				$.naxx.raphael['network'] = res;
			});
		},

		initOther: function(){
			var self = this, element = $(this.element);
			$('#http_port').keydown(function(event){
				if(!isNumericKey(event)) return false;
			}).keyup(function(event){
				if($(this).val()>65535)
				{
					$(this).val(65535).trigger('change').select();
				}
				self.validate();
			}).change(function(){
				self.validate();
			});
			$('#rtsp_port').keydown(function(event){
				if(!isNumericKey(event)) return false;
			}).keyup(function(event){
				if($(this).val()>65535)
				{
					$(this).val(65535).trigger('change').select();
				}
				self.validate();
			}).change(function(){
				self.validate();
			});
		}
	});
})(jQuery);
