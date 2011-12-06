steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/profile.ejs', 
       function($){

/**
 * @class Naxx.Profile.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists profiles and lets you destroy them.
 */
$.Controller('Naxx.Profile.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Profile.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.profile').model().destroy();
		}
	},
	"{Naxx.Models.Profile} destroyed" : function(Profile, ev, profile) {
		profile.elements(this.element).remove();
	},
	"{Naxx.Models.Profile} created" : function(Profile, ev, profile){
		this.element.append(this.view('init', [profile]))
	},
	"{Naxx.Models.Profile} updated" : function(Profile, ev, profile){
		profile.elements(this.element)
		      .html(this.view('profile', profile) );
	}
});

});