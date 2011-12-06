steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/iptable.ejs', 
       function($){

/**
 * @class Naxx.Iptable.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists iptables and lets you destroy them.
 */
$.Controller('Naxx.Iptable.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Iptable.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.iptable').model().destroy();
		}
	},
	"{Naxx.Models.Iptable} destroyed" : function(Iptable, ev, iptable) {
		iptable.elements(this.element).remove();
	},
	"{Naxx.Models.Iptable} created" : function(Iptable, ev, iptable){
		this.element.append(this.view('init', [iptable]))
	},
	"{Naxx.Models.Iptable} updated" : function(Iptable, ev, iptable){
		iptable.elements(this.element)
		      .html(this.view('iptable', iptable) );
	}
});

});