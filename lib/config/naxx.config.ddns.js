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
	$.widget("naxx.config_ddns", $.naxx.config, {
		options: {
			accept: 0
		},
		symbols: {
			'10': 'ddns_msg_hostname_in_use',
			'12': 'ddns_msg_incorrect_email',
			'8': 'ddns_msg_invalid_hostname',
			'10': 'ddns_msg_hostname_in_use',
			'9': 'ddns_msg_invalid_mac',
			'5': 'ddns_msg_invalid_server',
			'0': 'ddns_msg_register_successfully',
			'13': 'ddns_msg_other_errors',
			'16': 'ddns_msg_timeout'
		},
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_ddns').config_ddns('save');
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Register',
				attr: {
					symbol: 'text:register'
				},
				callback: function(self, element){
					$(':naxx-config_ddns').config_ddns('showRegister');
					return false;
				}
			}
		],
		showRegister: function(){
			var self = this, element = $(this.element);
			self.createRegister();
			$.naxx.block('#license');
			$('#accept').show();
			$('#register').hide();
			$('#agreement').show();
			$('#registerment').hide();
		},
		register: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.raphael, 'exec_ddns_register', $('#register_form').serialize(), function(res){
				$('#register_result').html($.naxx.stranslate(self.symbols[res]));
				$('#ddns_result').show();
			});
		},
		forgot_key: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.raphael, 'exec_ddns_forgot_key', $('#register_form').serialize(), function(res){
				$('#register_result').html($.naxx.stranslate(self.symbols[res]));
				$('#ddns_result').show();
			});
		},
		/*
		 * confirmkey111
		 * customenable0
		 * emailaaa@bbbccc.ddd
		 * hostname123
		 * key111
		 * methodregister
		 * servername
		 */
		createRegister: function(){
			var self = this, element = $(this.element);
			if($('#license', element).length == 0)
			{
				$('<div class="blockform" id="license"><form id="register_form"><fieldset id="agreement"><legend symbol="text:legal_agreement"></legend><iframe  width="100%" height="400" frameborder="0" style="margin:15px 0 15px 0;" src="setting/license.html" name="license"></iframe></fieldset><fieldset id="registerment"><legend symbol="text:register"></legend>'+
						'<div>'+
							'<label for="hostname" symbol="text:host_name"></label><input type=text id="hostname" name="hostname" size=128 /><span>.safe100.net</span>'+
						'</div>'+
						'<div>'+
							'<label for="email" symbol="text:email"></label><input type=text id="email" name="email" />'+
						'</div>'+
						'<div>'+
							'<label for="key" symbol="text:key"></label><input type=password id="key" name="key" size=64 /><button id="forgot_key" class="block" symbol="text:forgot_key" TabIndex=-1 />'+
						'</div>'+
						'<div>'+
							'<label for="confirmkey" symbol="text:confirm_key"></label><input type=password id="confirmkey" name="confirmkey" size=64 />'+
						'</div>'+
						'<div class="hidden">'+
							'<label for="method"></label><input type=text id="method" name="method" value="register" />'+
						'</div>'+
						'<div class="hidden">'+
							'<label for="customenable"></label><input type=text id="customenable" name="customenable" value=0 />'+
						'</div>'+
						'<div class="hidden">'+
							'<label for="servername"></label><input type=text id="servername" name="servername" value="register" />'+
						'</div>'+
						'</fieldset>'+
						'<fieldset id="ddns_result">'+
							'<legend symbol="text:ddns_message"></legend>'+
								'<div id="register_result"></div>'+
						'</fieldset>'+
						'</form><button id="accept" symbol="text:accept"></button><button id="register" symbol="text:register"></button><button id="cancel" symbol="text:cancel"></button>').appendTo(element);
				$('#registerment').hide();
				$('#ddns_result').hide();
				$('#cancel').addClass('block').button().click(function(){
					$.unblockUI();
				});
				$('#accept').addClass('block').button().click(function(){
					self.options.accept = 1;
					$('#agreement').hide();
					$('#accept').hide();
					$('#register').show();
					$('#registerment').show();
				});
				$('#register').addClass('block').button().hide().click(function(){
					self.register();
				});
				$('#forgot_key').addClass('block').button().click(function(){
					self.forgot_key();
				});
			}
		},
		initOther: function(){
			var self = this, element = $(this.element);
			$('#ddns_provider').change(function(){
					switch($(this).val())
					{
					case 'Safe100':
						self.register();
						break;
					}
			});
		}
	});
})(jQuery);
