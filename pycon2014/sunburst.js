var sunburst = function() {
    var margin = { top: 20, right: 0, bottom: 0, left: 0},
        width = 700,
        height = 600,
        radius = Math.min(width, height) / 2 - 10,
        color = d3.scale.category20c();

    var getX = function(d) { return d.key; };
    var getY = function(d) { return d.values; };

    var parseDate = d3.time.format("%a, %b %d %Y").parse;

    var sunburst_div = d3.select("#sunburst")

    var tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var partition = d3.layout.partition()
        .size([2 * Math.PI, radius * radius])
        .children(function(d) { return d.values; })
        .sort(function(a, b) { return d3.ascending(a.votes, b.votes); })
        .value(function(d) { return d.votes; });

    var arc_start = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    // d3js plugin for jsonp:: http://bl.ocks.org/tmcw/4494715
    d3.jsonp = function (url, callback) {
    function rand() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        c = '', i = -1;
        while (++i < 15) c += chars.charAt(Math.floor(Math.random() * 52));
        return c;
    }

    function create(url) {
        var e = url.match(/callback=d3.jsonp.(\w+)/),
        c = e ? e[1] : rand();
        d3.jsonp[c] = function(data) {
        callback(data);
        delete d3.jsonp[c];
        script.remove();
        };
        return 'd3.jsonp.' + c;
    }

    var cb = create(url),
        script = d3.select('head')
        .append('script')
        .attr('type', 'text/javascript')
        .attr('src', url.replace(/(\{|%7B)callback(\{|%7D)/, cb));
    };

    d3.json("funnel.json", function(data) {
        populate(data);
    });

    function populate(data) {
    var children = d3.nest()
        .key(function(d) { return d.level; })
        .key(function(d) { return d.section; })
        .entries(data.proposals);

    // adding a dummy root node
    var root = {
        "key" : "Root",
        "values": children
    };
    
    draw_sunburst(sunburst_div, root, "PyConIN '14 - Proposals Sunburst Chart");
    }

    /*
    d3.csv("http://media.arundhaj.com/projects/pycon_visualization/pycon_proposals.csv", function(data) {
    data.forEach(function(d) {
        d.Vote = +d.Vote,
        d.Comments = +d.Comments,
        d.Submitted = parseDate(d.Submitted + " 2014")
    });
    
    // create tree hierarchy, depth 1: Level, depth 2: Section and depth 3: Topic.
    var children = d3.nest()
        .key(function(d) { return d.Level; })
        .key(function(d) { return d.Section; })
        .entries(data);
    
    // adding a dummy root node
    var root = {
        "key" : "Root",
        "values": children
    };
    
    // draw_sunburst(sunburst_div, root, "PyConIN '14 - Proposals Sunburst Chart");
    });
    */

    function draw_sunburst(div_element, root, heading) {
    var svg = div_element.append("svg")
        .attr("width", width)
        .attr("height", height);

    var head = svg.append("text")
            .attr("class", "head-text")
            .attr("x", (width / 2))             
            .attr("y", (margin.top / 2) + 5)
            .text(heading);
    
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + ( height / 2 + margin.top / 2) + ")");  
    
    var path = g.datum(root).selectAll("path")
            .data(partition.nodes)
        .enter().append("path")
            .attr("display", function(d) {
                return d.depth ? null : "none";
        })
            .attr("d", arc_start)
            .style("stroke", "#fff")
            .style("fill", function(d) {
                return color((d.values ? d : d.parent).key)
        })
            .style("fill-rule", "evenodd");
    
    path
            .transition().duration(function(d) { 
                    return d.depth * 1000;
            })
            // .transition().duration(500)
            .attr("d", arc);
    
    path
        .on("mouseover", function(d) {
            var html = "";
            if(d.depth == 3) {
            html = "<i>Topic: </i><b>" + d.title + " </b><br />" +
                "<i>Proposer: </i><b>" + d.proposer + " </b><br />" +
                "<i>Section: </i><b>" + d.section + " </b><br />" +
                "<i>Level: </i><b>" + d.level + " </b><br />" +
                "<i>Votes: </i><b>" + d.votes + "</b>";
            } else {
            html = d.key;
            }
        
            tooltip.transition().duration(250)
                .style("opacity", ".9");

            tooltip.html(html)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d) {
        tooltip.transition().duration(250)
            .style("opacity", 0);
        });
    }
}
