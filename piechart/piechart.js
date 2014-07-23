// d3js pie chart
var pie_data = [
  {"channel":"M1","count":93},
  {"channel":"M2","count":52}
];

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2;

var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


var color = d3.scale.ordinal()
              .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(0);

var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { 
              return d.count; 
            });

var svg = d3.select("#pie_chart").append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

var g = svg.selectAll(".arc")
            .data(pie(pie_data))
          .enter().append("g")
            .attr("class", "arc")
            .style("fill", "#fff")
          .on("mouseover", function(d) {
            tooltip.transition()
              .duration(250)
              .style("opacity", ".9");
            tooltip.html(d.data.channel + "-" + d.data.count)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
          })
          .on("mouseout", function(d) {
            tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          });

g.append("path")
      .attr("d", arc).transition().duration(500)
      .style("fill", function(d) { return color(d.data.channel); });

g.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .transition().duration(250)
      .attr("dy", ".35em")
      .style("fill", "#000")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.data.channel;
      });