steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/encoderl.ejs', 
       function($){

/**
 * @class Naxx.Encoderl.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists encoderls and lets you destroy them.
 */
$.Controller('Naxx.Encoderl.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Encoderl.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.encoderl').model().destroy();
		}
	},
	"{Naxx.Models.Encoderl} destroyed" : function(Encoderl, ev, encoderl) {
		encoderl.elements(this.element).remove();
	},
	"{Naxx.Models.Encoderl} created" : function(Encoderl, ev, encoderl){
		this.element.append(this.view('init', [encoderl]))
	},
	"{Naxx.Models.Encoderl} updated" : function(Encoderl, ev, encoderl){
		encoderl.elements(this.element)
		      .html(this.view('encoderl', encoderl) );
	}
});

});