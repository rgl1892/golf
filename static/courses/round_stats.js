// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
var scoredataset = await d3.json("/api/scorecards");
var data = [];
for (let i = 0; i < scoredataset.length; i++) {
  data.push({
    score: scoredataset[i]["adam"],
    stable: scoredataset[i]["adam_stable"],
    par: scoredataset[i]["hole"]["par"],
    hole: scoredataset[i]["hole"]["hole"],
    course: scoredataset[i]["hole"]["course"],
  });
  data.push({
    score: scoredataset[i]["alex"],
    stable: scoredataset[i]["alex_stable"],
    par: scoredataset[i]["hole"]["par"],
    hole: scoredataset[i]["hole"]["hole"],
    course: scoredataset[i]["hole"]["course"],
  });
  data.push({
    score: scoredataset[i]["jaime"],
    stable: scoredataset[i]["jaime_stable"],
    par: scoredataset[i]["hole"]["par"],
    hole: scoredataset[i]["hole"]["hole"],
    course: scoredataset[i]["hole"]["course"],
  });
  data.push({
    score: scoredataset[i]["rich"],
    stable: scoredataset[i]["rich_stable"],
    par: scoredataset[i]["hole"]["par"],
    hole: scoredataset[i]["hole"]["hole"],
    course: scoredataset[i]["hole"]["course"],
  });
}
var mean_data = [
  {
    par: 3,
    score: d3.mean(
      data.filter((d) => d.par == "3"),
      (d) => d.score
    ),
    deviation: d3.deviation(
      data.filter((d) => d.par == "3"),
      (d) => d.score
    ),
    stable: d3.mean(
      data.filter((d) => d.par == "3"),
      (d) => d.stable
    ),
    stable_deviation: d3.deviation(
      data.filter((d) => d.par == "3"),
      (d) => d.stable
    ),
  },
  {
    par: 4,
    score: d3.mean(
      data.filter((d) => d.par == "4"),
      (d) => d.score
    ),
    deviation: d3.deviation(
      data.filter((d) => d.par == "4"),
      (d) => d.score
    ),
    stable: d3.mean(
      data.filter((d) => d.par == "4"),
      (d) => d.stable
    ),
    stable_deviation: d3.deviation(
      data.filter((d) => d.par == "4"),
      (d) => d.stable
    ),
  },
  {
    par: 5,
    score: d3.mean(
      data.filter((d) => d.par == "5"),
      (d) => d.score
    ),
    deviation: d3.deviation(
      data.filter((d) => d.par == "5"),
      (d) => d.score
    ),
    stable: d3.mean(
      data.filter((d) => d.par == "5"),
      (d) => d.stable
    ),
    stable_deviation: d3.deviation(
      data.filter((d) => d.par == "5"),
      (d) => d.stable
    ),
  },
];

var hole_mean_data = [];

for (let j = 0; j < 18; j++) {
  hole_mean_data[j] = {
    hole: j + 1,
    faldo_score: d3.mean(
      data.filter((d) => d.hole == `${j + 1}` && d.course == "Faldo"),
      (d) => d.score
    ),
    oconnor_score: d3.mean(
      data.filter((d) => d.hole == `${j + 1}` && d.course == "Oconnor"),
      (d) => d.score
    ),
    faldo_stable: d3.mean(
      data.filter((d) => d.hole == `${j + 1}` && d.course == "Faldo"),
      (d) => d.stable
    ),
    oconnor_stable: d3.mean(
      data.filter((d) => d.hole == `${j + 1}` && d.course == "Oconnor"),
      (d) => d.stable
    ),
  };
}
console.log(hole_mean_data)

async function mean_plot() {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var x_domain = { bottom: 3, top: 5 };
  var y_stroke_domain = { bottom: 0, top: 7 };
  var y_domain = { bottom: 0, top: 4 };

  var svg = d3
    .select("#div-template1")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg2 = d3
    .select("#div-template2")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg3 = d3
    .select("#div-template3")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg4 = d3
    .select("#div-template4")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom - 1, x_domain.top + 1])
    .range([0, width]);
  var y_stroke = d3
    .scaleLinear()
    .domain([y_stroke_domain.bottom, y_stroke_domain.top])
    .range([height, 0]);

  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);

  var adam_color = "#FCBF49";
  var adam_color_line = "#FCBF69";
  var mouseover_color = "black";
  var space_width = width / (x_domain.top - x_domain.bottom);
  var bar_width = ((space_width / 4) * 4) / 5;
  var trans_dur = 200;

  var Tooltip = d3
    .select("#div-template1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var Tooltip2 = d3
    .select("#div-template2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");
  var Tooltip3 = d3
    .select("#div-template3")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");
  var Tooltip4 = d3
    .select("#div-template4")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var mean_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var stable_mouseover = function (d, i) {
    Tooltip2.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var mean_dev_mouseover = function (d, i) {
    Tooltip3.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var stable_dev_mouseover = function (d, i) {
    Tooltip4.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var mean_dev_mousemove = function (d, i) {
    Tooltip3.html(`${i["deviation"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };
  var mean_mousemove = function (d, i) {
    Tooltip.html(`${i["score"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };
  var stable_mousemove = function (d, i) {
    Tooltip2.html(`${i["stable"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };
  var stable_dev_mousemove = function (d, i) {
    Tooltip4.html(`${i["stable_deviation"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
    console.log(d);
  };

  var mean_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var stable_mouseout = function (d) {
    Tooltip2.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var mean_dev_mouseout = function (d) {
    Tooltip3.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var stable_dev_mouseout = function (d) {
    Tooltip4.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(
      d3.axisLeft(y_stroke).ticks(y_stroke_domain.top - y_stroke_domain.bottom)
    );

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([3, 4, 5])
        .tickFormat((d) => d)
    );
  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).ticks(y_domain.top - y_domain.bottom));

  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([3, 4, 5])
        .tickFormat((d) => d)
    );
  svg3
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).ticks(y_domain.top - y_domain.bottom));

  svg3
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([3, 4, 5])
        .tickFormat((d) => d)
    );
  svg4
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).ticks(y_domain.top - y_domain.bottom));

  svg4
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([3, 4, 5])
        .tickFormat((d) => d)
    );

  var g = svg.selectAll(".bars").data(mean_data).enter().append("g");
  var g2 = svg2.selectAll(".bars").data(mean_data).enter().append("g");
  var g3 = svg3.selectAll(".bars").data(mean_data).enter().append("g");
  var g4 = svg4.selectAll(".bars").data(mean_data).enter().append("g");

  var mean = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.score * height) / y_stroke_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.score * height) / y_stroke_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-width / 2 - bar_width / 2},${height})`);

  var stable = g2
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.stable * height) / y_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.stable * height) / y_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-width / 2 - bar_width / 2},${height})`);
  var score_dev = g3
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.deviation * height) / y_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.deviation * height) / y_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-width / 2 - bar_width / 2},${height})`);

  var stable_dev = g4
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.stable_deviation * height) / y_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.stable_deviation * height) / y_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-width / 2 - bar_width / 2},${height})`);

  //   var adam_line = d3
  //     .line()
  //     .x((d, i) => x(d.hole.hole))
  //     .y((d, i) => yLeft(d.adam_cum))
  //     .curve(d3.curveCatmullRom.alpha(0.5));

  //   var adam_cum = svg
  //     .append("path")
  //     .attr("fill", "none")
  //     .attr("stroke", adam_color_line)
  //     .attr("stroke-width", 3)
  //     .attr(
  //       "d",
  //       adam_line(scoredataset)
  //     );

  mean
    .on("mouseover", mean_mouseover)
    .on("mousemove", mean_mousemove)
    .on("mouseout", mean_mouseout);

  stable
    .on("mouseover", stable_mouseover)
    .on("mousemove", stable_mousemove)
    .on("mouseout", stable_mouseout);
  score_dev
    .on("mouseover", mean_dev_mouseover)
    .on("mousemove", mean_dev_mousemove)
    .on("mouseout", mean_dev_mouseout);
  stable_dev
    .on("mouseover", stable_dev_mouseover)
    .on("mousemove", stable_dev_mousemove)
    .on("mouseout", stable_dev_mouseout);
}

async function course() {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var x_domain = { bottom: 1, top: 18 };
  var y_domain = { bottom: 0, top: 10 };
  var y_stable_domain = { bottom: 0, top: 4 };

  var svg = d3
    .select("#div-template5")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg2 = d3
    .select("#div-template6")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg3 = d3
    .select("#div-template7")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");
  var svg4 = d3
    .select("#div-template8")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom - 1, x_domain.top + 1])
    .range([0, width]);
  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);
  var y_stable = d3
    .scaleLinear()
    .domain([y_stable_domain.bottom, y_stable_domain.top])
    .range([height, 0]);

  var adam_color = "#FCBF49";
  var adam_color_line = "#FCBF69";
  var mouseover_color = "black";
  var space_width = width / (x_domain.top - x_domain.bottom);
  var bar_width = ((space_width / 4) * 4) / 5;
  var trans_dur = 200;

  var Tooltip = d3
    .select("#div-template5")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var faldo_stroke_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var faldo_stroke_mousemove = function (d, i) {
    Tooltip.html(`${i["faldo_score"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };

  var faldo_stroke_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var faldo_stable_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var faldo_stable_mousemove = function (d, i) {
    Tooltip.html(`${i["faldo_stable"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };

  var faldo_stable_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var oconnor_stroke_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var oconnor_stroke_mousemove = function (d, i) {
    Tooltip.html(`${i["oconnor_score"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };

  var oconnor_stroke_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };
  var oconnor_stable_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var oconnor_stable_mousemove = function (d, i) {
    Tooltip.html(`${i["oconnor_stable"]}`)
      .style("left", d["layerX"] + 20)
      .style("top", d["layerY"] - 100);
  };

  var oconnor_stable_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
  };

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).ticks(y_domain.top - y_domain.bottom));

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ])
        .tickFormat((d) => d)
    );
  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(d3.axisLeft(y).ticks(y_domain.top - y_domain.bottom));

  svg2
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ])
        .tickFormat((d) => d)
    );
  svg3
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(
      d3
        .axisLeft(y_stable)
        .tickValues([1, 2, 3, 4])
        .tickFormat((d) => d)
    );
  svg3
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ])
        .tickFormat((d) => d)
    );
  svg4
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${0},0)`)
    .call(
      d3
        .axisLeft(y_stable)
        .tickValues([1, 2, 3, 4])
        .tickFormat((d) => d)
    );

  svg4
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues([
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
        ])
        .tickFormat((d) => d)
    );

  var g = svg.selectAll(".bars").data(hole_mean_data).enter().append("g");
  var g2 = svg2.selectAll(".bars").data(hole_mean_data).enter().append("g");
  var g3 = svg3.selectAll(".bars").data(hole_mean_data).enter().append("g");
  var g4 = svg4.selectAll(".bars").data(hole_mean_data).enter().append("g");

  var faldo = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.hole / 19) * width)
    .attr("y", (d) =>  (-d.faldo_score * height) / y_domain.top
    )
    .attr("width", bar_width)
    .attr("height", (d) => (d.faldo_score * height) / y_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-bar_width / 2},${height})`);

  var oconnor = g2
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.hole / 19) * width)
    .attr("y", (d) => (-d.oconnor_score * height) / y_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.oconnor_score * height) / y_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-bar_width / 2},${height})`);
  var faldo_stable = g3
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.hole / 19) * width)
    .attr("y", (d) => (-d.faldo_stable * height) / y_stable_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.faldo_stable * height) / y_stable_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-bar_width / 2},${height})`);
  var oconnor_stable = g4
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.hole / 19) * width)
    .attr("y", (d) => (-d.oconnor_stable * height) / y_stable_domain.top)
    .attr("width", bar_width)
    .attr("height", (d) => (d.oconnor_stable * height) / y_stable_domain.top)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-bar_width / 2},${height})`);

  faldo
    .on("mouseover", faldo_stroke_mouseover)
    .on("mousemove", faldo_stroke_mousemove)
    .on("mouseout", faldo_stroke_mouseout);
  faldo_stable
    .on("mouseover", faldo_stable_mouseover)
    .on("mousemove", faldo_stable_mousemove)
    .on("mouseout", faldo_stable_mouseout);
  oconnor
    .on("mouseover", oconnor_stroke_mouseover)
    .on("mousemove", oconnor_stroke_mousemove)
    .on("mouseout", oconnor_stroke_mouseout);
  oconnor_stable
    .on("mouseover", oconnor_stable_mouseover)
    .on("mousemove", oconnor_stable_mousemove)
    .on("mouseout", oconnor_stable_mouseout);
}
mean_plot();
course();
