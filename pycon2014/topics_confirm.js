var topics_confirm = function() {
    var margin = { top: 20, right: 20, bottom: 20, left: 30},
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var scatter_div = d3.select("#topics_confirm");

    var tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

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
    //data.proposals.sort(function(a, b) { return d3.ascending(a.votes, b.votes); });
    draw_scatter(scatter_div, data.proposals, "PyConIN '14 - Topics votes vs confirmation");
    }

    function draw_scatter(div_element, data, heading) {
    var svg = div_element.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

    var head = svg.append("text")
            .attr("class", "head-text")
            .attr("x", (width / 2))             
            .attr("y", 25)
            .text(heading);
    
    var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.right + ")");
    
    var xMin = 0;
    var xMax = data.length;
    
    var yMin = d3.min(data, function(d) { return +d.votes; });
    var yMax = d3.max(data, function(d) { return +d.votes; });
    
    x.domain([xMin - 5, xMax + 5]);
    y.domain([yMin - 5, yMax + 5]);

    g.append("g")
        .attr("class", "x1 axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "y1 axis")
        .call(yAxis)
        .append("text")
            .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Votes");
    
    g.selectAll(".dot")
            .data(data)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d, i) { return x(i); })
            .attr("cy", function(d) { return y(d.votes); })
            .style("fill", function(d) { return d.confirmed ? "#2ca02c" : "#E41B17"; });
    
    g.selectAll(".dot")
        .on("mouseover", function(d) {
            var topic = d3.select(this);
            topic.transition().duration(250)
                .attr("r", 6);
    
            topic.moveToFront();
            
            tooltip.transition().duration(250)
                .style("opacity", ".9");
        
                var html = "<i>Topic:</i><b>" + d.title + " </b><br />" +
                    "<i>Proposer:</i><b>" + d.proposer + " </b><br />" +
                    "<i>Section:</i><b>" + d.section + " </b><br />" +
                    "<i>Level:</i><b>" + d.level + " </b><br />" +
                    "<i>Votes:</i><b>" + d.votes + "</b>";
        
            tooltip.html(html)
            .style("left", (d3.event.pageX + 3) + "px")
            .style("top", (d3.event.pageY + 3) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
            .transition().duration(250)
            .attr("r", 3.5);
        
            tooltip.transition().duration(250)
                .style("opacity", 0);
        });
    }

    d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
    }
}
