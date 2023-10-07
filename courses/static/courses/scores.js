var scoredataset = await d3.json("/api/scorecards");


for (let i = 0; i < scoredataset.length; i++) {
  if (scoredataset[i]["hole"]["hole"] == 1) {
    scoredataset[i]["adam_cum"] =
      scoredataset[i]["adam"] - scoredataset[i]["hole"]["par"];
    scoredataset[i]["alex_cum"] =
      scoredataset[i]["alex"] - scoredataset[i]["hole"]["par"];
    scoredataset[i]["jaime_cum"] =
      scoredataset[i]["jaime"] - scoredataset[i]["hole"]["par"];
    scoredataset[i]["rich_cum"] =
      scoredataset[i]["rich"] - scoredataset[i]["hole"]["par"];
  } else {
    scoredataset[i]["adam_cum"] =
      scoredataset[i]["adam"] == null
        ? scoredataset[i - 1]["adam_cum"]
        : scoredataset[i - 1]["adam_cum"] +
          scoredataset[i]["adam"] -
          scoredataset[i]["hole"]["par"];
    scoredataset[i]["alex_cum"] =
      scoredataset[i]["alex"] == null
        ? scoredataset[i - 1]["alex_cum"]
        : scoredataset[i - 1]["alex_cum"] +
          scoredataset[i]["alex"] -
          scoredataset[i]["hole"]["par"];
    scoredataset[i]["jaime_cum"] =
      scoredataset[i]["jaime"] == null
        ? scoredataset[i - 1]["jaime_cum"]
        : scoredataset[i - 1]["jaime_cum"] +
          scoredataset[i]["jaime"] -
          scoredataset[i]["hole"]["par"];
    scoredataset[i]["rich_cum"] =
      scoredataset[i]["rich"] == null
        ? scoredataset[i - 1]["rich_cum"]
        : scoredataset[i - 1]["rich_cum"] +
          scoredataset[i]["rich"] -
          scoredataset[i]["hole"]["par"];
  }
}

for (let i = 0; i < scoredataset.length; i++) {
  if (scoredataset[i]["hole"]["hole"] == 1) {
    scoredataset[i]["adam_cum_stable"] =
      scoredataset[i]["adam_stable"];
    scoredataset[i]["alex_cum_stable"] =
      scoredataset[i]["alex_stable"];
    scoredataset[i]["jaime_cum_stable"] =
      scoredataset[i]["jaime_stable"];
    scoredataset[i]["rich_cum_stable"] =
      scoredataset[i]["rich_stable"];
  } else {
    scoredataset[i]["adam_cum_stable"] =
      scoredataset[i]["adam_stable"] == null
        ? scoredataset[i - 1]["adam_cum_stable"]
        : scoredataset[i - 1]["adam_cum_stable"] +
          scoredataset[i]["adam_stable"];
    scoredataset[i]["alex_cum_stable"] =
      scoredataset[i]["alex_stable"] == null
        ? scoredataset[i - 1]["alex_cum_stable"]
        : scoredataset[i - 1]["alex_cum_stable"] +
          scoredataset[i]["alex_stable"];
    scoredataset[i]["jaime_cum_stable"] =
      scoredataset[i]["jaime_stable"] == null
        ? scoredataset[i - 1]["jaime_cum_stable"]
        : scoredataset[i - 1]["jaime_cum_stable"] +
          scoredataset[i]["jaime_stable"];
    scoredataset[i]["rich_cum_stable"] =
      scoredataset[i]["rich_stable"] == null
        ? scoredataset[i - 1]["rich_cum_stable"]
        : scoredataset[i - 1]["rich_cum_stable"] +
          scoredataset[i]["rich_stable"];
  }
}



console.log(window.innerWidth);
async function plot(course, score_type) {
  d3.selectAll("svg").remove();

  var margin = { top: 50, right: 100, bottom: 50, left: 50 },
    width = window.innerWidth - margin.left - margin.right,
    height = (window.innerHeight * 3) / 4 - margin.top - margin.bottom;

  const x_domain = { bottom: 0, top: 18 };
  if (score_type == "to_par") {
    var y_domain = { bottom: 0, top: 10 };
  } else {
    var y_domain = { bottom: 0, top: 5 };
  }

  var svg = d3
    .select("#div-template")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom, x_domain.top])
    .range([0, width]);
  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);
  var yLeft = d3.scaleLinear().domain(score_type == 'to_par'?[-10, 40]:[0,50]).range([height, 0]);

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

  var adam_leg = svg
    .append("circle")
    .attr("cx", width/2 - 2*legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", adam_color);
  var alex_leg = svg
    .append("circle")
    .attr("cx", width/2 - legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", alex_color);
  var jaime_leg = svg
    .append("circle")
    .attr("cx", width/2)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", jaime_color);
  var rich_leg = svg
    .append("circle")
    .attr("cx", width/2 + legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", rich_color);
  var adam_text = svg
    .append("text")
    .attr("x", width/2 - 2*legend_x + 20)
    .attr("y", legend_y)
    .text("Adam")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var alex_text = svg
    .append("text")
    .attr("x", width/2 - legend_x + 20)
    .attr("y", legend_y)
    .text("Alex")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var jaime_text = svg
    .append("text")
    .attr("x", width/2 + 20)
    .attr("y", legend_y)
    .text("Jaime")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var rich_text = svg
    .append("text")
    .attr("x", width/2 + legend_x +20)
    .attr("y", legend_y)
    .text("Rich")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

  var Tooltip = d3
    .select("#div-template")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var adam_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    adam_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    adam_text.style("font-size", `${leg_font_big}px`);
  };
  var adam_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>
      Shots ${i["adam"]}<br>
      Par ${i["hole"]["par"]}<br>
      Points ${i["adam_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var adam_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
    adam_leg.attr("r", "6").attr("stroke", "none");
    adam_text.style("font-size", `${leg_font_small}px`);
  };
  var alex_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    alex_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    alex_text.style("font-size", `${leg_font_big}px`);
  };
  var alex_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["alex"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["alex_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var alex_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", alex_color)
      .style("stroke-width", "1");
    alex_text.style("font-size", `${leg_font_small}px`);
    alex_leg.attr("r", "6").attr("stroke", "none");
  };
  var jaime_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    jaime_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    jaime_text.style("font-size", `${leg_font_big}px`);
  };
  var jaime_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["jaime"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["jaime_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var jaime_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", jaime_color)
      .style("stroke-width", "1");
    jaime_leg.attr("r", "6").attr("stroke", "none");
    jaime_text.style("font-size", `${leg_font_small}px`);
  };
  var rich_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    rich_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    rich_text.style("font-size", `${leg_font_big}px`);
  };
  var rich_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["rich"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["rich_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var rich_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", rich_color)
      .style("stroke-width", "1");
    rich_leg.attr("r", "6").attr("stroke", "none");
    rich_text.style("font-size", `${leg_font_small}px`);
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
    .call(d3.axisBottom(x).ticks(18) ).selectAll("text")  
    .attr("transform", "rotate(65) translate(20,-0)");

  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${width+40},0)`)
    .call(d3.axisRight(yLeft));

  var g = svg
    .selectAll(".bars")
    .data(scoredataset)
    .enter()
    .filter((d) => d.round_number.id == course)
    .append("g");

  var adam = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width -
        width / (x_domain.top - x_domain.bottom) / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.adam / y_domain.top) * height
        : (-d.adam_stable / y_domain.top) * height
    )
    .attr("width", bar_width)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.adam / y_domain.top) * height
        : (d.adam_stable / y_domain.top) * height
    )
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr(
      "transform",
      `translate(${space_width / 2 - 2 * bar_width},${height})`
    );
  var alex = g
    .append("rect")
    .attr("class", "bar-alex")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width -
        width / (x_domain.top - x_domain.bottom) / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.alex / y_domain.top) * height
        : (-d.alex_stable / y_domain.top) * height
    )
    .attr("width", bar_width)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.alex / y_domain.top) * height
        : (d.alex_stable / y_domain.top) * height
    )
    .attr("fill", alex_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${space_width / 2 - bar_width},${height})`);
  var jaime = g
    .append("rect")
    .attr("class", "bar-jaime")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width -
        width / (x_domain.top - x_domain.bottom) / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.jaime / y_domain.top) * height
        : (-d.jaime_stable / y_domain.top) * height
    )
    .attr("width", bar_width)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.jaime / y_domain.top) * height
        : (d.jaime_stable / y_domain.top) * height
    )
    .attr("fill", jaime_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${space_width / 2},${height})`);
  var rich = g
    .append("rect")
    .attr("class", "bar-rich")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width -
        width / (x_domain.top - x_domain.bottom) / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.rich / y_domain.top) * height
        : (-d.rich_stable / y_domain.top) * height
    )
    .attr("width", bar_width)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.rich / y_domain.top) * height
        : (d.rich_stable / y_domain.top) * height
    )
    .attr("fill", rich_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(${space_width / 2 + bar_width},${height})`);

  var adam_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.adam_cum : d.adam_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var adam_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", adam_color_line)
    .attr("stroke-width", 3)
    .attr(
      "d",
      adam_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var alex_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.alex_cum : d.alex_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5))
    ;

  var alex_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", alex_color_line)
    .attr("stroke-width", 3)
    .attr(
      "d",
      alex_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var jaime_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) =>
      yLeft(score_type == "to_par" ? d.jaime_cum : d.jaime_cum_stable)
    )
    .curve(d3.curveCatmullRom.alpha(0.5));

  var jaime_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", jaime_color_line)
    .attr("stroke-width", 3)
    .attr(
      "d",
      jaime_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var rich_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.rich_cum : d.rich_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var rich_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", rich_color_line)
    .attr("stroke-width", 3)
    .attr(
      "d",
      rich_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  adam
    .on("mouseover", adam_mouseover)
    .on("mousemove", adam_mousemove)
    .on("mouseout", adam_mouseout);

  alex
    .on("mouseover", alex_mouseover)
    .on("mousemove", alex_mousemove)
    .on("mouseout", alex_mouseout);

  jaime
    .on("mouseover", jaime_mouseover)
    .on("mousemove", jaime_mousemove)
    .on("mouseout", jaime_mouseout);

  rich
    .on("mouseover", rich_mouseover)
    .on("mousemove", rich_mousemove)
    .on("mouseout", rich_mouseout);
}

async function solo_plot(course, score_type, player) {
  d3.selectAll("svg").remove();

  var margin = { top: 50, right: 100, bottom: 50, left: 50 },
    width = window.innerWidth  - margin.left - margin.right,
    height = (window.innerHeight * 3) / 4 - margin.top - margin.bottom;

  const x_domain = { bottom: 0, top: 18 };
  if (score_type == "to_par") {
    var y_domain = { bottom: 0, top: 10 };
  } else {
    var y_domain = { bottom: 0, top: 5 };
  }

  var svg = d3
    .select("#div-template")
    .append("svg")
    .style("width", width + margin.left + margin.right)
    .style("height", height + margin.top + margin.bottom)
    .style("background", "#C5DFF8")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .style("color", "#000");

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom, x_domain.top])
    .range([0, width]);
  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);
  var yLeft = d3.scaleLinear().domain(score_type == 'to_par'?[-10, 20]:[0,50]).range([height, 0]);

  var alex_color = "#50808E";
  var adam_color = "#FCBF49";
  var jaime_color = "#7EA172";
  var rich_color = "#C1666B";
  var mouseover_color = "black";
  var space_width = width / (x_domain.top - x_domain.bottom);
  var bar_width = (space_width * 4) / 5;
  var legend_x = 100 ;
  var legend_y = -20
  var leg_font_small = 15;
  var leg_font_big = 20;
  var trans_dur = 200;
  var alex_color_line = "#50806E";
  var adam_color_line = "#DCBF49";
  var jaime_color_line = "#5EA152";
  var rich_color_line = "#A1866B";

  var adam_leg = svg
    .append("circle")
    .attr("cx", width/2 - 2*legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", adam_color);
  var alex_leg = svg
    .append("circle")
    .attr("cx", width/2 - legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", alex_color);
  var jaime_leg = svg
    .append("circle")
    .attr("cx", width/2)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", jaime_color);
  var rich_leg = svg
    .append("circle")
    .attr("cx", width/2 + legend_x)
    .attr("cy", legend_y)
    .attr("r", 6)
    .style("fill", rich_color);
  var adam_text = svg
    .append("text")
    .attr("x", width/2 - 2*legend_x + 20)
    .attr("y", legend_y)
    .text("Adam")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var alex_text = svg
    .append("text")
    .attr("x", width/2 - legend_x + 20)
    .attr("y", legend_y)
    .text("Alex")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var jaime_text = svg
    .append("text")
    .attr("x", width/2 + 20)
    .attr("y", legend_y)
    .text("Jaime")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  var rich_text = svg
    .append("text")
    .attr("x", width/2 + legend_x +20)
    .attr("y", legend_y)
    .text("Rich")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

  var Tooltip = d3
    .select("#div-template")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("position", "absolute");

  var adam_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    adam_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    adam_text.style("font-size", `${leg_font_big}px`);
  };
  var adam_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["adam"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["adam_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var adam_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", adam_color)
      .style("stroke-width", "1");
    adam_leg.attr("r", "6").attr("stroke", "none");
    adam_text.style("font-size", `${leg_font_small}px`);
  };
  var alex_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    alex_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    alex_text.style("font-size", `${leg_font_big}px`);
  };
  var alex_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["alex"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["alex_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var alex_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", alex_color)
      .style("stroke-width", "1");
    alex_text.style("font-size", `${leg_font_small}px`);
    alex_leg.attr("r", "6").attr("stroke", "none");
  };
  var jaime_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    jaime_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    jaime_text.style("font-size", `${leg_font_big}px`);
  };
  var jaime_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots ${i["jaime"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["jaime_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var jaime_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", jaime_color)
      .style("stroke-width", "1");
    jaime_leg.attr("r", "6").attr("stroke", "none");
    jaime_text.style("font-size", `${leg_font_small}px`);
  };
  var rich_mouseover = function (d, i) {
    Tooltip.style("opacity", 1).style("z-index", 1000);
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", mouseover_color)
      .style("stroke-width", "3");
    rich_leg.attr("r", "10").attr("stroke", "black").attr("stroke-width", 2);
    rich_text.style("font-size", `${leg_font_big}px`);
  };
  var rich_mousemove = function (d, i) {
    Tooltip.html(
      `Hole ${i["hole"]["hole"]}<br>Shots${i["rich"]}<br>Par ${i["hole"]["par"]}<br>Points ${i["rich_stable"]}`
    )
      .style("left", d["clientX"] + 20)
      .style("top", d["clientY"] - 100);
  };

  var rich_mouseout = function (d) {
    Tooltip.style("opacity", 0).style("z-index", "auto");
    d3.select(this)
      .transition()
      .duration(trans_dur)
      .style("fill", rich_color)
      .style("stroke-width", "1");
    rich_leg.attr("r", "6").attr("stroke", "none");
    rich_text.style("font-size", `${leg_font_small}px`);
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
    .call(d3.axisBottom(x).ticks(18)).selectAll("text")  
    .attr("transform", "rotate(65) translate(20,-0)");
    svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${width+40},0)`)
    .call(d3.axisRight(yLeft));

  var g = svg
    .selectAll(".bars")
    .data(scoredataset)
    .enter()
    .filter((d) => d.round_number.id == course)
    .append("g");

  var adam = g
    .append("rect")
    .attr("class", "bar-adam")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width - bar_width / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.adam / y_domain.top) * height
        : (-d.adam_stable / y_domain.top) * height
    )
    .attr("width", player == "adam" ? bar_width : 0)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.adam / y_domain.top) * height
        : (d.adam_stable / y_domain.top) * height
    )
    .attr("fill", adam_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(0,${height})`);
  var alex = g
    .append("rect")
    .attr("class", "bar-alex")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width - bar_width / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.alex / y_domain.top) * height
        : (-d.alex_stable / y_domain.top) * height
    )
    .attr("width", player == "alex" ? bar_width : 0)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.alex / y_domain.top) * height
        : (d.alex_stable / y_domain.top) * height
    )
    .attr("fill", alex_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(0,${height})`);
  var jaime = g
    .append("rect")
    .attr("class", "bar-jaime")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width - bar_width / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.jaime / y_domain.top) * height
        : (-d.jaime_stable / y_domain.top) * height
    )
    .attr("width", player == "jaime" ? bar_width : 0)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.jaime / y_domain.top) * height
        : (d.jaime_stable / y_domain.top) * height
    )
    .attr("fill", jaime_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(0,${height})`);
  var rich = g
    .append("rect")
    .attr("class", "bar-rich")
    .attr(
      "x",
      (d) =>
        (d.hole.hole / (x_domain.top - x_domain.bottom)) * width - bar_width / 2
    )
    .attr("y", (d) =>
      score_type == "to_par"
        ? (-d.rich / y_domain.top) * height
        : (-d.rich_stable / y_domain.top) * height
    )
    .attr("width", player == "rich" ? bar_width : 0)
    .attr("height", (d) =>
      score_type == "to_par"
        ? (d.rich / y_domain.top) * height
        : (d.rich_stable / y_domain.top) * height
    )
    .attr("fill", rich_color)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .attr("transform", `translate(0,${height})`);
  
    var adam_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.adam_cum : d.adam_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var adam_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", adam_color_line)
    .attr("stroke-width",  player == "adam" ? 3 : 0)
    .attr(
      "d",
      adam_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var alex_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.alex_cum : d.alex_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5))
    ;

  var alex_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", alex_color_line)
    .attr("stroke-width", player == "alex" ? 3 : 0)
    .attr(
      "d",
      alex_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var jaime_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) =>
      yLeft(score_type == "to_par" ? d.jaime_cum : d.jaime_cum_stable)
    )
    .curve(d3.curveCatmullRom.alpha(0.5));

  var jaime_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", jaime_color_line)
    .attr("stroke-width", player == "jaime" ? 3 : 0)
    .attr(
      "d",
      jaime_line(scoredataset.filter((d) => d.round_number.id == course))
    );
  var rich_line = d3
    .line()
    .x((d, i) => x(d.hole.hole))
    .y((d, i) => yLeft(score_type == "to_par" ? d.rich_cum : d.rich_cum_stable))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var rich_cum = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", rich_color_line)
    .attr("stroke-width", player == "rich" ? 3 : 0)
    .attr(
      "d",
      rich_line(scoredataset.filter((d) => d.round_number.id == course))
    );

  adam
    .on("mouseover", adam_mouseover)
    .on("mousemove", adam_mousemove)
    .on("mouseout", adam_mouseout);

  alex
    .on("mouseover", alex_mouseover)
    .on("mousemove", alex_mousemove)
    .on("mouseout", alex_mouseout);

  jaime
    .on("mouseover", jaime_mouseover)
    .on("mousemove", jaime_mousemove)
    .on("mouseout", jaime_mouseout);

  rich
    .on("mouseover", rich_mouseover)
    .on("mousemove", rich_mousemove)
    .on("mouseout", rich_mouseout);
}

let btn = document
  .getElementById("round_choice")
  .addEventListener("change", clickdemo);
let btn2 = document
  .getElementById("scoring_choice")
  .addEventListener("change", clickdemo);
let btn3 = document
  .getElementById("player_choice")
  .addEventListener("change", clickdemo);
var hmm = window.addEventListener("resize", clickdemo);
var course = scoredataset[0]["round_number"]["id"];
var score_type = "to_par";
var player = "all";
window.innerWidth <500 ? solo_plot(course, score_type, 'adam'):plot(course, score_type);
export function clickdemo() {
  course = document.getElementById("round_choice").value;
  score_type = document.getElementById("scoring_choice").value;
  player = document.getElementById("player_choice").value;
  window.innerWidth <500 ? solo_plot(course, score_type, player):
  player == "all"
    ? plot(course, score_type)
    : solo_plot(course, score_type, player);
}
