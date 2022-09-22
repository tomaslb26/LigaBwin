var dataset;
var currentTeam = "Benfica"
var display_name = "Benfica"
var currentSelectedTeam = "Arouca"
var currentPassNetworkState = "Home"
var allPasses = false
var selectedPlayer = "Rafa"
var currentOption = "actions"
var allCarries = false
var ProgressivePasses = false
var ProgressiveCarries = false
var UnsuccessfulPasses = false
var defensiveActions = false
var currentTeamId = 299;
var currentSeason = "22-23"
var once = false;
var once_2 = false;
var selectedStat = "OppHalfDefActions"
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

var teams_colors = [{ "team": "Benfica", "color": "#cf261f" }, { "team": "Famalicao", "color": "#163b66" }, { "team": "Moreirense", "color": "#145f25" }, { "team": "Vizela", "color": "#014694" },
{ "team": "Arouca", "color": "#fff400" }, { "team": "Belenenses SAD", "color": "#02578d" }, { "team": "Boavista", "color": "#000000" }, { "team": "Casa Pia", "color": "#000000" }, { "team": "Braga", "color": "#dc0b15" },
{ "team": "Maritimo", "color": "#073219" }, { "team": "Pacos de Ferreira", "color": "#f5eb00" }, { "team": "Vitoria de Guimaraes", "color": "#97928B" },
{ "team": "Gil Vicente", "color": "#ee2623" }, { "team": "Porto", "color": "#040c55" }, { "team": "Portimonense", "color": "#000000" }, { "team": "Santa Clara", "color": "#b5252e" },
{ "team": "Tondela", "color": "#06653d" }, { "team": "Estoril", "color": "#ffed00" }, { "team": "Sporting", "color": "#008057" }, { "team": "Chaves", "color": "#114288" }, { "team": "Rio Ave", "color": "#009036" }]

var teamDict2122 = {
  'Benfica': 299, 'Famalicao': 935, 'Moreirense': 108, 'Vizela': 2899,
  'Arouca': 5948, 'Belenenses-SAD': 292, 'Boavista': 122, 'Braga': 288,
  'Maritimo': 264, 'Pacos-de-Ferreira': 786, 'Vitoria-de-Guimaraes': 107, 'Gil-Vicente': 290,
  'Porto': 297, 'Portimonense': 1463, 'Santa-Clara': 251, 'Tondela': 8071,
  'Estoril': 2188, 'Sporting': 296
}

var teamDict2223 = {
  'Benfica': 299, 'Famalicao': 935, 'Vizela': 2899,
  'Arouca': 5948, 'Boavista': 122, 'Braga': 288,
  'Maritimo': 264, 'Pacos-de-Ferreira': 786, 'Vitoria-de-Guimaraes': 107, 'Gil-Vicente': 290,
  'Porto': 297, 'Portimonense': 1463, 'Santa-Clara': 251,
  'Estoril': 2188, 'Sporting': 296, 'Rio-Ave': 121, 'Casa-Pia': 9509, 'Chaves': 2008
}

var currentTeamDict = teamDict2223
var currentTeams = teams2223

function flow_chart_selects() {
  if (once_2 == false) {
    d3.select("#selectSeason2").on("change", function (d) {
      // recover the option that has been chosen
      currentSeason = d3.select(this).property("value");

      if (currentSeason == "21-22") {
        currentTeamDict = teamDict2122
        currentTeams = teams2122
      }
      else {
        currentTeamDict = teamDict2223
        currentTeams = teams2223
      }

      init_2()
    })

    d3.select("#selectSeason2")
      .selectAll('myOptions')
      .data(['21-22', '22-23'])
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

    d3.select("#selectSeason2").property("value", currentSeason)

    d3.select("#selectAwayTeam").style("text-shadow", "0px 0px 5px" + getColor(currentSelectedTeam)).style("filter", "url(#glow)");
    d3.select("#selectHomeTeam").style("text-shadow", "0px 0px 5px" + getColor(currentTeam)).style("filter", "url(#glow)");
  }

  d3.selectAll("#selectHomeTeam").selectAll('option').remove()
  d3.selectAll("#selectAwayTeam").selectAll('option').remove()

  d3.select("#selectHomeTeam")
    .selectAll('myOptions')
    .data(currentTeams)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

  d3.select("#selectAwayTeam")
    .selectAll('myOptions')
    .data(currentTeams)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })


  d3.select("#selectHomeTeam").on("change", function (d) {
    currentTeam = d3.select(this).property("value")
    currentTeamId = currentTeamDict[currentTeam.replaceAll(" ", "-")]
    d3.select("div#rectangle_3").style("border", "solid 2px " + getColor(currentTeam))
    d3.select("div#background_div").style("background", "url(../data/" + currentSeason + "/estadio_" + currentTeam.replaceAll(" ", "-") + ".jpg)").style("opacity", 0.2)
    document.getElementById("home_team").src = "data/" + currentSeason + "/" + currentTeam.replaceAll(" ", "-") + ".png";
    d3.select("#selectHomeTeam").style("text-shadow", "0px 0px 5px" + getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#global").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#player_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#team_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("div#row_1").style("border-top", "solid 2px " + getColor(currentTeam))
    d3.select("select#selectSeason2").style("border", "solid 2px " + getColor(currentTeam))
    d3.select("div#row_1").style("border-bottom", "solid 2px " + getColor(currentTeam))
    d3.select("div#circle_1").style("border-top", "3px solid " + getColor(currentTeam))
    d3.select("div#circle_1").style("border-bottom", "3px solid " + getColor(currentTeam))
    d3.select("span#home_span").style("text-shadow", "0px 0px 5px " + getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("span#flow_title").style("filter", "url(#glow)").style("text-shadow", "0px 1px 4px " + getColor(currentTeam));
    init_2()
  })

  d3.select("#selectAwayTeam").on("change", function (d) {
    currentSelectedTeam = d3.select(this).property("value")
    d3.select("div#background_div").style("background", "url(../data/" + currentSeason + "/estadio_" + currentTeam.replaceAll(" ", "-") + ".jpg)").style("opacity", 0.2)
    document.getElementById("away_team").src = "data/" + currentSeason + "/" + currentSelectedTeam.replaceAll(" ", "-") + ".png";
    d3.select("#selectAwayTeam").style("text-shadow", "0px 0px 5px" + getColor(currentSelectedTeam)).style("filter", "url(#glow)");
    d3.select("span#away_span").style("text-shadow", "0px 0px 5px" + getColor(currentSelectedTeam)).style("filter", "url(#glow)");
    d3.select("div#circle_2").style("border-top", "3px solid" + getColor(currentSelectedTeam))
    d3.select("div#circle_2").style("border-bottom", "3px solid " + getColor(currentSelectedTeam))
    init_2()
  })

  d3.select("#selectHomeTeam").property("value", currentTeam)
  d3.select("#selectAwayTeam").property("value", currentSelectedTeam)
  d3.select("#selectAwayTeam").style("filter", "url(#glow)");
  d3.select("#selectHomeTeam").style("filter", "url(#glow)");
  d3.select("#selectSeason2").style("filter", "url(#glow)");
  d3.select("span#flow_title").style("filter", "url(#glow)")
  d3.select("#season").style("filter", "url(#glow)");
  d3.select("span#hifen_span").style("filter", "url(#glow)");
  d3.select("span#home_span").style("filter", "url(#glow)");
  d3.select("span#away_span").style("filter", "url(#glow)");
  d3.select("div#circle_1").style("filter", "url(#glow)");
  d3.select("div#circle_2").style("filter", "url(#glow)");
  d3.select("#global").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
  d3.select("#player_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
  d3.select("#team_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
  once_2 = true

}

function checkOwnGoal(array_goals) {
  var goals_flag = 0;
  for (i = 0; i < array_goals.length; i++) {
    if (array_goals[i].isOwnGoal == "True") goals_flag -= 1
  }
  return goals_flag

}

function flow_chart() {

  var string = "data/" + currentSeason + "/" + currentTeam.replace(/\s+/g, '-') + "/" + currentTeam + " - " + currentSelectedTeam + ".csv"


  d3.csv(string)
    .then((data) => {
      dataset = data;
      var xt = [];
      var xt_2 = [];
      goals_1 = data.filter(function (d) { if (d.type == "Goal" && d.teamId == currentTeamId) return d })
      var team_1_own_goals = checkOwnGoal(goals_1)
      d3.csv("data/" + currentSeason + "/" + currentSelectedTeam.replace(/\s+/g, '-') + "/" + currentTeam + " - " + currentSelectedTeam + ".csv")
        .then((data) => {
          goals_2 = data.filter(function (d) { if (d.type == "Goal" && d.teamId != currentTeamId) return d })
          var team_2_own_goals = checkOwnGoal(goals_2)
          data = data.filter(d => { if (d.teamId == currentTeamDict[currentSelectedTeam] || d.type == "Carry") return d })
          data = d3.rollup(data, v => d3.sum(v, d => d.xT), d => d.minute);

          goals = goals_1.concat(goals_2)



          document.getElementById('home_span').textContent = String(goals_1.length + Math.abs(team_2_own_goals) - Math.abs(team_1_own_goals))
          document.getElementById('away_span').textContent = String(goals_2.length - Math.abs(team_2_own_goals) + Math.abs(team_1_own_goals))

          data.forEach((value, key) => {
            xt_2.push({ 'minute': Number(key), 'xT': value })
          })


          dataset = dataset.filter(d => { if (d.teamId == currentTeamId || d.type == "Carry") return d })
          dataset = d3.rollup(dataset, v => d3.sum(v, d => d.xT), d => d.minute);
          dataset.forEach((value, key) => {
            xt.push({ 'minute': Number(key), 'xT': value })
          })

          var xt_final = []

          lastMin = Math.max(xt[(xt.length) - 1]['minute'], xt_2[(xt_2.length) - 1]['minute'])
          for (minute = 0; minute <= lastMin; minute++) {
            home_xT = xt.find(e => e['minute'] == minute);
            if (home_xT == null) home_xT = 0;
            else home_xT = home_xT['xT']

            away_xT = xt_2.find(e => e['minute'] == minute);
            if (away_xT == null) away_xT = 0;
            else away_xT = away_xT['xT']

            xt_final.push({ 'minute': minute, 'home_xT': Number(home_xT), 'away_xT': Number(away_xT) })
          }

          var width = window.innerWidth - 200
          if (window.innerWidth > 1400) {
            d3.select("div#circle_1").style("height", "180px").style("width", "180px")
            d3.select("div#circle_2").style("height", "180px").style("width", "180px")
            d3.select("img#home_team").style("height", "90px")
            d3.select("img#away_team").style("height", "90px")
            d3.select("span#home_span").style("font-size", "250%")
            d3.select("span#away_span").style("font-size", "250%")
            d3.select("span#hifen_span").style("font-size", "250%")
            d3.select("span#flow_title").style("font-size", "300%")
            var height = window.innerHeight / 2 - 120;
            var margin = { top: 50, right: 10, bottom: 90, left: 55 }
          }
          else if (window.innerWidth > 1200) {
            var height = window.innerHeight / 2 - 120;
            var margin = { top: 50, right: 10, bottom: 50, left: 55 }
          }
          else {
            d3.select("div#circle_1").style("height", "50px").style("width", "50px")
            d3.select("div#circle_2").style("height", "50px").style("width", "50px")
            d3.select("img#home_team").style("height", "25px")
            d3.select("img#away_team").style("height", "25px")
            d3.select("span#home_span").style("font-size", "50%")
            d3.select("span#away_span").style("font-size", "50%")
            d3.select("span#hifen_span").style("font-size", "50%")
            d3.select("span#flow_title").style("font-size", "100%")
            d3.select("#selectHomeTeam").style("font-size", "40%")
            d3.select("#selectAwayTeam").style("font-size", "40%")
            var height = window.innerHeight / 2;
            var margin = { top: 50, right: 20, bottom: 90, left: 55 }
            var width = window.innerWidth - 120
          }

          var y = d3.scaleLinear()
            .domain([-0.5, 0.5])
            .range([height, 0]);

          var x = d3.scaleBand()
            .domain(xt_final.map(d => d.minute))
            .range([0, width])
            .padding([0])

          var formatTick = function (d) {
            if (d == 45) return "HT"
            else if (d % 15 == 0) return String(d) + "'"
          }

          var formatYTick = function (d) {
            if (d < 0) return (-d)
            else return d
          }

          xAxis = (g) => g
            .call(d3
              .axisBottom(x).tickFormat(formatTick).tickSizeOuter(0))

          yAxis = (g) => g
            .call(d3.axisLeft(y).tickFormat(formatYTick).tickSizeOuter(0))

          yAxis2 = (g) => g
            .call(d3.axisRight(y).tickFormat(formatYTick).tickSizeOuter(0))

          d3.select("div#flow_chart").select("svg").remove()
          const svg = d3
            .select("div#flow_chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
              "translate(" + (margin.left - 20) + "," + (margin.top - 20) + ")");

          create_glow(svg)

          svg.append("g").attr("class", "XAxisFlowChart").attr('transform', 'translate(0,' + (y(0)) + ')')
            .call(xAxis);
          svg.append("g").attr("class", "YAxisFlowChart").call(yAxis);
          svg.append("g").attr("class", "YAxisFlowChart2").attr('transform', 'translate(' + (x(lastMin) + 18) + ',0)').call(yAxis2);

          svg.append("g")
            .selectAll('lines')
            .data(goals)
            .enter().append('line')
            .attr('y1', d => y(0))
            .attr('y2', function (d) {
              var change = 1
              if (d.isOwnGoal == "True") change = -1

              if (d.teamId == currentTeamId) return y(0.5 * change)
              else if (d.teamId != currentTeamId) return y(-0.5 * change)

            })
            .attr('x1', d => x(Number(d['minute'])) + 8)
            .attr('x2', d => x(Number(d['minute'])) + 8)
            .style('stroke-width', 1)
            .style('stroke-opacity', 0.5)
            .style('stroke', "white")
            .style("stroke-dasharray", ("10,3"))
            .transition()
            .ease(d3.easeBack)
            .duration(800)
            .attr("opacity", 1)

          svg.selectAll("XAxisScatter .tick")
            .data(goals).enter()
            .append("image")
            .attr("x", d => x(Number(d['minute'])) - 15)
            .attr('y', function (d) {
              var change = 1
              if (d.isOwnGoal == "True") change = -1

              if (d.teamId == currentTeamId) return y(0.5 * change + 0.03)
              else if (d.teamId != currentTeamId) return y(-0.5 * change + 0.03)

            })
            .attr('height', 50)
            .attr("xlink:href", function (d) {
              if (Number(d.teamId) == currentTeamId) string = "data/Photos/" + currentTeam + "/" + d.name + ".png"
              else if (Number(d.teamId) != currentTeamId) string = "data/Photos/" + currentSelectedTeam + "/" + d.name + ".png"
              return string
            })
            .transition()
            .ease(d3.easeBack)
            .duration(800)
            .attr("opacity", 1)



          svg.selectAll("XAxisScatter .tick")
            .data(goals).enter()
            .append("image")
            .attr("x", d => x(Number(d['minute'])) - 2)
            .attr('y', function (d) {
              var change = 1
              if (d.isOwnGoal == "True") change = -1

              if (d.teamId == currentTeamId) return y(0.3 * change + 0.03)
              else if (d.teamId != currentTeamId) return y(-0.3 * change + 0.03)
            })
            .attr('height', 20)
            .attr("xlink:href", "data/football_ball.png")
            .transition()
            .ease(d3.easeBack)
            .duration(800)
            .attr("opacity", 1)


          svg.selectAll("YAxisScatter").style("filter", "url(#glow)")

          svg.append("g")
            .selectAll("rect")
            .data(xt_final)
            .join("rect")
            .attr("y", function (d) {
              if (d.home_xT > d.away_xT) return y(d.home_xT)
              else return y(0)
            })
            .attr("x", function (d) {
              return x(d.minute);
            })
            .transition()
            .ease(d3.easeBack)
            .duration(800)
            .attr("height", function (d) {
              if (d.home_xT > d.away_xT) return Math.abs(y(d.home_xT) - y(0));
              else return Math.abs(y(d.away_xT) - y(0));
            })
            .attr("width", x.bandwidth())
            .style("fill", function (d) {
              if (d.home_xT > d.away_xT) return getColor(currentTeam);
              else return getColor(currentSelectedTeam);
            })
            .style("stroke", "black")
            .style("stroke-width", 0.0)
            .style("filter", "url(#glow)");

          d3.selectAll(".YAxisFlowChart").style("filter", "url(#glow)")
          d3.selectAll(".YAxisFlowChart2").style("filter", "url(#glow)")

          d3.selectAll(".XAxisFlowChart .tick text")
            .style("filter", "url(#glow)")
            .attr("y", d => {
              return y(-0.23)
            })
            .attr("font-size", "20")
            .attr("font-weight", "bold");



        })


    })
}

function init_2() {
  flow_chart_selects()
  flow_chart()
}

function init() {
  selectTeam();
  PassNetwork();
  movingAverage()
  if (currentOption == "heatmap") heatmap()
  else actions(currentOption)
  table_bar()
  fill_glow()
  if (window.innerWidth < 800) {
    d3.select("div#rectangle").style("width", "130%")
    d3.select("div#rectangle_1").style("width", "130%").style("left", "0%").style("height", "100%")
    d3.select("div#rectangle_2").style("width", "130%").style("left", "0%").style("height", "90%").style("margin-top", "50%")
  }
  else if (window.innerWidth > 800 && window.innerWidth < 1400) d3.select("div#rectangle_2").style("width", "110%")
}

function fill_glow() {
  d3.select("p#Plot").style("filter", "url(#glow)")
  d3.select("p#PassingNetwork").style("filter", "url(#glow)")
  d3.select("p#Game").style("filter", "url(#glow)")
  d3.select("span#Rank").style("filter", "url(#glow)")
  d3.select("span#Game").style("filter", "url(#glow)")
  d3.select("select#selectButton").style("filter", "url(#glow)")
  d3.select("select#selectHome").style("filter", "url(#glow)")
  d3.select("select#selectSeason").style("filter", "url(#glow)")
  d3.select("select#selectStat").style("filter", "url(#glow)")
  d3.select(".btn").style("filter", "url(#glow)")

  d3.select("select#selectTeam").style("filter", "url(#glow)")
}

function createTriangle(svg, id, opacity) {
  svg.append("svg:defs").append("svg:marker")
    .attr("id", id)
    .attr("refX", 11)
    .attr("refY", 6)
    .attr("markerWidth", 10)
    .attr("markerHeight", 10)
    .attr("markerUnits", "userSpaceOnUse")
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
    .style("fill", "white")
    .style("fill-opacity", opacity);
}

function create_glow(svg) {
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

function mouseaux(svg, div, d, option, option_2) {
  if (option == "over") ret_value = 0.1
  else ret_value = 1
  svg.selectAll(div)
    .style("fill-opacity", function (e) {
      if (option_2 != null) {
        if (e[option_2] != d[option_2]) return ret_value
      }
      else {
        if (e != d) return ret_value
      }
    })
    .attr("stroke-opacity", function (e) {
      if (option_2 != null) {
        if (e[option_2] != d[option_2]) return ret_value
      }
      else {
        if (e != d) return ret_value
      }
    })

}

function movingAverage() {
  d3.select("div#movingAverage").select("svg").remove();
  d3.select("body").selectAll("div#tooltip_moving_average").remove()

  let tooltip = d3.select("body").append("div").attr("id", "tooltip_moving_average")
    .attr("class", "tooltip")
    .style("border", "2px solid " + getColor(currentTeam))
    .style("opacity", 0);

  d3.csv("data/" + currentSeason + "/" + "allShotsLigaBwin" + currentSeason.replace("-", "") + ".csv")
    .then((data) => {


      // -------------------------------------DATA PROCESSING --------------------------------------------/
      data = data.filter(function (d) {
        if (d.homeTeam == currentTeam || d.awayTeam == currentTeam) {
          return d;
        }
      })

      team_data = data.filter(function (d) {
        if (d.name == currentTeam) {
          return d
        }
      })

      opp_data = data.filter(function (d) {
        if (d.name != currentTeam) {
          return d
        }
      })

      team_data = d3.rollup(team_data, v => d3.sum(v, d => d.expectedGoals), d => d.round);
      opp_data = d3.rollup(opp_data, v => d3.sum(v, d => d.expectedGoals), d => d.round);

      final_team_data = []
      final_opp_data = []
      team_data.forEach((value, key) => {
        final_team_data.push({ 'round': key, 'value': value })
      })
      opp_data.forEach((value, key) => {
        final_opp_data.push({ 'round': key, 'value': value })
      })
      final_team_data.sort(function (a, b) {
        return a.round - b.round
      });
      final_opp_data.sort(function (a, b) {
        return a.round - b.round
      });
      //--------------------------------------------------------------------------------------/
      if (window.innerWidth > 1400) var width = window.innerWidth / 3 - 50
      else if (window.innerWidth > 1150) var width = window.innerWidth / 3 - 150
      else var width = 380
      var height = window.innerHeight / 4
      var margin = { 'top': 40, 'right': 380, 'bottom': 40, 'left': 20 }


      var yScale = d3.scaleLinear()
        .range([height, 0])

      var xScale = d3.scaleLinear()
        .range([0, width])

      var line = d3.line()
        .x(function (d) { return xScale(d.round) })
        .y(function (d) { return yScale(d.value) })

      setupScales = function (data) {
        xScale.domain([0, 34])
        yScale.domain([0, Math.max(d3.max(final_team_data, function (d) { return d.value }), d3.max(final_opp_data, function (d) { return d.value }))])
      }

      setupScales(data)

      svg = d3.select("div#movingAverage").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + (margin.left + 20) + "," + margin.top + ")");

      create_glow(svg)

      svg.append("path")
        .attr('class', 'line')
        .attr("d", function (d) { return line(final_team_data) })
        .style("stroke", getColor(currentTeam))
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("filter", "url(#glow)")

      svg.append("path")
        .attr('class', 'line')
        .attr("d", function (d) { return line(final_opp_data) })
        .style("stroke", "#48EDDB")
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("filter", "url(#glow)")

      function getAwayTeamName(d) {
        var ret_value = ""
        data.filter(function (e) {
          if (e.round == d.round) {
            if (e.homeTeam == currentTeam) {
              ret_value = e.awayTeam
            }
            else ret_value = e.homeTeam
          }
        })
        return ret_value
      }


      function handleMouseClick(event, d) {
        var homeTeam = ""
        var awayTeam = ""
        var benficaxg
        var oppxg
        data.filter(function (e) {
          if (e.round == d.round) {
            homeTeam = e.homeTeam
            awayTeam = e.awayTeam
          }
        })
        final_team_data.filter(function (e) {
          if (e.round == d.round) {
            benficaxg = e.value
          }
        })
        final_opp_data.filter(function (e) {
          if (e.round == d.round) {
            oppxg = e.value
          }
        })

        var matrix = this.getScreenCTM()
          .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

        var string2 = "<p style='display: inline-block; font-size:60%; font-weight:bold; padding-left:2%'>" + homeTeam + " - " + awayTeam + "<br\>"
          + currentTeam + " xG: " + String(benficaxg).substring(0, 5) + "<br\>"
          + currentTeam + " xGA: " + String(oppxg).substring(0, 5) + "<p/>";

        tooltip.transition()
          .duration(200)
          .style("opacity", 1).style("visibility", "visible");
        tooltip.html(string2).style("left", event.x + "px")
          .style("top", event.y + "px");

      }

      function handleMouseOver(event, d) {
        d3.select(this).style("cursor", "pointer")
        //mouseaux(svg,"image#logos",d,"over","round")

        svg.selectAll("image#logos").style("opacity", e => { if (e.round != d.round) return 0.2 })
      }

      function handleMouseLeave(event, d) {
        svg.selectAll("image#logos").style("opacity", e => { if (e.round != d.round) return 1 })
      }

      svg.selectAll('image')
        .data(final_team_data)
        .enter()
        .append("image")
        .attr("id", "logos")
        .attr('x', d => xScale(d.round) - 7)
        .attr('y', d => yScale(d.value) - 7)
        .on("mouseover", handleMouseOver)
        .on("mouseleave", handleMouseLeave)
        .on("click", handleMouseClick)
        .attr('height', 16)
        .attr("xlink:href", "data/" + currentSeason + "/" + currentTeam.replaceAll(" ", "-") + ".png")
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("opacity", 1)

      svg.selectAll('image_2')
        .data(final_opp_data)
        .enter()
        .append("image")
        .attr("id", "logos")
        .attr('x', d => xScale(d.round) - 7)
        .attr('y', d => yScale(d.value) - 7)
        .on("mouseover", handleMouseOver)
        .on("mouseleave", handleMouseLeave)
        .on("click", handleMouseClick)
        .attr('height', 16)
        .attr("xlink:href", d => {
          return "data/" + currentSeason + "/" + getAwayTeamName(d).replaceAll(" ", "-") + ".png"
        })
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attr("opacity", 1)

      xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom + 40})`)
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
          .style("fill", "white")
          .style("filter", "url(#glow)")
          .style("font-size", "15px")
          .style("font-weight", "bold")

      yAxis = (g) =>
        g.attr("transform", `translate(${margin.left - 20},0)`)
          .call(d3.axisLeft(yScale).tickFormat((y) => y).tickSizeOuter(0))
          .append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("x", -95)
          .attr("y", -40)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Expected Goals")
          .style("fill", "white")
          .style("filter", "url(#glow)")
          .style("font-size", "15px")
          .style("font-weight", "bold")


      svg.append("g").attr("class", "XAxis").call(xAxis);
      svg.append("g").attr("class", "YAxis").call(yAxis);

      svg.selectAll(".XAxis").style("filter", "url(#glow)")
      svg.selectAll(".YAxis").style("filter", "url(#glow)")


      svg
        .append("text")
        .attr("x", 0)
        .attr("y", -2)
        .attr("dy", "-.55em")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("filter", "url(#glow)")
        .style("fill", "white")
        .style("font-weight", "bold")
        .text("xG");

      svg
        .append("text")
        .attr("x", 35)
        .attr("y", -2)
        .attr("dy", "-.55em")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("filter", "url(#glow)")
        .style("fill", getColor(currentTeam))
        .style("font-weight", "bold")
        .text("For");

      svg
        .append("text")
        .attr("x", 93)
        .attr("y", -2)
        .attr("dy", "-.55em")
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("filter", "url(#glow)")
        .style("fill", "#48EDDB")
        .style("font-weight", "bold")
        .text("Against");

    })
}

function selectTeam() {
  if (once == false) {
    d3.select("#selectStat").on("change", function (d) {
      // recover the option that has been chosen
      selectedStat = d3.select(this).property("value");
      table_bar();
    })

    d3.select("#selectSeason").on("change", function (d) {
      // recover the option that has been chosen
      currentSeason = d3.select(this).property("value");

      if (currentSeason == "21-22") {
        currentTeamDict = teamDict2122
        currentTeams = teams2122
      }
      else {
        currentTeamDict = teamDict2223
        currentTeams = teams2223
      }

      init()
    })

    d3.select("#selectSeason")
      .selectAll('myOptions')
      .data(['21-22', '22-23'])
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

    d3.select("#selectHome")
      .selectAll('myOptions')
      .data(['Home', 'Away'])
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

    d3.select("#selectHome").on("change", function (d) {
      // recover the option that has been chosen
      currentPassNetworkState = d3.select(this).property("value")
      PassNetwork()
      if (currentOption == "heatmap") heatmap()
      else actions(currentOption)
    })

    d3.select("#selectHome").property("value", currentPassNetworkState)
    d3.select("#selectSeason").property("value", currentSeason)

    d3.select("#global").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#player_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#go_back").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");

  }

  d3.selectAll("#selectStat").selectAll('option').remove()

  var data_calc;
  d3.csv("data/" + currentSeason + "/calcs.csv").then((data) => {
    data_calc = data;

    array = Object.keys(data_calc[0])
    var array = array.filter(function (value, index, arr) {
      if (value != "shirtNo" && value != "playerId" && value != "team"
        && value != "name" && value != "minutes" && value != "total_passes"
        && value != "suc_passes" && value != "fotmob_player_id" && value != "fotmob_name"
        && value != "suc_take_ons" && value != "take_ons") return value;
    });

    selectedStat = array[0]
    array.push("Pass Percentage")
    array.push("Take-On Percentage")


    d3.select("#selectStat")
      .selectAll('myOptions')
      .data(array)
      .enter()
      .append('option')
      .text(function (d) {
        if (d == "prog_passes") return "Prog. Passes Per 90'"
        else if (d == "prog_carries") return "Prog. Carries Per 90'"
        else if (d == "defensive_actions") return "Def. Actions Per 90'"
        else if (d == "xt") return "xT per 90'"
        else if (d == "final_third_entries") return "Final Third Entries per 90'"
        else if (d == "final_third_passes") return "Final Third Passes per 90'"
        else if (d == "penalty_box_passes") return "Penalty Box Passes per 90'"
        else if (d == "penalty_box_entries") return "Penalty Box Entries per 90'"
        else if (d == "key_passes") return "Key Passes per 90'"
        else if (d == "Shots") return "Shots per 90'"
        else if (d == "xG") return "xG per 90'"
        else if (d == "xA") return "xA per 90'"
        else if (d == "xGOT") return "xGOT per 90'"
        else if (d == "ChancesCreated") return "Chances Created per 90'"
        else return d;
      }) // text showed in the menu
      .attr("value", function (d) { return d; })

  })

  d3.selectAll("#selectTeam").selectAll('option').remove()

  d3.select("#selectTeam")
    .selectAll('myOptions')
    .data(currentTeams)
    .enter()
    .append('option')
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })


  d3.select("#selectTeam").on("change", function (d) {
    // recover the option that has been chosen
    currentTeam = d3.select(this).property("value")
    //d3.select("#selectTeam").style("color",getColor(currentTeam))
    currentTeamId = currentTeamDict[currentTeam.replaceAll(" ", "-")]
    document.getElementById("image_logo").src = "data/" + currentSeason + "/" + currentTeam.replaceAll(" ", "-") + ".png";
    d3.select("div#background_div").style("background", "url(../data/" + currentSeason + "/estadio_" + currentTeam.replaceAll(" ", "-") + ".jpg)").style("opacity", 0.2)
    d3.select("div#rectangle").style("border", "2px solid " + getColor(currentTeam))
    d3.select("div#rectangle_1").style("border", "2px solid " + getColor(currentTeam))
    d3.select("div#rectangle_2").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#selectButton").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#selectStat").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#selectHome").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#selectSeason").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#selectTeam").style("border", "2px solid " + getColor(currentTeam))
    d3.select("#global").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#player_stats").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    d3.select("#go_back").style("text-decoration-color", getColor(currentTeam)).style("filter", "url(#glow)");
    console.log(currentOption)
    d3.select("#" + currentOption.replaceAll(".", "_")).style("background-color", getColor(currentTeam))
    d3.selectAll(".btn").style("border", "2px solid " + getColor(currentTeam))
    init()
  })

  new_teams = currentTeams.filter(item => item !== currentTeam)

  if (currentSelectedTeam == currentTeam) currentSelectedTeam = new_teams[6]

  d3.select("#selectButton").selectAll("#options").remove()

  d3.select("#selectButton")
    .selectAll('myOptions')
    .data(new_teams)
    .enter()
    .append('option')
    .attr("id", "options")
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; })

  d3.select("#selectTeam").property("value", currentTeam)

  d3.select("#selectButton").on("change", function (d) {
    // recover the option that has been chosen
    currentSelectedTeam = d3.select(this).property("value")
    PassNetwork()
    if (currentOption == "heatmap") heatmap()
    else actions(currentOption)
  })

  d3.select("#selectButton").property("value", currentSelectedTeam)

  once = true;
}

function newSelects() {

  d3.select("#a0").on("change", function (d) {
    // recover the option that has been chosen
    allPasses = !allPasses;
    actions()
  })

  d3.select("#a1").on("change", function (d) {
    // recover the option that has been chosen
    ProgressivePasses = !ProgressivePasses;
    d3.select("div#tooltip_definitions").style("opacity", 0).style("visibility", "hidden");
    actions()
  })

  d3.select("#a2").on("change", function (d) {
    // recover the option that has been chosen
    UnsuccessfulPasses = !UnsuccessfulPasses;
    actions()
  })

  d3.select("#a3").on("change", function (d) {
    // recover the option that has been chosen
    allCarries = !allCarries;
    actions()
  })

  d3.select("#a4").on("change", function (d) {
    // recover the option that has been chosen
    ProgressiveCarries = !ProgressiveCarries;
    d3.select("div#tooltip_definitions").style("opacity", 0).style("visibility", "hidden");
    actions()
  })

  d3.select("#a5").on("change", function (d) {
    // recover the option that has been chosen
    defensiveActions = !defensiveActions;
    actions()
  })

  d3.select("#c0").on("change", function (d) {
    // recover the option that has been chosen
    xt_gen = !xt_gen
    heatmap()
  })

  d3.select("#c1").on("change", function (d) {
    // recover the option that has been chosen
    touches = !touches
    heatmap()
  })
}


function PassNetwork() {

  d3.select("body").selectAll("div#tooltip_pass").remove()

  let tooltip = d3.select("body").append("div").attr("id", "tooltip_pass")
    .attr("class", "tooltip")
    .style("border", "2px solid " + getColor(currentTeam))
    .style("opacity", 0);

  if (currentPassNetworkState == "Home") var string = "data/" + currentSeason + "/PassNetworks/" + currentTeam.replace(/\s+/g, '-') + "/PassNetwork" + currentTeam.replace(/\s+/g, '-') + currentSelectedTeam.replace(/\s+/g, '-') + ".csv"
  else var string = "data/" + currentSeason + "/PassNetworks/" + currentTeam.replace(/\s+/g, '-') + "/PassNetwork" + currentSelectedTeam.replace(/\s+/g, '-') + currentTeam.replace(/\s+/g, '-') + ".csv"

  d3.csv(string)
    .then((data) => {
      dataset = data;

      lineColor = "#757272"
      lineWidth = 1.8
      pitchColor = "#eee"
      pitchMultiplier = 5.5
      pitchWidth = 105
      pitchHeight = 68
      var margin = { top: 10, right: 9, bottom: 0, left: 5 }


      var width = 590
      if (window.innerWidth > 1150) var height = window.innerWidth / 3 - 60
      else {
        var height = 950
        var margin = { top: 50, right: 9, bottom: 0, left: 5 }
      }

      getPitchLines = [{ "x1": 0, "x2": 16.5, "y1": 13.85, "y2": 13.85 }, { "x1": 16.5, "x2": 16.5, "y1": 13.85, "y2": 54.15 }, { "x1": 0, "x2": 16.5, "y1": 54.15, "y2": 54.15 }, { "x1": 0, "x2": 5.5, "y1": 24.85, "y2": 24.85 }, { "x1": 5.5, "x2": 5.5, "y1": 24.85, "y2": 43.15 }, { "x1": 0, "x2": 5.5, "y1": 43.15, "y2": 43.15 }, { "x1": 88.5, "x2": 105, "y1": 13.85, "y2": 13.85 }, { "x1": 88.5, "x2": 88.5, "y1": 13.85, "y2": 54.15 }, { "x1": 88.5, "x2": 105, "y1": 54.15, "y2": 54.15 }, { "x1": 99.5, "x2": 105, "y1": 24.85, "y2": 24.85 }, { "x1": 99.5, "x2": 99.5, "y1": 24.85, "y2": 43.15 }, { "x1": 99.5, "x2": 105, "y1": 43.15, "y2": 43.15 }, { "x1": 0, "x2": 105, "y1": 0, "y2": 0 }, { "x1": 0, "x2": 105, "y1": 68, "y2": 68 }, { "x1": 0, "x2": 0, "y1": 0, "y2": 68 }, { "x1": 105, "x2": 105, "y1": 0, "y2": 68 }, { "x1": 52.5, "x2": 52.5, "y1": 0, "y2": 68 }, { "x1": -1.5, "x2": -1.5, "y1": 30.34, "y2": 37.66 }, { "x1": -1.5, "x2": 0, "y1": 30.34, "y2": 30.34 }, { "x1": -1.5, "x2": 0, "y1": 37.66, "y2": 37.66 }, { "x1": 106.5, "x2": 106.5, "y1": 30.34, "y2": 37.66 }, { "x1": 0, "x2": -1.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 37.66, "y2": 37.66 }]
      getPitchCircles = [{ "cy": 52.5, "cx": 34, "r": 9.15, "color": "none" }, { "cy": 11, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 94, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 52.5, "cx": 34, "r": 0.3, "color": "#000" }]
      getArcs = [{ "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 1.5707963267948966, "endAngle": 3.141592653589793 }, "x": 0, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 4.7124, "endAngle": 3.1416 }, "x": 0, "y": 68 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 0, "endAngle": 1.5708 }, "x": 105, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 6.283185307179586, "endAngle": 4.71238898038469 }, "x": 105, "y": 68 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229, "endAngle": 4.0603 }, "x": 9, "y": 34 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229 + Math.PI, "endAngle": 4.0603 + Math.PI }, "x": 96, "y": 34 }]

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
        .style("opacity", "0")

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
      dataset.filter(function (d) {
        if (d.average_location == "True") positions.push({ 'name': d.name, 'shirtNo': Number(d.shirtNo), 'x': Number(d.x), 'y': Number(d.y) })
      })

      lines = dataset.filter(function (d) {
        if (d.average_location == "False") return d;
      })

      pass_count = []
      lines.filter(function (d) {
        pass_count.push(Number(d.pass_count));
      })

      const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
      avgPasses = average(pass_count);
      max = Math.max.apply(Math, pass_count)
      min = Math.min.apply(Math, pass_count)

      t1 = (avgPasses + max) / 2
      t2 = (avgPasses + min) / 2

      create_glow(pitch)
      createTriangle(pitch, "triangle", 1)
      createTriangle(pitch, "triangle2", 0.1)


      pitch.selectAll('.pitchLines')
        .data(lines)
        .enter().append("line")
        .attr("id", "passing")
        .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
        .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
        .attr("x2", d => (68 - Number(d.mid_y)) * pitchMultiplier)
        .attr("y2", d => (105 - Number(d.mid_x)) * pitchMultiplier)
        .style("filter", "url(#glow)")
        .attr("stroke", "white")
        .attr("stroke-width", d => (Number(d.pass_count) * 2.5) / max)
        .attr("marker-end", "url(#triangle)");

      pitch.selectAll('.pitchLines')
        .data(lines)
        .enter().append("line")
        .attr("id", "passing")
        .attr("x1", d => (68 - Number(d.mid_y)) * pitchMultiplier)
        .attr("y1", d => (105 - Number(d.mid_x)) * pitchMultiplier)
        .attr("x2", d => (68 - Number(d.y_end)) * pitchMultiplier)
        .attr("y2", d => (105 - Number(d.x_end)) * pitchMultiplier)
        .style("filter", "url(#glow)")
        .attr("stroke", "white")
        .attr("stroke-width", d => (Number(d.pass_count) * 2.5) / max)

      function handleMouseClick(event, d) {
        var matrix = this.getScreenCTM()
          .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

        var string = "<img src=" + "'data/Photos/" + currentTeam.replaceAll(" ", "-") + "/" + String(d.name) + ".png' style='width:80px; height: 80px; padding-left:0%; display: inline-block;'/>";
        if (d.name.includes(" ")) var string2 = "<p style='display: inline-block; font-size:60%; font-weight:bold; padding-left:2%'>" + d.name.split(" ")[0] + "<br>" +
          d.name.split(" ")[1] + "<p/>";
        else var string2 = "<p style='display: inline-block; font-size:60%; font-weight:bold; padding-left:2%'>\n" + d.name + "<pre/>";

        tooltip.transition()
          .duration(200)
          .style("opacity", 1).style("visibility", "visible");
        tooltip.html(string + string2).style("left", event.x + "px")
          .style("top", event.y + "px");
      }

      function handleMouseOver(event, d) {
        d3.select(this).style("cursor", "pointer")
        mouseaux(pitch, "circle#nodes", d, "over")
        mouseaux(pitch, "text#numbers", d, "over", "shirtNo")
        mouseaux(d3.select("div#actions"), "circle#progressive", d, "over", "name")
        mouseaux(d3.select("div#actions"), "line#progressive", d, "over", "name")
        mouseaux(d3.select("div#actions"), "circle#def", d, "over", "name")
        mouseaux(d3.select("div#actions"), "circle#shots", d, "over", "name")

        pitch.selectAll("line#passing")
          .attr("stroke-opacity", 0.1).attr("marker-end", "url(#triangle2)");
      }


      function handleMouseLeave(event, d) {
        mouseaux(pitch, "circle#nodes", d, "leave")
        mouseaux(pitch, "text#numbers", d, "over", "leave")
        mouseaux(d3.select("div#actions"), "circle#progressive", d, "leave", "name")
        mouseaux(d3.select("div#actions"), "line#progressive", d, "leave", "name")
        mouseaux(d3.select("div#actions"), "circle#def", d, "leave", "name")
        mouseaux(d3.select("div#actions"), "circle#shots", d, "leave", "name")
        pitch.selectAll("line#passing")
          .attr("stroke-opacity", 1).attr("marker-end", "url(#triangle)");
      }


      pitch.selectAll('.pitchCircles')
        .data(positions)
        .enter().append('circle')
        .attr("id", "nodes")
        .attr('cy', d => (105 - d.x) * pitchMultiplier)
        .attr('cx', d => (68 - d.y) * pitchMultiplier)
        .attr('r', 15)
        .style('stroke-width', lineWidth)
        .style('stroke', "white")
        .style('fill', getColor(currentTeam))
        .style("filter", "url(#glow)")
        .style("fill-opacity", 0.8)
        .on("mouseover", handleMouseOver)
        .on("click", handleMouseClick)
        .on("mouseleave", handleMouseLeave)
        .style("stroke-dasharray", ("6,2"));

      pitch.selectAll('.pitchCircles')
        .data(positions).enter()
        .append("text")
        .attr("id", "numbers")
        .attr("x", d => (68 - d.y) * pitchMultiplier)
        .attr("y", d => (105 - d.x) * pitchMultiplier + 5)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("filter", "url(#glow)")
        .style("fill", "white")
        .on("mouseover", handleMouseOver)
        .on("click", handleMouseClick)
        .on("mouseleave", handleMouseLeave)
        .text(d => d.shirtNo);

      dataset.filter(function (d) {
        game_time = d.game_minutes
      })

      pitch
        .append("text")
        .attr("x", (7 * pitchMultiplier))
        .attr("y", (102 * pitchMultiplier))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("filter", "url(#glow)")
        .style("fill", "white")
        .text(String(game_time));

    })
    .catch((error) => {
      ////console.log(error);
    });


}

function setAllFalse() {
  ProgressiveCarries = false
  ProgressivePasses = false
  allCarries = false
  allPasses = false
  UnsuccessfulPasses = false
  d3.select("div#rectangle_2").selectAll(".removable").remove()
  d3.select("div#actions").selectAll("select").remove()
}

function plot_goal(event, d) {
  d3.select("div#tooltip_shots").select("svg").remove()

  d3.select("div#tooltip_shots").transition()
    .duration(200)
    .style("opacity", 1).style("visibility", "visible");

  d3.select("div#tooltip_shots").style("left", event.x - 140 + "px")
    .style("top", event.y - 140 + "px").style("border", "2px solid " + getColor(currentTeam));

  var lineColor = "white"
  var lineWidth = 1.8
  var pitchColor = "#eee"
  var pitchMultiplier = 25.5
  goalWidth = 7.5
  goalHeight = 2.5

  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }

  var width = 480
  var height = 250

  const svg = d3.select("div#tooltip_shots").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).style("padding-left", "18.5%").style("padding-top", "2.5%");

  const goal = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`)

  goal.append('rect')
    .attr('x', margin.left)
    .attr('y', margin.top)
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .style('fill', pitchColor)
    .style("opacity", "0")

  getGoalLines = [{ 'x1': -0.5, 'x2': 8, 'y1': 2.5, 'y2': 2.5, "type": "underline" }, { 'x1': 0, 'x2': 7.5, 'y1': 0, 'y2': 0 }, { 'x1': 0, 'x2': 0, 'y1': 0, 'y2': 2.5 }, { 'x1': 7.5, 'x2': 7.5, 'y1': 0, 'y2': 2.5 }]

  const goalLineData = getGoalLines;
  goal.selectAll('.goalLines')
    .data(goalLineData)
    .enter().append('line')
    .attr('x1', d => d['x1'] * pitchMultiplier)
    .attr('x2', d => d['x2'] * pitchMultiplier)
    .attr('y1', d => d['y1'] * pitchMultiplier)
    .attr('y2', d => d['y2'] * pitchMultiplier)
    .style('stroke-width', d => {
      if (d.type == "underline") return 1
      else return 2.2
    })
    .style('stroke', lineColor)
    .style("stroke-dasharray", d => { if (d.type == "underline") return ("10,3") });


  if (d.blockedX == "") {
    event = d.eventType
    goal.selectAll('.goalCircles')
      .data([d])
      .enter().append("circle")
      .attr("cx", d => {
        return ((7.5 - (Number(d['goalCrossedY']) - 30)) * pitchMultiplier)
      })
      .attr("cy", d => {
        return (2.5 - d['goalCrossedZ']) * pitchMultiplier
      })
      .attr('r', 5)
      .style('stroke-width', 0.5)
      .style('stroke', "white")
      .style("filter", "url(#glow)")
      .style("fill", function (d) {
        if (d.eventType == "Goal") return "#42DC60"
        else if (d.eventType == "AttemptSaved") return "red"
        else if (d.eventType == "Post") return "#42DCD5"
        else return "red"
      })
  }
  else event = "Blocked"

  if (currentPassNetworkState == "Home") {
    if (Number(d.home_score) > Number(d.away_score)) game_state = "Winning " + Number(d.home_score) + " - " + Number(d.away_score)
    else if (Number(d.home_score) < Number(d.away_score)) game_state = "Losing " + Number(d.home_score) + " - " + Number(d.away_score)
    else game_state = "Drawing: " + Number(d.home_score) + " - " + Number(d.away_score)
  }
  else {
    if (Number(d.home_score) < Number(d.away_score)) game_state = "Winning " + Number(d.home_score) + " - " + Number(d.away_score)
    else if (Number(d.home_score) > Number(d.away_score)) game_state = "Losing " + Number(d.home_score) + " - " + Number(d.away_score)
    else game_state = "Drawing " + Number(d.home_score) + " - " + Number(d.away_score)
  }

  var string2 = "Player: " + d.playerName
  var string3 = "Game State: " + game_state
  var string4 = String(d.expectedGoals).substring(0, 4) + " xG";

  colors = ['#8C8984', "#35322E"]

  var i = 0

  function append_text(svg, y, text) {
    svg
      .append("rect")
      .attr("x", 0.1 * pitchMultiplier)
      .attr("y", (y - 0.5) * pitchMultiplier)
      .attr("height", 0.6 * pitchMultiplier)
      .style("stroke-width", 1)
      .style("filter", "url(#glow)")
      .style("stroke", getColor(currentTeam))
      .style("fill", function (d) {
        if (i == 0) i = 1
        else {
          i = 0
        }
        return colors[i]
      })
      .attr("width", 8.85 * pitchMultiplier)


    svg
      .append("text")
      .attr("x", 4.4 * pitchMultiplier)
      .attr("y", y * pitchMultiplier)
      .attr("dx", "0%")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("filter", "url(#glow)")
      .style("fill", "white")
      .style("font-weight", "bold")
      .text(text);


  }

  append_text(svg, 4.2, string2)
  append_text(svg, 4.8, event)
  append_text(svg, 5.4, "Situation: " + d.situation.replace(/([A-Z])/g, ' $1').trim())
  append_text(svg, 6, d.shotType.replace(/([A-Z])/g, ' $1').trim())
  append_text(svg, 6.6, string3)
  append_text(svg, 7.2, string4 + " - " + String(d.expectedGoalsOnTarget).substring(0, 4) + " xGOT")



}

function heatmap() {
  currentOption = "heatmap"

  uncheck_buttons(currentOption)

  setAllFalse()

  if (currentPassNetworkState == "Home") var string = "data/" + currentSeason + "/" + currentTeam.replace(/\s+/g, '-') + "/" + currentTeam + " - " + currentSelectedTeam + ".csv"
  else var string = "data/" + currentSeason + "/" + currentTeam.replace(/\s+/g, '-') + "/" + currentSelectedTeam + " - " + currentTeam + ".csv"

  d3.csv(string)
    .then((data) => {
      dataset = data;

      lineColor = "#757272"
      lineWidth = 1.8
      pitchColor = "#eee"
      var pitchMultiplier = 5.5
      pitchWidth = 105
      pitchHeight = 68
      var margin = { top: 50, right: 9, bottom: 0, left: 5 }
      var width = 590
      var fontSize = 1
      var windowTax = 0
      if (window.innerWidth > 1400) {
        var height = window.innerWidth / 3 - 60
      }
      else if (window.innerWidth > 1200) {
        var height = window.innerWidth / 3 - 100
        pitchMultiplier = 5
        width = 530
        fontSize = 0.85
        windowTax = 1
      }
      else {
        var height = 950
        var margin = { top: 120, right: 9, bottom: 0, left: 5 }
      }

      getPitchLines = [{ "x1": 0, "x2": 16.5, "y1": 13.85, "y2": 13.85 }, { "x1": 16.5, "x2": 16.5, "y1": 13.85, "y2": 54.15 }, { "x1": 0, "x2": 16.5, "y1": 54.15, "y2": 54.15 }, { "x1": 0, "x2": 5.5, "y1": 24.85, "y2": 24.85 }, { "x1": 5.5, "x2": 5.5, "y1": 24.85, "y2": 43.15 }, { "x1": 0, "x2": 5.5, "y1": 43.15, "y2": 43.15 }, { "x1": 88.5, "x2": 105, "y1": 13.85, "y2": 13.85 }, { "x1": 88.5, "x2": 88.5, "y1": 13.85, "y2": 54.15 }, { "x1": 88.5, "x2": 105, "y1": 54.15, "y2": 54.15 }, { "x1": 99.5, "x2": 105, "y1": 24.85, "y2": 24.85 }, { "x1": 99.5, "x2": 99.5, "y1": 24.85, "y2": 43.15 }, { "x1": 99.5, "x2": 105, "y1": 43.15, "y2": 43.15 }, { "x1": 0, "x2": 105, "y1": 0, "y2": 0 }, { "x1": 0, "x2": 105, "y1": 68, "y2": 68 }, { "x1": 0, "x2": 0, "y1": 0, "y2": 68 }, { "x1": 105, "x2": 105, "y1": 0, "y2": 68 }, { "x1": 52.5, "x2": 52.5, "y1": 0, "y2": 68 }, { "x1": -1.5, "x2": -1.5, "y1": 30.34, "y2": 37.66 }, { "x1": -1.5, "x2": 0, "y1": 30.34, "y2": 30.34 }, { "x1": -1.5, "x2": 0, "y1": 37.66, "y2": 37.66 }, { "x1": 106.5, "x2": 106.5, "y1": 30.34, "y2": 37.66 }, { "x1": 105, "x2": 106.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 37.66, "y2": 37.66 }]
      getPitchCircles = [{ "cy": 52.5, "cx": 34, "r": 9.15, "color": "none" }, { "cy": 11, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 94, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 52.5, "cx": 34, "r": 0.3, "color": "#000" }]
      getArcs = [{ "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 1.5707963267948966, "endAngle": 3.141592653589793 }, "x": 0, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 4.7124, "endAngle": 3.1416 }, "x": 0, "y": 68 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 0, "endAngle": 1.5708 }, "x": 105, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 6.283185307179586, "endAngle": 4.71238898038469 }, "x": 105, "y": 68 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229, "endAngle": 4.0603 }, "x": 9 - windowTax, "y": 34 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229 + Math.PI, "endAngle": 4.0603 + Math.PI }, "x": 96 + windowTax, "y": 34 }]

      d3.select("div#actions").select("svg").remove();
      d3.select("div#actions").selectAll("text").remove();
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
        .style("opacity", "0")

      setAllFalse()
      names = []
      dataset.filter(function (d) {
        if (d.teamId == currentTeamId || d.type == "Carry") names.push(d.name)
      })


      dataset = dataset.filter(function (d) {
        if (d.name == selectedPlayer) return d
      })



      for (i = 0; i < dataset.length; i++) {
        dataset[i]['bin_width'] = Number(String(dataset[i]['y'] / (68 / 50)).split(".")[0])
        dataset[i]['bin_height'] = Number(String(dataset[i]['x'] / (105 / 50)).split(".")[0])
      }

      //dataset = d3.rollup(dataset, v => d3.sum(v, d => d.xT), d => d.bin_width,d => d.bin_height);
      dataset = d3.rollup(dataset, v => v.length, d => d.bin_width, d => d.bin_height);





      clean_data = []
      dataset.forEach((value, key) => {
        var bin_width = key
        value.forEach((value, key) => {
          var bin_height = key
          if (value < 0) value = 0
          clean_data.push({ 'bin_width': bin_width, 'bin_height': bin_height, 'xT': value })
        })
      })




      var myColor = d3.scaleLinear().domain([0, d3.max(clean_data, d => d.xT)])
        .interpolate(d3.interpolateRgb)
        .range([d3.rgb("#2a2e30"), d3.rgb(getColor(currentTeam))])


      //PITCH WIDTH IN RECTS == 44 * 25 = 1100
      //PITCH HEIGTH IN RECTS

      possible_combinations = d3.map(clean_data, d => [d.bin_width, d.bin_height, d.xT])

      for (i = 0; i < 50; i += 1) {
        for (j = 0; j < 50; j += 1) {
          var flag = false
          color = myColor(0)

          for (k = 0; k < possible_combinations.length; k++) {
            if (possible_combinations[k][0] == 49 - j && possible_combinations[k][1] == 49 - i) {
              flag = true
              color = myColor(possible_combinations[k][2])
            }
          }

          //if(flag == true) continue

          pitch.append("rect")
            .attr('y', d => i * (105 / 50) * pitchMultiplier)
            .attr('x', d => j * (68 / 50) * pitchMultiplier)
            .attr("height", (105 / 50) * pitchMultiplier)
            .attr("width", (68 / 50) * pitchMultiplier)
            .attr("id", "heatmap")
            .style("stroke-width", 0)
            //.style("filter", "url(#glow)")
            .style("fill", color)
        }
      }

      pitch.append("rect")
        .attr("y", 10 * pitchMultiplier)
        .attr("x", 72 * pitchMultiplier)
        .attr("width", 20)
        .attr("height", 300)
        .style("stroke", "white")
        .style("stroke-width", 0.1)
        .style("filter", "url(#glow)")
        .style("fill", "url(#linear-gradient)");

      pitch.append("text")
        .attr("y", 13 * pitchMultiplier)
        .attr("x", (73 - windowTax / 4) * pitchMultiplier)
        .text("+").style("filter", "url(#glow)").style("font-weight", "bold").style("font-size", "100%").style("fill", "white")

      pitch.append("text")
        .attr("y", 63 * pitchMultiplier)
        .attr("x", (73.4 - windowTax / 4) * pitchMultiplier)
        .text("-").style("fill", "white").style("filter", "url(#glow)").style("font-weight", "bold").style("font-size", "100%")


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


      var defs = svg.append("defs");

      //Append a linearGradient element to the defs and give it a unique id
      var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

      linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      //Set the color for the start (0%)
      linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", getColor(currentTeam)); //light blue

      //Set the color for the end (100%)
      linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#2a2e30"); //dark blue

      create_glow(pitch)
      createTriangle(pitch, "triangle2", 0.1)
      createTriangle(pitch, "triangle3", 0.8)

      d3.select("div#actions")
        .append("text").text("Player:").style("color", "white").style("margin-left", "1%").style("padding-top", "30%").style("font-size", "100%").style("vertical-align", "middle")
        .style("filter", "url(#glow)").style("font-weight", "bold")

      d3.select("div#actions").append("select")
        .attr("id", "selectPlayer").style("margin-left", "1%").style("filter", "url(#glow)");

      names = [...new Set(names)]

      d3.select("#selectPlayer")
        .selectAll('myOptions')
        .data(names)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; })

      d3.select("#selectPlayer").on("change", function (d) {
        // recover the option that has been chosen
        selectedPlayer = d3.select(this).property("value")
        if (currentOption == "heatmap") heatmap()
        else actions(currentOption)
      })

      d3.select("#selectPlayer").property("value", selectedPlayer)

      newSelects()

    })
}

function uncheck_buttons(option) {
  list = ["actions", "shots", "def_actions", "heatmap"]
  for (i = 0; i < list.length; i++) {
    d3.select("#" + list[i]).style("background-color", "#cf251f00")
  }

  d3.select("#" + option.replaceAll(".", "_")).style("background-color", getColor(currentTeam))

}

function actions(option) {

  if (option != null) uncheck_buttons(option)

  d3.select("body").selectAll("div#tooltip_actions").remove()

  let tooltip = d3.select("body").append("div").attr("id", "tooltip_actions")
    .attr("class", "tooltip")
    .style("border", "2px solid " + getColor(currentTeam))
    .style("opacity", 0);

  let tooltip2 = d3.select("body").append("div").attr("id", "tooltip_definitions")
    .attr("class", "tooltip2")
    .style("border", "2px solid " + getColor(currentTeam))
    .style("opacity", 0);

  d3.select("body").append("div").attr("id", "tooltip_shots")
    .attr("class", "tooltip3")
    .style("border", "2px solid " + getColor(currentTeam))
    .style("opacity", 0);

  d3.select("body").on("click", function () {
    d3.select("div#tooltip_actions").style("opacity", 0).style("visibility", "hidden");
    d3.select("div#tooltip_shots").style("opacity", 0).style("visibility", "hidden");
    d3.select("div#tooltip_definitions").style("opacity", 0).style("visibility", "hidden").style("left", 0);
    d3.select("div#tooltip_pass").style("opacity", 0).style("visibility", "hidden");
    d3.select("div#tooltip_moving_average").style("opacity", 0).style("visibility", "hidden");
  });

  if (option != null) currentOption = option

  if (currentPassNetworkState == "Home") var string = "data/" + currentSeason + "/" + currentTeam.replace(/\s+/g, '-') + "/" + currentTeam + " - " + currentSelectedTeam + ".csv"
  else var string = "data/" + currentSeason + "/" + currentTeam.replace(/\s+/g, '-') + "/" + currentSelectedTeam + " - " + currentTeam + ".csv"

  d3.csv(string)
    .then((data) => {
      dataset = data;

      lineColor = "#757272"
      lineWidth = 1.8
      pitchColor = "#eee"
      var pitchMultiplier = 5.5
      pitchWidth = 105
      pitchHeight = 68
      var margin = { top: 50, right: 9, bottom: 0, left: 5 }
      var width = 590
      var fontSize = 1
      var windowTax = 0
      if (window.innerWidth > 1400) {
        var height = window.innerWidth / 3 - 80
      }
      else if (window.innerWidth > 1200) {
        var height = window.innerWidth / 3 - 120
        pitchMultiplier = 5
        width = 530
        fontSize = 0.85
        windowTax = 1
      }
      else {
        var height = 950
        var margin = { top: 120, right: 9, bottom: 0, left: 5 }
      }

      getPitchLines = [{ "x1": 0, "x2": 16.5, "y1": 13.85, "y2": 13.85 }, { "x1": 16.5, "x2": 16.5, "y1": 13.85, "y2": 54.15 }, { "x1": 0, "x2": 16.5, "y1": 54.15, "y2": 54.15 }, { "x1": 0, "x2": 5.5, "y1": 24.85, "y2": 24.85 }, { "x1": 5.5, "x2": 5.5, "y1": 24.85, "y2": 43.15 }, { "x1": 0, "x2": 5.5, "y1": 43.15, "y2": 43.15 }, { "x1": 88.5, "x2": 105, "y1": 13.85, "y2": 13.85 }, { "x1": 88.5, "x2": 88.5, "y1": 13.85, "y2": 54.15 }, { "x1": 88.5, "x2": 105, "y1": 54.15, "y2": 54.15 }, { "x1": 99.5, "x2": 105, "y1": 24.85, "y2": 24.85 }, { "x1": 99.5, "x2": 99.5, "y1": 24.85, "y2": 43.15 }, { "x1": 99.5, "x2": 105, "y1": 43.15, "y2": 43.15 }, { "x1": 0, "x2": 105, "y1": 0, "y2": 0 }, { "x1": 0, "x2": 105, "y1": 68, "y2": 68 }, { "x1": 0, "x2": 0, "y1": 0, "y2": 68 }, { "x1": 105, "x2": 105, "y1": 0, "y2": 68 }, { "x1": 52.5, "x2": 52.5, "y1": 0, "y2": 68 }, { "x1": -1.5, "x2": -1.5, "y1": 30.34, "y2": 37.66 }, { "x1": -1.5, "x2": 0, "y1": 30.34, "y2": 30.34 }, { "x1": -1.5, "x2": 0, "y1": 37.66, "y2": 37.66 }, { "x1": 106.5, "x2": 106.5, "y1": 30.34, "y2": 37.66 }, { "x1": 105, "x2": 106.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 37.66, "y2": 37.66 }]
      getPitchCircles = [{ "cy": 52.5, "cx": 34, "r": 9.15, "color": "none" }, { "cy": 11, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 94, "cx": 34, "r": 0.3, "color": "#000" }, { "cy": 52.5, "cx": 34, "r": 0.3, "color": "#000" }]
      getArcs = [{ "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 1.5707963267948966, "endAngle": 3.141592653589793 }, "x": 0, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 4.7124, "endAngle": 3.1416 }, "x": 0, "y": 68 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 0, "endAngle": 1.5708 }, "x": 105, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 6.283185307179586, "endAngle": 4.71238898038469 }, "x": 105, "y": 68 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229, "endAngle": 4.0603 }, "x": 9 - windowTax, "y": 34 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229 + Math.PI, "endAngle": 4.0603 + Math.PI }, "x": 96 + windowTax, "y": 34 }]

      d3.select("div#actions").select("svg").remove();
      d3.select("div#actions").selectAll("text").remove();
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
        .style("opacity", "0")

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

      create_glow(pitch)
      createTriangle(pitch, "triangle2", 0.1)
      createTriangle(pitch, "triangle3", 0.8)

      if (option == "actions") {

        setAllFalse()
        d3.select("div#rectangle_2").selectAll("input")
          .data(["All Passes", "Progressive Passes", "Unsuccessful Passes", "All Carries", "Progressive Carries"])
          .enter()
          .append('label')
          .attr('for', function (d, i) { return 'a' + i; })
          .text(function (d) { return d; })
          .style("filter", "url(#glow)")
          .attr("class", "removable")
          .style("color", "white")
          .style("width", "fit-content")
          .style("padding-left", "5%")
          .style("font-size", 100 * fontSize + "%")
          .append("input")
          .attr("type", "checkbox")
          .attr("id", function (d, i) { return 'a' + i; })
          .attr("class", "removable")
          .style("filter", "url(#glow)")
          .style("color", "white")
          .on("mouseover", d3.select("div#tooltip_definitions").style("opacity", 0).style("visibility", "hidden").style("left", 0))
          .style("margin-left", "10px")
          .style("padding-left", "5%")

        newSelects()

      }
      else if (option == "shots") {
        setAllFalse()

        d3.csv("data/" + currentSeason + "/" + "allShotsLigaBwin" + currentSeason.replace("-", "") + ".csv").then((data) => {
          data = data.filter(function (d) {
            if ((currentPassNetworkState == "Home" && d.homeTeam == currentTeam && d.awayTeam == currentSelectedTeam && d.name == currentTeam) ||
              (currentPassNetworkState == "Away" && d.awayTeam == currentTeam && d.homeTeam == currentSelectedTeam && d.name == currentTeam)) return d
          })

          function handleMouseOver(event, d) {
            d3.select(this).style("cursor", "pointer")
            pitch.selectAll('line#remove')
              .remove()

            pitch.selectAll('.progressiveLines')
              .data([d])
              .enter().append("line")
              .attr("id", "remove")
              .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
              .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
              .attr("x2", d => {
                if (d.blockedY == "") return (68 - Number(d.goalCrossedY)) * pitchMultiplier
                else return (68 - Number(d.blockedY)) * pitchMultiplier
              })
              .attr("y2", d => {
                if (d.blockedX == "") {
                  return (105 - 105) * pitchMultiplier
                }
                else return (105 - Number(d.blockedX)) * pitchMultiplier
              })
              .style("filter", "url(#glow)")
              .attr("stroke", "white")
              .style("stroke-width", 2)
              .style("stroke-opacity", 1)
              .attr("stroke-width", lineWidth)
              .attr("marker-end", "url(#triangle3)");
          }

          function handleMouseLeave(event, d) {
            pitch.selectAll('line#remove')
              .remove()
          }

          function handleClick(event, d) {
            plot_goal(event, d);
          }

          _data = []
          _data.push({ 'x': 36, 'y': 38, 'expectedGoals': 0.5, 'eventType': "Post" })
          _data.push({ 'x': 36, 'y': 43, 'expectedGoals': 0.25 })
          _data.push({ 'x': 36, 'y': 46.5, 'expectedGoals': 0.1 })
          _data.push({ 'x': 36, 'y': 32, 'expectedGoals': 0.75 })
          _data.push({ 'x': 36, 'y': 24, 'expectedGoals': 1, 'eventType': "Goal" })

          circles = pitch.selectAll('.progressiveCircles')
            .data(data)
            .enter().append('circle')
            .attr("id", "shots")
            .attr('cy', d => (105 - d.x) * pitchMultiplier)
            .attr('cx', d => (68 - d.y) * pitchMultiplier)
            .attr('r', d => 20 * d.expectedGoals)
            .style('stroke-width', 0.5)
            .style('stroke', "white")
            .style("filter", "url(#glow)")
            .style('fill', function (d) {
              if (d.eventType == "Goal") return "#42DC60"
              else if (d.eventType == "AttemptSaved") return "red"
              else if (d.eventType == "Post") return "#42DCD5"
              else return "red"
            })
            .on("click", handleClick)
            .on("mouseover", handleMouseOver)
            .on("mouseleave", handleMouseLeave)
            .style("fill-opacity", 1)

          circles = pitch.selectAll('.progressiveCircles')
            .data(_data)
            .enter().append('circle')
            .attr('cy', d => (105 - d.x) * pitchMultiplier)
            .attr('cx', d => (68 - d.y) * pitchMultiplier)
            .attr('r', d => 20 * d.expectedGoals)
            .style('stroke-width', 0.5)
            .style('stroke', "white")
            .style("filter", "url(#glow)")
            .style('fill', function (d) {
              if (d.eventType == "Goal") return "#42DC60"
              else if (d.eventType == "AttemptSaved") return "red"
              else if (d.eventType == "Post") return "#42DCD5"
              else return "red"
            })
            .style("fill-opacity", 1)

          function appendText(x, y, text) {
            pitch.append("text")
              .attr("y", d => (((105 - x) * pitchMultiplier) - 20))
              .attr("x", d => ((68 - y) * pitchMultiplier) - 15)
              .attr("dy", "-.55em")
              .style("font-size", 12)
              .style("filter", "url(#glow)")
              .style("fill", "white")
              .style("font-weight", "bold")
              .text(text);
          }

          pitch.selectAll('text').data(_data).enter().append("text")
            .attr("y", d => (((105 - d.x) * pitchMultiplier) + 40))
            .attr("x", d => ((68 - d.y) * pitchMultiplier) - 5)
            .attr("dy", "-.55em")
            .style("font-size", 12)
            .style("filter", "url(#glow)")
            .style("fill", "white")
            .style("font-weight", "bold")
            .text(d => String(d.expectedGoals));

          appendText(36, 24, "Goal")
          appendText(36, 32, "Miss")
          appendText(36, 38, "Post")
          appendText(21, 35, "xG Sizes")
        })
      }
      else if (option == "def.actions") {

        function handleMouseClick(event, d) {
          var matrix = this.getScreenCTM()
            .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

          var string2 = "<p style='display: inline-block; font-size:60%; font-weight:bold; padding-left:2%'>" + d.name + " (" + Number(d.shirtNo) + ")" + "<br>" + "Minute: "
            + String(Number(d.minute)) + "<br>" + d.homeTeam + " - " + d.awayTeam + "<br>" + d.type + " " + d.outcomeType + "<p/>";

          tooltip.transition()
            .duration(200)
            .style("opacity", 1).style("visibility", "visible");
          tooltip.html(string2).style("left", event.x + "px")
            .style("top", event.y + "px");
        }

        function handleMouseOver(event, d) {
          d3.select(this).style("cursor", "pointer")
          mouseaux(pitch, "circle#def", d, "over")
          mouseaux(d3.select("div#chart"), "circle#nodes", d, "over", "name")
        }

        function handleMouseLeave(event, d) {
          d3.select(this).style("cursor", "pointer")
          mouseaux(d3.select("div#chart"), "circle#nodes", d, "leave", "name")

          pitch.selectAll("circle#def")
            .style("fill-opacity", function (e) {
              if (e.outcomeType == "Unsuccessful") return 0.1
              else if (e["name"] != d["name"]) return 1
            })
        }

        setAllFalse()

        def_actions_list = ["Interception", "BlockedPass", "BallRecovery", "Clearance", "Tackle"]
        def_actions = dataset.filter(function (d) {
          if (def_actions_list.includes(d.type, 0) && d.teamId == currentTeamId) {
            return d;
          }
        });

        circles = pitch.selectAll('.progressiveCircles')
          .data(def_actions)
          .enter().append('circle')
          .attr("id", "def")
          .attr('cy', d => (105 - d.x) * pitchMultiplier)
          .attr('cx', d => (68 - d.y) * pitchMultiplier)
          .attr('r', d => 7)
          .style('stroke-width', 0)
          .style('stroke', "white")
          .style("filter", "url(#glow)")
          .style('fill', function (d) {
            if (d.type == "BallRecovery") return "#42DC60"
            else if (d.type == "Interception") return "red"
            else if (d.type == "BlockedPass") return "#42DCD5"
            else if (d.type == "Clearance") return "#D047D6"
            else if (d.type == "Tackle") return "#E38A18"
            else return "red"
          })
          .on("mouseover", handleMouseOver)
          .on("click", handleMouseClick)
          .on("mouseleave", handleMouseLeave)
          //.style("filter", "url(#glow)")
          .style("fill-opacity", function (d) {
            if (d.outcomeType == "Successful") return 1
            else return 0.1
          })


        d3.select("div#rectangle_2").selectAll("input")
          .data(["Ball Recovery", "Interception", "BlockedPass", "Clearance", "Tackle"])
          .enter()
          .append('label')
          .attr('for', function (d, i) { return 'b' + i; })
          .text(function (d) { return d; })
          .attr("class", "removable")
          .style("filter", "url(#glow)")
          .style("color", "white")
          .style("padding-left", "5%")
          .append('div')
          .attr('id', 'circle')
          .style('background', function (d) {
            if (d == "Ball Recovery") return "#42DC60"
            else if (d == "Interception") return "red"
            else if (d == "BlockedPass") return "#42DCD5"
            else if (d == "Clearance") return "#D047D6"
            else if (d == "Tackle") return "#E38A18"
            else return "red"
          })
          .style("height", "12px")
          .style("width", "12px")
          .attr("class", "removable")
          .style("margin-left", "10px")
          .style("filter", "url(#glow)")
          .style("display", "inline-block")
          .style("border-radius", "50%")

      }

      function handleMouseOver2(event, d) {
        if (event.path[0].type == "checkbox") return
        if (d == "Progressive Passes") {
          var string2 = "<p style='display: inline-block; font-size:55%; padding-left:2%'>" + "It's progressive if the pass moves the ball:" + "<br>" +
            "  - 30m closer to the goal if the pass start and finish are on the team's own half." + "<br>"
            + "  - 15m closer to the goal if the pass start and finish are on different halves." + "<br>"
            + "  - 10m closer to the goal if the pass start and finish are on the opponent's half." + "<p/>";
        }
        else if (d == "Progressive Carries") {
          var string2 = "<p style='display: inline-block; font-size:55%; padding-left:2%'>" + "It's progressive if the carry moves the ball:" + "<br>" +
            "  - 10m closer to the goal if the pass start and finish are on the team's own half." + "<br>"
            + "  - 7.5m closer to the goal if the pass start and finish are on different halves." + "<br>"
            + "  - 5m closer to the goal if the pass start and finish are on the opponent's half." + "<p/>";
        }
        else return

        tooltip2.transition()
          .duration(200)
          .style("opacity", 1).style("visibility", "visible");
        tooltip2.html(string2).style("left", event.x - 140 + "px")
          .style("top", event.y - 140 + "px");
      }

      function handleMouseLeave2(event, d) {
        tooltip2.style("opacity", 0).style("visibility", "hidden")
      }

      //d3.select("div#rectangle_2").selectAll("label").on("mouseover",handleMouseOver2)
      //.on("mouseleave",handleMouseLeave2)

      function handleMouseClick(event, d) {
        var matrix = this.getScreenCTM()
          .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

        var string2 = "<p style='display: inline-block; font-size:60%; font-weight:bold; padding-left:2%'>" + d.name + " (" + Number(d.shirtNo) + ")" + "<br>" + "Minute: "
          + String(Number(d.minute)) + "<br>" + d.homeTeam + " - " + d.awayTeam + "<br>" + "Progressive " + d.type + "<p/>";

        tooltip.transition()
          .duration(200)
          .style("opacity", 1).style("visibility", "visible");
        tooltip.html(string2).style("left", event.x + "px")
          .style("top", event.y + "px");
      }

      function handleMouseOver(event, d) {
        d3.select(this).style("cursor", "pointer")
        mouseaux(pitch, "circle#progressive", d, "over")
        mouseaux(pitch, "line#progressive", d, "over")
        mouseaux(d3.select("div#chart"), "circle#nodes", d, "over", "name")
      }

      function handleMouseLeave(event, d) {
        d3.select(this).style("cursor", "pointer")
        mouseaux(pitch, "circle#progressive", d, "leave")
        mouseaux(pitch, "line#progressive", d, "leave")
        mouseaux(d3.select("div#chart"), "circle#nodes", d, "leave", "name")
      }

      function plotLines(svg, data) {
        svg.selectAll('.progressiveLines')
          .data(data)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .attr("stroke-width", lineWidth)
      }

      function plotCircles(svg, data, color) {
        svg.selectAll('.progressiveCircles')
          .data(data)
          .enter().append('circle')
          .attr("id", "progressive")
          .attr('cy', d => (105 - d.endX) * pitchMultiplier)
          .attr('cx', d => (68 - d.endY) * pitchMultiplier)
          .attr('r', 7)
          .style('stroke-width', lineWidth)
          .style("filter", "url(#glow)")
          .on("mouseover", handleMouseOver)
          .on("click", handleMouseClick)
          .on("mouseleave", handleMouseLeave)
          .style('stroke', color)
          .style('fill', "#2a2e30")
          .style("fill-opacity", 1)
      }

      if (UnsuccessfulPasses) {
        unsuccesful = dataset.filter(function (d) {
          if (d.type == "Pass" && d.outcomeType == "Unsuccessful" && Number(d.teamId) == currentTeamId) {
            return d;
          }
        });

        pitch.selectAll('.progressiveLines')
          .data(unsuccesful)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.1)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle2)");
      }
      if (allPasses && !ProgressivePasses) {
        passes = dataset.filter(function (d) {
          if (d.type == "Pass" && d.outcomeType == "Successful" && Number(d.teamId) == currentTeamId) {
            return d;
          }
        });

        pitch.selectAll('.progressiveLines')
          .data(passes)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");
      }
      else if (allPasses) {
        passes = dataset.filter(function (d) {
          if (d.type == "Pass" && d.outcomeType == "Successful" && d.progressive == "False" && Number(d.teamId) == currentTeamId) {
            return d;
          }
        });

        pitch.selectAll('.progressiveLines')
          .data(passes)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");
      }
      if (ProgressivePasses) {
        console.log(dataset)
        progressive = dataset.filter(function (d) {
          if (d.type == "Pass" && d.outcomeType == "Successful" && d.progressive == "True" && Number(d.teamId) == currentTeamId) {
            return d;
          }
        });

        plotLines(pitch, progressive)

        plotCircles(pitch, progressive, getColor(currentTeam))

      }

      if (allCarries && !ProgressiveCarries) {
        carries = dataset.filter(function (d) {
          if (d.type == "Carry") {
            return d;
          }
        });

        pitch.selectAll('.progressiveLines')
          .data(carries)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");
      }
      else if (allCarries) {
        carries = dataset.filter(function (d) {
          if (d.type == "Carry" && d.progressive == "False") {
            return d;
          }
        });

        pitch.selectAll('.progressiveLines')
          .data(carries)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", d => (68 - Number(d.y)) * pitchMultiplier)
          .attr("y1", d => (105 - Number(d.x)) * pitchMultiplier)
          .attr("x2", d => (68 - Number(d.endY)) * pitchMultiplier)
          .attr("y2", d => (105 - Number(d.endX)) * pitchMultiplier)
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");
      }

      if (ProgressiveCarries) {
        progressiveC = dataset.filter(function (d) {
          if (d.type == "Carry" && d.progressive == "True") {
            return d;
          }
        });
        plotLines(pitch, progressiveC)
        plotCircles(pitch, progressiveC, "#48EDDB")
      }
    })
    .catch((error) => {
      ////console.log(error);
    });
}


function getColor(item) {
  for (i = 0; i < teams_colors.length; i++) {
    if (teams_colors[i]["team"] == item.replaceAll("-", " ")) return teams_colors[i]["color"]
  }
  return "red"
}

function table_bar(option) {

  function roundToTwo(num) { return +(Math.round(num + "e+2") + "e-2"); }

  d3.csv("data/" + currentSeason + "/calcs.csv").then((data) => {
    var data_selected = data;

    data_selected = data_selected.filter(function (d) {
      if (d.team == currentTeam.replaceAll(" ", "-") && d.minutes > 220) return d
    })

    if (selectedStat == "Goals" || selectedStat == "Assists") data_selected = data_selected.map(o => new Object({ name: o.name, stat: (o[selectedStat]) }))
    else if (selectedStat == "Pass Percentage") data_selected = data_selected.map(o => new Object({ name: o.name, stat: (o["suc_passes"] / o["total_passes"]) * 100 }))
    else if (selectedStat == "Take-On Percentage") data_selected = data_selected.map(o => new Object({ name: o.name, stat: (o["suc_take_ons"] / o["take_ons"]) * 100 }))
    else data_selected = data_selected.map(o => new Object({ name: o.name, stat: (o[selectedStat] * 90) / o.minutes }))

    data_selected = data_selected.sort(function (a, b) {
      var keyA = Number(a["stat"]),
        keyB = Number(b["stat"]);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    })

    data_selected = data_selected.slice(0, 13)

    d3.select("div#table").select("svg").remove();

    var margin = { top: 0, right: 0, bottom: 0, left: 0 }
    if (window.innerWidth > 1000) var width = window.innerWidth / 3 - 40
    else var width = 470
    var height = 420;

    y = d3.scaleBand()
      .domain(data_selected.map(d => d.name))
      .rangeRound([margin.top, height - margin.bottom]).padding(1.7)

    x = d3.scaleLinear()
      .domain([0, d3.max(data_selected, (d) => Number(d["stat"]))])
      .rangeRound([margin.left, width - margin.right])

    xAxis = (g) => g
      .attr("transform", `translate(0,${width - margin.right})`)
      .call(d3
        .axisBottom(x)
        .tickSizeOuter(0))


    yAxis = (g) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    const svg = d3
      .select("div#table")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    create_glow(svg)

    //svg.append("g").attr("class","XAxisBar").call(xAxis);
    svg.append("g").attr("class", "YAxisBar").call(yAxis);

    function handleMouseOver(event, d) {
      d3.select(this).style("cursor", "pointer")

      mouseaux(svg, "rect", d, "over")

      svg.selectAll("text#display_over").style("opacity", e => { if (e.name != d.name) return 0.1 })
      svg.selectAll("text#display_over").text(function (e) {
        if (e.name == d.name) {
          return roundToTwo(d.stat) + " - " + d.name
        }
        else return roundToTwo(e.stat)
      });

      svg.selectAll("image#logos_1").style("opacity", e => { if (e.name != d.name) return 0.1 })

    }

    function handleMouseLeave(event, d) {
      mouseaux(svg, "rect", d, "leave")
      svg.selectAll("text#display_over").style("opacity", e => { if (e.name != d.name) return 1 })
      svg.selectAll("image#logos_1").style("opacity", e => { if (e.name != d.name) return 1 })
      svg.selectAll("text#display_over").style("x", function (e) {
        return x(Number(e["stat"])) * 0.7 - 20 + 70
      }).
        text(function (e) {
          return roundToTwo(e.stat)
        });
    }

    svg.append("g")
      .selectAll("rect")
      .data(data_selected)
      .join("rect")
      .attr("x", 42)
      .attr("y", d => y(d.name) - 35)
      .attr("rx", 5)
      .on("mouseover", handleMouseOver)
      .on("mouseleave", handleMouseLeave)
      .attr("height", 15)
      .style("filter", "url(#glow)")
      .style("stroke", function (d) {
        return "white"
      })
      .style("fill", d => getColor(currentTeam))
      .transition()
      .ease(d3.easeLinear)
      .duration(800)
      .attr("width", function (d) {
        return x(d["stat"]) * 0.7
      })

    svg.selectAll('image')
      .data(data_selected)
      .enter()
      .append("image")
      .attr("id", "logos_1")
      .attr("x", 5)
      .attr("y", d => y(d.name) - 45)
      .attr('height', 30)
      .attr("xlink:href", d => "data/Photos/" + currentTeam.replaceAll(" ", "-") + "/" + d.name + ".png")


    svg.selectAll("YAxisBar .tick")
      .data(data_selected).enter()
      .append("text")
      .attr("id", "display_over")
      .attr("x", d => {
        return x(Number(d["stat"])) * 0.7 - 20 + 90
      })
      .attr("y", d => y(d.name) - 22)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("filter", "url(#glow)")
      .style("fill", "white")
      .text(d => roundToTwo(Number(d["stat"])));

  })
}
