steal("funcunit/qunit", "naxx/fixtures", "naxx/models/bookmark.js", function(){
	module("Model: Naxx.Models.Bookmark")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Bookmark.findAll({}, function(bookmarks){
			ok(bookmarks)
	        ok(bookmarks.length)
	        ok(bookmarks[0].name)
	        ok(bookmarks[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Bookmark({name: "dry cleaning", description: "take to street corner"}).save(function(bookmark){
			ok(bookmark);
	        ok(bookmark.id);
	        equals(bookmark.name,"dry cleaning")
	        bookmark.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Bookmark({name: "cook dinner", description: "chicken"}).
	            save(function(bookmark){
	            	equals(bookmark.description,"chicken");
	        		bookmark.update({description: "steak"},function(bookmark){
	        			equals(bookmark.description,"steak");
	        			bookmark.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Bookmark({name: "mow grass", description: "use riding mower"}).
	            destroy(function(bookmark){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})