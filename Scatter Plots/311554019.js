const W = 900
const H = 450
const margins = { top: 0, bottom: 50, left: 120, right: 100 }
const w = W - margins.left - margins.right 
const h = H - margins.top - margins.bottom - 30

const label = {
  'sepal length': 'Sepal Length',
  'sepal width': 'Sepal Width',
  'petal length': 'Petal Length',
  'petal width': 'Petal Width'
}

const outer = d3.select('svg#points-scatter').attr('width', W + 80) .attr('height', H+100)

const inner = outer
  .append('g')
  .attr('id', 'inner-points')
  .attr('width', w)
  .attr('height', h)
  .attr('transform', 'translate(' + margins.left + ',' + margins.right + ')')

d3.csv("http://vis.lab.djosix.com:2020/data/iris.csv", loaddata)
  .then(function(d) {
    const removeId = d.findIndex(dd=> {
      return (
         dd["sepal length"] === ""
      );
    });
    
    d.splice(removeId, 1);
    d.forEach(function(dd) { 
      console.log(dd.class)})
    init(d)
    change(d)
  }).catch(error => console.log(error))
  
var loaddata = function (d) {
            d["sepal length"] = +d["sepal length"];
            d["sepal width"] = +d["sepal width"];
            d["petal length"] = +d["petal length"];
            d["petal width"] = +d["petal width"];
  return d
};  

var vars = []
var xScale, yScale, color
var xAxis, yAxis

function init(points) {
  vars = points
  var variables = Object.keys(points[0]).filter(d => d != 'class')

  inner.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('fill', 'transparent')
    .attr('stroke', 'black')

  d3.select('select.x_variable')
    .on('change', () => change(vars))
    .selectAll('option')
    .data(variables)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => label[d])

  d3.select('select.y_variable')
    .on('change', () => change(vars)) 
    .selectAll('option')
    .data(variables)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => label[d])


  d3.select('select.x_variable').property('value', 'petal width')
  d3.select('select.y_variable').property('value', 'petal length')
 
  var x_variable = d3.select('select.x_variable').property('value')
  var y_variable = d3.select('select.y_variable').property('value')

  
  xScale = d3.scaleLinear()
    .domain([
    d3.min(points,function (d) { return d[x_variable]}),
    d3.max(points,function (d) { return d[x_variable] })
    ])
    .range([20, w - 20])
  xAxis = d3.axisBottom(xScale).tickSize(-h)

  yScale = d3.scaleLinear()
  .domain([
    d3.min(points,function (d) { return d[y_variable]}),
    d3.max(points,function (d) { return d[y_variable] })
    ])
    .range([20, h - 20].reverse())
  yAxis = d3.axisLeft(yScale).tickSize(-w)


  //color = d3.scaleOrdinal(d3.schemeCategory10).domain(Object.keys(points.map(d => d['class'])))
  color = d3.scaleOrdinal()
    .domain(Object.keys(points.map(d => d['class'])))
    .range([ "#F8766A", "#00BA38", "#619CFF"])
    
    
  inner.append('g').attr('transform', 'translate(' + 0 + ', ' + h + ')')
    .attr('class', 'x axis') 
    .call(xAxis)

  inner.append('g').attr('class', 'y axis').call(yAxis)

  outer.append('text')
  .attr('class', 'x axis')
    .attr('x', margins.left + w / 2)
    .attr('y', H - margins.bottom / 2 + 100)
    .attr('text-anchor', 'middle')
    .text(label[x_variable])

  outer.append('text')
  .attr('class', 'y axis')
    .attr('x', margins.left / 2 - 60 )
    .attr('y', margins.bottom + h / 2 - 10 )
    .attr('text-anchor', 'middle')
    .attr(
      'transform',
      `rotate(-90 ${margins.left / 2} ${margins.bottom + h / 2})`
    )
    .text(label[y_variable])

}

function change(points) {
  var x_variable = d3.select('select.x_variable').property('value')
  var y_variable = d3.select('select.y_variable').property('value')
  
  var div = outer.append("div").attr("class", "tooltip").style("opacity", 0);
  var legendKeys = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"].range = [ "#F8766A", "#00BA38", "#619CFF"]  
  var legendwords = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]
  xScale
  .domain([
    d3.min(points,function (d) { return d[x_variable]}),
    d3.max(points,function (d) { return d[x_variable] })
    ])
    
  yScale
  .domain([
      d3.min(points,function (d) { return d[y_variable]}),
      d3.max(points,function (d) { return d[y_variable] })
      ])

  inner.select('.x.axis').transition().duration(500).call(xAxis)
  inner.select('.y.axis').transition().duration(500).call(yAxis)

  inner.selectAll('circle').data(points)
    .join(enter =>
      enter
          .append('circle')
          .attr('cx', d => xScale(d[x_variable]))
          .attr('cy', d => yScale(d[y_variable]))
          .style('fill', d => color(d['class'])),
      change =>
        change
          .transition().duration(500)
          .attr('cx', d => xScale(d[x_variable]))
          .attr('cy', d => yScale(d[y_variable]))
          .attr('r', 8),
      exit =>
        exit.transition().duration(500).remove()
    )

    inner.selectAll("circle")
        .on('mouseover', function () {
            d3.select(this).transition().duration(300).attr('r',15)
            div.transition().duration(300).style("opacity", 1);
            div.html("ssssss" + "," + d[y_variable])
          .style("left", (d3.event.pageX + 100) + "px")
          .style("top", (d3.event.pageY - 150) + "px");
            
          })
          .on('mouseout', function () {
            d3.select(this).transition().duration(500).attr('r',8)
            div.transition().duration(100).style("opacity", 0);
          })

  outer
    .selectAll('text.y.axis') 
    .transition()
    .duration(500)
    .text(label[y_variable])

  outer
    .selectAll('text.x.axis')
    .transition()
    .duration(500)
    .text(label[x_variable])


    outer.selectAll("legendSymbols")
      .data(legendKeys)
      .enter()
      .append("circle")
      .attr("cx", margins.left / 2 + 765)
      .attr("cy", (d, i) => i * 25 + margins.bottom + h / 2 - 5)
      .attr("r", 5)
      .attr('fill', d => color(d))
  
    outer.selectAll("legendTexts")
      .data(legendwords)
      .enter()
      .append("text")
      .text((d) => d)
      .attr('x', margins.left / 2 + 830)
      .attr('y', (d, i) => i * 25 + margins.bottom + h / 2 )
      .attr('text-anchor', 'middle')
      .attr("class", "textbox")

    outer.append("rect")
                      .attr("x", margins.left / 2 + 750)
                      .attr("y", 215)
                      .attr("rx", 5)
                      .attr("ry", 5)
                      .attr("width", 150)
                      .attr("height", 80)
                      .attr("id", "legend")

}