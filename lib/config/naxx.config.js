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
	$.widget("naxx.config", {
		options : {
			channel: 0,
			path: ''
		},

		grid: {
			PROCESSING: '<img class="normal" src="images/gif/jqgrid-row-processor.gif" /><img class="active" src="images/gif/active-jqgrid-row-processor.gif" /><img class="hover" src="images/gif/hover-jqgrid-row-processor.gif" />'
		},

		object: {
			$grid: {
				scan: null,
				camera: null,
				emap: null,
				sata: null,
				hdd: null,
				usb: null,
				formHtml: null
			},
			$timer: null,
			$timeout: null,
			$interval: null,
			$layout: null,
			$dialog: null,
			$oldconfig: null,
			$loader: null,
			model: null
		},
		weekday_index: {'MO': 0, 'TU': 1, 'WE': 2, 'TH': 3, 'FR': 4, 'SA': 5, 'SU': 6},
		weekday_array: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
		weekday_symbol: [{symbol: 'text:MO'}, {symbol:'text:TU'}, {symbol:'text:WE'}, {symbol:'text:TH'}, {symbol:'text:FR'}, {symbol:'text:SA'}, {symbol:'text:SU'}],

		publicReload : function(){
			var self = this, element = $(this.element);
			self.reloadPrivate();
		},
		initPublicButton: function(){
			var self = this, element = $(this.element);
			$('div.widget-head h3', element).remove();
			for (var i = 0; i < self.buttons.length; i++)
			{
				//$('<span></span>').vivobutton(self.buttons[i]).appendTo($('div.widget-head', element));
				if(self.buttons[i].callback)
					$('<button class="ui-corner-all" symbol='+self.buttons[i].attr.symbol+'>'+self.buttons[i].text+'</button>').attr(self.buttons[i].attr).button().click(self.buttons[i].callback).appendTo($('div.widget-head', element));
				else
					$('<button class="ui-corner-all" symbol='+self.buttons[i].attr.symbol+'>'+self.buttons[i].text+'</button>').attr(self.buttons[i].attr).button().appendTo($('div.widget-head', element));

			}
			self.initPrivateButton();
		},
		beforeSave: function(){
			return true;
		},
		save: function(){
			var self = this, element = $(this.element);
			var data = {};
			if(!self.beforeSave()) return;
			if(!this.check()) return;
			$('input,select', element).each(
				function(index){
					if($(this).prop('name') == '') return;
					if($(this).attr('type') == 'radio')
						data[$(this).prop('name')] = $('[name='+$(this).prop('name')+']:checked').val();
					else if($(this).attr('type') == 'checkbox')
						data[$(this).prop('name')] = $(this).prop('checked');
					else
					{
						if($(this).attr('_type') == 'int')
							data[$(this).prop('name')] = Number($(this).val());
						else
							data[$(this).prop('name')] = $(this).val();
					}
				}
			);

			$.naxx.teleport.Import($.naxx.path.raphael+self.options.path, data,
				function(){
					$.naxx.discard = true;
			});
		},
		empty: function(){
			$('input,select').each(function(index){
				if($(this).attr('type')=='checkbox' || $(this).attr('type')=='radio') $(this).attr('checked', false);
				else $(this).val('');
			});
		},
		reload: function(){
			var self = this, element = $(this.element);
			self.empty();
			$.naxx.teleport.Export($.naxx.path.raphael + self.options.path,
				function(res){
					for (var i in res)
					{
						if($('[name='+i+']').attr('type') == 'radio' )
						{
							$('[name='+i+']').attr('checked', false);
							$('[name='+i+'][value='+res[i]+']').attr('checked', true).siblings('a.jqTransformRadio').addClass('jqTransformChecked');
						}
						else if($('[name='+i+']').attr('type') == 'checkbox')
						{
							if(res[i] == true)
								$('[name='+i+']').attr('checked', true).siblings('a.jqTransformCheckbox').addClass('jqTransformChecked');
							else
								$('[name='+i+']').attr('checked', false);
						}
						else
						{
							$('[name='+i+']').val(res[i]);
						}

					}
					$('form div.jqTransformSelectWrapper select').each(function(){
						$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
					});
					$('form div.jqTransformCheckboxWrapper input').each(function(){
						$(this).trigger('change'); 
					});
					self.reloadPrivate(res);
					self.object.model = res;
				}
			);
		},
		check: function(){
			var self = this, element = $(this.element);
			var pass = true;
			$('.check', element).remove();
			$('input.needed', element).each(function(){
				if($(this).val() == '')
				{
					if($(this).find('.check').length==0) $('<span class="check ui-icon ui-icon-alert"></span>').insertAfter($(this).parent().parent().parent());
					$(this).addClass('unsatisfied');
					pass = false;
				}
				else
				{
					$(this).find('.check.ui-icon-alert').remove();
					$(this).removeClass('unsatisfied');
				}
			});
			return pass;
		},
		initPrivateButton: function(){}, //to be derived
		reloadPrivate: function(res){}, //to be derived
		initOther: function(){},
		initButton: function(){this.initPublicButton(); this.initPrivateButton();},
		initLayout: function(){
			var self = this, element = $(this.element);
			if($('.wizard', element).length > 0) return;
			if($('.tablePanel').length > 0 && $('.statusPanel').length > 0)
			{
				self.object.$layout = element.layout({
					showOverflowOnHover: false,
					resizerClass: 'table_resizer',
					north: {
						showOverflowOnHover: false,
						size: 56,
						minSize: 56,
						resizerClass: 'table_resizer',
						paneSelector: '.widget-head',
						spacing_open: 0,
						spacing_closed: 0,
						resizable: false
					},
					center: {
						showOverflowOnHover: false,
						resizerClass: 'table_resizer',
						paneSelector: '.tablePanel',
						closable: true
					},
					south: {
						showOverflowOnHover: false,
						paneSelector: '.statusPanel',
						resizerClass: 'table_resizer',
						size: 250,
						spacing_open: 1,
						spacing_closed: 1,
						resizable: true,
						slidable: false,
						closable: false
					},
					onresize_end: function(){
						self.resize();
					}
				});
			}
			else if ($('.tablePanel').length > 0) //iptables only(?)
			{
				self.object.$layout = element.layout({
					showOverflowOnHover: false,
					resizerClass: 'table_resizer',
					north: {
						showOverflowOnHover: false,
						size: 56,
						minSize: 56,
						resizerClass: 'table_resizer',
						paneSelector: '.widget-head',
						spacing_open: 0,
						spacing_closed: 0,
						resizable: false
					},
					center: {
						showOverflowOnHover: false,
						resizerClass: 'table_resizer',
						paneSelector: '.tablePanel',
						closable: true
					},
					onresize_end: function(){
						self.resize();
					}
				});
			}
			else if ($('.statusPanel').length > 0)
			{
				self.object.$layout = element.layout({
					showOverflowOnHover: false,
					north: {
						showOverflowOnHover: false,
						size: 56,
						minSize: 56,
						resizerClass: 'table_resizer',
						paneSelector: '.widget-head',
						spacing_open: 0,
						spacing_closed: 0,
						resizable: false
					},
					center: {
						showOverflowOnHover: false,
						resizerClass: 'table_resizer',
						paneSelector: '.statusPanel',
						spacing_open: 0,
						spacing_closed: 0
					}
				});
			}
			element.find('.tablePanel').watch('height,width',function(){
				//20110314 Alive: hdiv must be considered.
				self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height());
				self.object.$grid.setGridWidth($(this).width());
			});
		},
		initTable: function(){},
		RowState: function(row_index, state, target_grid){
			var self = this, element = $(this.element);
			if(typeof(target_grid) == 'undefined')
			{
				target_grid = self.object.$grid;
				if(self.object.$grid == null) return;
			}
			switch(state)
			{
			case 'MODIFIED':
				target_grid.setRowData(row_index+1, {modified: '*'}, 'ui-jqgrid-new');
				break;
			case 'SAVED':
				/*globally*/
				target_grid.setRowData(row_index+1, {modified: ''}, 'ui-jqgrid-new');
				$('#'+row_index+'[role=row]', element).removeClass('ui-jqgrid-new');
				break;
			case 'PROCESSING':
				target_grid.setRowData(row_index+1, {modified: '<img src="images/gif/jqgrid-row-processor.gif" />'});
				break;
			case 'SUCCESS':
				$('#'+row_index+'[role=row]', element).removeClass('ui-jqgrid-new');
				target_grid.setRowData(row_index+1, {modified: '<span class="ui-icon ui-icon-check" />'});
				break;
			case 'FAILED':
			case 'TIMEOUT':
				//$('#'+row_index+'[role=row]', element).removeClass('ui-jqgrid-new');
				target_grid.setRowData(row_index+1, {modified: '<span class="ui-icon ui-icon-close" />'});
				break;
			case 'CLEANALL':
				$('[role=row]', element).removeClass('ui-jqgrid-new');
				$.each(target_grid.getRowData(), function(index, data){
					target_grid.setRowData(index+1, {modified: ''});
				});
				break;
			}
		},
		resize: function(){
			var self = this, element = $(this.element);
			if(self.object.$grid!=null)
			{
				self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', $(this)).height() - $('#pjmap').height());
				self.object.$grid.setGridWidth(element.find('.tablePanel').width());
			}
			self.resizePrivate();
		},
		resizePrivate: function(){
			var self = this, element = $(this.element);
		},


		_create: function(){
			var self = this, element = $(this.element);
			element.data('widget', self);

		},

		clearWarFog: function(){
				var self = this, element = $(this.element);
				element.find('.statusPanel').unblock({
					fadeIn: 0,
					fadeOut: 0
				});
		},

		_init : function(){
			var self = this, element = $(this.element);
			var clone = $('.statusPanel', element).clone();
			clone.children('div.blockUI').remove();
			self.object.formHtml = clone.html();
			self.object.$timeout = null;
			self.object.$interval = null;

			//jqGrid一定要有id, 此處強制將所有無id table加上id
			$('table', element).each(function(index){
				if($(this).prop('id') == '')
				{
					$(this).prop('id', 'grid'+index);
				}
			});
			self.initButton();
			self.initLayout();
			self.initTable();
			self.reload();
			self.unicorn();
			self.initOther();
		},

		//動態表單控制項美化
		unicorn: function(){
			var self = this, element = $(this.element);
			self.transform();
			$('form').bind('grid', function(){
				if(self.object.$grid != null)
				{
					self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
					self.object.$grid.jqGrid('setRowData', self.options.channel+1, {modified: '*'}, 'ui-jqgrid-new');
				}
			});
			$('form', element).change(function(){
					self.check();
			});
			$('form input', element).mouseleave(function(){
					self.check();
			});
			
		},

		beforeTransform : function(){},
		afterTransform : function(targetForm){
			var self = this, element = $(this.element);
			targetForm.find("div.jqTransformSelectWrapper ul li a", element).click(function(){
				$(this).parent().parent().siblings('select').trigger('change');
				return false; //prevent default browser action
			});
			targetForm.find('div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
			});
			targetForm.find('.jqTransformCheckboxWrapper input').each(function(){
					$(this).trigger('change');
			});
		},

		apply : function(){
			this.save();
		},

		transform: function(targetForm){
			var self = this, element = $(this.element);
			if(!targetForm)
				targetForm = $('.statusPanel form', element);
			if(targetForm.is('.jqtransformdone')) return true;
			self.beforeTransform();
			targetForm.find('input,select').parent('div').addClass('rowElem');
			targetForm.jqTransform();
			if(element.find('.blockUI').length>0) self.clearWarFog();
			self.afterTransform(targetForm);
			self.ValidateBinding();
		},

		ValidateBinding: function(){},

		getCurrentModel: function(){
			var self = this, element = $(this.element);
			if(element.find('.tablePanel').length > 0)
			{
			}
			else
			{
				return $('form').serializeObject();
			}
		},

		addAlertIcon: function(target) {
			if(target.siblings('.check').length==0) $('<span class="check ui-icon ui-icon-alert"></span>').appendTo(target.parent());
			target.addClass('unsatisfied');
		},

		removeAlertIcon: function(target){
			target.siblings('.check').remove();
			target.removeClass('unsatisfied');
		},

		modelChanged: function(){
			var self = this, element = $(this.element);
			var changed = false;
			if(element.find('table').length>0) return false;
			if(self.object.model==null) return false;
			$.each(self.getCurrentModel(), function(key, value){
				if(self.object.model[key] != value)
				{
					if (value=='nochange'&&key=='type') return true;
					changed = true;
					return false;
				}
			});
			return changed;
		},

		/*
		 * User self.object.formHtml as View,
		 * Rebuild the form w/ jqtransform and eventbinding and then validate binding
		 * After rebuild, call the individual constructor.
		 *
		 * */
		rebuildForm: function(){
			var self = this, element = $(this.element);
			$('.statusPanel', element).children().remove();
			$('.statusPanel').html(self.object.formHtml);
			
			self.privateConstructorInit();

			if (self.object.$grid)
				self.object.$grid.GridToForm(self.options.index >= 0 ? self.options.index+1 : self.options.channel+1);

			self.transform();

			if (self.object.$grid)
				$('.statusPanel', element).find('input,select').change(function(){
					self.object.$grid.jqGrid('FormToGrid', self.options.index >= 0 ? self.options.index+1 : self.options.channel+1, 'form');
					self.RowState(self.options.index >= 0 ? self.options.index : self.options.channel, 'MODIFIED');
				});

			self.privateConstructorEnd();
		},

		privateConstructorInit: function(){},
		privateConstructorEnd: function(){},

		destroy : function(){
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			clearInterval(self.object.$interval);
			clearTimeout(self.object.$timeout);
			$.each($.naxx.ajax_queue, function(k, v){
				if(typeof(v)!='undefined') v.abort();
			});
			$.naxx.ajax_queue = [];
			self.object.$grid = null;
		}
	});
})(jQuery);
