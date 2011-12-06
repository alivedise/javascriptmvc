steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/protocol.ejs', 
       function($){

/**
 * @class Naxx.Protocol.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists protocols and lets you destroy them.
 */
$.Controller('Naxx.Protocol.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Protocol.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.protocol').model().destroy();
		}
	},
	"{Naxx.Models.Protocol} destroyed" : function(Protocol, ev, protocol) {
		protocol.elements(this.element).remove();
	},
	"{Naxx.Models.Protocol} created" : function(Protocol, ev, protocol){
		this.element.append(this.view('init', [protocol]))
	},
	"{Naxx.Models.Protocol} updated" : function(Protocol, ev, protocol){
		protocol.elements(this.element)
		      .html(this.view('protocol', protocol) );
	}
});

});