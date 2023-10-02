import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
var dataset = await d3.json('/api/holes');
async function plot(val) {
    d3.selectAll('svg').remove()

    var margin = { top: 50, right: 50, bottom: 50, left:50},
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight * 2/3 - margin.top - margin.bottom;

    const x_domain = {bottom:0,top:18}
    const y_domain = {bottom:0,top:700}

    var svg = d3.select('#div-template').append('svg')
        .style('width', width + margin.left + margin.right)
        .style('height', height + margin.top + margin.bottom)
        .style("background", "#C5DFF8")
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .style("color", "#000");

    // var outline = svg.append('rect')
    //     .attr('x',0)
    //     .attr('y',0)
    //     .attr('height',height)
    //     .attr('width',width) 
    //     .attr('stroke',"black")
    //     .attr('fill','none')
    //     .attr('stroke-width','2px')

    var x = d3.scaleLinear().domain([x_domain.bottom,x_domain.top]).range([0,width]);
    var y = d3.scaleLinear().domain([y_domain.bottom,y_domain.top]).range([height,0]);

    

    var color = (d) => d.tees;

    var size = (d) => d.par*2;

    var Tooltip = d3.select('#div-template')
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style('position','absolute')

 
    var mouseover = function(d,i){
        Tooltip.style('opacity',1);
        d3.select(this).transition().duration(500).style('fill','#8DB580').attr('r',20)
    }
    var mousemove = function(d,i){
        Tooltip
          .html(`${i['course']}<br>${i['tees']}:<br>${i['yards']} Yards`)
          .style('left',d['clientX']+50)
          .style('top',d['clientY']-150)
        }

    var mouseout = function(d){
        Tooltip.style('opacity',0).attr('width','1px');
        d3.select(this).transition().duration(500).style('fill',color).attr('r',size)
    }

    svg.append("g")
        .attr('class','axis')
        .style('font','14px monaco')
        .attr('transform',`translate(${0},0)`)
        // .attr('transform','rotate(90)')
        .call(d3.axisLeft(y));
    svg.append('g')
        .attr('class','axis')
        .style('font','14px monaco')
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(18))
        .selectAll("text")  
     .attr("transform", "rotate(65) translate(20,-0)");

        if (val == 'Both') {
    var circles = svg.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .attr("cx",(d) => d.hole/18 * (width) )
        .attr("cy",(d) => -d.yards/y_domain.top *(height) )
        .attr("r", (d) => d.par*2)
        .attr('stroke','black') 
        .attr('stroke-width','3') 
        .attr('transform',`translate(${0},${height})`)
        .attr('fill',(d) => d.tees)
        ;
        }
    else {
    var circles = svg.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
        .filter((d) => d.course == val)
        .attr("cx",(d) => d.hole/18 * (width) )
        .attr("cy",(d) => -d.yards/y_domain.top *(height) )
        .attr("r", (d) => d.par*2)
        .attr('stroke','black') 
        .attr('stroke-width','3') 
        .attr('transform',`translate(${0},${height})`)
        .attr('fill',(d) => d.tees)
        ;
    }

    circles.transition().duration(1000).delay(500);
    

    circles.on('mouseover',mouseover)
        .on('mousemove',mousemove)
        .on('mouseout',mouseout);
            
     }   

    // circles.transition().duration(500);
    // var btn = document.getElementById('course_choice');
    // var value = btn.value
    // btn.addEventListener('onchange',console.log(value))

    let btn = document.getElementById('course_choice').addEventListener('change',clickdemo)
    var hmm = window.addEventListener('resize',clickdemo)

plot('Faldo')
export function clickdemo(){
    var val = document.getElementById('course_choice').value
    plot(val)
}








