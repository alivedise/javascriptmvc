steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/volume.ejs', 
       function($){

/**
 * @class Naxx.Volume.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists volumes and lets you destroy them.
 */
$.Controller('Naxx.Volume.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Volume.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.volume').model().destroy();
		}
	},
	"{Naxx.Models.Volume} destroyed" : function(Volume, ev, volume) {
		volume.elements(this.element).remove();
	},
	"{Naxx.Models.Volume} created" : function(Volume, ev, volume){
		this.element.append(this.view('init', [volume]))
	},
	"{Naxx.Models.Volume} updated" : function(Volume, ev, volume){
		volume.elements(this.element)
		      .html(this.view('volume', volume) );
	}
});

});