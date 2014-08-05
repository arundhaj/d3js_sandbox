var width = 960,
    height = 1000;

/*
var svg = d3.select("#cubism-chart").append("svg")
    .attr("width", width)
    .attr("height", height);
*/

var current_date = new Date();
var offset_mins = ((60 * current_date.getHours()) + current_date.getMinutes()) - 970;

var offset_millis = offset_mins * 60 * 1000;

var color = d3.scale.category20();

var context = cubism.context()
        .step(6e4)
        .size(400)
        .serverDelay(offset_millis)
        .stop();

d3.select("body").append("div")
        .attr("class", "rule")
        .call(context.rule());

function stock(name) {
    return context.metric(function(start, stop, step, callback) {
        d3.json("data/" + name + ".json", function(error, original_rows) {
            var rows = md.ffill(original_rows);
            var compare = rows[0][1], value = rows[0][1], values = [value];

            rows.forEach(function(d) {
                values.push(value = (d[1] - compare) / compare);
            });

            callback(null, values);
        });
    }, name);
}

function draw_graph(stock_list) {
    d3.select("#cubism-chart")
            .selectAll(".axis")
            .data(["top"])
        .enter()
            .append("div")
            .attr("class", function(d) {
                return d + " axis";
            })
            .each(function(d) {
                d3.select(this)
                    .call(context.axis()
                            .ticks(4)
                            .orient(d));
            });
    d3.select("#cubism-chart")
            .selectAll(".horizon")
            .data(stock_list.map(stock))
        .enter()
            .insert("div", ".bottom")
            .attr("class", "horizon")
            .call(context.horizon()
                        .format(d3.format("+,.2p")));

    context.on("focus", function(i) {
            d3.selectAll(".value").style("right",
                i == null? null : context.size() - i + "px");
    });

}

draw_graph(["APL", "BF.B", "STZ"]);
