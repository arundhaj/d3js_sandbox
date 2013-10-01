var top250List = []

var mrow = 10, mcol = 25;
var availableHeight = 0, availableWidth = 0;
var imgHeight = 0, imgWidth = 0;

$( document ).ready(function() {
    drawMovies();
    utilsWindowResize(drawMovies);
});

var sortingType = 0; // by rating

$("#sortToggle").click(function(e) {
	var mysvg = d3.select('#imdb svg');
	if(e.button == 0) {

		if(sortingType == 0) {
			var mov = mysvg.selectAll("image")
					// .transition()
					.sort(function(a, b) {
						return d3.ascending(a.name, b.name);
						//return (a["name"] > b["name"]) ? 1 : ((a["name"] < b["name"]) ? -1 : 0);
					})
					.transition()
			    	//.delay(1000) // function(d, i) { return i * 50})
			    	.duration(2000)
			    	.ease("linear")
				   	.attr("x", function(d, i) { return i % mcol == 0 ? 0 : (i % mcol) * imgWidth })
				    .attr("y", function(d, i) { return Math.floor(i / mcol) * imgHeight });

			sortingType = 1;
		} else {
			var mov = mysvg.selectAll("image")
					// .transition()
					.sort(function(a, b) {
						return d3.ascending(a.index, b.index);
						//return (a["name"] > b["name"]) ? 1 : ((a["name"] < b["name"]) ? -1 : 0);
					})
					.transition()
			    	//.delay(1000) // function(d, i) { return i * 50})
			    	.duration(2000)
			    	.ease("quad")
				   	.attr("x", function(d, i) { return i % mcol == 0 ? 0 : (i % mcol) * imgWidth })
				    .attr("y", function(d, i) { return Math.floor(i / mcol) * imgHeight });

			sortingType = 0;
		}
	}
});


drawMovies = function() {

    var availableWidth = $("#imdb").width() - 10; // utilsWindowSize().width - 10,
    var availableHeight = $("#imdb").height() -10; // utilsWindowSize().height - 10;

	// console.log(json);
	imgHeight = availableHeight / mrow;
	imgWidth = availableWidth / mcol;
    // var obj = jQuery.parseJSON('{"name": "John" }')

    $("#imdb svg").empty();

	var mysvg = d3.select('#imdb svg')
		.attr("width", availableWidth)
		.attr("height", availableHeight)

    $.getJSON('withimgsrc.json', function(json) {

    	xpos = 0, ypos = 0;

    	var mov = mysvg.selectAll("image").data(json)

    	mov.enter()
    		.append("image")
		    .attr("xlink:href", function(d) { return d.imgsrc; }) // "img/" + d.filename; })
		    .attr("x", function(d, i) { return i % mcol == 0 ? 0 : (i % mcol) * imgWidth })
		    .attr("y", function(d, i) { return Math.floor(i / mcol) * imgHeight })
		    .attr("width", 0)
		    .attr("height", 0)
		    .attr("title", function(d) { return "#" + d.index + ": " + d.name; })
		    .transition()
		    .delay(function(d, i) { return i * 20})
		    .duration(400)
		    .attr("width", imgWidth)
		    .attr("height", imgHeight)

		/*
    	// sorting by alphanumeric
		json.sort(function(a, b) {
			return (a["name"] > b["name"]) ? 1 : ((a["name"] < b["name"]) ? -1 : 0);
		});
		*/
    });
}

utilsWindowSize = function() {
    // Sane defaults
    var size = {width: 640, height: 480};

    // Earlier IE uses Doc.body
    if (document.body && document.body.offsetWidth) {
        size.width = document.body.offsetWidth;
        size.height = document.body.offsetHeight;
    }

    // IE can use depending on mode it is in
    if (document.compatMode=='CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth ) {
        size.width = document.documentElement.offsetWidth;
        size.height = document.documentElement.offsetHeight;
    }

    // Most recent browsers use
    if (window.innerWidth && window.innerHeight) {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
    }
    return (size);
};

utilsWindowResize = function(fun){
  if (fun === undefined) return;
  var oldresize = window.onresize;

  window.onresize = function(e) {
    if (typeof oldresize == 'function') oldresize(e);
    fun(e);
  }
}