steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/recording.ejs', 
       function($){

/**
 * @class Naxx.Recording.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists recordings and lets you destroy them.
 */
$.Controller('Naxx.Recording.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Recording.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.recording').model().destroy();
		}
	},
	"{Naxx.Models.Recording} destroyed" : function(Recording, ev, recording) {
		recording.elements(this.element).remove();
	},
	"{Naxx.Models.Recording} created" : function(Recording, ev, recording){
		this.element.append(this.view('init', [recording]))
	},
	"{Naxx.Models.Recording} updated" : function(Recording, ev, recording){
		recording.elements(this.element)
		      .html(this.view('recording', recording) );
	}
});

});