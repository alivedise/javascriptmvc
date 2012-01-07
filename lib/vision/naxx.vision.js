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
 * Date: 2010-11-17 11:08:33
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.vision: make a web vision of several views
 *
 */

;(function($) {
	$.widget("naxx.vision", {
		/*Initial options Value of Layout*/
		options : {
			mode: 'liveview',    //default mode: live-view
			total: 16,
			layout: "4x4",
			name: '',
			index: 0, //vision index
			TotalView: 16,
			TotalViewColumn: 4,
			TotalViewRow: 4,
			WidthPerUnit: [],
			HeightPerUnit: [],
			OccupiedArray: [],
			StartChannel: 0,
			MaxHeight: -1,
			MaxWidth: -1,
			rotate: 3,
			bAnimate: false,
			view: {},
			max: 4,
			bRotate: false
		},


		object : {
			$timer : null,
			$rotate : null
		},
		
		/*Overriding _init of $.widget*/
		_create: function() {
			var self = this;
			var element = $(this.element);
			element.addClass('vision').addClass(self.options.mode);

			if (this.options.mode == 'playback') this.options.layout = '1x1';  //default 1x1

			for (var i = 0; i < $.naxx.capability.container; i++)
			{
				$('<div class="view" vid="'+i+'" content="-1"></div>').view({
					type: self.options.mode //Live or Playback, default is live.
				}).appendTo(element);
			}

			this.object.$view = $(':naxx-view', element);
			
			this._initLengthPerUnit();
			$(document).bind('keydown', function(event){
				var act = $(':naxx-view.active');
				if(act.length == 0) return true;
				if(act.view('status') == 0) return true;
				if(act.find('.plugin.occupied').length > 0)
				{
					var channel = $(':naxx-view.active').view('option', 'content');
					if((event.keyCode && event.keyCode == 13) || (event.which == 13)) //enter
					{
					}
					else
					{
						act.view('showBookmark');
					}
				}
			});
		},			

		_init: function(){
			var self = this, element = $(this.element);
			for (var i = 0; i < $.naxx.capability.encoder; i++)
				self.object.$view.eq(i).view(self.options.view[i]);
			this.displayLayout(self.options.layout);
			this.playqueue();
			this.polling();
		},

		playqueue: function(){
			var self = this, element = $(this.element);
			if(self.options.mode != 'playback') return;
			if($(':naxx-playqueue').length == 0) return;

			$.each($(':naxx-playqueue').playqueue('option', 'list'), function(index, value){
					$('.plugin.free:eq(0)').parent().view($.extend({type: 'playback'}, value));
			});
		},
		
		/*member function: init unit length to 1*/
		_initLengthPerUnit : function() {
			for (var i = 0; i < 5*5 ; i++)
			{
				this.options.WidthPerUnit[i] = 1;
				this.options.HeightPerUnit[i] = 1;
				this.options.OccupiedArray[i] = i;
			}
		},

		polling : function(){
			var self = this, element = $(this.element);
		},

		//下一頁
		displayNext : function(bRotate) {
			var self = this, element = $(this.element);

			/*No Next Viewcells*/
			var nextStartChannel = this.options.StartChannel + this.options.TotalView;
			if(nextStartChannel >= this.options.total)
			{
				if (bRotate) 
				{
					this.options.StartChannel = 0;
					this.displayLayout();
					return;
				}
				else
				{
					return;
				}
			}
			else
			{
				var bStillHasOccupied = true;
				for(var i = nextStartChannel; i < self.options.total; i++)
				{
					if(self.options.view[i].content >= 0) //find validate cell
					{
						if(bRotate)
						{
							this.options.StartChannel = i - i%this.options.TotalView;
						}
						else
							this.options.StartChannel = nextStartChannel;
						this.displayLayout();
						return;
					}
				}
			}
			if (bRotate) 
			{
				this.options.StartChannel = 0;
				this.displayLayout();
				return;
			}
			else
			{
				this.options.StartChannel = nextStartChannel;
				this.displayLayout();
			}
		},

		//上一頁
		displayPrev : function() {
			var self = this, element = $(this.element);

			var prevStartChannel = this.options.StartChannel;
			prevStartChannel -= this.options.TotalView;
			if(prevStartChannel < 0) {
				return;
			}
			else this.options.StartChannel = prevStartChannel;
			this.displayLayout();
			if(prevStartChannel - self.options.TotalView < 0) return false;
			else return true;
		},

		displayRotate : function(bRotate){
			var self = this;
			self.options.bRotate = bRotate;
			if (bRotate)
			{
				self.object.$rotate = setInterval(function(){
					self.displayNext(bRotate);
				},
				self.options.rotate*1000);
			}
			else
			{
				self.checkPrev();
				clearInterval(self.object.$rotate);
			}
		},

		checkPrev: function(){
			var self = this;
			var element = $(this.element);
			if(self.options.StartChannel  > 0)
			{
				$(':naxx-vivobutton.page-left').vivobutton('enable');
			}
			else
			{
				$(':naxx-vivobutton.page-left').vivobutton('disable');
			}
		},
		checkNext: function(){
			var self = this;
			var element = $(this.element);
			if(self.options.StartChannel + self.options.TotalView >= $.naxx.capability.encoder)
			{
				$(':naxx-vivobutton.page-right').vivobutton('disable');
			}
			else
			{
				$(':naxx-vivobutton.page-right').vivobutton('enable');
			}
		},

		saveVision : function(){
			var self = this;
			var element = $(this.element);

			$.naxx.desktop.vision[self.options.index].layout = self.options.layout;
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				$.naxx.desktop.vision[self.options.index].view[i].type = self.object.$view.eq(i).view('option', 'type');
				//$.naxx.desktop[index].Container[i].Position = self.object.$view.eq(i).position();
				$.naxx.desktop.vision[self.options.index].view[i].content = self.object.$view.eq(i).view('option', 'content');
			}
			
			$.naxx.teleport.Import(
				$.naxx.path.vision+'/'+self.options.index,
				$.naxx.desktop.vision[self.options.index]
			);
		},

		/*member function: print layout*/
		displayLayout : function(style, startchannel) {
			var self = this;
			var element = $(this.element);
			var $view = self.object.$view;

			var focused_view = -1;
			if(element.find('div.view.active').length > 0)
			{
				focused_view = Number(element.find('div.view.active').attr('vid'));
			}
			this._initLengthPerUnit();
			if (style != undefined)
			{
				this.options.layout = style;
				this.options.StartChannel = 0;
			}
			$(':naxx-vivobutton[layout='+self.options.layout+']').vivobutton('active');

			if (startchannel != null)
			{
				this.options.StartChannel = startchannel;
			}
			
			this.options.MaxWidth = element.width();
			this.options.MaxHeight = element.height();
			switch (this.options.layout)
			{
				case "1x1":
					this.options.TotalView = 1;
					this.options.TotalViewColumn = 1;
					this.options.TotalViewRow = 1;
					break;
				case "1+3":
					this.options.TotalView = 4;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[0] = 2;
					this.options.HeightPerUnit[0] = 3;
					this.options.OccupiedArray = [0,0,1,0,0,2,0,0,3];
					break;
				case "1_3":
					this.options.TotalView = 4;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[0] = 3;
					this.options.HeightPerUnit[0] = 2;
					this.options.OccupiedArray = [0,0,0,0,0,0,1,2,3];
					break;
				case "2x2":
					this.options.TotalView = 4;
					this.options.TotalViewColumn = 2;
					this.options.TotalViewRow = 2;
					break;
				case "3x3":
					this.options.TotalView = 9;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					break;
				case "4x4":
					this.options.TotalView = 16;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					break;
				case "1+12":
					this.options.TotalView = 13;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[0] = 2;
					this.options.HeightPerUnit[0] = 2;
					this.options.OccupiedArray = [0,0,1,2,0,0,3,4,5,6,7,8,9,10,11,12];
					break;
				case "1+7":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[0] = 3;
					this.options.HeightPerUnit[0] = 3;
					this.options.OccupiedArray = [0,0,0,1,0,0,0,2,0,0,0,3,4,5,6,7];
					break;
				case "1+5":
					this.options.TotalView = 6;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[0] = 2;
					this.options.HeightPerUnit[0] = 2;
					this.options.OccupiedArray = [0,0,1,0,0,2,3,4,5];
					break;
				case "12+1":
					this.options.TotalView = 13;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[2] = 2;
					this.options.HeightPerUnit[2] = 2;
					this.options.OccupiedArray = [0,1,2,2,3,4,2,2,5,6,7,8,9,10,11,12];
					break;
				case "7+1":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[1] = 3;
					this.options.HeightPerUnit[1] = 3;
					this.options.OccupiedArray = [0,1,1,1,2,1,1,1,3,1,1,1,4,5,6,7];
					break;
				case "5+1":
					this.options.TotalView = 6;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[1] = 2;
					this.options.HeightPerUnit[1] = 2;
					this.options.OccupiedArray = [0,1,1,2,1,1,3,4,5];
					break;
				case "12_1":
					this.options.TotalView = 13;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[10] = 2;
					this.options.HeightPerUnit[10] = 2;
					this.options.OccupiedArray = [0,1,2,3,4,5,6,7,8,9,10,10,11,12,10,10];
					break;
				case "7_1":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[5] = 3;
					this.options.HeightPerUnit[5] = 3;
					this.options.OccupiedArray = [0,1,2,3,4,5,5,5,6,5,5,5,7,5,5,5];
					break;
				case "5_1":
					this.options.TotalView = 6;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[4] = 2;
					this.options.HeightPerUnit[4] = 2;
					this.options.OccupiedArray = [0,1,2,3,4,4,5,4,4];
					break;
				case "1_12":
					this.options.TotalView = 13;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[8] = 2;
					this.options.HeightPerUnit[8] = 2;
					this.options.OccupiedArray = [0,1,2,3,4,5,6,7,8,8,9,10,8,8,11,12];
					break;
				case "1_7":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[4] = 3;
					this.options.HeightPerUnit[4] = 3;
					this.options.OccupiedArray = [0,1,2,3,4,4,4,5,4,4,4,6,4,4,4,7];
					break;
				case "1_5":
					this.options.TotalView = 6;
					this.options.TotalViewColumn = 3;
					this.options.TotalViewRow = 3;
					this.options.WidthPerUnit[3] = 2;
					this.options.HeightPerUnit[3] = 2;
					this.options.OccupiedArray = [0,1,2,3,3,4,3,3,5];
					break;
				case "12[1]":
					this.options.TotalView = 13;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 4;
					this.options.WidthPerUnit[5] = 2;
					this.options.HeightPerUnit[5] = 2;
					this.options.OccupiedArray = [0,1,2,3,4,5,5,6,7,5,5,8,9,10,11,12];
					break;
				case "4x2":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 2;
					this.options.TotalViewRow = 4;
					break;
				case "2x4":
					this.options.TotalView = 8;
					this.options.TotalViewColumn = 4;
					this.options.TotalViewRow = 2;
					break;
				}
						
				$view.hide();
//				for ( var i = this.options.TotalView; i < 25; i++ ) $view.eq(i).hide();

						//Disconnect View First!
				for ( var i = 0; i < this.options.TotalView; i++ )
				{
					var TopN = parseInt(this.options.OccupiedArray.indexOf(i) / this.options.TotalViewColumn, 10);
					var LeftN = this.options.OccupiedArray.indexOf(i) % this.options.TotalViewColumn;
					var targetView = $view.eq(i+this.options.StartChannel);
					
						var width = this.options.WidthPerUnit[i]*this.options.MaxWidth/this.options.TotalViewColumn - 6;
						var height = this.options.HeightPerUnit[i]*this.options.MaxHeight/this.options.TotalViewRow - 6;
						var top = TopN*this.options.MaxHeight/this.options.TotalViewRow;
						var left = LeftN*this.options.MaxWidth/this.options.TotalViewColumn;
						if(targetView.hasClass('active'))
						{
							switch(this.options.layout)
							{
							case '1x1':
								var focus_width = element.width()-10;
								var focus_height = element.height()-20-50;
								var focus_top = top;
								var focus_left = left;
								targetView.addClass('max');
								break;
							default:
								var focus_width = width*1.1;
								var focus_height = height*1.1;
								if(focus_width <  targetView.view('option', 'min_width'))
									focus_width = targetView.view('option', 'min_width');
								var focus_top =  top - 0.05*height - 9;
								var focus_left =  left - (focus_width - width)/2 - 9;
								if (focus_top < 0) focus_top = 0;
								else if (focus_top > element.height() - focus_height - 40) focus_top = element.height() - focus_height - 40 - 10 ;
								if (focus_left < 0){
									focus_left = 0;
								}
								else if (focus_left > element.width() - focus_width){
									focus_left = element.width() - focus_width -13 ;
								}
								break;
							}
							if(i == 0)
							{
								if(self.options.layout == '1+3')
									focus_height = element.height()-10-40;
								if(self.options.layout == '1_3')
									focus_width = element.width()-10;
							}
							targetView.show()
								  .css({top: focus_top, left: focus_left})
								  .view('option', {top: top, left: left, height: height, width: width, mtop: focus_top, mleft: focus_left, mwidth: focus_width ,mheight: focus_height})
								  .width('auto').height('auto');
								  targetView.find('.plugin').css(
								  {
										width: focus_width,
										height: focus_height
								  });
						}
						else
						{
							targetView.show()
								  .css({top: top, left: left})
								  .view('option', {top: top, left: left, height: height, width: width})
								  .width(width).height(height);
								  targetView.find('.plugin').css(
								  {
										width: width,
										height: height
								  });
						}
			}
			self.checkNext();
			self.checkPrev();
		},
		
		destroy : function(){
			this.displayRotate(false);
			$(':naxx-view', $(this.element)).view('destroy');
			$(this.element).children().unbind().remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			clearTimeout(self.object.$timer);
			element.removeClass('liveview playback');
		}
	});
})(jQuery);
