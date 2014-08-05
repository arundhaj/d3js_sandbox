// Kshitij Aranke 2013

function init(in_data, step) {
	step = step || 1;

	// Sort the data to prevent inappropriate ranges
	var sorted_in_data = _.sortBy(in_data, function(d) { return d[0]; }); 

	// Split the input data into two lists -- one with all the timestamps and the other with all the values
	var in_ts  = _.map(sorted_in_data, function(d) { return d[0]; });
	var in_vals = _.map(sorted_in_data, function(d) { return d[1]; });

	// Create a list of timestamps between the first and last one (both inclusive) 
	var out_ts  = _.range(_.first(in_ts), (_.last(in_ts) + step), step);

	return [in_ts, in_vals, step, out_ts];
}

var md = {
	ffill: function(in_data, step) {
		var ts_data = init(in_data, step);
		var in_ts = ts_data[0], in_vals = ts_data[1].reverse(), step = ts_data[2], out_ts = ts_data[3], out_vals = new Array();
		var cur_idx = in_ts.length;

		_.each(out_ts, function(t) {
			// Decrement the counter if the timestamp was originally present
			if (_.contains(in_ts, t)) { cur_idx -= 1; } 

			// For each timestamp, get the last available value
			var cur_val = in_vals[cur_idx];
			out_vals.push([t, cur_val]);
		});
		return out_vals;
	},

	bfill: function(in_data, step) {
		var ts_data = init(in_data, step);
		var in_ts = ts_data[0], in_vals = ts_data[1], step = ts_data[2], out_ts = ts_data[3], out_vals = new Array();
		var cur_idx = 0;
		
		_.each(out_ts, function(t) {
			// For each timestamp, get the last available value
			var cur_val = in_vals[cur_idx];
			out_vals.push([t, cur_val]);

			// Increment the counter if the timestamp was originally present
			if (_.contains(in_ts, t)) { cur_idx += 1; } 
		});
		return out_vals;
	},

	fillna: function(in_data, fill_value, step) {
		var ts_data = init(in_data, step);
		var in_ts = ts_data[0], in_vals = ts_data[1], step = ts_data[2], out_ts = ts_data[3], out_vals = new Array();
		var cur_idx = 0;

		_.each(out_ts, function(t) {
			// For each timestamp, get the last available value
			var cur_val = in_vals[cur_idx];

			// Fill with a fixed value if the timestamp was originally not present
			if (_.contains(in_ts, t)) { cur_idx += 1; } 
			else { cur_val = fill_value; }

			out_vals.push([t, cur_val]);
		});
		return out_vals;
	}
}