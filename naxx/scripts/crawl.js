// load('naxx/scripts/crawl.js')

load('steal/rhino/rhino.js')

steal('steal/html/crawl', function(){
  steal.html.crawl("naxx/naxx.html","naxx/out")
});
