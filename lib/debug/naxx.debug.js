/* # 
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
 * Date: 2011-03-24 20:22:05
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * $.naxx.debugconsole: invoke debug console.
 *
 */

;(function($) {
	var dialog = null;
	$.widget('naxx.debug', {
		formatTree: function(data, folder){
			var new_data = [], self = this;
			$.each(data, function(key, value){
				if (typeof(value) == 'object')
				{
					new_data.push({'data':{'title': key},'attr':{node: 'folder', path: folder+key}, 'children': self.formatTree(value, folder+key+'/')});
				}
				else
				{
				new_data.push({'data': {'title': key}, 'attr':{node: 'key', path: folder+key}, 'children': [{'attr': {node: 'value', path: folder+key+'/'+value}, 'data': {'title': value}}]});
				}
			});
			return new_data.sort(function(a,b){
				if (Number(a.data.title) != NaN || Number(b.data.title) != NaN)
					return Number(a.data.title) > Number(b.data.title);
				else
					return (a.data.title) > (b.data.title);
			});
		},
		_init: function(){
			var self = this, element = $(this.element);
			var job_counter = 2;
			$('<div class="d_top"></div><div class="d_content"><ul><li><a href="#tabs-1">Saravee Init..</a><span class="ui-icon ui-icon-close">Remove Tab</span></li></ul><div id="tabs-1">Usage: 1.Input gconf path or 2.Input linux console command.</div></div>').appendTo(element);
			var maintab = $('.d_content', element)
				.tabs({
					add: function(e, ui) {
						$(ui.tab).parents('li:first')
						.append('<span class="ui-tabs-close ui-icon ui-icon-close" title="Close Tab"></span>')
						.find('span.ui-tabs-close')
						.click(function() {
							maintab.tabs('remove', $('li', maintab).index($(this).parents('li:first')[0]));
						});
						$('#'+ui.panel.id)
							.append('<p>'+new Date()+'</p>')
							.append('<img class="rolling" src="images/vivoload.gif" />');
						//$('#'+ui.panel.id).animate({scrollTop: $('#'+ui.panel.id)[0].scrollHeight});
						maintab.tabs('select', '#' + ui.panel.id);
						if ( ui.tab.textContent.match(/^\//) != null )
						{
							$.naxx.teleport.System('gconftool-2 -R '+ui.tab.textContent, function(data){
								$('#'+ui.panel.id).append(data.command+'<br/><br/>');
								$('#'+ui.panel.id).append(data.output.replace(/\n/g, '<br/>'));
								$('#'+ui.panel.id).find('img.rolling').hide();
								$('#'+ui.panel.id).append('<div class="tree" href="#'+ui.panel.id+'"></div>');
								self.refresh(ui.panel.id, ui.tab.textContent);
							});

						}
						else
						{
							$.naxx.teleport.System(ui.tab.textContent, function(data){
								$('#'+ui.panel.id).append(data.command+'<br/><br/>');
								$('#'+ui.panel.id).append(data.output.replace(/\n/g, '<br/>'));
								$('#'+ui.panel.id).find('img.rolling').hide();
							});
						}
					}
			});
			$('<input type="text" class="cmd"></input>').change(function(){
				maintab.tabs('add', '#tabs-'+job_counter, $(this).val());
				$(this).val('');
				//$('.d_content', element).animate({scrollTop: $('.d_content', element)[0].scrollHeight});
				job_counter++;
			}).appendTo($('.d_top', element));
			$('<button>Refresh Gconf Tree</button>').click(function(){self.refresh();}).appendTo($('.d_top', element));


			//keybinding
			$(document).keydown(function(e){
				var key = e.keycode ? e.keycode : e.which; 
				if(key == 37 && e.shiftKey) {
					var selected = $( ".d_content" ).tabs( "option", "selected" );
					$('.d_content').tabs('select', selected-1);
				}  
				else if(key == 39 && e.shiftKey) {
					var selected = $( ".d_content" ).tabs( "option", "selected" );
					$('.d_content').tabs('select', selected+1);
				}  
			});

			$('#tabs-1').append('<div class="tree" href="#tabs-1"></div>')
						.append('<img class="rolling" src="images/vivoload.gif" />');
			
			self.refresh('tabs-1', '/');
		},
		refresh: function(href, path){
			var self = this, element = $(this.element);
			$.naxx.teleport.Export(path, function(res){
			//init jstree
				$('div.tree[href=#'+href+']').jstree({
					'json_data' : {
						'data' : [{ data: path, attr: {id: 'root'}, children: self.formatTree(res, path)}],
						progressive_render: true
					},
					'core' : { 'initially_open' : [ 'root' ] },
					plugins : [ 'themes', 'json_data', 'types', 'ui', 'crrm', 'contextmenu'] ,
					contextmenu: 
					{
						items: function customMenu(node) {
							var items = {
								renameItem: {
									label: "Revalue",
									action: function () {
										this.rename();
									}
								},
								deleteItem: {
									label: "Delete",
									action: function(){
										this.remove();
									}
								},
								createItem: {
									label: "Create",
									submenu: {
										Key: {
											label: 'Key',
											submenu: {
												'Integer':
												{
													label: 'Integer',
													action: function(){
													this.create( null , 0 , { 
														attr: { node: 'key', mode: 'int', path: this.get_selected().attr('path')}, 
														data: { title: 'New Key' } }
														, null, false );
													}
												},
												'String':{label: 'String',
													action: function(){
														this.create( null , 0 , { attr: {node: 'key', mode: 'string', path: this.get_selected().attr('path') }, data: { title: 'New Key' } } , null, false );
													}
												},
												'Boolean':{label: 'Boolean',
													action: function(){
														this.create( null , 0 , { attr: {node: 'key', mode: 'bool',path: this.get_selected().attr('path') }, data: { title: 'New Key' } }, null, false );
													}
												},
												'Float':{label: 'Float',
													action: function(){
														this.create( null , 0 , { attr: {node: 'key', mode: 'float',path: this.get_selected().attr('path') }, data: { title: 'New Key' } }, null, false );
													}
												}
											}
										},
										Folder: {
											label: 'Folder',
											icon: 'folder',
											action: function(){
														this.create( null , 0 , { attr: {node: 'folder', path: this.get_selected().attr('path') }, data: { title: 'New Folder' }} ,null, false );
											}
										},
										Value: {
											label: 'Value',
											action: function(){
														this.create( null , 0 , { attr: { node: 'value' },data: { title: 'edit Value', attr: { path: this.get_selected().attr('path') } } } ,null, false );
											}
										}
									}
								}
							};

							
							switch( $(node).attr('node') )
							{
								case 'key':
									delete items.createItem.Folder;
									delete items.createItem.Key;
								case 'value':
									delete items.createItem;
									break;
								case 'folder':
									delete items.createItem.Value;
									break;
							}
							return items;
						}
					},
					themes: {
						theme: 'default',
						icons: true,
						dots: false
					}
				}).bind('rename.jstree', function(e, data){
					alert(data.rslt.new_name);
				}).bind('create.jstree', function(e, data){
					if(data.rslt.obj.attr('node') == 'key')
					{
						if(data.rslt.obj.attr('mode') == 'int') var init_value = 0;
						else if(data.rslt.obj.attr('mode') == 'string') var init_value = '';
						else if(data.rslt.obj.attr('mode') == 'bool') var init_value = false;
						else if(data.rslt.obj.attr('mode') == 'float') var init_value = 0.0;
						data.rslt.obj.attr('path', data.rslt.obj.attr('path')+'/'+data.rslt.name);
						$(this).jstree('create', data.rslt.obj, 0, {data: {title: init_value}, attr: {node: 'value', path: data.rslt.obj.attr('path')}}, null, false);
					}
					else if(data.rslt.obj.attr('node') == 'value')
					{
						$.naxx.teleport.System('gconftool-2 --type='+data.rslt.parent.attr('mode')+' --set '+data.rslt.parent.attr('path')+' '+data.rslt.name, function(){});
					}
					else if(data.rslt.obj.attr('node') == 'folder')
					{
						data.rslt.obj.attr('path', data.rslt.obj.attr('path')+'/'+data.rslt.name);
						$.naxx.teleport.System('gconftool-2 --type=bool --set '+data.rslt.obj.attr('path')+'/enable false; gconftool-2 --unset --recursive-unset '+data.rslt.obj.attr('path'), function(){});
					}
				});
			});

			$('#'+href).find('img.rolling').hide();
		},
		gconf: function(){},
		dbus: function(){},
		log4c: function(){}
	});

	$.extend($.naxx, {
		debugconsole: function(){
			if (dialog == null)
			{
			dialog = $('<div class="debugconsole" style="overflow: hidden;"></div>').appendTo('body')
				.debug()
				.dialog({width: 800, height: 400, resizable: true, title: 'Alive Debug Console [Saravee] V0.1'});
			}
			else
			{
				dialog.dialog('open');
			}
		}
	});
})(jQuery);
