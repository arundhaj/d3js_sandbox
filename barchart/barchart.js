// d3js bar chart
var bar_data = [
  {
    "date":"2013-01",
    "value":53,
    "prev":52
  },
  {
    "date":"2013-02",
    "value":165,
    "prev":165
  },
  {
    "date":"2013-03",
    "value":269,
    "prev":260
  },
  {
    "date":"2013-04",
    "value":344,
    "prev":380
  },
  {
    "date":"2013-05",
    "value":376,
    "prev":376
  },
  {
    "date":"2013-06",
    "value":410,
    "prev":409
  },
  {
    "date":"2013-07",
    "value":421,
    "prev":420
  },
  {
    "date":"2013-08",
    "value":405,
    "prev":405
  },
  {
    "date":"2013-09",
    "value":376,
    "prev":373
  },
  {
    "date":"2013-10",
    "value":359,
    "prev":358
  },
  {
    "date":"2013-11",
    "value":392,
    "prev":392
  },
  {
    "date":"2013-12",
    "value":433,
    "prev":433
  },
  {
    "date":"2014-01",
    "value":455,
    "prev":455
  },
  {
    "date":"2014-02",
    "value":478,
    "prev":470
  }
];

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


var dateFormat = d3.time.format("%Y-%m");
var parseDate = dateFormat.parse;

bar_data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(dateFormat);

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

var svg = d3.select("#bar_chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(bar_data.map(function(d) { return d.date; }));
y.domain([0, d3.max(bar_data, function(d) { return d.value; })])

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)");
//    .attr("y", 6)
//    .attr("dy", ".71em")
//    .style("text-anchor", "end")
//    .text("Value ($)");

var tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll("bar")
    .data(bar_data)
  .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d.date); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) {return height - y(d.value); })
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(dateFormat(d.date) + "<br/>" + d.value)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });

svg.selectAll("bar")
    .data(bar_data)
  .enter().append("rect")
    .style("fill", "red")
    .attr("x", function(d) { return x(d.date); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.prev); })
    .attr("height", 2)//function(d) {return height - y(d.prev); })
  .on("mouseover", function(d) {
    tooltip.transition()
      .duration(200)
      .style("opacity", .9);
    tooltip.html(dateFormat(d.date) + "<br/>" + d.prev)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY) + "px");
  })
  .on("mouseout", function(d) {
    tooltip.transition()
      .duration(500)
      .style("opacity", 0);
  });