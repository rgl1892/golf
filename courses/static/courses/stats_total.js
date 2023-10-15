var dataset = await d3.json("/api/scorecards");

function testing() {
  console.log("test!!");
}

var cumsum_adam = d3.cumsum(dataset, (d) => d.adam);
var cumsum_alex = d3.cumsum(dataset, (d) => d.alex);
var cumsum_jaime = d3.cumsum(dataset, (d) => d.jaime);
var cumsum_rich = d3.cumsum(dataset, (d) => d.rich);
var cumsum_adam_stable = d3.cumsum(dataset, (d) => d.adam_stable);
var cumsum_alex_stable = d3.cumsum(dataset, (d) => d.alex_stable);
var cumsum_jaime_stable = d3.cumsum(dataset, (d) => d.jaime_stable);
var cumsum_rich_stable = d3.cumsum(dataset, (d) => d.rich_stable);
var cumsum_adam_to_par = d3.cumsum(dataset, (d) => d.adam_to_par);
var cumsum_alex_to_par = d3.cumsum(dataset, (d) => d.alex_to_par);
var cumsum_jaime_to_par = d3.cumsum(dataset, (d) => d.jaime_to_par);
var cumsum_rich_to_par = d3.cumsum(dataset, (d) => d.rich_to_par);
var cumsum_adam_stable_counting = d3.cumsum(dataset, (d) => d.adam_stable);
var cumsum_alex_stable_counting = d3.cumsum(dataset, (d) => d.alex_stable);
var cumsum_jaime_stable_counting = d3.cumsum(dataset, (d) => d.jaime_stable);
var cumsum_rich_stable_counting = d3.cumsum(dataset, (d) => d.rich_stable);

var margin = { top: 50, right: 100, bottom: 50, left: 50 },
  width = window.innerWidth - margin.left - margin.right,
  height = (window.innerHeight * 3) / 4 - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.bottom})`);

svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .attr("class", "axis--x");
svg.append("g").attr("transform", `translate(0,${0})`).attr("class", "axis--y");

var duration = 300;

export async function plot(data) {
  console.log(data);
  var x_domain = { bottom: 0, top: data.length + 2 };
  var y_domain = { bottom: 0, top: d3.max(data) };

  var x = d3
    .scaleLinear()
    .domain([x_domain.bottom, x_domain.top])
    .range([0, width]);

  var y = d3
    .scaleLinear()
    .domain([y_domain.bottom, y_domain.top])
    .range([height, 0]);

  svg
    .selectAll(".axis--x")
    .transition()
    .duration(duration)
    .call(d3.axisBottom(x));

  svg
    .selectAll(".axis--y")
    .transition()
    .duration(duration)
    .call(d3.axisLeft(y));

  var valueline = d3
    .line()
    .curve(d3.curveBumpX)
    .x(function (d, i) {
      return x(i);
    })
    .y(function (d, i) {
      return y(d);
    });

  var line = svg.selectAll(".lineTest").data([data]);

  line = line
    .enter()
    .append("path")
    .attr("class", "lineTest")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 3)
    .merge(line)
    ;

  line.transition().duration(duration).ease(d3.easeElastic.amplitude(2.7)).duration(2000).attr("d", valueline);
}
window.plot = plot;
window.cumsum_adam = cumsum_adam;
window.cumsum_alex = cumsum_alex;
window.cumsum_jaime = cumsum_jaime;
window.cumsum_rich = cumsum_rich;
window.cumsum_adam_stable = cumsum_adam_stable;
window.cumsum_alex_stable = cumsum_alex_stable;
window.cumsum_jaime_stable = cumsum_jaime_stable;
window.cumsum_rich_stable = cumsum_rich_stable;
window.cumsum_adam_to_par = cumsum_adam_to_par;
window.cumsum_alex_to_par = cumsum_alex_to_par;
window.cumsum_jaime_to_par = cumsum_jaime_to_par;
window.cumsum_rich_to_par = cumsum_rich_to_par;

// var player = document.getElementById('player_choiuce').value
// var player_event = document
//   .getElementById("player_choice")
//   .addEventListener("change", plot((data = cumsum)));
