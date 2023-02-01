// const W = 900
// const H = 450
// const margins = { top: 0, bottom: 50, left: 120, right: 100 }
// const w = W - margins.left - margins.right 
// const h = H - margins.top - margins.bottom - 30

var margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40,
    mid: 20
  },
  w = 750 - margin.left - margin.right,
  h = 300 - margin.top - margin.bottom;
var barPadding = 1;
var padding = 20;
var miniHeight = 60;

var selected;

var svg = d3.select(".outer-wrapper .chart").append("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.mid + miniHeight + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var barsGroup = svg.append('g')
//                     .attr("class","barsGroup");

// var miniGroup = svg.append('g')
//                     .attr("class","miniGroup")
//                     .attr("transform","translate(" + 0 + "," + (margin.top + h + margin.mid) + ")");

// var brushGroup = svg.append('g')
//                     .attr("class","brushGroup")
//                     .attr("transform","translate(" + 0 + "," + (margin.top + h + margin.mid) + ")");

    var w2 = 400;
    var h2 = 400;

    var outerRadius = w2 / 2;
    var innerRadius = w2 / 3;
    var arc = d3.svg.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);
    
    var pie = d3.layout.pie()
        .sort(null)
    .value(function(d) { return d.values; });
    
    var color = d3.scale.category20c();

    var svg2 = d3.select("body")
                .append("svg")
                .attr("width", w2)
                .attr("height", h2);


d3.csv("./dataset.csv", function(data) {
        var dataset1 = d3.nest()
        .key(function(d) { return d.popularity; })
        .entries(data);

        var x = d3.scale.linear().range([0, 100]);
        var y = d3.scale.ordinal().rangeRoundBands([0, 100]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    
        var svg1 = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 1000);

   
        x.domain(data.map(function(d) {return d.popularity; }));
        y.domain(data.map(function(d) {return d.track_name; }));
     
       svg1.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + 300 + ")")
           .call(xAxis)
         .selectAll("text")
     
       svg1.append("g")
           .attr("class", "y axis")
           .call(yAxis)
         .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text("Value ($)");
     
       svg1.selectAll(".bar")
           .data(dataset1)
           .enter().append("rect")
           .style("fill", "steelblue")
            .attr("y", function(d) { return y(d.track_name); })
           .attr("width", 10)
           .attr("height", 10)
       
        svg1.append("text")
         .attr("x", 350)
         .attr("y", 370)
         .attr("dy", "0.71em")
         .attr("fill", "#000")
         .text("Number of Records")
         .style("font", "12px avenir")
         .style("fill", "#000000")
         .style("font-weight", "bold");
     

var dataset2 = d3.nest()
        .key(function(d) { return d.explicit; })
        .sortKeys(d3.ascending)
        .rollup(function(values) {  return values.length; })
        .entries(data);

var text = svg2.append("text")
          .attr("dx", 200)
          .attr("dy", 200)
          .attr("font-size", 30)
          .style("text-anchor", "middle")
          .attr("fill", "#36454f");
          
var text2 = svg2.append("text")
          .attr("dx", 200)
          .attr("dy", 230)
          .attr("font-size", 20)
          .style("text-anchor", "middle")
          .attr("fill", "#36454f");
          
var text3 = svg2.append("text")
          .attr("dx", 200)
          .attr("dy", 260)
          .attr("font-size", 20)
          .style("text-anchor", "middle")
          .attr("fill", "#36454f");

  //Set up groups
    var arcs = svg2.selectAll("g.arc")
                  .data(pie(dataset2))
                  .enter()
                  .append("g")
                  .attr("class", "arc")
                  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
                  .on("mouseover", function(d) {
                    
                     var total = data.length;
           var percent = Math.round(1000 * d.value / total) / 10;
              
                 text.text(d.data.key).attr("class", "inner-circle");
                 text2.text(d.value + " nums");
                 text3.text(percent +"%");
          
              })
              .on("mouseout", function(d) {
               
                text.text(function(d) { return ""; });
                text2.text(function(d) { return ""; });
                text3.text(function(d) { return ""; });
          
              });
    
    //Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

});

// d3.csv("./dataset.csv").then(function(d) {
    
//     var track_id = d.map(function(d) { return d.track_id })
//     var artists= d.map(function(d) { return d.artists })
//     console.log(track_id)
//     console.log(artists)
// });



// var loaddata = function (d) {
//     d["track_id"] = d["track_id"];
//     d["artists"] = d["artists"];
//     d["album_name"] = d["album_name"];
//     d["track_name"] = d["track_name"];
//     d["popularity"] = +d["popularity"];
//     d["duration_ms"] = +d["duration_ms"];
//     d["danceability"] = +d["danceability"];
//     d["energy"] = +d["energy"];
//     d["key"] = +d["key"];
//     d["loudness"] = +d["loudness"];
//     d["mode"] = +d["mode"];
//     d["speechiness"] = +d["speechiness"];
//     d["acousticness"] = +d["acousticness"];
//     d["instrumentalness"] = +d["instrumentalness"];
//     d["liveness"] = +d["liveness"];
//     d["valence"] = +d["valence"];
//     d["tempo"] = +d["tempo"];
//     d["time_signature"] = +d["time_signature"];
//     d["track_genre"] = d["track_genre"];
// return d
// };  

