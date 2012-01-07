 /* 
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
  * Date: 2011-06-15 15:13:41
  * Author: Alive Kuo (alive.kuo at vivotek.com)
  *
  * naxx.config.disk
  *
  *
  */

;(function($) {
	$.widget('naxx.config_volume', $.naxx.config, {
		options: {
			index: 0,
			firstload: true
		},
		object: {
			$scan: null,
			$progress: []
		},
		buttons: [
			{
				type: 'settingBtn',
				text: 'Wizard',
				attr: {
					symbol: 'text:wizard'
				},
				callback: function(self, element){
					$(':naxx-config_volume').config_volume('wizard');
					return false;
				}
			}
		],

		initTable: function(){
			var self = this, element = $(this.element);
			self.object.$grid = element.find('table.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'x' ,'raid_type', 'component', 'component', 'total_size', 'free_size', 'state', 'spare_disks(RAID5)'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false, hidden: true},
					{ name : 'reset', width : 10, align: 'left', sortable: false, hidden: true},
					{ name : 'raid_type', width : 50, align: 'left', sortable: false},
					{ name : 'component', width : 100, align: 'left', sortable: false, hidden: true},
					{ name : 'componentString', width : 100, align: 'left', sortable: false},
					{ name : 'total_size_GB', width : 30, align: 'left', sortable: false},
					{ name : 'unused_size_GB', width : 50, align: 'left', sortable: false},
					{ name : 'state', width : 50, align: 'left', sortable: false},
					{ name : 'spareString', width : 50, align: 'left', sortable: false}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.index = id - 1 ;
				}
			}).show();

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			var reload = false;
			$.naxx.teleport.Exec($.naxx.path.comet, 'disk_query', '', function(res){
				if($(':naxx-config_volume').length == 0) return;
				$.extend($.naxx.disk, res);
			});
			$.naxx.teleport.Exec($.naxx.path.comet, 'volume_query', '', function(res){
				if($(':naxx-config_volume').length == 0) return;
				$.extend($.naxx.volume, res);
				self.parseComponent();
				if (self.object.$grid.getGridParam('records') == 0) bFirst = true;
				else bFirst = false;
				self.object.$progress = [];
				for (var i = 0; i < $.naxx.capability.volume; i++)
				{
					//$.naxx.volume[i].component
					if (bFirst) self.object.$grid.jqGrid('addRowData', i+1, $.naxx.volume[i]);
					else self.object.$grid.jqGrid('setRowData', i+1, $.naxx.volume[i]);
					switch ($.naxx.volume[i].state)
					{
						case 'VOLUME_PREREPLACE':
						case 'VOLUME_REPLACEABLE':
						case 'VOLUME_INSERTABLE':
						case 'VOLUME_REPLACING':
						case 'VOLUME_REMOVING':
						case 'VOLUME_EXPANDABLE':
							self.options.index = i;
							self.object.$grid.jqGrid('setSelection', i+1);
							reload = true;
							break;
						case 'VOLUME_FORMATING':
							if( $.naxx.volume[i].format_progress>=0 )
								self.object.$progress.push('volume '+(i+1)+' formating:'+$.naxx.volume[i].format_progress+'%');
							break;
						case 'VOLUME_PREMIGRATE':
						case 'VOLUME_MIGRATING':
							if( $.naxx.volume[i].migrate_progress>=0 )
								self.object.$progress.push('volume '+(i+1)+' migrating:'+$.naxx.volume[i].migrate_progress+'%');
							break;
						case 'VOLUME_PREADD':
						case 'VOLUME_ADDING':
							if( $.naxx.volume[i].add_progress>=0 )
								self.object.$progress.push('volume '+(i+1)+' adding disks:'+$.naxx.volume[i].add_progress+'%');
							break;
						default:
							if( $.naxx.volume[i].raid5_rebuild_progress>=0 )
							{
								self.object.$progress.push('volume '+(i+1)+' rebuliding RAID5:'+$.naxx.volume[i].raid5_rebuild_progress+'%');
								reload = true;
							}
							break;
					}
					if( $.naxx.volume[i].component == 0 )
						$('#'+(i+1), element).hide();
				}
				self.updateForm();
				if ($('.jqgrow:visible').length > 0 && bFirst)
					self.object.$grid.setSelection($('.jqgrow:visible').eq(0).attr('id'));
				if (self.object.$progress.length>0 || reload)
					self.object.$timeout = setTimeout(function(){self.reload()}, 1500);
				self.options.firstload = false;
			});
		},

		updateForm: function(){
			var self = this, element = $(this.element);
			$('div.statusPanel form fieldset>div', element).remove();
			$.each(self.object.$progress, function(index, value){
					$('<div>'+value+'<img src="images/gif/comet_progress.gif" /></div>').appendTo($('div.statusPanel form fieldset', element));
			});
			if(self.object.$progress.length == 0)
				$('<div><span symbol="text:no_raid_task_now"></span></div>').appendTo($('div.statusPanel form fieldset', element));
			$.naxx.translate();
		},

		calculateGB: function(KB){
			var self = this, element = $(this.element);
			return (KB/1024).toFixed(2);
		},
		
		calculateMB: function(KB){
			var self = this, element = $(this.element);
			return (KB/(1024*1024)).toFixed(2);
		},

		wizard: function(){
			var self = this, element = $(this.element);
			self.volumeWizard();
			self.optionBuilder();
			var ad = self.parseVolume();
			$.each(ad, function(index, value){
					$('.diskRow:eq('+value+')').show().find('.capability').text(self.calculateGB($.naxx.disk[value].size)+' GB');
				});
			$.each($.naxx.volume[self.options.index].componentArray, function(index, value){
					$('.diskRow:eq('+value+')').hide().find('input').attr('checked', false);
				});
			$('span.replace').hide();

			/*OFFLINE can only remove*/
			if ( $.naxx.volume[self.options.index].state == 'VOLUME_OFFLINE')
			{
				$('#buildR0').remove();
				$('#buildR1').remove();
				$('#buildR5').remove();
				$('#buildMigrate').remove();
				$('#buildFormat').remove();
				$('#removeRaid').remove();
				$('#buildExpand').remove();
				$('#buildAdd').remove();
				$('#buildSpare').remove();
				$('#releaseSpare').remove();
			}
			switch($.naxx.volume[self.options.index].raid_type)
			{
			case 'RAID_N':
				if ( $.naxx.volume[self.options.index].state == 'VOLUME_ONLINE')
				{
					$('#buildR0').show();
					$('#buildR1').show();
					$('#buildR5').show();
				}
				else 
				{
					$('#buildR0').remove();
					$('#buildR1').remove();
					$('#buildR5').remove();
				}
				$('#buildMigrate').remove();
				$('#buildFormat').show();
				$('#buildExpand').remove();
				$('#buildAdd').remove();
				$('#buildSpare').remove();
				$('#releaseSpare').remove();
				$('#check').remove();
				break;
			case 'RAID_0':
				$('#buildR0').remove();
				$('#buildR1').remove();
				$('#buildR5').show();
				$('#buildFormat').show();
				$('#removeRaid').show();
				$('#buildExpand').show();
				$('#buildAdd').remove();
				$('#buildSpare').remove();
				$('#releaseSpare').remove();
				break;
			case 'RAID_1':
				$('#buildR0').remove();
				$('#buildR1').remove();
				$('#buildR5').show();
				$('#buildMigrate').show();
				$('#buildFormat').show();
				$('#removeRaid').show();
				$('#buildExpand').show();
				$('#buildAdd').remove();
				$('#buildSpare').remove();
				$('#releaseSpare').remove();
				break;
			case 'RAID_5':
				$('#buildR0').remove();
				$('#buildR1').remove();
				$('#buildR5').remove();
				$('#buildFormat').show();
				$('#removeRaid').show();
				$('#buildExpand').show();
				$('#buildAdd').show();
				$('#buildSpare').show();
				if ( $.naxx.volume[self.options.index].raid5_hot_spare > 0 )
					$('#releaseSpare').show();
				else
					$('#releaseSpare').remove();

				break;
			}

			$('.diskRow').hide();

			switch($.naxx.volume[self.options.index].state)
			{
			case 'VOLUME_PREREPLACE':
			case 'VOLUME_REPLACEABLE':
			case 'VOLUME_INSERTABLE':
			case 'VOLUME_REPLACING':
			case 'VOLUME_REMOVING':
			case 'VOLUME_EXPANDABLE':
				$('#volumeAction').val('buildExpand').trigger('change');
				break;
			default:
				$('#volumeAction').trigger('change');
				break;
			}
			//$('#volumeWizard form').jqTransform();
			$('form div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
				});
			$('form div.jqTransformCheckboxWrapper input').each(function(){
				$(this).trigger('change'); 
			});
			$.naxx.block('#volumeWizard');
		},

		optionBuilder: function(){
			var self = this, element = $(this.element);
			$('#volumeWizard form').html(self.object.formHtml);
			for(var i = 0; i < $.naxx.capability.disk; i++)
			{
				$('<div class="diskRow rowElem"><input type="checkbox" name="source" id='+i+' value='+i+' /><label for="'+i+'">Disk#'+(i+1)+'</label><span class="capability"></span><span class="replace"><button target='+i+' symbol="text:replace">Replace</button><span class="replacing"></span></span></div>').appendTo($('#volumeWizard form fieldset:last'));
			}

			$('span.replace button').button().click(function(){self.replace($(this).attr('target'));});

			$('input[name=source]').change(function(){
					var selectNum = $('input[name=source]:checked').length;
					switch($('#volumeAction').val())
					{
					case 'buildR0':
					case 'buildR1':
					case 'buildSpare':
						if(selectNum == 0)
						{
							$('#process').button('disable');
						}
						else
						{
							$('#process').button('enable');
						}
						break;
					case 'buildMigrate':
					case 'buildR5':
						if(selectNum < 2)
						{
							$('#process').button('disable');
						}
						else
						{
							$('#process').button('enable');
						}
						break;
					case 'buildAdd':
						if(selectNum == 0)
						{
							$('#process').button('disable');
						}
						else
						{
							$('#process').button('enable');
						}
						break;
					case 'buildExpand':
						if(selectNum == 0)
						{
							$('#process').button('disable');
						}
						else
						{
							$('#process').button('enable');
						}
						break;
					}
				});

			$('select#volumeAction').change(function(){
					for (var i = 0; i < $.naxx.capability.disk; i++)
						$('.diskRow:eq('+i+') .capability').text('('+self.calculateGB($.naxx.disk[i].size)+' GB)');

					var ad = self.parseVolume();
					$.each(ad, function(index, value){
							$('.diskRow:eq('+value+')').find('input').attr('checked', true);
							$('.diskRow:eq('+value+')').show();
						});
					$.each($.naxx.volume[self.options.index].componentArray, function(index, value){
							$('.diskRow:eq('+value+')').find('input').attr('checked', false);
							$('.diskRow:eq('+value+')').hide();
						});
					switch($(this).val())
					{
					case 'buildFormat':
						$('#warnRow').attr('symbol', 'text:format_will_kill_any_data_on_this_volume');
						$('.diskRow').hide();
						break;
					case 'removeRaid':
						$('#warnRow').text('symbol', 'text:remove_will_disband_the_disks_under_this_volume');
						$('.diskRow').hide();
						break;
					case 'buildR0':
						$('#warnRow').attr('symbol', 'text:you_need_select_at_least_2_disks_to_build_a_raid0');
						break;
					case 'buildR1':
						$('#warnRow').attr('symbol', 'text:you_need_select_at_least_2_disks_to_build_a_raid1');
						break;
					case 'buildR5':
						$('#warnRow').attr('symbol', 'text:you_need_select_at_least_3_disks_to_build_a_raid2');
						break;
					case 'buildMigrate':
						$('#warnRow').attr('symbol', 'text:you_need_can_select_1_or_more_disks_to_migrate_this_volume');
						break;
					case 'buildAdd':
						$('#warnRow').attr('symbol', 'text:you_need_can_select_1_or_more_disks_to_add_into_this_volume');
						break;
					case 'buildSpare':
						$('#warnRow').attr('symbol', 'text:select_1_or_more_disks_to_spare_this_volume');
						break;
					case 'buildExpand':
						$('#warnRow').attr('symbol' ,'text:expand_this_volume_needs_step_by_step_disk_swap');
						$('.diskRow').hide();
						$.each($.naxx.volume[self.options.index].componentArray, function(index, value){
								$('.diskRow:eq('+value+')').show().find('input').hide().siblings('span.replace').show();
							});
						switch ($.naxx.volume[self.options.index].state)
						{
						default:
							break;
						case 'VOLUME_REPLACEABLE':
							$('.diskRow span.replace button').hide();
							$('.diskRow:eq('+$.naxx.volume[self.options.index].replace_target+') span.replacing').attr('symbol', 'text:please_remove_this_disk_now');
							break;
						case 'VOLUME_INSERTABLE':
							$('.diskRow span.replace button').hide();
							$('.diskRow:eq('+$.naxx.volume[self.options.index].replace_target+') span.replacing').attr('symbol', 'text:please_insert_new_disk_now');
							break;
						case 'VOLUME_REPLACING':
							$('.diskRow span.replace button').hide();
							$('.diskRow:eq('+$.naxx.volume[self.options.index].replace_target+') span.replacing').attr('symbol', '').text('replacing:'+$.naxx.volume[self.options.index].replace_progress+'%, plz be patient..')
							break;
						case 'VOLUME_PREREPLACE':
							$('.diskRow span.replace button').show();
							$('.diskRow:eq('+$.naxx.volume[self.options.index].replace_target+') span.replacing').hide();
							break;
						case 'VOLUME_EXPANDABLE':
							$('.diskRow span.replace button').show();
							break;
						}
						break;
					case 'releaseSpare':
						$('#warnRow').text('Select 1 or more disks to spare this volume.');
						$('.diskRow').hide();
						$('.diskRow input').attr('checked', false);
						$.each($.naxx.volume[self.options.index].spareArray, function(index, value){
								$('.diskRow:eq('+value+')').show().find('input').attr('checked', false);
							});
						break;
					}
					$.naxx.translate();
				});
		},

		volumeWizard: function(){
			var self = this, element = $(this.element);
			if($('#volumeWizard').length == 0)
			{
				$('<div id="volumeWizard" class="blockform"><h3>Volume wizard</h3><form onsubmit="return false;"><fieldset><div class="rowElem"><label symbol="text:you_had_selected_a_volume_do_you_want_to">You had selected a volume, do you want to:</label><select id="volumeAction"><option id="buildFormat" value="buildFormat" symbol="text:format">FORMAT(!)</option><option id="buildR0" value="buildR0" symbol="text:build_raid_0">Build RAID0</option><option id="buildR1" value="buildR1" symbol="text:build_raid_1">Build RAID1</option><option id="buildR5" value="buildR5" symbol="text:build_raid_5">Build RAID5</option><option id="buildMigrate" value="buildMigrate" symbol="text:migrate_to_RAID5">Migrate to RAID5</option><option id="removeRaid" value="removeRaid" symbol="text:remove_raid">Remove RAID(!)</option><option id="buildExpand" value="buildExpand" symbol="text:expand_raid">Expand RAID</option><option id="buildAdd" value="buildAdd" symbol="text:add_disk">Add Disks</option><option id="buildSpare" value="buildSpare" symbol="text:spare_raid">Spare RAID</option><option id="releaseSpare" value="releaseSpare" symbol="text:release_spare">Release spare</option><option id="check" value="check" symbol="text:check">Check</option></select></div><div id="warnRow" class="ui-corner-all"></div></fieldset><fieldset></fieldset></form></div>').hide().appendTo(element);
				self.object.formHtml = $('#volumeWizard form').html();

				$('<button id="cancel" symbol="text:cancel" class="block">Cancel</button>').button().click(function(){
					$.unblockUI();
				}).appendTo($('#volumeWizard'));
				
				$('<button id="process" symbol="text:process" class="block">Process</button>').button().click(function(){
						var selectedDisk = new Array();
						$('[name=source]:visible').each(function(){
							if($(this).attr('checked'))
							{
								selectedDisk.push(Number($(this).val()));
							}
						});
					switch($('select#volumeAction').val())
					{
					case 'buildFormat':
						self.format();
						break;
					case 'buildR0':
						self.migrate(selectedDisk, 'RAID_0');
						break;
					case 'buildR1':
						self.migrate(selectedDisk, 'RAID_1');
						break;
					case 'buildR5':
						self.migrate(selectedDisk, 'RAID_5');
						break;
					case 'buildMigrate':
						self.migrate(selectedDisk, 'RAID_5');
						break;
					case 'buildAdd':
						self.add(selectedDisk);
						break;
					case 'buildExpand':
						self.expand();
						break;
					case 'removeRaid':
						self.remove();
						break;
					case 'buildSpare':
						self.spare(selectedDisk);
						break;
					case 'releaseSpare':
						self.releasespare(selectedDisk);
						break;
					}
					$.unblockUI();
				}).appendTo($('#volumeWizard'));
			}
		},

		calculateSize: function(){
			var self = this, element = $(this.element);
			var esize;
			switch($('#volumeAction').val())
			{
			case 'buildR5':
//				esize = 
				break;
			case 'buildR1':
				break;
			case 'buildR0':
				break;
			}
		},

		calculateDisk: function(){
			var self = this, element = $(this.element);
			var count = 0, availableDisk = new Array();
			for (var i = 0; i< $.naxx.capability.disk; i++)
			{
				if($.naxx.disk[i].state == 'DISK_CONNECTED')
				{
					availableDisk.push(i);
				}
			}

			return availableDisk;
		},
		
		parseComponent: function(){
			var self = this, element = $(this.element);
			for (var j = 0; j < $.naxx.capability.volume; j ++)
			{
				var disks = new Array();
				disklist = $.naxx.volume[j].component.toString(2);
				disklist = disklist.padL(6, '0');
				for (var i = 0; i < $.naxx.capability.disk; i++)
				{
					if(disklist[i] == '1')
						disks.push($.naxx.capability.volume-i-1);
				}
				$.naxx.volume[j]['componentArray'] = disks;
				disks.sort();
				var diskstring = new Array();
				$.each(disks, function(index, value){
					diskstring.push('disk#'+(Number(value)+1));
				});

				var spares = new Array();
				sparelist = $.naxx.volume[j].raid5_hot_spare.toString(2);
				sparelist = sparelist.padL(6, '0');
				for (var i = 0; i < $.naxx.capability.disk; i++)
				{
					if(sparelist[i] == '1')
						spares.push($.naxx.capability.volume-i-1);
				}
				$.naxx.volume[j]['spareArray'] = spares;
				spares.sort();
				var sparestring = new Array();
				$.each(spares, function(index, value){
					sparestring.push('disk#'+(Number(value)+1));
				});

				$.naxx.volume[j]['spareString'] = sparestring.toString();
				$.naxx.volume[j]['componentString'] = diskstring.toString();
				$.naxx.volume[j]['total_size_GB'] = ($.naxx.volume[j]['total_size']/(1024)).toFixed(3)+' GB';
				$.naxx.volume[j]['unused_size_GB'] = ($.naxx.volume[j]['unused_size']/(1024)).toFixed(3)+' GB';
			}
		},

		parseVolume: function(){
			var self = this, element = $(this.element);
			var disklist = '';
			var available = new Array();
			for (var i = 0; i < $.naxx.capability.disk; i++)
			{
				if($.naxx.disk[i].state != 'DISK_UNCONNECTED')
				{
					available.push(i);
				}
			}
	
			self.parseComponent();
			for (var j = 0; j < $.naxx.capability.volume; j ++)
			{
				var disks = $.naxx.volume[j].componentArray
				if(disks.length>1) //RAID
				{
					$.each(available, function(index, value){
						for (var k = 0; k < disks.length; k++)
						{
							if(value == disks[k])
								available.splice(index, 1);
						}
					})
				}
			}

			return available;
		},

		format: function(){
			var self = this, element = $(this.element);
				$.naxx.teleport.Exec($.naxx.path.disk, 'volume_format', 'target='+self.options.index, function(){
					self.reload();
			});
		},

		replace: function(target){
			var self = this, element = $(this.element);
				$.naxx.teleport.Exec($.naxx.path.volume, 'volume_replace', 'target='+target, function(){
					self.reload();
			});
		},

		migrate: function(sourceArray, raidtype){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_migrate', 'raid_type='+raidtype+'&destination='+self.options.index+'&source='+JSON.stringify(sourceArray), function(){
				self.reload();
			});
		},

		add: function(source){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_add', 'destination='+self.options.index+'&source='+JSON.stringify(source), function(){
					self.reload();
			});
		},
		
		spare: function(source){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_spare', 'destination='+self.options.index+'&source='+JSON.stringify(source)+'&action=add', function(){
					self.reload();
			});
		},
		
		releasespare: function(source){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_spare', 'destination='+self.options.index+'&source='+JSON.stringify(source)+'&action=remove', function(){
					self.reload();
			});
		},

		check: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_check', 'target='+self.options.index, function(){
					self.reload();
			});
		},
		
		remove: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_remove', 'target='+self.options.index, function(){
					self.reload();
			});
		},
		
		expand: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.volume, 'volume_expand', 'target='+self.options.index, function(){
					self.reload();
			});
		}
	});
})(jQuery);
