var margin = {top: 30, right: 40, bottom: 10, left: 5},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://vis.lab.djosix.com:2020/data/iris.csv", function(error, Data) {

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(Data[0]).filter(function(d) {
    return d != "class" && (y[d] = d3.scale.linear()
        .domain(d3.extent(Data, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  var class_color = d3.scale.ordinal()
  .domain(["Iris-setosa", "Iris-versicolor" , "Iris-virginica"])
  .range([ "#F8766A", "#00BA38", "#619CFF"])
  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(Data)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(Data)
    .enter().append("path")
    .attr({'style': function(d) {return "stroke: " + class_color (d.class)}})
    .attr("d", path)
    .style('stroke-width', 2);

    var legendKeys = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"].range = [ "#F8766A", "#00BA38", "#619CFF"]  
    var legendwords = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]
    
    svg.selectAll("legendSymbols")
    .data(legendKeys)
    .enter()
    .append("line")
    .attr('x1', margin.left / 2 + 822).attr('y1', (d, i) => i * 25 +margin.bottom +140).attr('x2', margin.left / 2 + 828).attr('y2', (d, i) => i * 25 + margin.bottom +150)
    .style('stroke', Data => class_color(Data))
    .style('stroke-width', 3)

    svg.selectAll("legendTexts")
    .data(legendwords)
    .enter()
    .append("text")
    .text((d) => d)
    .attr('x', margin.left / 2 + 888)
    .attr('y', (d, i) => i * 25 + margin.bottom + 300/ 2 )
    .attr('text-anchor', 'middle')
    .attr("class", "textbox")


  svg.append("rect")
    .attr("x", margin.left / 2 + 815)
    .attr("y", 140)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("width", 133)
    .attr("height", 80)
    .attr("id", "legend")  

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
  


});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}