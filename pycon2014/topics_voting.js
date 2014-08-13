var topics_voting = function() {
    var margin = { top: 60, right: 20, bottom: 20, left: 20},
        width = 600 - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;

    var positive_range = ["#d9f0a3","#addd8e","#78c679","#41ab5d","#238443","#006837","#004529"];
        // ["#f7fcfd","#e5f5f9","#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#006d2c","#00441b"];
    var negative_range = ["#fdd0a2","#fdae6b","#fd8d3c","#f16913","#d94801","#a63603","#7f2704"];

    var colorScale = d3.scale.quantile()
                .domain([-9, 9])
                .range(negative_range.reverse().concat(positive_range));

    var parseDate = d3.time.format("%a, %b %d %Y").parse;

    var bar_div = d3.select("#topics_voting")

    var tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.ordinal().rangeBands([height, 0], .05);

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
    data.proposals.sort(function(a, b) { return d3.ascending(a.votes, b.votes); });

    draw_bar(bar_div, data.proposals, "PyConIN '14 - Topics with Voting");
    }

    /*
    d3.csv("http://media.arundhaj.com/projects/pycon_visualization/pycon_proposals.csv", function(data) {
    data.forEach(function(d) {
        d.Vote = +d.Vote,
        d.Comments = +d.Comments,
        d.Submitted = parseDate(d.Submitted + " 2014")
    });
    
    data.sort(function(a, b) { return d3.ascending(a.Vote, b.Vote); });
    
    draw_bar(bar_div, data, "PyConIN '14 - Topics with Voting");
    });
    */
    
    function draw_bar(div_element, data, heading) {
    var svg = div_element.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    
    var head = svg.append("text")
            .attr("class", "head-text")
            .attr("x", (width / 2))
            .attr("y", 25)
            .text(heading);
    
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xExtent = d3.extent(data, function(d) { return d.votes; });
    x.domain([xExtent[0] - 10, xExtent[1] + 10]);
    y.domain(data.map(function(d) { return d.title; }))
    
    var xAxis = d3.svg.axis()
                .scale(x)
                .orient("top");

    var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
    
    g.append("g")
            .attr("class", "x axis")
            .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "middle");

    g.append("g")
            .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", height);  
            // .call(yAxis);
    
    g.selectAll(".bg-bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bg-bar topic")
            // .style("fill", "platinum")	
            .attr("x", function(d) { 
                return x(xExtent[0] - 10); })
            .attr("width", width)
            .attr("y", function(d) {
                return y(d.title);
        })
            .attr("height", y.rangeBand());

    g.selectAll(".bar")
            .data(data)
        .enter().append("rect")
            .attr("class", "bar topic")
            // .style("fill", "steelblue")	
            .style("fill", function(d) {
                return colorScale(d.votes / 15); 
        })
            .attr("x", function(d) { 
                return x(Math.min(0, d.votes)); })
            .attr("width", function(d) { 
                return Math.abs(x(d.votes) - x(0));;
        })
            .attr("y", function(d) {
                return y(d.title);
        })
            .attr("height", y.rangeBand());
    
    g.selectAll(".topic")
        .on("mouseover", function(d) {
            tooltip.transition().duration(250)
                .style("opacity", ".9");
        
                var html = "<i>Topic:</i><b>" + d.title + " </b><br />" +
                    "<i>Proposer:</i><b>" + d.proposer + " </b><br />" +
                    "<i>Section:</i><b>" + d.section + " </b><br />" +
                    "<i>Level:</i><b>" + d.level + " </b><br />" +
                    "<i>Votes:</i><b>" + d.votes + "</b>";
        
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
