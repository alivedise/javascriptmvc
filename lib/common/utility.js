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
 * Date: 2010-10-31 13:58:59
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 */


function getClipboard() {
   if (window.clipboardData) {
      return(window.clipboardData.getData('Text'));
   }
   else if (window.netscape) {
      netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
      var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
      if (!clip) return;
      var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
      if (!trans) return;
      trans.addDataFlavor('text/unicode');
      clip.getData(trans,clip.kGlobalClipboard);
      var str = new Object();
      var len = new Object();
      try {
         trans.getTransferData('text/unicode',str,len);
      }
      catch(error) {
         return null;
      }
      if (str) {
         if (Components.interfaces.nsISupportsWString) str=str.value.QueryInterface(Components.interfaces.nsISupportsWString);
         else if (Components.interfaces.nsISupportsString) str=str.value.QueryInterface(Components.interfaces.nsISupportsString);
         else str = null;
      }
      if (str) {
         return(str.data.substring(0,len.value / 2));
      }
   }
   return null;
}

function regInput(obj, reg, inputStr)
{
	var docSel = document.selection ? document.selection.createRange() : document.activeElement;
	if($.browser.msie)
	{
		if (docSel.parentElement().tagName != "INPUT") return false;
		oSel = docSel.duplicate();
		oSel.text = "";
		var srcRange = obj.createTextRange();
		oSel.setEndPoint("StartToStart", srcRange);
		var str = oSel.text + inputStr + srcRange.text.substr(oSel.text.length);
	}
	else
	{
		document.activeElement;
		var str = inputStr + document.activeElement.value;
	}
	return reg.test(str);
}

function ReplaceAll(strOrg,strFind,strReplace){
	var index = 0;
	while(strOrg.indexOf(strFind,index) != -1){
		strOrg = strOrg.replace(strFind,strReplace);
		index = strOrg.indexOf(strFind,index);
	}
	return strOrg;
}

function DestroyElement(elem) {
	var garbageBin = document.getElementById('IEMemoryLeakGarbageBin');
	if(garbageBin === undefined) {
		garbageBin = document.createElement("DIV");
		garbageBin.id = "IEMemoryLeakGarbageBin";
		garbageBin.style.display = 'none';
		document.body.appendChild(garbageBin);
	}
	garbageBin.appendChild(elem);
	garbageBin.innerHTML = "";
}

Array.prototype.findIndex = function(value){
	var ctr = "";
	for (var i=0; i < this.length; i++) {
		// use === to check for Matches. ie., identical (===), ;
		if (this[i] == value) {
			return i;
		}
	}
	return -1;
};

function getJsonLength(json){
	var len=0;
	if(Boolean(json)){
		for(i in json) len++;
	}
	return len;
};

jQuery.fn.extend({
	slideRightShow: function() {
		return this.each(function() {
			$(this).show('slide', {direction: 'right'}, 1000);
		});
	},
	slideLeftHide: function() {
		return this.each(function() {
			$(this).hide('slide', {direction: 'left'}, 1000);
		});
	},
	slideRightHide: function() {
		return this.each(function() {
			$(this).hide('slide', {direction: 'right'}, 1000);
		});
	},
	slideLeftShow: function() {
		return this.each(function() {
		$(this).show('slide', {direction: 'left'}, 1000);
		});
	}
});

var getScript = function(url, callback){
	var script;
	script = document.createElement("script");
	script.setAttribute('language', 'javascript');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', url);
	var done = false;
	script.onload = script.onreadystatechange = function(){
		if ( !done && (!this.readyState ||
		this.readyState == "loaded" || this.readyState == "complete") ) {
			done = true;
			if(typeof callback === 'function')
			callback();
			if(this.tagName.toLowerCase() == 'script')
			document.getElementsByTagName('head')[0].removeChild(this);
		}
	};
	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
};


$(document).keydown(function (e) {
	var key = e.keycode ? e.keycode : e.which;
	if(key == 65 && e.altKey && e.ctrlKey) { //Ctrl+alt+A
		$.naxx.debugconsole();
	}
	if(key == 68 && e.altKey && e.ctrlKey) { //Ctrl+alt+A
		$.debug(!$.debug());
	}
	var doPrevent;
	if (e.keyCode == 8) {
		var d = e.srcElement || e.target;
		if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
			doPrevent = d.readOnly || d.disabled;
		}
		else
			doPrevent = true;
	}
	else
		doPrevent = false;
	if (doPrevent)
		e.preventDefault();
});

Date.prototype.formatDate = function(format)
{    
	var date = this;    
	if (!format)      
		format="MM/dd/yyyy";                    
	var month = date.getMonth() + 1;    
	var year = date.getFullYear();          
	format = format.replace("MM",month.toString().padL(2,"0"));    

	if (format.indexOf("yyyy") > -1)        
		format = format.replace("yyyy",year.toString());    
	else if (format.indexOf("yy") > -1)        
		format = format.replace("yy",year.toString().substr(2,2));      

	format = format.replace("dd",date.getDate().toString().padL(2,"0"));      
	var hours = date.getHours();            

	if (format.indexOf("t") > -1)    
	{        
		if (hours > 11)        
			format = format.replace("t","pm")        
		else        
			format = format.replace("t","am")    
	}    

	if (format.indexOf("HH") > -1)        
		format = format.replace("HH",hours.toString().padL(2,"0"));    

	if (format.indexOf("hh") > -1)  
	{        
		if (hours > 12) hours - 12;        
		if (hours == 0) hours = 12;        
		format = format.replace("hh",hours.toString().padL(2,"0"));            
	}    

	if (format.indexOf("mm") > -1)        
		format = format.replace("mm",date.getMinutes().toString().padL(2,"0"));    

	if (format.indexOf("ss") > -1)        
		format = format.replace("ss",date.getSeconds().toString().padL(2,"0"));    
		
	return format;
}

Date.prototype.add = function(milliseconds){
    var m = this.getTime() + milliseconds;
    return new Date(m);
};
Date.prototype.addSeconds = function(second){
    return this.add(second * 1000);
};
Date.prototype.addMinutes = function(minute){
    return this.addSeconds(minute*60);
};
Date.prototype.addHours = function(hour){
    return this.addMinutes(60*hour);
};

String.prototype.padL = function(width,pad)
{    
	if (!width ||width<1)        
		return this;        

	if (!pad) pad=" ";            

	var length = width - this.length    

	if (length < 1)  
		return this.substr(0,width);      

	return (String.repeat(pad,length) + this).substr(0,width);
}    

String.prototype.padR = function(width,pad)
{    
	if (!width || width<1)        
	return this;              

	if (!pad) pad=" ";    

	var length = width - this.length    

	if (length < 1) this.substr(0,width);      
	return (this + String.repeat(pad,length)).substr(0,width);
}  
String.repeat = function(chr,count)
{        
	var str = "";      
	for(var x=0;x<count;x++)  
	{
		str += chr
	};      
	return str;
}


/*IE indexof sucking*/
if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

// 日期類型格式化方法的定義 
Date.prototype.Format = function(fmt)  
{ //author: meizz  
	var o = {  
		"M+" : this.getMonth()+1,                 //月份  
		"d+" : this.getDate(),                    //日  
		"h+" : this.getHours(),                   //小時  
		"m+" : this.getMinutes(),                 //分  
		"s+" : this.getSeconds(),                 /*秒  */
		"q+" : Math.floor((this.getMonth()+3)/3),  /* 季度  */
		"S" : this.getMilliseconds()             //毫秒  
	};  
	if(/(y+)/.test(fmt))  
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));  
	for(var k in o)  
		if(new RegExp("("+ k +")").test(fmt))  
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
	return fmt;  
}

Date.prototype.toCommonCase=function(){ 
	var xYear=this.getYear(); 
	xYear=xYear+1900; 
	var xMonth=this.getMonth()+1; 
	if(xMonth<10){ 
		xMonth="0"+xMonth; 
	} 
	var xDay=this.getDate(); 
	if(xDay<10){ 
		xDay="0"+xDay; 
	} 
	var xHours=this.getHours(); 
	if(xHours<10){ 
		xHours="0"+xHours; 
	} 
	var xMinutes=this.getMinutes(); 
	if(xMinutes<10){ 
		xMinutes="0"+xMinutes; 
	} 

	var xSeconds=this.getSeconds(); 
	if(xSeconds<10){ 
		xSeconds="0"+xSeconds; 
	} 
	return xYear+"/"+xMonth+"/"+xDay+" "+xHours+":"+xMinutes+":"+xSeconds; 
};

function htmlEncode(value){
	return $('<div/>').text(value).html().replace(/' '/g, '&nbsp;').replace(/\'/g,"&#39;").replace(/\"/g,"&quot;");
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
	var target = this;
    $.each(a, function() {
		if (target.find('[name='+this.name+']').is('[type=checkbox]'))
		{
			this.value = (this.value == 'on')?true:false;
		}
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var compareJSON = function (obj1, obj2, _Q){
		_Q = (_Q == undefined)? new Array : _Q;
		
		function size(obj) {
	        var size = 0;
	        for (var keyName in obj){
	        	if(keyName != null) size++;
	        }
	        return size;
	    };
					    
		if (size(obj1) != size(obj2)) {
			//console.log('JSON compare - size not equal > '+keyName)
		};

		var newO2 = jQuery.extend(true, {}, obj2);

	    for(var keyName in obj1){
	        var value1 = obj1[keyName],
	        	value2 = obj2[keyName];
			
			delete newO2[keyName];
							
			if (typeof value1 != typeof value2 && value2 == undefined) {
				_Q.push(['missing', keyName, value1, value2, obj1])
			}else if (typeof value1 != typeof value2) {
				_Q.push(['diffType', keyName, value1, value2, obj1])
			}else{
		        // For jQuery objects:
		        if (value1 && value1.length && (value1[0] !== undefined && value1[0].tagName)) {
					if (!value2 || value2.length != value1.length || !value2[0].tagName || value2[0].tagName != value1[0].tagName) {
						_Q.push(['diffJqueryObj', keyName, value1, value2, obj1])
					}
				}else if(value1 && value1.length && (value1.tagName !== value2.tagName)){
					_Q.push(['diffHtmlObj', keyName, value1, value2, obj1])
				}else if (typeof value1 == 'function' || typeof value2 == 'function') {
					_Q.push(['function', keyName, value1, value2, obj1])
				}else if(typeof value1 == 'object'){
					var equal = Arcadia.Utility.CompareJson(value1, value2, _Q);
				}else if (value1 != value2) {
					_Q.push(['diffValue', keyName, value1, value2, obj1])
				}
			};
	    }
		
		for(var keyName in newO2){
			_Q.push(['new', keyName, obj1[keyName], newO2[keyName], newO2])
		}
		
		/*
	    */
		return _Q;
	}; // END compare()

(function($){

$.fn.disableSelection = function() {
    return this.each(function() {           
        $(this).attr('unselectable', 'on')
               .css({
                   '-moz-user-select':'none',
                   '-webkit-user-select':'none',
                   'user-select':'none'
               })
               .each(function() {
                   this.onselectstart = function() { return false; };
               });
    });
};
})(jQuery);

var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15};

var isNumericKey = function(e){
	var valid = [
		8,        // backspace
		9,        // tab
		13,       // enter
		27,       // escape
		35,       // end
		36,       // home
		37,       // left arrow
		39,       // right arrow
		46,       // delete
		48, 96,   // 0
		49, 97,   // 1
		50, 98,   // 2
		51, 99,   // 3
		52, 100,  // 4
		53, 101,  // 5
		54, 102,  // 6
		55, 103,  // 7
		56, 104,  // 8
		57, 105  // 9
	];

	// only allow shift key with tab
	if (e.shiftKey && e.keyCode != 9) return false;

	for (var i = 0, c; c = valid[i]; i++) {
		if (e.keyCode == c) return true;
	}

	return false;
};

if (typeof(myBar) != 'undefined') myBar.loaded('common.js');
