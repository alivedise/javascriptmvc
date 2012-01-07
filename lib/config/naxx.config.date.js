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
	$.widget("naxx.config_date", $.naxx.config, {
		buttons:[
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self){
					$(':naxx-config_date').config_date('savePost');
					return false;
				}
			}
		],
		TZtable : [],
		reloadPrivate: function(data)
		{
			var self = this, element = $(this.element);
			$('#timezone_selector').val($('#timezone option[value="'+data.timezone+'"]').text());
			$('[name=type]').attr('checked', false).trigger('change');
			if(data.type!='ntp') $('#nochange').attr('checked', true).trigger('change');
			else $('#ntp').attr('checked', true).trigger('change');
			self.renewTimes(data);
			self.object.model = self.getCurrentModel();
		},
		renewTimes: function(data){
			var self = this, element = $(this.element);
			var current = new Date(self.options.timestamp*1000+self.options.timezone);
				$('#date').DatePicker({
					format:'Y.m.d',
					current: data.date,
					date: data.date,
					starts: 1,
					onBeforeShow: function(){
					},
					onChange: function(formated, dates){                                                                       
					    $('#date').val(formated);
					}  
				});
			$('form div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click();
			});
		},
		initOther: function(){
			var self = this, element = $(this.element);
			self.buildTZ();
		},

		savePost: function(){
			var self = this, element = $(this.element);
			var count = 0;
			var model = self.getCurrentModel();
			var max = 30;
			switch($('[name=type]:checked:eq(0)').val())
			{
			case 'custom':
				break;
			case 'ntp':
				break;
			case 'auto':
				var now = new Date();
				$('#date').val(now.formatDate('yyyy.MM.dd'));
				$('#hour').val(Number(now.formatDate('hh')));
				$('#minute').val(Number(now.formatDate('mm')));
				$('#second').val(Number(now.formatDate('ss')));
				break;
			default:
				break;
			}
			if (this.object.model['timezone'] != $('#timezone').val())
			{
				var desc = '<div id="desc" symbol="text:network_is_reseting_you_will_be_redirected_to_web_page_after_120_sec">Network is reseting. You will be redirected to web page after 120 sec..</div><div>Click here to go to web page directly. <b><u><a href="http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'">http://'+window.location.hostname+':'+$.naxx.raphael.network.protocol.http_port+'</a></u></b></div><div class="countdown"></div>';
				$.naxx.blockWarn(desc);
				var count = 0;
				$('.countdown').progressbar({value: 0});
				i2 = setInterval(function(){
						count+=1;
						$('#desc').html($.naxx.stranslate('network_is_reseting_you_will_be_redirected_to_web_page_after')+' '+(120-count)+$.naxx.stranslate('s'));
						try
						{
							$('.countdown').progressbar('option', 'value', count/1.2);
						}
						catch(e)
						{

						}
						if(count>=120)
						{
							document.location.reload();
						}
					}, 1000);
				$.naxx.teleport.Import($.naxx.path.raphael+self.options.path, model,
					function(){
						$.naxx.modified = false;
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
					$.naxx.teleport.Import($.naxx.path.raphael+self.options.path, self.getCurrentModel(), function(){
						$.naxx.modified = false;
						setTimeout(function(){
								$(':naxx-panel').panel('getSystemTime');
						}, 3000);
					});
				}
		},
		
		buildTZ: function(){
			var self = this, element = $(this.element);
			$('<div class="hidden" id="byGMT"><ul></ul></div>').appendTo(element);
			$('<div class="hidden" id="byArea"><ul></ul></div>').appendTo(element);
			var GMT = $('#byGMT ul');
			var Area = $('#byArea ul');
			$('select#timezone option').each(function(){
				var value = $(this).val();
				var text = $(this).text();
				var byarea = value.split('/', 1);
				var bygmt = text.split(' ', 1);
				var found = false;
				$('a.continent').each(function(){
					if($(this).attr('index') == byarea[0]) //repeat
					{
						$(this).siblings('ul').append('<li><a href="#" class="nation" value='+value+'>'+text+'</a></li>');
						found = true;
						return;
					}
				});
				if(!found)
				{
					$('<li><a href="#" class="continent" index='+byarea[0]+'>'+byarea[0]+'</a><ul><li><a href="#" class="nation" value='+value+'>'+bygmt+' '+text+'</a></li></ul></li>').appendTo(Area);
				}
			});

			$('#timezone_selector').menu({
					content: $('#byArea').html(),
					width: 210,
					maxHeight: 301,
					height: 'auto',
					positionOpts: {
						posX: 'left', 
						posY: 'bottom',
						offsetX: -5,
						offsetY: 0,
						directionH: 'right',
						directionV: 'down', 
						detectH: true, // do horizontal collision detection  
						detectV: true, // do vertical collision detection
						linkToFront: false
					},
					bindings: {
						'ul ul a': function(){
							$('#timezone').val($(this).attr('value'));
							$('#timezone_selector').val($(this).text());
						}
					}
			});
		}
	});
})(jQuery);
