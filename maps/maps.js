var width = 960,
    height = 1000;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var color = d3.scale.category20();

drawIND();

function drawIND() {
    d3.json("in.json", function(error, ind) {
        if (error) return console.error(error);

        var subunits = topojson.feature(ind, ind.objects.subunits_ind);
        var projection = d3.geo.mercator()
                .scale(1500)
                .center([80,20])
                .translate([width / 2, height / 2]);

        var path = d3.geo.path()
                .projection(projection)
                .pointRadius(2);

        svg.selectAll(".subunit")
                .data(subunits.features)
            .enter().append("path")
                .attr("class", function(d) { return "subunit " + d.id; })
                .attr("fill", function(d, i) { return color(i); })
                .attr("d", path);

        svg.append("path")
                .datum(topojson.feature(ind, ind.objects.places_in))
                .attr("d", path)
                .attr("class", "place");

        svg.selectAll(".place-label")
                .data(topojson.feature(ind, ind.objects.places_in).features)
            .enter().append("text")
                .attr("class", "place-label")
                .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
                .attr("dy", ".35em")
                .text(function(d) { return d.properties.name; });
    });
}
