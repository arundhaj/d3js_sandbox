var proposals_pie = function() {
    // http://media.arundhaj.com/projects/pycon_visualization/pycon_proposals.csv
    var margin = { top: 20, right: 0, bottom: 0, left: 0},
            width = 500,
        height = 250,
        radius = Math.min(height, width) / 2,
        color = d3.scale.category20();

    var getX = function(d) { return d.key; }
    var getY = function(d) { return d.values; }

    var parseDate = d3.time.format("%a, %b %d %Y").parse;

    var arc_start = d3.svg.arc()
    .outerRadius(0)
    .innerRadius(0);

    var arc = d3.svg.arc()
    .outerRadius(radius - 15)
    .innerRadius(0);

    var arcOver = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

    var pie_layout = d3.layout.pie()
    .sort(null)
    .value(getY);

    var tooltip = d3.select("#tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

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
    var section_array = d3.nest()
        .key(function(d) {
        return d.section;
        })
        .rollup(function(d) {
        return d.length;
        }).entries(data.proposals);
    
    var levels_array = d3.nest()
        .key(function(d) {
        return d.level;
        })
        .rollup(function(d) {
        return d.length;
        }).entries(data.proposals);

    var section_svg = d3.select("#proposals_section");
    var level_svg = d3.select("#proposals_level"); 
    
    draw_pie(level_svg, levels_array, "PyConIN '14 - Proposals Level");
    draw_pie(section_svg, section_array, "PyConIN '14 - Proposals Section");
    }

    /*
    d3.csv("http://media.arundhaj.com/projects/pycon_visualization/pycon_proposals.csv", function(data) {
    data.forEach(function(d) {
                d.Vote = +d.Vote,
                d.Comments = +d.Comments,
                d.Submitted = parseDate(d.Submitted + " 2014")
        });
    
        var section_array = d3.nest()
                .key(function(d) { 
                    return d.Section;
                })
                .rollup(function(d) { 
                    return d.length;
                }).entries(data);
        
        var levels_array = d3.nest()
                .key(function(d) { 
                    return d.Level;
                })
                .rollup(function(d) {
                    return d.length;
                }).entries(data);
    
    var section_svg = d3.select("#section_pie");
    var level_svg = d3.select("#level_pie"); 
    
    //draw_pie(level_svg, levels_array, "PyConIN '14 - Proposals Level");
    //draw_pie(section_svg, section_array, "PyConIN '14 - Proposals Section");
    });
    */

    function draw_pie(div_element, data_array, heading) {
    var svg = div_element.append("svg")
            .attr("height", height)
            .attr("width", width);
        
    var head = svg.append("text")
            .attr("class", "head-text")
            .attr("x", (width / 2))             
            .attr("y", (margin.top))
            .text(heading);
    
    var g = svg.append("g");
    g.attr("transform", "translate(" + width / 2 + "," + ( height / 2 + margin.top / 2 ) + ")");
    
    var arcsWrap = g.selectAll(".arcsWrap")
            .data(pie_layout(data_array))
                .enter().append("g")
                    .attr("class", "arcsWrap")
                .on("mouseover", function(d) {
                d3.select(this).select("path")
                        .transition().duration(250)
                        .attr("d", arcOver);
                tooltip.transition().duration(250)
                        .style("opacity", ".9");
            
                tooltip.html(getX(d.data) + " (" + getY(d.data) + ")")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
            })
                .on("mouseout", function(d) {
                d3.select(this).select("path")
                        .transition().duration(250)
                        .attr("d", arc);

                tooltip.transition().duration(250)
                        .style("opacity", 0);
            });

    arcsWrap.append("path")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc_start)
            .transition().duration(function(d, i) { return i* 200; })
            .attr("d", arc);
    
    arcsWrap.append("text")
            .attr("class", "over-text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
            .text(function(d) { return getY(d.data) });  
    }
}
