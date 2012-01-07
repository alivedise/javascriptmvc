steal( 'jquery/controller','jquery/view/ejs', 'mxui/data/grid','naxx/models' )
	.then( './views/init.ejs', function($){

/**
 * @class Naxx.User.Grid
 */
$.Controller('Naxx.User.Grid',
/** @Static */
{
	defaults : {
		model: null
	}
},
/** @Prototype */
{
	init : function(){
		this.element.mxui_data_grid({
			model: Naxx.Models.User,
			row: '//naxx/user/grid/views/init.ejs',
			columns: {
				username: "Username",
				group: "Group",
				langauge: "Language"
			},
		});
	}
})

});
