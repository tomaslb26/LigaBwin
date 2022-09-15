selectedTeam = "Benfica"
selectedPlayer = "Gilberto"
selectedPlayerId = null
selectedSeason = "22-23"
selectedMode = "percentile"
minutes_treshold = 220
once = false

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

var currentTeamDict = teamDict2223
var currentTeams = teams2223

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

var currentTeamDict = teamDict2223
var currentTeams = teams2223


function init(){
    init_selects()
    get_player_id()
    stats()
    fill_glow()
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

function fill_glow(){
  d3.select("#global").style("text-decoration-color",teams_colors[selectedTeam.replaceAll("-"," ")]).style("filter", "url(#glow)");
  d3.select("#player_stats").style("text-decoration-color",teams_colors[selectedTeam.replaceAll("-"," ")]).style("filter", "url(#glow)");
  d3.select("#go_back").style("text-decoration-color",teams_colors[selectedTeam.replaceAll("-"," ")]).style("filter", "url(#glow)");
  d3.select("#player").style("filter", "url(#glow)");
  d3.select("#season").style("filter", "url(#glow)");
  d3.select("#selectTeam").style("filter", "url(#glow)");
  d3.select("#selectPlayer").style("filter", "url(#glow)");
  d3.select("#selectSeason").style("filter", "url(#glow)");
  d3.select("#per_90").style("filter", "url(#glow)");
  d3.select("#percentile").style("filter", "url(#glow)");
  d3.select("#passing_title").style("filter", "url(#glow)");
  d3.select("#creation_title").style("filter", "url(#glow)");
  d3.select("#carry_title").style("filter", "url(#glow)");
  d3.select("#shooting_title").style("filter", "url(#glow)");
}

function get_player_id(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    for(i = 0; i < data.length; i++){
      if(data[i]["name"] == selectedPlayer){  
        selectedPlayerId = Number(data[i]["playerId"])
        break
      }
    }
  })
}

function change_mode(string){
  selectedMode = string;
  stats()
}

function init_selects(){
    if(once == false){
    
        d3.select("#selectSeason").on("change", function(d) {
          // recover the option that has been chosen
          selectedSeason = d3.select(this).property("value");
    
          if(selectedSeason == "21-22"){
            currentTeamDict = teamDict2122
            currentTeams = teams2122
          }
          else{
            currentTeamDict = teamDict2223
            currentTeams = teams2223
          }
    
          init()
        })
    
        d3.select("#selectSeason")
        .selectAll('myOptions')
        .data(['21-22','22-23'])
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })
    
      
        d3.select("#selectTeam").on("change", function(d) {
        // recover the option that has been chosen
          selectedTeam = d3.select(this).property("value")
          document.getElementById("image_logo").src="data/" + selectedSeason + "/" + selectedTeam.replaceAll(" ","-") + ".png";
          d3.select("div#background_div").style("background","url(../data/" + selectedSeason + "/estadio_" + selectedTeam.replaceAll(" ","-") + ".jpg)").style("opacity", 0.2)
          d3.select("#selectSeason").style("border","2px solid " + teams_colors[selectedTeam])
          d3.select("#selectTeam").style("border","2px solid " + teams_colors[selectedTeam])
          d3.select("#selectPlayer").style("border","2px solid " + teams_colors[selectedTeam])
          d3.select("#rectangle").style("border","2px solid " + teams_colors[selectedTeam])
          d3.select("#percentile").style("border","2px solid " + teams_colors[selectedTeam])
          d3.select("#per_90").style("border","2px solid " + teams_colors[selectedTeam])
          init()
        })

        d3.select("#selectPlayer").on("change", function(d) {
            // recover the option that has been chosen
              selectedPlayer = d3.select(this).property("value")
              init()
        })
      
        d3.select("#selectSeason").property("value",selectedSeason)
    
      }

      d3.selectAll("#selectTeam").selectAll('option').remove()
      d3.selectAll("#selectPlayer").selectAll('option').remove()

      d3.select("#selectTeam")
      .selectAll('myOptions')
      .data(currentTeams)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

      d3.select("#selectTeam").property("value",selectedTeam)

      d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {
        data = data.map(function(d) { if(d.team == selectedTeam.replaceAll(" ", "-")) return d.name; }).filter(item => item !== undefined).filter(item => item !== "")

        console.log(data)
        d3.select("#selectPlayer")
        .selectAll('myOptions')
        .data(data)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })

        d3.select("#selectPlayer").property("value",selectedPlayer)
      })

      once = true
}

function stats(){
  passing_stats()
  creation_stats()
  carry_stats()
  shooting_stats()
  defending_stats()
}

function get_percentile(data, stat){

  data = data.filter(item => item["minutes"] > minutes_treshold)

  data = data.map(o => new Object({name: o.name, playerId: Number(o.playerId), minutes: Number(o.minutes), stat: (o[stat]*90)/o.minutes}))

  player = data.filter(item => item["playerId"] === selectedPlayerId)[0]

  below = data.filter(item => item["stat"] < player["stat"])

  percentile = ((below.length/data.length) * 100)

  if(percentile.toFixed(0) == 100) percentile = 99
  else if(percentile.toFixed(0) == 0) percentile = 1
  
  return [percentile, player["stat"] ]

}

function append_rect(svg,x,y,height,width,color, opacity){
  svg
  .append("rect")
  .attr("x",x)
  .attr("y", y)
  .attr("rx",5)
  .attr("height", height)
  .style("stroke","white")
  .style("stroke-width","2px")
  .style("filter", "url(#glow)")
  .style("fill",color)
  .attr("width", width)
  .style("opacity",opacity)
}

function append_text(svg,x,y,text,color, fontSize, weight){
  svg
  .append("text")
  .attr("x", x)             
  .attr("y", y)
  .attr("dx","0%")
  .style("filter", "url(#glow)")
  .style("fill",color)
  .style("font-weight",weight)
  .style("font-size",String(fontSize * 100) + "%")
  .text(text);
}

function creation_stats(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    xA = get_percentile(data, "xA")
    key_passes = get_percentile(data, "key_passes")
    chances_created = get_percentile(data, "ChancesCreated")
    xT = get_percentile(data, "xt")

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    if(window.innerWidth > 1400){
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom
    }
    else if(window.innerWidth > 1200){
      var height = 480 + margin.top + margin.bottom
      var width = 510 + margin.left + margin.right
    }
    else {
      var height = 550 + margin.top + margin.bottom
      var width = 270 + margin.left + margin.right
  }

  d3.select("div#creation").select("svg").remove();
  const svg = d3
  .select("div#creation")
  .append("svg")
  //.attr("style", "outline: thin solid red;")
  .attr("width", width)
  .attr("height", height)

  create_glow(svg)

  /*
  append_rect(svg,0,0,height,width/4,d3.interpolateRdYlGn(xA[0]*0.01),1)
  append_rect(svg,width/4,0,height,width/4,d3.interpolateRdYlGn(key_passes[0]*0.01),1)
  append_rect(svg,width*2/4,0,height,width/4,d3.interpolateRdYlGn(chances_created[0]*0.01),1)
  append_rect(svg,width*3/4,0,height,width/4,d3.interpolateRdYlGn(xT[0]*0.01),1)
  */

  append_rect(svg,0,0,height,width/4,teams_colors[selectedTeam],xA[0]*0.01)
  append_rect(svg,width/4,0,height,width/4,teams_colors[selectedTeam],key_passes[0]*0.01)
  append_rect(svg,width*2/4,0,height,width/4,teams_colors[selectedTeam],chances_created[0]*0.01)
  append_rect(svg,width*3/4,0,height,width/4,teams_colors[selectedTeam],xT[0]*0.01)

  append_text(svg, 55, 20, "xA", "white", 0.9)
  append_text(svg, 150, 20, "Key Passes", "white", 0.9)
  append_text(svg, 258, 20, "Chances Created", "white", 0.9)
  append_text(svg, 428, 20, "xT", "white", 0.9)

  if(selectedMode == "percentile"){
    append_text(svg,20,85, String(xA[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,145,85, String(key_passes[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,275,85, String(chances_created[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,395,85, String(xT[0].toFixed(0)), "white", 4.5, "bold")
  }
  else{
    append_text(svg,15,85, String(xA[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,140,85, String(key_passes[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,270,85, String(chances_created[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,390,85, String(xT[1].toFixed(1)), "white", 4.5, "bold")
  }

  
  
  
  })
}

function passing_stats(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    prog_passing = get_percentile(data, "prog_passes")
    final_third_passes = get_percentile(data, "final_third_passes")
    penalty_box_passes = get_percentile(data, "penalty_box_passes")

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    if(window.innerWidth > 1400){
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom
    }
    else if(window.innerWidth > 1200){
      var height = 480 + margin.top + margin.bottom
      var width = 510 + margin.left + margin.right
    }
    else {
      var height = 550 + margin.top + margin.bottom
      var width = 270 + margin.left + margin.right
  }

  d3.select("div#passing").select("svg").remove();
  const svg = d3
  .select("div#passing")
  .append("svg")
  //.attr("style", "outline: thin solid red;")
  .attr("width", width)
  .attr("height", height)

  create_glow(svg)

  /*append_rect(svg,0,0,height,width/3,d3.interpolateRdYlGn(prog_passing[0]*0.01),1)
  append_rect(svg,width/3,0,height,width/3,d3.interpolateRdYlGn(final_third_passes[0]*0.01),1)
  append_rect(svg,width*2/3,0,height,width/3,d3.interpolateRdYlGn(penalty_box_passes[0]*0.01),1)*/

  append_rect(svg,0,0,height,width/3,teams_colors[selectedTeam],prog_passing[0]*0.01)
  append_rect(svg,width/3,0,height,width/3,teams_colors[selectedTeam],final_third_passes[0]*0.01)
  append_rect(svg,width*2/3,0,height,width/3,teams_colors[selectedTeam],penalty_box_passes[0]*0.01)

  append_text(svg, 15, 20, "Progressive Passes", "white", 1)
  append_text(svg, 185, 20, "Final Third Passes", "white", 1)
  append_text(svg, 347, 20, "Penalty Box Passes", "white", 1)

  if(selectedMode == "percentile"){
    append_text(svg,45,85, String(prog_passing[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,210,85, String(final_third_passes[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,375,85, String(penalty_box_passes[0].toFixed(0)), "white", 4.5, "bold")
  }
  else{
    append_text(svg,15,85, String(prog_passing[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,180,85, String(final_third_passes[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,365,85, String(penalty_box_passes[1].toFixed(1)), "white", 4.5, "bold") 
  }

  
  
  
  })
}

function carry_stats(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    prog_carries = get_percentile(data, "prog_carries")
    final_third_entries = get_percentile(data, "final_third_entries")
    penalty_box_entries = get_percentile(data, "penalty_box_entries")

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    if(window.innerWidth > 1400){
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom
    }
    else if(window.innerWidth > 1200){
      var height = 480 + margin.top + margin.bottom
      var width = 510 + margin.left + margin.right
    }
    else {
      var height = 550 + margin.top + margin.bottom
      var width = 270 + margin.left + margin.right
  }

  d3.select("div#carry").select("svg").remove();
  const svg = d3
  .select("div#carry")
  .append("svg")
  //.attr("style", "outline: thin solid red;")
  .attr("width", width)
  .attr("height", height)

  create_glow(svg)

  /*append_rect(svg,0,0,height,width/3,d3.interpolateRdYlGn(prog_carries[0]*0.01),1)
  append_rect(svg,width/3,0,height,width/3,d3.interpolateRdYlGn(final_third_entries[0]*0.01),1)
  append_rect(svg,width*2/3,0,height,width/3,d3.interpolateRdYlGn(penalty_box_entries[0]*0.01),1)*/

  append_rect(svg,0,0,height,width/3,teams_colors[selectedTeam],prog_carries[0]*0.01)
  append_rect(svg,width/3,0,height,width/3,teams_colors[selectedTeam],final_third_entries[0]*0.01)
  append_rect(svg,width*2/3,0,height,width/3,teams_colors[selectedTeam],penalty_box_entries[0]*0.01)

  append_text(svg, 15, 20, "Progressive Carries", "white", 1)
  append_text(svg, 185, 20, "Final Third Entries", "white", 1)
  append_text(svg, 347, 20, "Penalty Box Entries", "white", 1)

  if(selectedMode == "percentile"){
    append_text(svg,45,85, String(prog_carries[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,210,85, String(final_third_entries[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,375,85, String(penalty_box_entries[0].toFixed(0)), "white", 4.5, "bold")
  }
  else{
    append_text(svg,15,85, String(prog_carries[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,200,85, String(final_third_entries[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,365,85, String(penalty_box_entries[1].toFixed(1)), "white", 4.5, "bold")
  }

  
  
  
  })
}

function shooting_stats(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    xG = get_percentile(data, "xG")
    xGOT = get_percentile(data, "xGOT")
    shots = get_percentile(data, "Shots")

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    if(window.innerWidth > 1400){
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom
    }
    else if(window.innerWidth > 1200){
      var height = 480 + margin.top + margin.bottom
      var width = 510 + margin.left + margin.right
    }
    else {
      var height = 550 + margin.top + margin.bottom
      var width = 270 + margin.left + margin.right
  }

  d3.select("div#shooting").select("svg").remove();
  const svg = d3
  .select("div#shooting")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  create_glow(svg)

  /*append_rect(svg,0,0,height,width/3,d3.interpolateRdYlGn(xG[0]*0.01),1)
  append_rect(svg,width/3,0,height,width/3,d3.interpolateRdYlGn(xGOT[0]*0.01),1)
  append_rect(svg,width*2/3,0,height,width/3,d3.interpolateRdYlGn(shots[0]*0.01),1)*/

  append_rect(svg,0,0,height,width/3,teams_colors[selectedTeam],xG[0]*0.01)
  append_rect(svg,width/3,0,height,width/3,teams_colors[selectedTeam],xGOT[0]*0.01)
  append_rect(svg,width*2/3,0,height,width/3,teams_colors[selectedTeam],shots[0]*0.01)


  if(selectedMode == "percentile"){
    append_text(svg,45,85, String(xG[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,210,85, String(xGOT[0].toFixed(0)), "white", 4.5, "bold")
    append_text(svg,375,85, String(shots[0].toFixed(0)), "white", 4.5, "bold")
  }
  else{
    append_text(svg,35,85, String(xG[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,200,85, String(xGOT[1].toFixed(1)), "white", 4.5, "bold")
    append_text(svg,365,85, String(shots[1].toFixed(1)), "white", 4.5, "bold")
  }

  append_text(svg, 75, 20, "xG", "white", 1)
  append_text(svg, 225, 20, "xGOT", "white", 1)
  append_text(svg, 395, 20, "Shots", "white", 1)


  
  
  
  })
}

function defending_stats(){
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    def_actions = get_percentile(data, "defensive_actions")

    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    if(window.innerWidth > 1400){
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom
    }
    else if(window.innerWidth > 1200){
      var height = 480 + margin.top + margin.bottom
      var width = 510 + margin.left + margin.right
    }
    else {
      var height = 550 + margin.top + margin.bottom
      var width = 270 + margin.left + margin.right
  }

  d3.select("div#defending").select("svg").remove();
  const svg = d3
  .select("div#defending")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  create_glow(svg)

  /*
  append_rect(svg,0,0,height,width,d3.interpolateRdYlGn(def_actions[0]*0.01),1)
  */
  append_rect(svg,0,0,height,width,teams_colors[selectedTeam],def_actions[0]*0.01)

  if(selectedMode == "percentile"){
    append_text(svg,210,85, String(def_actions[0].toFixed(0)), "white", 4.5, "bold")
  }
  else{
    append_text(svg,180,85, String(def_actions[1].toFixed(1)), "white", 4.5, "bold")
  }


  append_text(svg, 185, 20, "Defensive Actions", "white", 1)


  
  
  
  })
}