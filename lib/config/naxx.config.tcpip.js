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
	$.widget("naxx.config_tcpip", $.naxx.config, {
		buttons:[{
			type: 'settingBtn',
			text: 'Save',
				attr: {
					symbol: 'text:save'
				},
			callback: function(self){
				$(':naxx-config_tcpip').config_tcpip('savePost');
				return false;
			}
		}],
		savePost: function(){
			var self = this, element = $(this.element);
			var count = 0;
			var model = self.getCurrentModel();


			var max = 30;
			if(model['type'] == 'static')
			{
				$('#address').addClass('needed');
				$('#netmask').addClass('needed');
				$('#gateway').addClass('needed');
			}
			else
			{
				$('#address').removeClass('needed');
				$('#netmask').removeClass('needed');
				$('#gateway').removeClass('needed');
			}
			if(model['eth1_type'] == 'static')
			{
				$('#eth1_address').addClass('needed');
				$('#eth1_netmask').addClass('needed');
				$('#eth1_gateway').addClass('needed');
			}
			else
			{
				$('#eth1_address').removeClass('needed');
				$('#eth1_netmask').removeClass('needed');
				$('#eth1_gateway').removeClass('needed');
			}
			if(self.check()){
				if(model['bonding_type'] == 'dual') 
				{
					if(model['type'] == 'dynamic' && model['eth1_type'] == 'dynamic')
					{
						var desc = '<div id="desc" symbol="text:network_is_reseting_please_wait_a_while_and_use_IW2_to_search_this_server_again"></div><span symbol="text:mac_address"></span><span>:</span><span>'+$.naxx.raphael.network.mac+'</span><button id="ok" class="block" symbol="text:ok" />';
					}
					else if(model['type'] == 'static')
					{
						var desc = '<div id="desc" symbol="text:network_is_reseting_you_will_be_redirected_to_web_page_after_30_sec">Network is reseting. You will be redirected to web page after 30 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+model['address']+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+model['address']+':'+$.naxx.raphael.network.protocol.http_port+'</a></u></b></div><div class="countdown"></div>';
					}
					else if(model['eth1_type'] == 'static')
					{
						var desc = '<div id="desc" symbol="text:network_is_reseting_you_will_be_redirected_to_web_page_after_30_sec">Network is reseting. You will be redirected to web page after 30 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+model['eth1_address']+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+model['eth1_address']+':'+$.naxx.raphael.network.protocol.http_port+'</a></u></b></div><div class="countdown"></div>';
					}
				}
				else
				{
					if(model['type'] == 'dynamic')
					{
						var desc = '<div id="desc" symbol="text:network_is_reseting_please_wait_a_while_and_use_IW2_to_search_this_server_again"></div><span symbol="text:mac_address"></span><span>:</span><span>'+$.naxx.raphael.network.mac+'</span><button id="ok" class="block" symbol="text:ok" />';
					}
					else
					{
						var desc = '<div id="desc" symbol="text:network_is_reseting_you_will_be_redirected_to_web_page_after_30_sec">Network is reseting. You will be redirected to web page after 30 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+model['address']+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+model['address']+':'+$.naxx.raphael.network.protocol.http_port+'</a></u></b></div><div class="countdown"></div>';
					}
				}
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
							document.location.assign('http://'+model['address']+':'+$.naxx.raphael.network.protocol.http_port);
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
		initOther: function(){
			var self = this, element = $(this.element);
			$('[name=bonding_type]').change(function(){
				var value = $('[name=bonding_type]:checked').val();
				switch(value)
				{
				case 'dual':
					$('#eth1').show();
					$('[name=eth0]').attr('symbol', 'text:lan_1');
					break;
				default:
					$('#eth1').hide();
					$('[name=eth0]').attr('symbol', 'text:general_settings');
					break;
				}
				$.naxx.translate();
			});
			$('[name=type]').change(function(){
				var value = $('[name=type]:checked').val();
				switch(value)
				{
				case 'dynamic':
					$('.eth0').siblings('.ip_container').find('input').attr('readonly', 'readonly');
					break;
				default:
					$('.eth0').siblings('.ip_container').find('input').attr('readonly', false);
					break;
				}
			});
			$('[name=eth1_type]').change(function(){
				var value = $('[name=eth1_type]:checked').val();
				switch(value)
				{
				case 'dynamic':
					$('.eth1').siblings('.ip_container').find('input').attr('readonly', 'readonly');
					break;
				default:
					$('.eth1').siblings('.ip_container').find('input').attr('readonly', false);
					break;
				}
			});
			$.naxx.teleport.Export($.naxx.path.raphael, function(res){
				$.extend($.naxx.raphael, res);
			});
			$('[name=bonding_type]', element).trigger('change');
			$('[name=eth1_type]', element).trigger('change');
			$('[name=type]', element).trigger('change');
		},
		reloadPrivate: function(res){
			var self = this, element = $(this.element);
			$('[name=bonding_type]', element).trigger('change');
			$('[name=eth1_type]', element).trigger('change');
			$('[name=type]', element).trigger('change');
			self.object.model = res; 
			$('input.ip', element).ipaddress({cidr: false});
		}

	});
})(jQuery);
