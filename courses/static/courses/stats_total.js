var dataset = await d3.json("/api/scorecards");

function testing() {
    console.log('test!!')
}


var cumsum_adam = d3.cumsum(dataset, (d) => d.adam_to_par);
var cumsum_alex = d3.cumsum(dataset, (d) => d.alex_to_par);
var cumsum_jaime = d3.cumsum(dataset, (d) => d.jaime_to_par);
var cumsum_rich = d3.cumsum(dataset, (d) => d.rich_to_par);

var margin = { top: 50, right: 50, bottom: 50, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 640 - margin.top - margin.bottom;

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
  .attr('class','axis--x');
svg
  .append("g")
  .attr("transform", `translate(0,${0})`)
  .attr('class','axis--y')

var duration = 500;

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
    .selectAll('.axis--x')
    .transition()
    .duration(duration)
    .call(d3.axisBottom(x));

svg
    .selectAll('.axis--y')
    .transition()
    .duration(duration)
    .call(d3.axisLeft(y));

var valueline = d3.line()
    .curve(d3.curveBumpX)
    .x(function(d,i) { return x(i); })
    .y(function(d,i) { return y(d); });
//   var line = svg
//   .selectAll('.linetest')
//   .line()
//   .x((d, i) => x(i))
//   .y((d, i) => y(d))
//   .curve(d3.curveCatmullRom.alpha(0.5));

//   var line_cum = svg
//   .append("path")
//   .attr('class','linetest')
//   .attr("fill", "none")
//   .attr("stroke", 'red')
//   .attr("stroke-width", 3)
//   .attr(
//     "d",
//     line(data)
//   );

  var line = svg.selectAll(".lineTest")
      .data([data]);

    line = line
      .enter()
    .append("path")
      .attr("class","lineTest")
      .attr("fill", "none")
  .attr("stroke", 'red')
  .attr("stroke-width", 3)
      .merge(line);

    line.transition()
      .duration(duration)
      .attr("d", valueline)
}
window.plot = plot;
window.cumsum_adam = cumsum_adam;
window.cumsum_alex = cumsum_alex;
window.cumsum_jaime = cumsum_jaime;
window.cumsum_rich = cumsum_rich;

// var player = document.getElementById('player_choiuce').value
// var player_event = document
//   .getElementById("player_choice")
//   .addEventListener("change", plot((data = cumsum)));
