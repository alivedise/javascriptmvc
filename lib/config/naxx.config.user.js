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
 * Date: 2011-03-22 11:35:32
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.user: user management
 *
 */

;(function($) {
	$.widget('naxx.config_user', $.naxx.config, {
		options: {
			index: 0
		},
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_user').config_user('apply');
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Create user',
				attr: {
					symbol: 'text:create_user'
				},
				callback: function(self, element){
					$(':naxx-config_user').config_user('create');
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Remove user',
				attr: {
					symbol: 'text:remove_user'
				},
				callback: function(self, element){
					$(':naxx-config_user').config_user('remove');
					return false;
				}
			}
		],
		initTable: function(){
			var self = this, element = $(this.element);
			element.find('.tablePanel').watch('height,width',function(){
				//20110314 Alive: hdiv must be considered.
				self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height());
				self.object.$grid.setGridWidth($(this).width());
			});

			self.object.$grid = element.find('table.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: false,
				colNames : ['*' ,'Username', 'Type', 'Default language', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '','', '', ''],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'username', width : 50, align: 'left', sortable: false},
					{ name : 'group', width : 100, align: 'left', sortable: false},
					{ name : 'language', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'password', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'encoder.0', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.1', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.2', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.3', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.4', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.5', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.6', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.7', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.8', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.9', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.10', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.11', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.12', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.13', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.14', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'encoder.15', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'settings', width : 50, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.index = id - 1 ;
					self.updateForm();
				}
			}).show();
			

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		updateForm: function(){
			var self = this, element = $(this.element);
			$('.statusPanel').children().remove();
			$('.statusPanel').html(self.object.formHtml);
			self.beforeTransform();
			self.object.$grid.GridToForm(self.options.index+1, '.statusPanel form');
			self.transform();
			$('.statusPanel').find('input,select').change(function(){
				 self.object.$grid.jqGrid('FormToGrid', self.options.index+1, 'form');
				 self.object.$grid.jqGrid('setRowData', self.options.index+1, {modified: '*'}, 'ui-jqgrid-new');
			});
			if($.naxx.user[self.options.index].username == 'admin')
			{
				$('#encoderRow').hide();
				$('#settingsRow').hide();
				$('#usernameRow').hide();
				$('#groupRow').hide();
			}
			else
			{
				$('#encoderRow').show();
				$('#settingsRow').show();
				$('#usernameRow').show();
				$('#groupRow').show();
			}
			if($.naxx.user[self.options.index].group == 'user')
			{
				$('#settingsRow').hide();
			}
			else
			{
				$('#settingsRow').show();
			}
		},

		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			$.naxx.teleport.Export($.naxx.path.raphael+'/user', function(res){
				$.extend($.naxx.user, res);
				for (var i = 0; i < $.naxx.capability.user; i++)
				{
					self.object.$grid.jqGrid('addRowData', i+1, $.naxx.user[i]);
					if($.naxx.user[i].username == '')
						$('#'+(i+1), element).hide();
					if($.cookie('nvr_user') == $.naxx.user[i].username)
						self.object.$grid.setSelection(i+1);
				}
			});
			$.naxx.teleport.Export($.naxx.path.encoder, function(res){
				$.extend($.naxx.encoder, res);
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					var target = 'encoder.'+i;
					element.find('label[for="'+target+'"]').text((i+1)+'.'+$.naxx.encoder[i].name).attr('title', (i+1)+'.'+$.naxx.encoder[i].name);
				}
			});
		},


		beforeTransform: function(){
			var self = this, element = $(this.element);

			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				element.find('#encoderRow>div').append('<div class="encoder_item"><input type="checkbox" id="encoder.'+i+'" name="encoder.'+i+'" id="encoder'+i+'" /><label for="encoder.'+i+'"></label></div>');
			}
		},

		initOther : function(){
			var self = this, element = $(this.element);
		},

		userEditor: function(){
			var self = this, element = $(this.element);
			if($('#createUser').length == 0 )
			{
				$('<div id="createUser" class="blockform">'+
					'<h3>Create new user</h3>'+
					'<form id="createUserForm">'+
						'<div><label for="username" symbol="text:user_name">Username</label><input name="username" id="username" /></div>'+
						'<div><label for="password" symbol="text:password">Password</label><input type="password" id="password" name="password"></input></div>'+
						'<div><label for="verify" symbol="text:confirm_password">Verify password</label><input name="verify" id="verify" type="password" /></div>'+
						'<div><label for="group" symbol="text:group">Group</label><select name="group"><option value="administrator">Administrator</option><option value="user">Normal user</option></select></div>'+
						'<div><label for="language" symbol="text:default_language">Default language</label><select name="language"></select></div>'+
						'<div id="createUserEncoderRow"><label symbol="text:camera_access">Camera access</label></div>'+
						'<div id="createUserSettingsRow"><input id="settings" name="settings" type="checkbox" /><label for="settings" symbol="text:system_configuration">Settings access</label></div>'+
					'</form>'+
				'</div>').appendTo(element);

				for (var i = 0; i < $.naxx.language.length; i++)
				{
					$('<option value='+i+'>'+$.naxx.language[i]+'</option>').appendTo($('#createUser [name=language]'));
				}

				$('<button id="create" symbol="text:create" class="block">Create</button>').button().click(function(){
					$.each(self.object.$grid.getRowData(), function(key, value){
						if(value['username'] == '')
						{
							self.object.$grid.FormToGrid(Number(key)+1, 'form#createUserForm');
							$('#'+(Number(key)+1), element).show();
								self.object.$grid.setSelection(Number(key)+1);
							return false;
						}
					});
					$.unblockUI();
				}).appendTo($('#createUser'));

				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					$('#createUserEncoderRow').append('<div><input type="checkbox" name="encoder.'+i+'" id="encoder'+i+'" /><span><label for="encoder'+i+'">'+(i+1)+'.'+$.naxx.encoder[i].name+'</label></span></div>');
				}
				
				$('<button id="cancel" symbol="text:cancel" class="block">Cancel</button>').button().click(function(){
					$.unblockUI();
				}).appendTo($('#createUser'));

				$('<button id="remove" symbol="text:remove" class="block">Remove(!)</button>').button().click(function(){
					$.unblockUI();
				}).appendTo($('#createUser'));

				$('#createUser [name=group]').change(function(){
					if($(this).val() == 'user')
					{
						$('#createUserSettingsRow').hide();
						$('#createUser [name=settings]').attr('checked', false).trigger('change');
					}
					else
					{
						$('#createUserSettingsRow').show();
						$('#createUser [name=settings]').attr('checked', true).trigger('change');
					}
				});

				$('#createUser input').not(':checkbox').keydown(function(){
					var model = $('#createUser form').serializeObject();
					if(model.username == '' || model.password == '' || model.verify == '')
					{
						$('#create').button('disable');
					}
					else
					{
						$('#create').button('enable');
					}
				});
			}

			$.naxx.translate($.naxx.acl.language, $('#createUser'));
		},

		/*按鈕按下後套用*/
		apply : function()
		{
			var self = this, element = $(this.element);
			$.each(self.object.$grid.getRowData(), function(index, value){
				var encoder_acl = {};
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					if(value['encoder.'+i] == 'true')
						encoder_acl[i] = true;
					else
						encoder_acl[i] = false;
				}
				var settings = false;
				if(value['settings'] == 'true')
					settings = true;
				else
					settings = false;

				$.extend($.naxx.user[index], {encoder: encoder_acl, username: value['username'], password: value['password'], group: value['group'], settings: settings, language: value['language']});
				if(value['password'] == '')
					delete $.naxx.user[index]['password'];
			});

			$.naxx.teleport.Import($.naxx.path.raphael+'/user', $.naxx.user, 
				function(res)
				{
					$.each($.naxx.user, function(index, value)
					{
						if(value['username'] == $.naxx.acl.username)
						{
							$.naxx.acl.language = value['language'];
							$.naxx.translate();
							return true;
						}
					});

					if(self.object.$loader!=null) 
						self.object.$loader.pnotify_remove();

					$.pnotify({
							pnotify_title: '<span style="color: green;">Apply Complete!</span>',
							pnotify_text: 'Config of all cameras is saved to NVR.',
							//pnotify_nonblock: true,
							pnotify_addclass: 'stack-bottomright',
							pnotify_history: false,
							pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
						});
					$('[role=row]', element).removeClass('ui-jqgrid-new');
					$('#modified').val('');
					for (var i = 0; i < $.naxx.capability.encoder; i++)
						self.object.$grid.setRowData( i+1, {modified: ''});
				}
			);
		},

		create : function(){
			var self = this, element = $(this.element);
			
			self.userEditor();
			$('#createUser input').val('');
			$('#createUser [name=group]').val('administrator').trigger('change');
			$('#createUser #createUserEncoderRow input').attr('checked', true);
			$('#createUser #createUserSettingsRow input').attr('checked', true);
			$('#done').hide();
			$('#remove').hide();
			$('#create').button('disable');
			$.naxx.block('#createUser');
			$('#createUser form').jqTransform();
			$('#createUser form div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
			});
			$("#createUser form div.jqTransformSelectWrapper ul li a").click(function(){
				$(this).parent().parent().siblings('select').trigger('change');
				return false; //prevent default browser action
			});
		},

		remove: function(){
			var self = this, element = $(this.element);
			var row = self.object.$grid.getRowData(self.options.index+1);
			if(row['username'] == 'admin')
			{
				$.blockWarn('<span symbol="text:you_can_not_remove_the_admin_account" />');
				setTimeout(function(){$.unblockUI();}, 5000);
			}
			else
			{
				self.object.$grid.delRowData(self.options.index+1);
			}
		},

		edit : function(){
			var self = this, element = $(this.element);
			self.userEditor();
			$.naxx.block('#createUser');
		},

		describePolicy : function(){
			var self = this, element = $(this.element);
		},

		/*用select切換頻道*/
		switchChannel: function(index)
		{
			var self = this, element = $(this.element);
			if (index < 0 || index >= $.naxx.capability.encoder) return;
			self.object.$grid.jqGrid('setSelection', index+1);
			this.options.index = Number(index);
		}

	});
})(jQuery);
