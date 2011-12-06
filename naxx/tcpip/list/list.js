steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/tcpip.ejs', 
       function($){

/**
 * @class Naxx.Tcpip.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists tcpips and lets you destroy them.
 */
$.Controller('Naxx.Tcpip.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Tcpip.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.tcpip').model().destroy();
		}
	},
	"{Naxx.Models.Tcpip} destroyed" : function(Tcpip, ev, tcpip) {
		tcpip.elements(this.element).remove();
	},
	"{Naxx.Models.Tcpip} created" : function(Tcpip, ev, tcpip){
		this.element.append(this.view('init', [tcpip]))
	},
	"{Naxx.Models.Tcpip} updated" : function(Tcpip, ev, tcpip){
		tcpip.elements(this.element)
		      .html(this.view('tcpip', tcpip) );
	}
});

});