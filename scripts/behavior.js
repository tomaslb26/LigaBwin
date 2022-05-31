var dataset;
var currentTeam = "Benfica"
var currentSelectedTeam = "Braga"
var currentPassNetworkState = "Home"
var allPasses = false
var allCarries = false
var ProgressivePasses = true
var ProgressiveCarries = false
var UnsuccessfulPasses = false
var currentTeamId = 299;
var teams = ['Benfica', 'Famalicao', 'Moreirense', 'Vizela',
'Arouca', 'Belenenses SAD', 'Boavista', 'Braga',
'Maritimo', 'Pacos de Ferreira', 'Vitoria de Guimaraes', 'Gil Vicente',
'Porto', 'Portimonense', 'Santa Clara', 'Tondela',
'Estoril', 'Sporting']


function init(){

  selectTeam();
  PassNetwork();
  movingAverage()
  actions()

}

function movingAverage(){
  d3.csv("data/allShotsLigaBwin2122.csv")
  .then((data) => {


    // -------------------------------------DATA PROCESSING --------------------------------------------/
    data = data.filter(function(d) {
      if(d.homeTeam == currentTeam || d.awayTeam == currentTeam){
        return d;
      }
    })

    team_data = data.filter(function(d){
      if(d.name == currentTeam){
        return d
      }
    })

    opp_data = data.filter(function(d){
      if(d.name != currentTeam){
        return d
      }
    })

    team_data = d3.rollup(team_data, v => d3.sum(v, d => d.expectedGoals), d => d.round);
    opp_data = d3.rollup(opp_data, v => d3.sum(v, d => d.expectedGoals), d => d.round);

    final_team_data = []
    final_opp_data = []
    team_data.forEach((value, key) => {
      final_team_data.push({'round':key, 'value': value})
    })
    opp_data.forEach((value, key) => {
      final_opp_data.push({'round':key, 'value': value})
    })
    final_team_data.sort(function(a,b) {
      return a.round - b.round
    });
    final_opp_data.sort(function(a,b) {
      return a.round - b.round
    });
    //--------------------------------------------------------------------------------------/

    width = 480
    height = 200
    margin = {'top': 40, 'right':380, 'bottom':40, 'left':20}


    var yScale = d3.scaleLinear()
    .range([height, 0])

    var xScale = d3.scaleLinear()
    .range([0, width])

    var line = d3.line()
    .x(function(d){ return xScale(d.round) })
    .y(function(d){ return yScale(d.value) })

    setupScales = function(data){
      xScale.domain(d3.extent(final_team_data, function(d) { return Number(d.round); }))
      yScale.domain([0, d3.max(final_team_data, function(d){return d.value}) ])
    }

    setupScales(data)

    svg = d3.select("div#movingAverage").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + (margin.left+20) + "," + margin.top + ")");

    svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 11)
    .attr("refY", 6)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
    .style("fill", "white");

    var defs = svg.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id","glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation","2.2")
        .attr("result","coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    svg.append("path")
        .attr('class','line')
        .attr("d", function(d){ return line(final_team_data) })
        .style("stroke","#e83030")
        .style("stroke-width", 3)
        .style("fill","none")
        .style("filter", "url(#glow)")

    svg.append("path")
    .attr('class','line')
    .attr("d", function(d){ return line(final_opp_data) })
    .style("stroke","#48EDDB")
    .style("stroke-width", 3)
    .style("fill","none")
    .style("filter", "url(#glow)")


    svg.selectAll('.lineCircles')
    .data(final_team_data)
    .enter().append('circle')
    .attr('cx', d => xScale(d.round))
    .attr('cy', d => yScale(d.value))
    .attr('r', 4)
    .style('stroke-width', 0.5)
    .style('stroke', "black")
    .style('fill', "#e83030")
    .style("filter", "url(#glow)")
    .style("fill-opacity",0.8)

    svg.selectAll('.lineCircles')
    .data(final_opp_data)
    .enter().append('circle')
    .attr('cx', d => xScale(d.round))
    .attr('cy', d => yScale(d.value))
    .attr('r', 4)
    .style('stroke-width', 0.5)
    .style('stroke', "black")
    .style('fill', "#48EDDB")
    .style("filter", "url(#glow)")
    .style("fill-opacity",0.8)

    xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom+40})`)
    .call(d3
        .axisBottom(xScale)
        .tickFormat((x) => x)
        .ticks(34))
        .append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 40)
        .attr("y", 32)
        .text("Round")
        .style("fill","white")
        .style("filter", "url(#glow)")
        .style("font-size", "15px")
        .style("font-weight","bold")

    yAxis = (g) =>
      g.attr("transform", `translate(${margin.left-20},0)`)
        .call(d3.axisLeft(yScale).tickFormat((y) => y).tickSizeOuter(0))
        .append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -105)
        .attr("y", -40)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Expected Goals")
        .style("fill","white")
        .style("filter", "url(#glow)")
        .style("font-size", "15px")
        .style("font-weight","bold")


    svg.append("g").attr("class","XAxis").call(xAxis);
    svg.append("g").attr("class","YAxis").call(yAxis);

    svg
    .append("text")
    .attr("x", 0)             
    .attr("y", 5)
    .attr("dy","-.55em")
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("filter", "url(#glow)")
    .style("fill","white")
    .text("xG"); 

    svg
    .append("text")
    .attr("x", 35)             
    .attr("y", 5)
    .attr("dy","-.55em")
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("filter", "url(#glow)")
    .style("fill","#e83030")
    .style("font-weight","bold")
    .text("For");  

    svg
    .append("text")
    .attr("x",93)             
    .attr("y", 5)
    .attr("dy","-.55em")
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("filter", "url(#glow)")
    .style("fill","#48EDDB")
    .style("font-weight","bold")
    .text("Against"); 

  })
}

function selectTeam(){

  d3.select("#inlineCheckbox1").on("change", function(d) {
    // recover the option that has been chosen
    allPasses = !allPasses;
    actions()
  })

  d3.select("#inlineCheckbox2").on("change", function(d) {
    // recover the option that has been chosen
    ProgressivePasses = !ProgressivePasses;
    actions()
  })

  d3.select("#inlineCheckbox3").on("change", function(d) {
    // recover the option that has been chosen
    UnsuccessfulPasses = !UnsuccessfulPasses;
    actions()
  })

  d3.select("#inlineCheckbox4").on("change", function(d) {
    // recover the option that has been chosen
    allCarries = !allCarries;
    actions()
  })

  d3.select("#inlineCheckbox5").on("change", function(d) {
    // recover the option that has been chosen
    ProgressiveCarries = !ProgressiveCarries;
    actions()
  })

  teams = teams.filter(item => item !== currentTeam)

  d3.select("#selectButton")
  .selectAll('myOptions')
  .data(teams)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; })

  d3.select("#selectButton").on("change", function(d) {
  // recover the option that has been chosen
    currentSelectedTeam= d3.select(this).property("value")
    PassNetwork()
    actions()
  })

  d3.select("#selectButton").property("value",currentSelectedTeam)

  d3.select("#selectHome")
  .selectAll('myOptions')
  .data(['Home','Away'])
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; })

  d3.select("#selectHome").on("change", function(d) {
  // recover the option that has been chosen
    currentPassNetworkState= d3.select(this).property("value")
    PassNetwork()
    actions()
  })

  d3.select("#selectHome").property("value",currentPassNetworkState)
}


function PassNetwork(){

  if(currentPassNetworkState == "Home") var string = "data/PassNetworks/Benfica/PassNetwork" + currentTeam.replace(/\s+/g, '-') + currentSelectedTeam.replace(/\s+/g, '-') + ".csv"
  else var string = "data/PassNetworks/Benfica/PassNetwork" + currentSelectedTeam.replace(/\s+/g, '-') + currentTeam.replace(/\s+/g, '-') + ".csv"

  d3.csv(string)
  .then((data) => {
    dataset = data;

    lineColor = "#757272"
    lineWidth = 1.8
    pitchColor = "#eee"
    pitchMultiplier = 5.5
    pitchWidth = 105
    pitchHeight = 68
    margin = {
    top: 10,
    right: 0,
    bottom: 0,
    left: 5
    }
    width = 590
    height = 374

    getPitchLines = [{"x1":0,"x2":16.5,"y1":13.85,"y2":13.85},{"x1":16.5,"x2":16.5,"y1":13.85,"y2":54.15},{"x1":0,"x2":16.5,"y1":54.15,"y2":54.15},{"x1":0,"x2":5.5,"y1":24.85,"y2":24.85},{"x1":5.5,"x2":5.5,"y1":24.85,"y2":43.15},{"x1":0,"x2":5.5,"y1":43.15,"y2":43.15},{"x1":88.5,"x2":105,"y1":13.85,"y2":13.85},{"x1":88.5,"x2":88.5,"y1":13.85,"y2":54.15},{"x1":88.5,"x2":105,"y1":54.15,"y2":54.15},{"x1":99.5,"x2":105,"y1":24.85,"y2":24.85},{"x1":99.5,"x2":99.5,"y1":24.85,"y2":43.15},{"x1":99.5,"x2":105,"y1":43.15,"y2":43.15},{"x1":0,"x2":105,"y1":0,"y2":0},{"x1":0,"x2":105,"y1":68,"y2":68},{"x1":0,"x2":0,"y1":0,"y2":68},{"x1":105,"x2":105,"y1":0,"y2":68},{"x1":52.5,"x2":52.5,"y1":0,"y2":68},{"x1":-1.5,"x2":-1.5,"y1":30.34,"y2":37.66},{"x1":-1.5,"x2":0,"y1":30.34,"y2":30.34},{"x1":-1.5,"x2":0,"y1":37.66,"y2":37.66},{"x1":106.5,"x2":106.5,"y1":30.34,"y2":37.66},{"x1":105,"x2":106.5,"y1":30.34,"y2":30.34},{"x1":105,"x2":106.5,"y1":37.66,"y2":37.66}]
    getPitchCircles = [{"cy":52.5,"cx":34,"r":9.15,"color":"none"},{"cy":11,"cx":34,"r":0.3,"color":"#000"},{"cy":94,"cx":34,"r":0.3,"color":"#000"},{"cy":52.5,"cx":34,"r":0.3,"color":"#000"}]
    getArcs = [{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":1.5707963267948966,"endAngle":3.141592653589793},"x":0,"y":0},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":4.7124,"endAngle":3.1416},"x":0,"y":68},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":0,"endAngle":1.5708},"x":105,"y":0},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":6.283185307179586,"endAngle":4.71238898038469},"x":105,"y":68},{"arc":{"innerRadius":73.2,"outerRadius":74.2,"startAngle":2.2229,"endAngle":4.0603},"x":9,"y":34},{"arc":{"innerRadius":73.2,"outerRadius":74.2,"startAngle":2.2229+Math.PI,"endAngle":4.0603+Math.PI},"x":96,"y":34}]

    d3.select("div#chart").select("svg").remove();
    const svg = d3.select("div#chart").append("svg")
    .attr("height", width + margin.left + margin.right)
    .attr("width", height + margin.top + margin.bottom);

    const pitch = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.right})`)
    
    pitch.append('rect')
        .attr('y', -margin.left)
        .attr('x', -margin.top)
        .attr('height', width + margin.left + margin.right)
        .attr('width', height + margin.top + margin.bottom)
        .style('fill', pitchColor)
        .style("opacity","0")
    
    const pitchLineData = getPitchLines;
    pitch.selectAll('.pitchLines')
        .data(pitchLineData)
      .enter().append('line')
        .attr('y1', d => d['x1'] * pitchMultiplier)
        .attr('y2', d => d['x2'] * pitchMultiplier)
        .attr('x1', d => d['y1'] * pitchMultiplier)
        .attr('x2', d => d['y2'] * pitchMultiplier)
        .style('stroke-width', lineWidth)
        .style('stroke', lineColor)
        .style("stroke-dasharray", ("10,3"));
    
    const pitchCircleData = getPitchCircles;
    pitch.selectAll('.pitchCircles')
        .data(pitchCircleData)
      .enter().append('circle')
        .attr('cy', d => d['cy'] * pitchMultiplier)
        .attr('cx', d => d['cx'] * pitchMultiplier)
        .attr('r', d => d['r'] * pitchMultiplier)
        .style('stroke-width', lineWidth)
        .style('stroke', lineColor)
        .style('fill', d => d['color'])
        .style("stroke-dasharray", ("10,3"));
    
    const pitchArcData = getArcs;
    const arc = d3.arc();
    pitch.selectAll('.pitchCorners')
        .data(pitchArcData)
      .enter().append('path')
        .attr('d', d => arc(d['arc']))
        .attr('transform', d => `translate(${pitchMultiplier * d.y},${pitchMultiplier * d.x})`)
        .style('fill', "none")
        .style('stroke', lineColor)
        .style("stroke-dasharray", ("10,3"));

    var positions = []; 
    dataset.filter(function(d){
      if(d.average_location == "True") positions.push({'name':d.name,'no':Number(d.shirtNo),'x':Number(d.x),'y':Number(d.y)})
    })
    
    lines = dataset.filter(function(d){
      if(d.average_location == "False") return d;
    })

    pass_count = []
    lines.filter(function(d){
      pass_count.push(Number(d.pass_count));
    })

    const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
    avgPasses = average(pass_count);
    max = Math.max.apply(Math, pass_count)
    min = Math.min.apply(Math, pass_count)

    t1 = (avgPasses+max)/2
    t2 = (avgPasses+min)/2


    svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 11)
    .attr("refY", 6)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
    .style("fill", "white");

    var defs = svg.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id","glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation","0.5")
        .attr("result","coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    pitch.selectAll('.pitchLines')
    .data(lines)
    .enter().append("line")
    .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
    .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
    .attr("x2",d => (68-Number(d.mid_y)) * pitchMultiplier)  
    .attr("y2",d => (105-Number(d.mid_x)) * pitchMultiplier)  
    .style("filter", "url(#glow)")
    .attr("stroke","white") 
    .attr("stroke-width",d => (Number(d.pass_count)*2.5)/max)   
    .attr("marker-end", "url(#triangle)");  

    pitch.selectAll('.pitchLines')
    .data(lines)
    .enter().append("line")
    .attr("x1",d => (68 - Number(d.mid_y)) * pitchMultiplier)  
    .attr("y1",d => (105-Number(d.mid_x)) * pitchMultiplier)  
    .attr("x2",d => (68-Number(d.y_end)) * pitchMultiplier)  
    .attr("y2",d => (105-Number(d.x_end)) * pitchMultiplier)  
    .style("filter", "url(#glow)")
    .attr("stroke","white") 
    .attr("stroke-width",d => (Number(d.pass_count)*2.5)/max)   

    pitch.selectAll('.pitchCircles')
    .data(positions)
    .enter().append('circle')
    .attr('cy', d => (105 -d.x) * pitchMultiplier)
    .attr('cx', d => (68-d.y) * pitchMultiplier)
    .attr('r', 15)
    .style('stroke-width', lineWidth)
    .style('stroke', "white")
    .style('fill', "#e83030")
    .style("filter", "url(#glow)")
    .style("fill-opacity",0.8)
    .style("stroke-dasharray", ("6,2"));
  
    pitch.selectAll('.pitchCircles')
    .data(positions).enter()
    .append("text")
          .attr("x", d => (68-d.y) * pitchMultiplier)             
          .attr("y", d => (105-d.x) * pitchMultiplier + 5)
          .attr("text-anchor", "middle")  
          .style("font-size", "16px") 
          .style("filter", "url(#glow)")
          .style("fill","white")
          .text(d => d.no);  

      dataset.filter(function(d){
        game_time = d.game_minutes
      })

      pitch
      .append("text")
      .attr("x", (7 * pitchMultiplier))             
      .attr("y", (102 * pitchMultiplier))
      .attr("text-anchor", "middle")  
      .style("font-size", "20px") 
      .style("filter", "url(#glow)")
      .style("fill","white")
      .text(String(game_time));  

  })
  .catch((error) => {
    ////console.log(error);
  });
    

}

function actions(){

  if(currentPassNetworkState == "Home") var string = "data/Benfica/" + currentTeam + " - " + currentSelectedTeam + ".csv"
  else var string = "data/Benfica/" + currentSelectedTeam + " - " + currentTeam + ".csv"

  d3.csv(string)
  .then((data) => {
    dataset = data;

    lineColor = "#757272"
    lineWidth = 1.8
    pitchColor = "#eee"
    pitchMultiplier = 5.5
    pitchWidth = 105
    pitchHeight = 68
    margin = {
    top: 10,
    right: 0,
    bottom: 0,
    left: 5
    }
    width = 590
    height = 374

    getPitchLines = [{"x1":0,"x2":16.5,"y1":13.85,"y2":13.85},{"x1":16.5,"x2":16.5,"y1":13.85,"y2":54.15},{"x1":0,"x2":16.5,"y1":54.15,"y2":54.15},{"x1":0,"x2":5.5,"y1":24.85,"y2":24.85},{"x1":5.5,"x2":5.5,"y1":24.85,"y2":43.15},{"x1":0,"x2":5.5,"y1":43.15,"y2":43.15},{"x1":88.5,"x2":105,"y1":13.85,"y2":13.85},{"x1":88.5,"x2":88.5,"y1":13.85,"y2":54.15},{"x1":88.5,"x2":105,"y1":54.15,"y2":54.15},{"x1":99.5,"x2":105,"y1":24.85,"y2":24.85},{"x1":99.5,"x2":99.5,"y1":24.85,"y2":43.15},{"x1":99.5,"x2":105,"y1":43.15,"y2":43.15},{"x1":0,"x2":105,"y1":0,"y2":0},{"x1":0,"x2":105,"y1":68,"y2":68},{"x1":0,"x2":0,"y1":0,"y2":68},{"x1":105,"x2":105,"y1":0,"y2":68},{"x1":52.5,"x2":52.5,"y1":0,"y2":68},{"x1":-1.5,"x2":-1.5,"y1":30.34,"y2":37.66},{"x1":-1.5,"x2":0,"y1":30.34,"y2":30.34},{"x1":-1.5,"x2":0,"y1":37.66,"y2":37.66},{"x1":106.5,"x2":106.5,"y1":30.34,"y2":37.66},{"x1":105,"x2":106.5,"y1":30.34,"y2":30.34},{"x1":105,"x2":106.5,"y1":37.66,"y2":37.66}]
    getPitchCircles = [{"cy":52.5,"cx":34,"r":9.15,"color":"none"},{"cy":11,"cx":34,"r":0.3,"color":"#000"},{"cy":94,"cx":34,"r":0.3,"color":"#000"},{"cy":52.5,"cx":34,"r":0.3,"color":"#000"}]
    getArcs = [{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":1.5707963267948966,"endAngle":3.141592653589793},"x":0,"y":0},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":4.7124,"endAngle":3.1416},"x":0,"y":68},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":0,"endAngle":1.5708},"x":105,"y":0},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":6.283185307179586,"endAngle":4.71238898038469},"x":105,"y":68},{"arc":{"innerRadius":73.2,"outerRadius":74.2,"startAngle":2.2229,"endAngle":4.0603},"x":9,"y":34},{"arc":{"innerRadius":73.2,"outerRadius":74.2,"startAngle":2.2229+Math.PI,"endAngle":4.0603+Math.PI},"x":96,"y":34}]

    d3.select("div#actions").select("svg").remove();
    const svg = d3.select("div#actions").append("svg")
    .attr("height", width + margin.left + margin.right)
    .attr("width", height + margin.top + margin.bottom);

    const pitch = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.right})`)
    
    pitch.append('rect')
        .attr('y', -margin.left)
        .attr('x', -margin.top)
        .attr('height', width + margin.left + margin.right)
        .attr('width', height + margin.top + margin.bottom)
        .style('fill', pitchColor)
        .style("opacity","0")
    
    const pitchLineData = getPitchLines;
    pitch.selectAll('.pitchLines')
        .data(pitchLineData)
      .enter().append('line')
        .attr('y1', d => d['x1'] * pitchMultiplier)
        .attr('y2', d => d['x2'] * pitchMultiplier)
        .attr('x1', d => d['y1'] * pitchMultiplier)
        .attr('x2', d => d['y2'] * pitchMultiplier)
        .style('stroke-width', lineWidth)
        .style('stroke', lineColor)
        .style("stroke-dasharray", ("10,3"));
    
    const pitchCircleData = getPitchCircles;
    pitch.selectAll('.pitchCircles')
        .data(pitchCircleData)
      .enter().append('circle')
        .attr('cy', d => d['cy'] * pitchMultiplier)
        .attr('cx', d => d['cx'] * pitchMultiplier)
        .attr('r', d => d['r'] * pitchMultiplier)
        .style('stroke-width', lineWidth)
        .style('stroke', lineColor)
        .style('fill', d => d['color'])
        .style("stroke-dasharray", ("10,3"));
    
    const pitchArcData = getArcs;
    const arc = d3.arc();
    pitch.selectAll('.pitchCorners')
        .data(pitchArcData)
      .enter().append('path')
        .attr('d', d => arc(d['arc']))
        .attr('transform', d => `translate(${pitchMultiplier * d.y},${pitchMultiplier * d.x})`)
        .style('fill', "none")
        .style('stroke', lineColor)
        .style("stroke-dasharray", ("10,3"));

    pitch.append("svg:defs").append("svg:marker")
    .attr("id", "triangle2")
    .attr("refX", 11)
    .attr("refY", 6)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
    .style("fill", "white")
    .style("fill-opacity",0.1);

    pitch.append("svg:defs").append("svg:marker")
    .attr("id", "triangle3")
    .attr("refX", 11)
    .attr("refY", 6)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits","userSpaceOnUse")
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
    .style("fill", "white")
    .style("fill-opacity",0.8);

    var defs = svg.append("defs");

    //Filter for the outside glow
    var filter = defs.append("filter")
        .attr("id","glow");
    filter.append("feGaussianBlur")
        .attr("stdDeviation","0.5")
        .attr("result","coloredBlur");
    var feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
        .attr("in","coloredBlur");
    feMerge.append("feMergeNode")
        .attr("in","SourceGraphic");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    if(UnsuccessfulPasses){
      unsuccesful = dataset.filter(function(d){
        if(d.type == "Pass" && d.outcomeType == "Unsuccessful" && Number(d.teamId) == currentTeamId){
          return d;
        }
      });

      console.log(unsuccesful)

      pitch.selectAll('.progressiveLines')
      .data(unsuccesful)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      .style("filter", "url(#glow)")
      .attr("stroke","white") 
      .style("stroke-opacity",0.1)
      .attr("stroke-width",lineWidth)   
      .attr("marker-end", "url(#triangle2)");  
    }
    if(allPasses && !ProgressivePasses){
      passes = dataset.filter(function(d){
        if(d.type == "Pass" && d.outcomeType == "Successful" && Number(d.teamId) == currentTeamId){
          return d;
        }
      });

      pitch.selectAll('.progressiveLines')
      .data(passes)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      .style("filter", "url(#glow)")
      .attr("stroke","white") 
      .style("stroke-opacity",0.8)
      .attr("stroke-width",lineWidth)   
      .attr("marker-end", "url(#triangle3)"); 
    }
    else if(allPasses){
      passes = dataset.filter(function(d){
        if(d.type == "Pass" && d.outcomeType == "Successful" && d.progressive == "False" && Number(d.teamId) == currentTeamId){
          return d;
        }
      });

      pitch.selectAll('.progressiveLines')
      .data(passes)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      .style("filter", "url(#glow)")
      .attr("stroke","white") 
      .style("stroke-opacity",0.8)
      .attr("stroke-width",lineWidth)   
      .attr("marker-end", "url(#triangle3)"); 
    }
    if(ProgressivePasses){
      progressive = dataset.filter(function(d){
        if(d.type == "Pass" && d.outcomeType == "Successful" && d.progressive == "True" && Number(d.teamId) == currentTeamId){
          return d;
        }
      });

      console.log(progressive);


      pitch.selectAll('.progressiveLines')
      .data(progressive)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      //.style("filter", "url(#glow)")
      .attr("stroke","white") 
      .attr("stroke-width",lineWidth)   

      pitch.selectAll('.progressiveCircles')
      .data(progressive)
      .enter().append('circle')
      .attr('cy', d => (105 -d.endX) * pitchMultiplier)
      .attr('cx', d => (68-d.endY) * pitchMultiplier)
      .attr('r', 7)
      .style('stroke-width', lineWidth)
      .style("filter", "url(#glow)")
      .style('stroke', "#e83030")
      .style('fill', "#2a2e30")
      .style("fill-opacity",1)

    }

    if(allCarries && !ProgressiveCarries){
      carries = dataset.filter(function(d){
        if(d.type == "Carry"){
          return d;
        }
      });

      pitch.selectAll('.progressiveLines')
      .data(carries)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      .style("filter", "url(#glow)")
      .attr("stroke","white") 
      .style("stroke-opacity",0.8)
      .attr("stroke-width",lineWidth)   
      .attr("marker-end", "url(#triangle3)"); 
    }
    else if(allCarries){
      carries = dataset.filter(function(d){
        if(d.type == "Carry" && d.progressive == "False"){
          return d;
        }
      });

      pitch.selectAll('.progressiveLines')
      .data(carries)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      .style("filter", "url(#glow)")
      .attr("stroke","white") 
      .style("stroke-opacity",0.8)
      .attr("stroke-width",lineWidth)   
      .attr("marker-end", "url(#triangle3)"); 
    }

    if(ProgressiveCarries){
      progressiveC = dataset.filter(function(d){
        if(d.type == "Carry" && d.progressive == "True"){
          return d;
        }
      });

      console.log(progressiveC);


      pitch.selectAll('.progressiveLines')
      .data(progressiveC)
      .enter().append("line")
      .attr("x1",d => (68 - Number(d.y)) * pitchMultiplier)  
      .attr("y1",d => (105-Number(d.x)) * pitchMultiplier)  
      .attr("x2",d => (68-Number(d.endY)) * pitchMultiplier)  
      .attr("y2",d => (105-Number(d.endX)) * pitchMultiplier)  
      //.style("filter", "url(#glow)")
      .attr("stroke","white") 
      .attr("stroke-width",lineWidth)   

      pitch.selectAll('.progressiveCircles')
      .data(progressiveC)
      .enter().append('circle')
      .attr('cy', d => (105 -d.endX) * pitchMultiplier)
      .attr('cx', d => (68-d.endY) * pitchMultiplier)
      .attr('r', 7)
      .style('stroke-width', lineWidth)
      .style("filter", "url(#glow)")
      .style('stroke', "#48EDDB")
      .style('fill', "#2a2e30")
      .style("fill-opacity",1)

    }
  })
  .catch((error) => {
    ////console.log(error);
  });
}

function actions2(){
  lineColor = "#757272"
  lineWidth = 1.8
  pitchColor = "#eee"
  pitchMultiplier = 5.5
  pitchWidth = 105
  pitchHeight = 68
  margin = {
  top: 10,
  right: 0,
  bottom: 0,
  left: 5
  }
  width = 590
  height = 374

  getPitchLines = [{"x1":0,"x2":16.5,"y1":13.85,"y2":13.85},{"x1":16.5,"x2":16.5,"y1":13.85,"y2":54.15},{"x1":0,"x2":16.5,"y1":54.15,"y2":54.15},{"x1":0,"x2":5.5,"y1":24.85,"y2":24.85},{"x1":5.5,"x2":5.5,"y1":24.85,"y2":43.15},{"x1":0,"x2":5.5,"y1":43.15,"y2":43.15},{"x1":0,"x2":52.5,"y1":0,"y2":0},{"x1":0,"x2":52.5,"y1":68,"y2":68},{"x1":0,"x2":0,"y1":0,"y2":68},{"x1":52.5,"x2":52.5,"y1":0,"y2":68},{"x1":-1.5,"x2":-1.5,"y1":30.34,"y2":37.66},{"x1":-1.5,"x2":0,"y1":30.34,"y2":30.34}]
  getPitchCircles = [{"cy":11,"cx":34,"r":0.3,"color":"#000"},{"cy":52.5,"cx":34,"r":0.3,"color":"#000"}]
  getArcs = [{"arc":{"innerRadius":63.2,"outerRadius":64.2,"startAngle":-Math.PI/2,"endAngle":Math.PI/2},"x":52.5,"y":34},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":1.5707963267948966,"endAngle":3.141592653589793},"x":0,"y":0},{"arc":{"innerRadius":8,"outerRadius":9,"startAngle":4.7124,"endAngle":3.1416},"x":0,"y":68},{"arc":{"innerRadius":73.2,"outerRadius":74.2,"startAngle":2.2229,"endAngle":4.0603},"x":9,"y":34}]

  d3.select("div#actions").select("svg").remove();
  const svg = d3.select("div#actions").append("svg")
  .attr("height", width + margin.left + margin.right)
  .attr("width", height + margin.top + margin.bottom);

  const pitch = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`)
  
  pitch.append('rect')
      .attr('y', -margin.left)
      .attr('x', -margin.top)
      .attr('height', width + margin.left + margin.right)
      .attr('width', height + margin.top + margin.bottom)
      .style('fill', pitchColor)
      .style("opacity","0")
  
  const pitchLineData = getPitchLines;
  pitch.selectAll('.pitchLines')
      .data(pitchLineData)
    .enter().append('line')
      .attr('y1', d => d['x1'] * pitchMultiplier)
      .attr('y2', d => d['x2'] * pitchMultiplier)
      .attr('x1', d => d['y1'] * pitchMultiplier)
      .attr('x2', d => d['y2'] * pitchMultiplier)
      .style('stroke-width', lineWidth)
      .style('stroke', lineColor)
      .style("stroke-dasharray", ("10,3"));
  
  const pitchCircleData = getPitchCircles;
  pitch.selectAll('.pitchCircles')
      .data(pitchCircleData)
    .enter().append('circle')
      .attr('cy', d => d['cy'] * pitchMultiplier)
      .attr('cx', d => d['cx'] * pitchMultiplier)
      .attr('r', d => d['r'] * pitchMultiplier)
      .style('stroke-width', lineWidth)
      .style('stroke', lineColor)
      .style('fill', d => d['color'])
      .style("stroke-dasharray", ("10,3"));
  
  const pitchArcData = getArcs;
  const arc = d3.arc();
  pitch.selectAll('.pitchCorners')
      .data(pitchArcData)
    .enter().append('path')
      .attr('d', d => arc(d['arc']))
      .attr('transform', d => `translate(${pitchMultiplier * d.y},${pitchMultiplier * d.x})`)
      .style('fill', "none")
      .style('stroke', lineColor)
      .style("stroke-dasharray", ("10,3"));

}
