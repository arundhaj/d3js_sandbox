var csv_string = 
"occurred,value\n\
2012-11-25,87\n\
2012-12-02,87\n\
2012-12-09,87\n\
2012-12-16,87\n\
2012-12-23,88\n\
2012-12-30,88\n\
2013-01-06,88\n\
2013-01-13,89\n\
2013-01-27,90\n\
2013-02-03,90\n\
2013-02-10,90\n\
2013-02-17,92\n\
2013-02-24,92\n\
2013-03-03,92\n\
2013-03-10,92\n\
2013-03-17,92\n\
2013-03-24,93\n\
2013-03-31,94\n\
2013-04-07,93\n\
2013-04-14,94\n\
2013-04-21,94\n\
2013-04-28,94\n\
2013-05-05,94\n\
2013-05-12,94\n\
2013-05-19,95\n\
2013-05-27,96\n\
2013-06-02,96\n\
2013-06-09,96\n\
2013-06-16,96\n\
2013-06-23,97\n\
2013-06-30,97\n\
2013-07-07,97\n\
2013-07-14,97\n\
2013-07-21,97\n\
2013-07-28,97\n\
2013-08-04,98\n\
2013-08-11,98\n\
2013-08-18,99\n\
2013-08-25,99\n\
2013-09-01,100\n\
2013-09-08,100\n\
2013-09-15,100\n\
2013-09-22,101\n\
2013-09-29,101\n\
2013-10-06,101\n\
2013-10-13,102\n\
2013-10-20,102\n\
2013-10-27,103\n\
2013-12-18,103\n\
2013-12-22,103\n\
2013-12-29,103\n\
2014-01-05,103\n\
2014-01-12,104\n\
2014-01-19,105\n\
2014-01-26,104\n\
2014-02-02,104\n\
2014-02-09,105\n\
2014-02-16,105\n\
2014-02-23,105\n\
2014-03-02,106\n\
2014-03-09,107\n\
2014-03-16,107\n\
2014-03-23,107\n\
2014-03-30,107\n\
2014-04-06,107\n\
2014-04-13,108\n\
2014-04-20,108\n\
2014-04-27,109\n\
2014-05-04,109\n\
2014-05-11,110\n\
2014-05-18,109\n\
2014-05-25,110\n\
2014-06-01,110\n\
2014-06-08,110\n\
2014-06-15,110";

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var csv_json = d3.csv.parse(csv_string);
var parseTime = d3.time.format("%Y-%m-%d").parse;

// convert to appropriate datatype
csv_json.forEach(function(d) {
    d.occurred = parseTime(d.occurred);
    d.value = +d.value;
});

var svg = d3.select("#trend").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var x = d3.time.scale()
        .range([0, width]);
var y = d3.scale.linear()
        .range([height, 0]);

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

var line = d3.svg.line()
        .x(function(d) { return x(d.occurred); })
        .y(function(d) { return y(d.value); });

x.domain(d3.extent(csv_json, function(d) { return d.occurred; }));
y.domain(d3.extent(csv_json, function(d) { return d.value; }));

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

svg.append("path")
        .datum(csv_json)
        .attr("class", "line")
        .attr("d", line);

// find a and b, for y = a + bx
function linearRegression() {
    var lr = {};
    var n = csv_json.length;
    var sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0, sum_yy = 0;

    csv_json.forEach(function(d) {
        sum_x += d.occurred.getTime();
        sum_y += d.value;

        sum_xx += (d.occurred.getTime() * d.occurred.getTime());
        sum_yy += (d.value * d.value);

        sum_xy += (d.occurred.getTime() * d.value);
    });

    // slope = b, intercept = a
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
    lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y *sum_y)), 2);
    
    return lr;
}

lr = linearRegression();

var regression_line = d3.svg.line()
        .x(function(d) { return x(d.occurred); })
        .y(function(d) { return y(lr.intercept + (lr.slope * d.occurred)) });

svg.append("path")
        .datum(csv_json)
        .attr("class", "regression_line")
        .attr("d", regression_line);
