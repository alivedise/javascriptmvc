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
	$.widget("naxx.config_backup", $.naxx.config, {
		buttons:[
			{
				type: 'settingBtn',
				text: 'Backup',
				attr: {
					symbol: 'text:backup'
				},
				callback: function(self, element){
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Restore',
				attr: {
					symbol: 'text:restore'
				},
				callback: function(self, element){
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Reset to default',
				attr: {
					symbol: 'text:set_to_default'
				},
				callback: function(self, element){
					$.blockUI({message: '<div><span symbol="text:you_will_lose_all_configurations_continue">Do you really want to reset to default? All configuration will be removed.</span></div><button id="reset" symbol="text:reset">Reset(!)</button><button id="cancel" symbol="text:cancel">Cancel</button>'});
					$('#reset').button().click(function(){
						$.naxx.teleport.System('ash /bin/reset_default.sh', function(){
							$.unblockUI();
						});
					});
					$('#cancel').button().click(function(){$.unblockUI();});
					$.naxx.translate();
					return false;
				}
			}
		]
	});
})(jQuery);
