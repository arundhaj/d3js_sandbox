var top250List = []

var mrow = 10, mcol = 25;
var availableHeight = 0, availableWidth = 0;
var imgHeight = 0, imgWidth = 0;

$( document ).ready(function() {
    console.log( "ready!" );

    drawTraffic();

    utilsWindowResize(drawTraffic);
});

drawTraffic = function() {
	var margin = { top: 50, right: 0, bottom: 50, left: 30 },
      width = 300 - margin.left - margin.right,
      height = 25 - margin.top - margin.bottom,
      gridSize = Math.floor(width / 24),
      legendElementWidth = gridSize*2,
      buckets = 9,
      colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850","#006837"] // copied from colorbrewer - RdYlGn
      days = ["Mo", "Tu"],
      times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];

	var svg = d3.select("#chart svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g");
              //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var inf = [];

	for(var i = 0; i < 24; i++) {
		inf.push({ "hour": i, "min": 0, "value": Math.floor((Math.random()*100)+1) });
		inf.push({ "hour": i, "min": 30, "value": Math.floor((Math.random()*100)+1) });
	}

	var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, d3.max(inf, function (d) { return d.value; })])
              .range(colors.reverse());

	var heatMap = svg.selectAll(".hour")
              .data(inf)
              .enter().append("rect")
              .attr("x", function(d) { return d.hour * gridSize; })
              .attr("y", function(d) { return (d.min / 30) * gridSize; })
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill", "#eee");
	
	heatMap.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    heatMap.append("title").text(function(d) { return ((d.hour < 10) ? "0" + d.hour : d.hour) + ":" + ((d.min < 10) ? "0" + d.min : d.min); });
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



// Easy way to bind multiple functions to window.onresize
// TODO: give a way to remove a function after its bound, other than removing all of them
utilsWindowResize = function(fun){
  if (fun === undefined) return;
  var oldresize = window.onresize;

  window.onresize = function(e) {
    if (typeof oldresize == 'function') oldresize(e);
    fun(e);
  }
}