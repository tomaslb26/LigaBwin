var once = false
var currentSeason = "22-23"
var currentStat = "Yellow Card"

var teams2122 = ['Benfica', 'Famalicao', 'Moreirense', 'Vizela',
'Arouca', 'Belenenses SAD', 'Boavista', 'Braga',
'Maritimo', 'Pacos de Ferreira', 'Vitoria de Guimaraes', 'Gil Vicente',
'Porto', 'Portimonense', 'Santa Clara', 'Tondela',
'Estoril', 'Sporting'].sort()

var teams2223 = ['Benfica', 'Famalicao', 'Casa Pia', 'Vizela',
'Arouca', 'Rio Ave', 'Boavista', 'Braga',
'Maritimo', 'Pacos de Ferreira', 'Vitoria de Guimaraes', 'Gil Vicente',
'Porto', 'Portimonense', 'Santa Clara', 'Chaves',
'Estoril', 'Sporting'].sort()

var teams_colors = {"Benfica":"#cf261f","Famalicao":"#163b66","Moreirense":"#145f25","Vizela":"#014694",
                    "Arouca":"#fff400","Belenenses SAD":"#02578d","Boavista":"#000000","Casa Pia":"#000000","Braga":"#dc0b15",
                    "Maritimo":"#073219","Pacos de Ferreira":"#f5eb00","Vitoria de Guimaraes":"#97928B",
                    "Gil Vicente":"#ee2623","Porto":"#040c55","Portimonense":"#000000","Santa Clara":"#b5252e",
                    "Tondela":"#06653d","Estoril":"#ffed00","Sporting":"#008057","Chaves":"#114288","Rio Ave":"#009036"}

var teamDict2122 = {'Benfica': 299, 'Famalicao': 935, 'Moreirense' : 108, 'Vizela': 2899,
            'Arouca': 5948, 'Belenenses-SAD': 292, 'Boavista': 122, 'Braga': 288,
            'Maritimo': 264, 'Pacos-de-Ferreira': 786, 'Vitoria-de-Guimaraes': 107, 'Gil-Vicente': 290,
            'Porto': 297, 'Portimonense': 1463, 'Santa-Clara': 251, 'Tondela': 8071,
            'Estoril': 2188, 'Sporting': 296}

var teamDict2223 = {'Benfica': 299, 'Famalicao': 935, 'Vizela': 2899,
            'Arouca': 5948, 'Boavista': 122, 'Braga': 288,
            'Maritimo': 264, 'Pacos-de-Ferreira': 786, 'Vitoria-de-Guimaraes': 107, 'Gil-Vicente': 290,
            'Porto': 297, 'Portimonense': 1463, 'Santa-Clara': 251,
            'Estoril': 2188, 'Sporting': 296, 'Rio-Ave': 121, 'Casa-Pia':9509, 'Chaves':2008}


function init(){
    init_selects()
    fill_glow()
    create_classification_table()
    create_misc_table()
}

function fill_glow(){
    list = ["select#selectSeason", "select#selectStat","#team_stats","#player_stats","#go_back","#Stat"]
    for (i = 0; i < list.length; i++){
        d3.select(list[i]).style("filter", "url(#glow)")
    }
}

function create_glow(svg){
    var defs = svg.append("defs");
  
    var filter = defs.append("filter")
          .attr("id", "glow")
          .attr("height", "150%")
          .attr("width", "200%");
  
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 2.5)
        .attr("result", "blur");
  
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 2)
        .attr("dy", 2)
        .attr("result", "offsetBlur");
  
    var feMerge = filter.append("feMerge");
  
    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
  
  }

function init_selects(){
    if(once == false){
        d3.select("#selectSeason").on("change", function(d) {
          // recover the option that has been chosen
          currentSeason = d3.select(this).property("value");
    
          if(currentSeason == "21-22"){
            currentTeamDict = teamDict2122
            currentTeams = teams2122
          }
          else{
            currentTeamDict = teamDict2223
            currentTeams = teams2223
          }
    
          init()
        })

        d3.select("#selectStat").on("change", function(d) {
            // recover the option that has been chosen
            currentStat = d3.select(this).property("value");
            init()
        })
    
        d3.select("#selectSeason")
        .selectAll('myOptions')
        .data(['22-23','21-22'])
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })

        d3.csv("data/" + currentSeason + "/misc.csv").then((data) => {
            data_calc = data;
        
            array = Object.keys(data_calc[0])
            var array = array.filter(function(value, index, arr){ 
              if(value != "Team" ) return value;
            });
        
            d3.select("#selectStat")
            .selectAll('myOptions')
            .data(array)
            .enter()
            .append('option')
            .text(d => d)
            .attr("value", function (d) { return d; })
        
          })
    }

    once = true
}

function append_text(svg,y,text){
    svg
    .append("rect")
    .attr("x",0.1*pitchMultiplier)
    .attr("y", (y - 0.5) * pitchMultiplier)
    .attr("height", 0.6*pitchMultiplier)
    .style("stroke-width", 1)
    .style("filter", "url(#glow)")
    .style("stroke",getColor(currentTeam)) 
    .style("fill",function(d){
      if(i == 0) i = 1
      else{
        i = 0
      }
      return colors[i]
    })
    .attr("width", 8.85*pitchMultiplier)

    
    svg
    .append("text")
    .attr("x", 4.4*pitchMultiplier)             
    .attr("y", y * pitchMultiplier)
    .attr("dx","0%")
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("filter", "url(#glow)")
    .style("fill","white")
    .style("font-weight","bold")
    .text(text);  
  
}

function append_rect(svg,x,y,height,width,color,team,opacity,stroke){
    if(team != null) color = teams_colors[team]

    svg
    .append("rect")
    .attr("x",x)
    .attr("y", y)
    .attr("rx",2)
    .attr("height", height)
    .style("stroke",stroke)
    .style("stroke-width","2x")
    .style("filter", "url(#glow)")
    .style("fill",color)
    .attr("width", width)
    .style("opacity",opacity)
}

function append_line(svg,x1,x2,y1,y2){
    svg
    .append("line")
    .attr("x1",x1)
    .attr("x2",x2)
    .attr("y1",y1)
    .attr("y2",y2)
    .style("stroke","white")
    .style("stroke-width", "2px")
    
}

function append_text(svg,x,y,text,color){
    svg
    .append("text")
    .attr("x", x)             
    .attr("y", y)
    .attr("dx","0%")
    .style("filter", "url(#glow)")
    .style("fill",color)
    .style("font-weight","bold")
    .style("font-size","100%")
    .text(text);
}

function create_classification_table(){

    d3.csv("/data/" + currentSeason + "/classification.csv").then((data) => {
        var margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
            }
          
        var width = 730
        var height = 750
    
        d3.select("div#classification").select("svg").remove();
        const svg = d3
        .select("div#classification")
        .append("svg")
        //.attr("style", "outline: thin solid red;") 
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

        create_glow(svg)

        for(i = 1; i < 19; i++){
            
            append_rect(svg,5,10  + i*(height/19),height/19,760,"red",data[i-1]["Team"], 0.8)
            
            svg
            .append("image")
            .attr("id","logos_1")
            .attr("x", 95)
            .attr("y", 55 + 39.5*(i-1))
            .attr('height', 30)
            .attr('width',30)
            .attr("xlink:href",d => "data/" + currentSeason + "/" + data[i-1]["Team"].replaceAll(" ", "-") + ".png")

            color = "white"
            
            append_text(svg,32,75 + 39.5*(i-1), data[i-1]["Position"] + "º", color)
            append_text(svg,160,75 + 39.5*(i-1), data[i-1]["Games"], color)
            append_text(svg,200,75 + 39.5*(i-1), data[i-1]["Wins"], color)
            append_text(svg,240,75 + 39.5*(i-1), data[i-1]["Draws"], color)
            append_text(svg,280,75 + 39.5*(i-1), data[i-1]["Losses"], color)
            append_text(svg,315,75 + 39.5*(i-1), data[i-1]["Goals"], color)
            append_text(svg,360,75 + 39.5*(i-1), data[i-1]["Goals Against"], color)
            append_text(svg,400,75 + 39.5*(i-1), data[i-1]["Goal Difference"], color)
            append_text(svg,465,75 + 39.5*(i-1), data[i-1]["Points"], color)
            append_text(svg,615,75 + 39.5*(i-1), data[i-1]["Attendance"], color)

        }

        append_rect(svg,5,10 ,height/19,760,"#ffb700", null, 1, "white")

        append_line(svg, 80, 80, 10, height + 10)
        append_line(svg, 145, 145, 10, height + 10)
        append_line(svg, 185, 185, 10, height + 10)
        append_line(svg, 225, 225, 10, height + 10)
        append_line(svg, 265, 265, 10, height + 10)
        append_line(svg, 305, 305, 10, height + 10)
        append_line(svg, 345, 345, 10, height + 10)
        append_line(svg, 390, 390, 10, height + 10)
        append_line(svg, 435, 435, 10, height + 10)
        append_line(svg, 515, 515, 10, height + 10)

        append_text(svg,10,35,"Position","white")
        append_text(svg,90,35,"Team","white")
        append_text(svg,152,35,"MP","white")
        append_text(svg,197,35,"W","white")
        append_text(svg,238,35,"D","white")
        append_text(svg,280,35,"L","white")
        append_text(svg,320,35,"G","white")
        append_text(svg,355,35,"GA","white")
        append_text(svg,400,35,"GD","white")
        append_text(svg,450,35,"Points","white")
        append_text(svg,560,35,"Average Attendance","white")
  

    })
}

function create_misc_table(){
    d3.csv("data/" + currentSeason + "/misc.csv").then((data) => {
        data = data.map(o => new Object({name: o.Team, stat: (o[currentStat])}))

        data = data.sort(function(a, b){
            var keyA = Number(a["stat"]),
                keyB = Number(b["stat"]);
            if(keyA < keyB) return 1;
            if(keyA > keyB) return -1;
            return 0;
        })

        d3.select("div#misc").select("svg").remove();

        var margin = {
            top: 40,
            right: 20,
            bottom: 0,
            left: 35
        }
          
        var width = 720
        var height = 700
      
        var x = d3.scaleBand()
        .range([ margin.left , width ])
        .domain(data.map(function(d) { return d.name; }))
        .padding(0.1);
      
        var y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => Number(d["stat"]))])
        .range([ height + margin.bottom, margin.top]);
        
        xAxis = (g) => g
        .attr("transform", `translate(0,${width})`)
        .call(d3
            .axisBottom(x)
            .tickSizeOuter(0))
            
      
        yAxis = (g) => g
        .attr("transform", `translate(${margin.left},${-margin.bottom})`)
        .call(d3.axisLeft(y).tickSizeOuter(0))

        const svg = d3
        .select("div#misc")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

        svg.append("g").attr("class","YAxisBarMisc").call(yAxis);

        svg.selectAll(".YAxisBarMisc").style("filter", "url(#glow)")

        svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.stat) - margin.bottom)
        .attr("rx", 2)
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height + margin.bottom- y(d.stat); })
        .style("filter", "url(#glow)")
        .style("opacity",0.8)
        .style("stroke",function(d){
          return "white"
        }) 
        .style("fill",d => teams_colors[d.name])

        svg.selectAll('image')
        .data(data)
        .enter()
        .append("image")
        .attr("id","logos_1")
        .attr("y", height - 40)
        .attr("x", d => x(d.name) + 3)
        .attr('height', 30)
        .attr('width',30)
        .attr("xlink:href",d => "data/" + currentSeason + "/" + d.name.replaceAll(" ", "-") + ".png")
    })
}