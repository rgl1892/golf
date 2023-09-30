import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
var scoredataset = await d3.json("/api/scorecards");
console.log(
  d3.mean(
    scoredataset.filter((d) => d.hole.par == "3"),
    (d) => d.rich
  )
);
var data = [];
for (let i = 0; i < scoredataset.length; i++) {
  data.push({
    score: scoredataset[i]["adam"],
    stable: scoredataset[i]["adam_stable"],
    par: scoredataset[i]["hole"]["par"],
  });
  data.push({
    score: scoredataset[i]["alex"],
    stable: scoredataset[i]["alex_stable"],
    par: scoredataset[i]["hole"]["par"],
  });
  data.push({
    score: scoredataset[i]["jaime"],
    stable: scoredataset[i]["jaime_stable"],
    par: scoredataset[i]["hole"]["par"],
  });
  data.push({
    score: scoredataset[i]["rich"],
    stable: scoredataset[i]["rich_stable"],
    par: scoredataset[i]["hole"]["par"],
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
  },
];

async function mean_plot() {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var x_domain = { bottom: 3, top: 5 };
  var y_domain = { bottom: 0, top: 10 };

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

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom - 1, x_domain.top + 1])
    .range([0, width]);
  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);
  var yLeft = d3.scaleLinear().domain([-10, 40]).range([height, 0]);

  var alex_color = "#50808E";
  var adam_color = "#FCBF49";
  var jaime_color = "#7EA172";
  var rich_color = "#C1666B";
  var alex_color_line = "#70808E";
  var adam_color_line = "#FCBF69";
  var jaime_color_line = "#7EA192";
  var rich_color_line = "#C1866B";
  var mouseover_color = "black";
  var space_width = width / (x_domain.top - x_domain.bottom);
  var bar_width = ((space_width / 4) * 4) / 5;
  var legend_x = 100 - 2;
  var legend_y = -20;
  var leg_font_small = 15;
  var leg_font_big = 20;
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

  var rich_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    Tooltip2.style("opacity", 1).style("z-index", 1000);

    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var rich_mousemove = function (d, i) {
    Tooltip.html(`Mean ${i["score"]}`)
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
    Tooltip2.html(`Mean ${i["stable"]}`)
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var rich_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    Tooltip2.style("opacity", 0).style("z-index", "auto");
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

  var g = svg.selectAll(".bars").data(mean_data).enter().append("g");
  var g2 = svg2.selectAll(".bars").data(mean_data).enter().append("g");

  var mean = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.score * height) / 10)
    .attr("width", bar_width)
    .attr("height", (d) => (d.score * height) / 10)
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${-width / 2 - bar_width / 2},${height})`);

  var stable = g2
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.stable * height) / 10)
    .attr("width", bar_width)
    .attr("height", (d) => (d.stable * height) / 10)
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
    .on("mouseover", rich_mouseover)
    .on("mousemove", rich_mousemove)
    .on("mouseout", rich_mouseout);

  stable
    .on("mouseover", rich_mouseover)
    .on("mousemove", rich_mousemove)
    .on("mouseout", rich_mouseout);
}

async function player_plot(player) {
  var margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var x_domain = { bottom: 3, top: 5 };
  var y_domain = { bottom: 0, top: 10 };

  var svg = d3
    .select("#div-template1")
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
  var yLeft = d3.scaleLinear().domain([-10, 40]).range([height, 0]);

  var alex_color = "#50808E";
  var adam_color = "#FCBF49";
  var jaime_color = "#7EA172";
  var rich_color = "#C1666B";
  var alex_color_line = "#70808E";
  var adam_color_line = "#FCBF69";
  var jaime_color_line = "#7EA192";
  var rich_color_line = "#C1866B";
  var mouseover_color = "black";
  var space_width = width / (x_domain.top - x_domain.bottom);
  var bar_width = ((space_width / 4) * 4) / 5;
  var legend_x = 100 - 2;
  var legend_y = -20;
  var leg_font_small = 15;
  var leg_font_big = 20;
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

  var rich_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
  };
  var rich_mousemove = function (d, i) {
    Tooltip.html(`Mean ${i["score"]}`)
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var rich_mouseout = function (d) {
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
        .tickValues([3, 4, 5])
        .tickFormat((d) => d)
    );

  var g = svg.selectAll(".bars").data(mean_data).enter().append("g");

  var adam = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr("x", (d) => (d.par / 4) * width)
    .attr("y", (d) => (-d.score * height) / 10)
    .attr("width", bar_width)
    .attr("height", (d) => (d.score * height) / 10)
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

  adam
    .on("mouseover", rich_mouseover)
    .on("mousemove", rich_mousemove)
    .on("mouseout", rich_mouseout);
}

mean_plot();
// let btn = document
//   .getElementById("round_choice")
//   .addEventListener("change", clickdemo);

// export function clickdemo() {
//   course = document.getElementById("round_choice").value;
//   score_type = document.getElementById("scoring_choice").value;
//   player = document.getElementById("player_choice").value;
//   window.innerWidth <500 ? solo_plot(course, score_type, player):
//   plot()

// }
