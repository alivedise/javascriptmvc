/*# 
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
 * Date: 2011-05-19 17:37:12
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.settings: nvr setting main page.
 *
 */

;(function($) {
	$.widget("naxx.settings", {
		options : {
		},

		utility:[{
					content: 'system',
					symbol: 'text:system',
					icon: 'setter system static',
					description_symbol: 'text:system_tools_including_upgrade_restore_your_systems.',
					ability: [{
								icon: 'images/ability_ups.png',
								name: 'general',
								symbol: 'text:general',
								url: 'setting/firmware.html',
								widget: 'config_firmware',
								path: '/network',
								builder: 'include/naxx.config.firmware.js'
						      },
							  {
								icon: 'images/ability_update.png',
								name: 'upgrade',
								symbol: 'text:upgrade',
								url: 'setting/update.html',
								widget: 'config_update',
								path: '/system/hardware/update',
								builder: 'include/naxx.config.update.js'
							  },
							  {
								icon: 'images/ability_backup.png',
								name: 'backup_restore',
								symbol: 'text:backup_restore',
								url: 'setting/backup.html',
								widget: 'config_backup',
								path: '/system/hardware/backup',
								builder: 'include/naxx.config.backup.js'
							  },							
							  {
								icon: 'images/ability_time.png',
								name: 'time',
								symbol: 'text:time',
								url: 'setting/sys02.html',
								widget: 'config_date',
								path: '/time',
								builder: 'include/naxx.config.date.js'
                              },
							  {
								name: 'maintenance',
								symbol: 'text:maintenance',
								url: 'setting/maintenance.html',
								widget: 'config_shutdown',
								path: '/psutil',
								builder: 'include/naxx.config.maintenance.js'
							  }
						  ]
				},
				{
					content: 'network',
					symbol: 'text:network',
					icon: 'setter network static',
					description_symbol: 'text:set_nvrs_ip_address_and_other_network_settings',
					ability: [{
								icon: 'images/ability_url.png',
								name: 'general',
								symbol: 'text:general',
								url: 'setting/tcpip.html',
								widget: 'config_tcpip',
								path: '/network/tcpip',
								builder: 'include/naxx.config.tcpip.js'
							  }, 
							  {
								icon: 'images/ability_ddns.png',
								name: 'ddns',
								symbol: 'text:ddns',
								url: 'setting/ddns.html',
								widget: 'config_ddns',
								path: '/network/ddns',
								builder: 'include/naxx.config.ddns.js'
							  }, 
							  {
								icon: 'images/ability_protocol.png',
								name: 'service',
								symbol: 'text:service',
								url: 'setting/protocol.html',
								widget: 'config_protocol',
								path: '/network/protocol',
								builder: 'include/naxx.config.protocol.js'
							  }, 
							  {
								icon: 'images/ability_ping.png',
								name: 'utility',
								symbol: 'text:utility',
								url: 'setting/ping.html',
								widget: 'config_ping',
								path: '/system/software/naxx/ping',
								builder: 'include/naxx.config.ping.js'
							  },
						  ]
				},
				{
					content: 'camera',
					symbol: 'text:camera',
					icon: 'setter camera static',
					description_symbol: 'text:add_remove_manage_your_cameras',
					ability: [{
								icon: 'images/ability_camera.png',
								name: 'general',
								symbol: 'text:general',
								url: 'setting/camera.html',
								widget: 'config_camera',
								path: '/system/software/meteor/encoder',
								builder: 'include/naxx.config.camera.js'
					          },
							  {
								icon: 'images/ability_recording.png',
								name: 'video',
								symbol: 'text:video',
								url: 'setting/recording.html',
								widget: 'config_video',
								path: '/system/software/meteor/profile',
								builder: 'include/naxx.config.video.js'
							  },
							  {
								icon: 'images/ability_schedule.png',
								name: 'schedule',
								symbol: 'text:schedule',
								url: 'setting/schedule.html',
								widget: 'config_schedule',
								path: '/system/software/mercury/schedule',
								builder: 'include/naxx.config.schedule.js'
							  },
							  {
								icon: 'images/ability_event.png',
								name: 'alarm',
								symbol: 'text:alarm',
								url: 'setting/event.html',
								widget: 'config_event',
								path: '/system/software/eventd',
								builder: 'include/naxx.config.event.js'
							  }
						  ]
				},
				{
					content: 'storage',
					symbol: 'text:storage',
					icon: 'setter storage static',
					description_symbol: 'text:manage_your_harddisk_or_usbdisks_Setting_RAID',
					ability: [
							  {
								icon: 'images/ability_raid.png',
								name: 'volume_',
								symbol: 'text:volume_',
								url: 'setting/raid.html',
								widget: 'config_volume',
								path: '/system/software/comet/volume',
								builder: 'include/naxx.config.volume.js'
							  },
							  {
								icon: 'images/ability_sata.png',
								name: 'disk',
								symbol: 'text:disk',
								url: 'setting/sata.html',
								widget: 'config_disk',
								path: '/system/software/comet/disk',
								builder: 'include/naxx.config.disk.js'
							  }
						]
				},
				{
					content: 'security',
					symbol: 'text:security',
					icon: 'setter user static',
					description_symbol: 'text:add_remove_manage_your_user_account',
					ability: [
						      {
								  icon: 'images/ability_user.png',
								  name: 'user_account',
								  symbol: 'text:user_account',
								  url: 'setting/adduser.html',
								  widget: 'config_user',
								  path: '/system/software/userd/user',
								  builder: 'include/naxx.config.user.js'
						      },
							  {
								icon: 'images/ability_hac.png',
								name: 'access_list',
								symbol: 'text:access_list',
								url: 'setting/hac.html',
								widget: 'config_iptables',
								path: '/network/iptables',
								builder: 'include/naxx.config.iptables.js'
							  }
						  ]

				},
				{
					content: 'logs',
					symbol: 'text:logs',
					icon: 'setter log static',
					description_symbol: 'text:system_log_and_statistics.',
					ability: [{
								icon: 'images/ability_eventlog.png',
								name: 'system',
								symbol: 'text:system',
								url: 'setting/systemlog.html',
								widget: 'config_systemlog',
								builder: 'include/naxx.config.systemlog.js'
							  },
							  {
								icon: 'images/nvrcamera.png',
								name: 'recording',
								symbol: 'text:recording',
								url: 'setting/cameralog.html',
								widget: 'config_cameralog',
								builder: 'include/naxx.config.cameralog.js'
							  },
							  {
								icon: 'images/ability_userlog.png',
								name: 'user',
								symbol: 'text:user',
								url: 'setting/userlog.html',
								widget: 'config_userlog',
								builder: 'include/naxx.config.userlog.js'
							  }
							]
				}
		],

		_create : function(){
			var self = this, element = $(this.element);
			element.addClass('settings').html('<div class="settingNav"></div><div class="settingCell"></div>');
			element.layout({
				showOverflowOnHover: false,
				closable: false,
				resizable: false,
				north: {
					showOverflowOnHover: false,
					size: 59,
					paneSelector: '.settingNav',
					spacing_open: 1,
					spacing_closed: 1,
					resizable: false
				},
				center: {
					showOverflowOnHover: false,
					paneSelector: '.settingCell'
				}
			});

			$('div.eventlist').settingtree({utility: self.utility});
			
		},

		_init: function(){
			var self = this, element = $(this.element);
			$('.settingNav', element).html('<div><span class="active" symbol="text:configuration">Settings</span></div>');
			$('.settingCell', element).children().remove();
			$('.settingCell', element).html('<div class="left-column"></div><div class="right-column"></div>"');
			for(var i = 0; i <self.utility.length/2; i++)
			{
				$('<div class="weapon ui-corner-all"><div class="left-shield"><span class="'+self.utility[i].icon+' activate" index="'+i+'"></span></div><div class="right-sword"><div class="class"><span symbol="'+self.utility[i].symbol+'">'+self.utility[i].content+'</span></div><div class="hidden description"><span symbol="'+self.utility[i].description_symbol+'">'+self.utility[i].description_symbol+'</span></div><div class="subject"></div></div></div>').appendTo($('.settingCell .left-column', element));
				for (var j = 0; j < self.utility[i].ability.length; j++)
				{
					$('<div class="link" spellid='+j+' classid='+i+' symbol="'+self.utility[i].ability[j].symbol+'">'+self.utility[i].ability[j].name+'</div>').click(function(){
							self.cast($(this));}
					).appendTo($('div.weapon div.subject', element).eq(i));
				}
			}
			for(var i = parseInt((self.utility.length+self.utility.length%2)/2); i < self.utility.length; i++)
			{
				$('<div class="weapon ui-corner-all"><div class="left-shield"><span class="'+self.utility[i].icon+' activate" index="'+i+'"></span></div><div class="right-sword"><div class="class"><span symbol="'+self.utility[i].symbol+'">'+self.utility[i].content+'</span></div><div class="hidden description"><span symbol="'+self.utility[i].description_symbol+'">'+self.utility[i].description_symbol+'</span></div><div class="subject"></div></div></div>').appendTo($('.settingCell .right-column', element));
				for (var j = 0; j < self.utility[i].ability.length; j++)
				{
					$('<div class="link" spellid='+j+' classid='+i+' symbol="'+self.utility[i].ability[j].symbol+'">'+self.utility[i].ability[j].name+'</div>').click(function(){
							self.cast($(this));}
					).appendTo($('div.weapon div.subject', element).eq(i));
				}
			}

			$('span.activate[index]', element).click(function(){
				$(':naxx-settingtree').accordion('activate', Number($(this).attr('index'))+1);
			});

			$.naxx.translate($.naxx.acl.language, element);
		},
		
		cast: function($ability){
			var self = this, element = $(this.element);
			var $utility = self.utility[$ability.attr('classid')];
			var $spell = $utility.ability[$ability.attr('spellid')];
			$('.ability', $('.settingtree')).removeClass('casting');
			$ability.addClass('casting');
			element.find('.settingCell').children().remove();
			element.find('.settingCell').block({
						message: '<img src="images/gif/stream-loader-3.gif" />',
						css: {
							cursor: 'wait', 
							border: 'none', 
							background: 'none'
						}, 
						overlayCSS: {
							backgroundColor: '#fff', 
							cursor: 'wait', 
							opacity: 1
						}, 
						fadeOut: 0, 
						fadeIn: 0
					});
			

			$('div.settingNav', element).children().remove();
			$('div.settingNav', element).html('<div><span symbol="'+$utility.symbol+'">'+$utility.content+'</span><span>&nbsp;-&nbsp;</span><span class="active" symbol="'+$spell.symbol+'">'+$spell.name+'</span></div>');
			$.naxx.translate($.naxx.acl.language, $('.settingNav', element));
			$.ajax({
				url: $spell.url,
				type: 'get',
				success: function(res){
					element.find('.settingCell').html('<div class="clear">'+res+'</div>');//.find('table').flexigrid();
					element.find('.settingCell .statusPanel').block({
						message: '<img src="images/gif/stream-loader-3.gif" />',
						css: {
							cursor: 'wait', 
							border: 'none', 
							background: 'none'
						}, 
						overlayCSS: {
							backgroundColor: '#fff', 
							cursor: 'wait', 
							opacity: 1
						}, 
						fadeOut: 0, 
						fadeIn: 0
					});
			

					getScript($spell.builder,
						function(){
							eval('$(".settingCell div.clear", element).'+$spell.widget+'({path: "'+$spell.path+'"});');
							$('div.ability').removeClass('casting');
							$('#settings_overview').removeClass('ui-state-active').addClass('ui-state-default').find('.arrow').remove();
							$('div.ability[classid='+$ability.attr('classid')+'][spellid='+$ability.attr('spellid')+']').addClass('casting').append('<span class="arrow" />');
							if($(':naxx-settingtree').accordion('option', 'active') != Number($ability.attr('classid'))+1)
								$(':naxx-settingtree').accordion('activate', Number($ability.attr('classid'))+1);

							$.naxx.translate();
					}
					);
				}
			});
		},
        
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.removeClass('settings').children().remove();
		}
	});
})(jQuery);
