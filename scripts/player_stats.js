selectedTeam = "Benfica"
selectedPlayer = "Gilberto"
selectedPlayerId = 119542
selected_fotmob_player_id = 387499
selectedSeason = "22-23"
selectedMode = "percentile"
minutes_treshold = 220
once = false
all_passes = false
all_carries = false
prog_passes = false
unsuc_passes = false
var prog_carries = false
var all_touches = false
var ball_recoveries = false
var blocked_passes = false
var interceptions = false
var clearances = false
var tackles = false
var goals = false
var posts = false
var attempt_saved = false
var misses = false
var selected_plot_mode = "actions"

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

var teams_colors = {
  "Benfica": "#cf261f", "Famalicao": "#163b66", "Moreirense": "#145f25", "Vizela": "#014694",
  "Arouca": "#fff400", "Belenenses SAD": "#02578d", "Boavista": "#000000", "Casa Pia": "#000000", "Braga": "#dc0b15",
  "Maritimo": "#073219", "Pacos de Ferreira": "#f5eb00", "Vitoria de Guimaraes": "#97928B",
  "Gil Vicente": "#ee2623", "Porto": "#040c55", "Portimonense": "#000000", "Santa Clara": "#b5252e",
  "Tondela": "#06653d", "Estoril": "#ffed00", "Sporting": "#008057", "Chaves": "#114288", "Rio Ave": "#009036"
}

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


function init() {
  init_selects()
  get_player_id()
  plot()
  stats()
  create_checkboxes()
  fill_glow()
  create_tooltip()
}

function create_tooltip() {
  d3.select("body").append("div").attr("id", "tooltip_shots")
    .attr("class", "tooltip3")
    .style("border", "2px solid " + teams_colors[selectedTeam]).style("opacity", 0).style("visibility", "hidden");

  d3.select("body").on("click", function () {
    d3.select("div#tooltip_shots").style("opacity", 0).style("visibility", "hidden");
  });
}

function create_checkboxes() {

  d3.select("div#first_checks").selectAll("input").remove()
  d3.select("div#first_checks").selectAll("label").remove()
  d3.select("div#first_checks").selectAll("circle").remove()
  d3.select("div#second_checks").selectAll("input").remove()
  d3.select("div#second_checks").selectAll("label").remove()
  d3.select("div#second_checks").selectAll("circle").remove()

  if (window.innerWidth < 800) {
    var font_size = 0.5
    var input_size = 0.7
  }
  else {
    var fontSize = 1
    var input_size = 1
  }

  if (selected_plot_mode == "actions") {
    d3.select("div#first_checks").selectAll("input")
      .data(["All Passes", "Progressive Passes", "Unsuccessful Passes", "All Carries", "Progressive Carries", "All Touches"])
      .enter()
      .append('label')
      .attr('for', function (d, i) { return 'a' + i; })
      .text(function (d) { return d; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("width", "fit-content")
      .style("padding-left", "1.5%")
      .style("font-size", String(100 * font_size) + "%")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", function (d, i) { return 'a' + i; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("outline", function (d) {
        if (d == "Progressive Passes") return "1.5px solid " + teams_colors[selectedTeam]
        else if (d == "Progressive Carries") return "1.5px solid #48EDDB"
      })
      .style("margin-left", "10px")
      .style("padding-left", "1%")
      .style("height", String(12 * input_size) + "px")
      .style("width", String(12 * input_size) + "px")

    d3.select("div#second_checks").selectAll("input")
      .data(["Ball Recoveries", "Blocked Passes", "Interceptions", "Clearances", "Tackles"])
      .enter()
      .append('circle')
      .attr('id', 'circle')
      .style('background', function (d) {
        if (d == "Ball Recoveries") return "#42DC60"
        else if (d == "Interceptions") return "red"
        else if (d == "Blocked Passes") return "#42DCD5"
        else if (d == "Clearances") return "#D047D6"
        else if (d == "Tackles") return "#E38A18"
      })
      .style("height", "12px")
      .style("width", "12px")
      .style("filter", "url(#glow)")
      .style("padding-right", "1.5%")
      .append('label')
      .attr('for', function (d, i) { return 'b' + i; })
      .text(function (d) { return d; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("width", "fit-content")
      .style("padding-left", "1.5%")
      .style("font-size", String(100 * font_size) + "%")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", function (d, i) { return 'b' + i; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("margin-left", "10px")
      .style("padding-left", "1%")
      .style("height", String(12 * input_size) + "px")
      .style("width", String(12 * input_size) + "px")
  }
  else {
    d3.select("div#first_checks").selectAll("input")
      .data(["Goal", "Attempt Saved", "Miss", "Post"])
      .enter()
      .append('circle')
      .attr('id', 'circle')
      .style('background', function (d) {
        if (d == "Goal") return "#55DD31"
        else if (d == "Attempt Saved") return "#DD9131"
        else if (d == "Miss") return "#DD3131"
        else if (d == "Post") return "#31B1DD"
      })
      .style("height", "12px")
      .style("width", "12px")
      .style("filter", "url(#glow)")
      .style("padding-right", "1.5%")
      .append('label')
      .attr('for', function (d, i) { return 'c' + i; })
      .text(function (d) { return d; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("width", "fit-content")
      .style("padding-left", "1.5%")
      .style("font-size", String(100 * font_size) + "%")
      .append("input")
      .attr("type", "checkbox")
      .attr("id", function (d, i) { return 'c' + i; })
      .style("filter", "url(#glow)")
      .style("color", "white")
      .style("margin-left", "10px")
      .style("padding-left", "1%")
      .style("height", String(12 * input_size) + "px")
      .style("width", String(12 * input_size) + "px")
  }


  d3.select("#a0").on("change", function (d) {
    // recover the option that has been chosen
    all_passes = !all_passes;
    plot()
  })

  d3.select("#a1").on("change", function (d) {
    // recover the option that has been chosen
    prog_passes = !prog_passes;
    plot()
  })

  d3.select("#a2").on("change", function (d) {
    // recover the option that has been chosen
    unsuc_passes = !unsuc_passes;
    plot()
  })

  d3.select("#a3").on("change", function (d) {
    // recover the option that has been chosen
    all_carries = !all_carries;
    plot()
  })

  d3.select("#a4").on("change", function (d) {
    // recover the option that has been chosen
    prog_carries = !prog_carries;
    plot()
  })

  d3.select("#a5").on("change", function (d) {
    // recover the option that has been chosen
    all_touches = !all_touches;
    plot()
  })


  d3.select("#b0").on("change", function (d) {
    // recover the option that has been chosen
    ball_recoveries = !ball_recoveries;
    plot()
  })

  d3.select("#b1").on("change", function (d) {
    // recover the option that has been chosen
    blocked_passes = !blocked_passes;
    plot()
  })

  d3.select("#b2").on("change", function (d) {
    // recover the option that has been chosen
    interceptions = !interceptions;
    plot()
  })

  d3.select("#b3").on("change", function (d) {
    // recover the option that has been chosen
    clearances = !clearances;
    plot()
  })

  d3.select("#b4").on("change", function (d) {
    // recover the option that has been chosen
    tackles = !tackles;
    plot()
  })


  d3.select("#c0").on("change", function (d) {
    // recover the option that has been chosen
    goals = !goals;
    plot()
  })

  d3.select("#c1").on("change", function (d) {
    // recover the option that has been chosen
    attempt_saved = !attempt_saved;
    plot()
  })

  d3.select("#c2").on("change", function (d) {
    // recover the option that has been chosen
    misses = !misses;
    plot()
  })

  d3.select("#c3").on("change", function (d) {
    // recover the option that has been chosen
    posts = !posts;
    plot()
  })

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

function fill_glow() {
  d3.select("#global").style("text-decoration-color", teams_colors[selectedTeam.replaceAll("-", " ")]).style("filter", "url(#glow)");
  d3.select("#player_stats").style("text-decoration-color", teams_colors[selectedTeam.replaceAll("-", " ")]).style("filter", "url(#glow)");
  d3.select("#go_back").style("text-decoration-color", teams_colors[selectedTeam.replaceAll("-", " ")]).style("filter", "url(#glow)");
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
  d3.select("#defending_title").style("filter", "url(#glow)");
  d3.select("#minutes").style("filter", "url(#glow)");
  d3.select("#goals").style("filter", "url(#glow)");
  d3.select("#assists").style("filter", "url(#glow)");
  d3.select("#actions").style("filter", "url(#glow)");
  d3.select("#shots").style("filter", "url(#glow)");
}

function get_player_id() {
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {

    data = data.filter(item => item["name"] === selectedPlayer)[0]
    selectedPlayerId = Number(data["playerId"])
    selected_fotmob_player_id = Number(data["fotmob_player_id"])
    console.log(data)

  })
}

function change_mode(string) {
  if (string == "percentile") d3.select("#per_90").style("background-color", teams_colors[selectedTeam] + "00")
  else d3.select("#percentile").style("background-color", teams_colors[selectedTeam] + "00")

  d3.select("#" + string).style("background-color", teams_colors[selectedTeam])

  selectedMode = string;
  stats()
}

function change_plot_mode(string) {
  if (string == "actions") d3.select("#shots").style("background-color", teams_colors[selectedTeam] + "00")
  else d3.select("#actions").style("background-color", teams_colors[selectedTeam] + "00")

  d3.select("#" + string).style("background-color", teams_colors[selectedTeam])

  selected_plot_mode = string
  init()
}

function init_selects() {
  if (once == false) {

    d3.select("#selectSeason").on("change", function (d) {
      // recover the option that has been chosen
      selectedSeason = d3.select(this).property("value");

      if (selectedSeason == "21-22") {
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


    d3.select("#selectTeam").on("change", function (d) {
      // recover the option that has been chosen
      selectedTeam = d3.select(this).property("value")
      document.getElementById("image_logo").src = "data/" + selectedSeason + "/" + selectedTeam.replaceAll(" ", "-") + ".png";
      d3.select("div#background_div").style("background", "url(../data/" + selectedSeason + "/estadio_" + selectedTeam.replaceAll(" ", "-") + ".jpg)").style("opacity", 0.2)
      d3.select("#selectSeason").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#selectTeam").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#selectPlayer").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#rectangle").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#rectangle_1").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#actions").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#shots").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#stats").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#a1").style("outline", "1.5px solid " + teams_colors[selectedTeam])
      d3.select("#percentile").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#per_90").style("border", "2px solid " + teams_colors[selectedTeam])
      d3.select("#global").style("text-decoration-color", teams_colors[selectedTeam]).style("filter", "url(#glow)");
      d3.select("#player_stats").style("text-decoration-color", teams_colors[selectedTeam]).style("filter", "url(#glow)");
      d3.select("#go_back").style("text-decoration-color", teams_colors[selectedTeam]).style("filter", "url(#glow)");
      init_selects()
      get_player_id()
      stats()
      plot()
    })

    d3.select("#selectPlayer").on("change", function (d) {
      // recover the option that has been chosen
      selectedPlayer = d3.select(this).property("value")
      init_selects()
      get_player_id()
      stats()
      plot()
    })

    d3.select("#selectSeason").property("value", selectedSeason)

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

  d3.select("#selectTeam").property("value", selectedTeam)

  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {
    data = data.map(function (d) { if (d.team == selectedTeam.replaceAll(" ", "-")) return d.name; }).filter(item => item !== undefined).filter(item => item !== "").sort()

    d3.select("#selectPlayer")
      .selectAll('myOptions')
      .data(data)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })

    d3.select("#selectPlayer").property("value", selectedPlayer)
  })

  once = true
}

function stats() {
  passing_stats()
  creation_stats()
  carry_stats()
  shooting_stats()
  defending_stats()
  basic_stats()
}

function basic_stats() {

  d3.csv("data/" + selectedSeason + "/calcs.csv").then((dataset) => {
    console.log(selectedPlayerId)

    dataset = dataset.map(o => new Object({ name: o.name, playerId: Number(o.playerId), minutes: Number(o.minutes), goals: Number(o.Goals), assists: Number(o.Assists) }))
    player = dataset.filter(item => item["playerId"] === Number(selectedPlayerId))[0]

    console.log(player)

    document.getElementById('minutes').textContent = "Minutes " + player["minutes"]
    document.getElementById('goals').textContent = "Goals " + player["goals"]
    document.getElementById('assists').textContent = "Assists " + player["assists"]
  })

}

function get_percentile(data, stat) {

  data_temp = structuredClone(data)

  data_temp = data_temp.filter(item => item["minutes"] > minutes_treshold)

  data_temp = data_temp.map(o => new Object({ name: o.name, playerId: Number(o.playerId), minutes: Number(o.minutes), stat: Number((o[stat] * 90) / o.minutes) }))

  player = data_temp.filter(item => item["playerId"] === selectedPlayerId)[0]

  below = data_temp.filter(item => item.stat < player.stat)

  percentile = ((below.length / data_temp.length) * 100)

  if (percentile.toFixed(0) == 100) percentile = 99
  else if (percentile.toFixed(0) == 0) percentile = 1

  return [percentile, player["stat"]]

}

function append_rect(svg, x, y, height, width, color, opacity) {
  svg
    .append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("rx", 5)
    .attr("height", height)
    .style("stroke", "white")
    .style("stroke-width", "2px")
    .style("filter", "url(#glow)")
    .style("fill", color)
    .attr("width", width)
    .style("opacity", opacity)
}

function append_text(svg, x, y, text, color, fontSize, weight) {
  svg
    .append("text")
    .attr("x", x)
    .attr("y", y)
    .attr("dx", "0%")
    .style("filter", "url(#glow)")
    .style("fill", color)
    .style("font-weight", weight)
    .style("font-size", String(fontSize * 100) + "%")
    .text(text);
}

function creation_stats() {
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

    if (window.innerWidth > 1400) {
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom

      header_coords = [55, 150, 258, 428]
      text_coords = [20, 145, 275, 395]
      font_size = 0.9
      stats_font_size = 4.5

      y_coords = 85

      window_tax = 11
    }
    else if (window.innerWidth > 1200) {
      var height = 30 + margin.top + margin.bottom
      var width = 285 + margin.left + margin.right

      header_coords = [35, 97, 165, 275]
      text_coords = [18, 100, 180, 260]

      font_size = 0.6
      stats_font_size = 2.5

      y_coords = 60

      window_tax = 6
    }
    else {
      var height = 70 + margin.top + margin.bottom
      var width = 235 + margin.left + margin.right

      header_coords = [30, 83, 142, 235]
      text_coords = [10, 80, 150, 217]

      font_size = 0.5
      stats_font_size = 2.5

      y_coords = 85

      window_tax = 6
    }

    d3.select("div#creation").select("svg").remove();
    const svg = d3
      .select("div#creation")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    create_glow(svg)

    /*
    append_rect(svg,0,0,height,width/4,d3.interpolateRdYlGn(xA[0]*0.01),1)
    append_rect(svg,width/4,0,height,width/4,d3.interpolateRdYlGn(key_passes[0]*0.01),1)
    append_rect(svg,width*2/4,0,height,width/4,d3.interpolateRdYlGn(chances_created[0]*0.01),1)
    append_rect(svg,width*3/4,0,height,width/4,d3.interpolateRdYlGn(xT[0]*0.01),1)
    */

    append_rect(svg, 0, 0, height, width / 4, teams_colors[selectedTeam], xA[0] * 0.01)
    append_rect(svg, width / 4, 0, height, width / 4, teams_colors[selectedTeam], key_passes[0] * 0.01)
    append_rect(svg, width * 2 / 4, 0, height, width / 4, teams_colors[selectedTeam], chances_created[0] * 0.01)
    append_rect(svg, width * 3 / 4, 0, height, width / 4, teams_colors[selectedTeam], xT[0] * 0.01)

    append_text(svg, header_coords[0], 20, "xA", "white", font_size)
    append_text(svg, header_coords[1], 20, "Key Passes", "white", font_size)
    append_text(svg, header_coords[2], 20, "Chances Created", "white", font_size)
    append_text(svg, header_coords[3], 20, "xT", "white", font_size)

    if (selectedMode == "percentile") {
      append_text(svg, text_coords[0], y_coords, String(xA[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1], y_coords, String(key_passes[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2], y_coords, String(chances_created[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[3], y_coords, String(xT[0].toFixed(0)), "white", stats_font_size, "bold")
    }
    else {
      append_text(svg, text_coords[0] - window_tax, y_coords, String(xA[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1] - window_tax, y_coords, String(key_passes[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2] - window_tax, y_coords, String(chances_created[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[3] - window_tax, y_coords, String(xT[1].toFixed(1)), "white", stats_font_size, "bold")
    }




  }).catch(e => {
    creation_stats()
  });
}

function passing_stats() {
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

    if (window.innerWidth > 1400) {
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom

      header_coords = [15, 185, 347]
      text_coords = [45, 210, 375]
      font_size = 1
      stats_font_size = 4.5
      y_coords = 85

      window_tax = 25
    }
    else if (window.innerWidth > 1200) {
      var height = 30 + margin.top + margin.bottom
      var width = 285 + margin.left + margin.right

      header_coords = [5, 120, 225]
      text_coords = [30, 140, 245]

      font_size = 0.7
      stats_font_size = 2.5
      y_coords = 60

      window_tax = 17
    }
    else {
      var height = 70 + margin.top + margin.bottom
      var width = 235 + margin.left + margin.right

      header_coords = [10, 105, 195]
      text_coords = [23, 115, 205]

      font_size = 0.5
      stats_font_size = 2.5
      y_coords = 85

      window_tax = 17
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

    append_rect(svg, 0, 0, height, width / 3, teams_colors[selectedTeam], prog_passing[0] * 0.01)
    append_rect(svg, width / 3, 0, height, width / 3, teams_colors[selectedTeam], final_third_passes[0] * 0.01)
    append_rect(svg, width * 2 / 3, 0, height, width / 3, teams_colors[selectedTeam], penalty_box_passes[0] * 0.01)

    append_text(svg, header_coords[0], 20, "Progressive Passes", "white", font_size)
    append_text(svg, header_coords[1], 20, "Final Third Passes", "white", font_size)
    append_text(svg, header_coords[2], 20, "Penalty Box Passes", "white", font_size)

    if (selectedMode == "percentile") {
      append_text(svg, text_coords[0], y_coords, String(prog_passing[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1], y_coords, String(final_third_passes[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2], y_coords, String(penalty_box_passes[0].toFixed(0)), "white", stats_font_size, "bold")
    }
    else {
      append_text(svg, text_coords[0] - window_tax, y_coords, String(prog_passing[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1] - window_tax, y_coords, String(final_third_passes[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2] - window_tax, y_coords, String(penalty_box_passes[1].toFixed(1)), "white", stats_font_size, "bold")
    }




  }).catch(e => {
    passing_stats()
  });
}

function carry_stats() {
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data) => {


    var prog_carries = get_percentile(data, "prog_carries")
    final_third_entries = get_percentile(data, "final_third_entries")
    penalty_box_entries = get_percentile(data, "penalty_box_entries")


    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }

    if (window.innerWidth > 1400) {
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom

      header_coords = [15, 185, 347]
      text_coords = [45, 210, 375]
      font_size = 1
      stats_font_size = 4.5
      y_coords = 85

      window_tax = 25
    }
    else if (window.innerWidth > 1200) {
      var height = 30 + margin.top + margin.bottom
      var width = 285 + margin.left + margin.right

      header_coords = [5, 120, 225]
      text_coords = [30, 140, 245]

      font_size = 0.7
      stats_font_size = 2.5
      y_coords = 60

      window_tax = 17
    }
    else {
      var height = 70 + margin.top + margin.bottom
      var width = 235 + margin.left + margin.right

      header_coords = [10, 105, 195]
      text_coords = [23, 115, 205]

      font_size = 0.5
      stats_font_size = 2.5
      y_coords = 85

      window_tax = 17
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

    append_rect(svg, 0, 0, height, width / 3, teams_colors[selectedTeam], prog_carries[0] * 0.01)
    append_rect(svg, width / 3, 0, height, width / 3, teams_colors[selectedTeam], final_third_entries[0] * 0.01)
    append_rect(svg, width * 2 / 3, 0, height, width / 3, teams_colors[selectedTeam], penalty_box_entries[0] * 0.01)

    append_text(svg, header_coords[0], 20, "Progressive Carries", "white", font_size)
    append_text(svg, header_coords[1], 20, "Final Third Entries", "white", font_size)
    append_text(svg, header_coords[2], 20, "Penalty Box Entries", "white", font_size)

    if (selectedMode == "percentile") {
      append_text(svg, text_coords[0], y_coords, String(prog_carries[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1], y_coords, String(final_third_entries[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2], y_coords, String(penalty_box_entries[0].toFixed(0)), "white", stats_font_size, "bold")
    }
    else {
      append_text(svg, text_coords[0] - window_tax, y_coords, String(prog_carries[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1] - window_tax, y_coords, String(final_third_entries[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2] - window_tax, y_coords, String(penalty_box_entries[1].toFixed(1)), "white", stats_font_size, "bold")
    }




  }).catch(e => {
    carry_stats()
  });
}

function shooting_stats() {
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data_shooting) => {


    xG = get_percentile(data_shooting, "xG")
    xGOT = get_percentile(data_shooting, "xGOT")
    shots = get_percentile(data_shooting, "Shots")


    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }

    if (window.innerWidth > 1400) {
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom

      header_coords = [80, 235, 395]
      text_coords = [45, 210, 375]
      font_size = 1
      stats_font_size = 4.5
      y_coords = 85

      window_tax = 25
    }
    else if (window.innerWidth > 1200) {
      var height = 30 + margin.top + margin.bottom
      var width = 285 + margin.left + margin.right

      header_coords = [47, 150, 255]
      text_coords = [30, 140, 245]

      font_size = 0.7
      stats_font_size = 2.5
      y_coords = 60

      window_tax = 17
    }
    else {
      var height = 70 + margin.top + margin.bottom
      var width = 235 + margin.left + margin.right

      header_coords = [10, 105, 195]
      text_coords = [23, 115, 205]

      font_size = 0.5
      stats_font_size = 2.5
      y_coords = 85

      window_tax = 17
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

    append_rect(svg, 0, 0, height, width / 3, teams_colors[selectedTeam], xG[0] * 0.01)
    append_rect(svg, width / 3, 0, height, width / 3, teams_colors[selectedTeam], xGOT[0] * 0.01)
    append_rect(svg, width * 2 / 3, 0, height, width / 3, teams_colors[selectedTeam], shots[0] * 0.01)


    if (selectedMode == "percentile") {
      append_text(svg, text_coords[0], y_coords, String(xG[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1], y_coords, String(xGOT[0].toFixed(0)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2], y_coords, String(shots[0].toFixed(0)), "white", stats_font_size, "bold")
    }
    else {
      append_text(svg, text_coords[0] - window_tax, y_coords, String(xG[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[1] - window_tax, y_coords, String(xGOT[1].toFixed(1)), "white", stats_font_size, "bold")
      append_text(svg, text_coords[2] - window_tax, y_coords, String(shots[1].toFixed(1)), "white", stats_font_size, "bold")
    }

    append_text(svg, header_coords[0], 20, "xG", "white", font_size)
    append_text(svg, header_coords[1], 20, "xGOT", "white", font_size)
    append_text(svg, header_coords[2], 20, "Shots", "white", font_size)





  }).catch(e => {
    shooting_stats()
  });
}

function defending_stats() {
  d3.csv("data/" + selectedSeason + "/calcs.csv").then((data_defending) => {

    def_actions = get_percentile(data_defending, "defensive_actions")


    var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }

    if (window.innerWidth > 1400) {
      var width = 460 + margin.left + margin.right
      var height = 70 + margin.top + margin.bottom

      header_coords = 185
      text_coords = 210
      font_size = 1
      stats_font_size = 4.5

      y_coords = 85

      window_tax = 25
    }
    else if (window.innerWidth > 1200) {
      var height = 30 + margin.top + margin.bottom
      var width = 285 + margin.left + margin.right

      header_coords = 115
      text_coords = 135

      font_size = 0.7
      stats_font_size = 2.5
      y_coords = 60

      window_tax = 17
    }
    else {
      var height = 70 + margin.top + margin.bottom
      var width = 235 + margin.left + margin.right

      header_coords = 105
      text_coords = 115

      font_size = 0.5
      stats_font_size = 2.5

      y_coords = 85

      window_tax = 17
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
    append_rect(svg, 0, 0, height, width, teams_colors[selectedTeam], def_actions[0] * 0.01)

    if (selectedMode == "percentile") {
      append_text(svg, text_coords, y_coords, String(def_actions[0].toFixed(0)), "white", stats_font_size, "bold")
    }
    else {
      append_text(svg, text_coords - window_tax, y_coords, String(def_actions[1].toFixed(1)), "white", stats_font_size, "bold")
    }


    append_text(svg, header_coords, 20, "Defensive Actions", "white", font_size)





  }).catch(e => {
    defending_stats()
  });
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

function get_data(dataset, type, outcome, progressive) {

  temp = structuredClone(dataset)


  temp = temp.filter(item => Number(item["playerId"]) === selectedPlayerId)

  if (Array.isArray(type)) {
    temp = temp.filter(item => type.includes(item["type"]))
  }
  else {
    temp = temp.filter(item => item["type"] === type)
  }

  if (outcome != null) temp = temp.filter(item => item["outcomeType"] === outcome)

  if (progressive != null) temp = temp.filter(item => item["progressive"] === progressive)

  console.log(temp)

  return temp

}

function plot_lines(svg, data, pitchMultiplier, mode) {
  var lineWidth = 1.8
  svg.selectAll('.progressiveLines')
    .data(data)
    .enter().append("line")
    .attr("id", "progressive")
    .attr("x1", function (d) {
      if (mode) return (68 - Number(d.y)) * pitchMultiplier
      else return (Number(d.x)) * pitchMultiplier
    })
    .attr("y1", function (d) {
      if (mode) return (105 - Number(d.x)) * pitchMultiplier
      else return (68 - Number(d.y)) * pitchMultiplier
    })
    .attr("x2", function (d) {
      if (mode) return (68 - Number(d.endY)) * pitchMultiplier
      else return (Number(d.endX)) * pitchMultiplier
    })
    .attr("y2", function (d) {
      if (mode) return (105 - Number(d.endX)) * pitchMultiplier
      else return (68 - Number(d.endY)) * pitchMultiplier
    })
    .style("filter", "url(#glow)")
    .attr("stroke", "white")
    .attr("stroke-width", lineWidth)
}

function plot_circles(svg, data, color, pitchMultiplier, mode) {
  var lineWidth = 1.8

  if (window.innerWidth < 800) r = 4
  else r = 7

  svg.selectAll('.progressiveCircles')
    .data(data)
    .enter().append('circle')
    .attr("id", "progressive")
    .attr('cx', function (d) {
      if (mode) return (68 - Number(d.endY)) * pitchMultiplier
      else return (Number(d.endX)) * pitchMultiplier
    })
    .attr('cy', function (d) {
      if (mode) return (105 - Number(d.endX)) * pitchMultiplier
      else return (68 - Number(d.endY)) * pitchMultiplier
    })
    .attr('r', r)
    .style('stroke-width', lineWidth)
    .style("filter", "url(#glow)")
    .style('stroke', color)
    .style('fill', "#2a2e30")
    .style("fill-opacity", 1)
}

function plot_def_actions(svg, data, color, pitchMultiplier, mode) {
  svg.selectAll('.progressiveCircles')
    .data(data)
    .enter().append('circle')
    .attr("id", "progressive")
    .attr("cx", function (d) {
      if (mode) return (68 - Number(d.y)) * pitchMultiplier
      else return (Number(d.x)) * pitchMultiplier
    })
    .attr("cy", function (d) {
      if (mode) return (105 - Number(d.x)) * pitchMultiplier
      else return (68 - Number(d.y)) * pitchMultiplier
    })
    .attr('r', 5)
    .style("filter", "url(#glow)")
    .style('fill', color)
    .style("fill-opacity", function (d) {
      if (d.outcomeType == "Successful") return 0.7
      else return 0.2
    })
}

function plot_goal(event, d) {
  d3.select("div#tooltip_shots").select("svg").remove()

  d3.select("div#tooltip_shots").transition()
    .duration(200)
    .style("opacity", 1).style("visibility", "visible");

  if (window.innerWidth < 800) {
    d3.select("div#tooltip_shots").style("left", event.x - 100 + "px")
      .style("top", event.y + "px").style("border", "2px solid " + teams_colors[selectedTeam]);
  }
  else
    d3.select("div#tooltip_shots").style("left", event.x - 500 + "px")
      .style("top", event.y - 140 + "px").style("border", "2px solid " + teams_colors[selectedTeam]);

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
        if (d.eventType == "Goal") return "#55DD31"
        else if (d.eventType == "AttemptSaved") return "#DD9131"
        else if (d.eventType == "Post") return "#31B1DD"
        else return "red"
      })
  }
  else event = "Blocked"

  var string2 = "Player: " + d.playerName
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
      .style("stroke", teams_colors[selectedTeam])
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
  append_text(svg, 6.6, string4 + " - " + String(d.expectedGoalsOnTarget).substring(0, 4) + " xGOT")

}

function plot_shot_circles(svg, data, color, pitchMultiplier, mode) {

  var lineWidth = 1.8

  function handleMouseOver(event, d) {

    d3.select(this).style("cursor", "pointer")
    svg.selectAll('line#remove')
      .remove()

    svg.selectAll('.progressiveLines')
      .data([d])
      .enter().append("line")
      .attr("id", "remove")
      .attr("x1", function (d) {
        if (mode) return (68 - Number(d.y)) * pitchMultiplier
        else return (Number(d.x)) * pitchMultiplier
      })
      .attr("y1", function (d) {
        if (mode) return (105 - Number(d.x)) * pitchMultiplier
        else return (68 - Number(d.y)) * pitchMultiplier
      })
      .attr("y2", d => {
        if (mode) {
          if (d.blockedX == "") return (105 - 105) * pitchMultiplier
          else return (105 - Number(d.blockedX)) * pitchMultiplier
        }
        else {
          if (d.blockedY == "") return (68 - Number(d.goalCrossedY)) * pitchMultiplier
          else return (68 - Number(d.blockedY)) * pitchMultiplier
        }
      })
      .attr("x2", d => {
        if (mode) {
          if (d.blockedY == "") return (68 - Number(d.goalCrossedY)) * pitchMultiplier
          else return (68 - Number(d.blockedY)) * pitchMultiplier
        }
        else {
          if (d.blockedX == "") {
            return 105 * pitchMultiplier
          }
          else return (Number(d.blockedX)) * pitchMultiplier
        }
      })
      .style("filter", "url(#glow)")
      .attr("stroke", "white")
      .style("stroke-width", 2)
      .style("stroke-opacity", 1)
      .attr("stroke-width", lineWidth)
      .attr("marker-end", "url(#triangle3)");
  }

  function handleMouseLeave(event, d) {
    svg.selectAll('line#remove')
      .remove()
  }

  svg.selectAll('.progressiveCircles')
    .data(data)
    .enter().append('circle')
    .attr("cx", function (d) {
      if (mode) return (68 - Number(d.y)) * pitchMultiplier
      else return (Number(d.x)) * pitchMultiplier
    })
    .attr("cy", function (d) {
      if (mode) return (105 - Number(d.x)) * pitchMultiplier
      else return (68 - Number(d.y)) * pitchMultiplier
    })
    .attr('r', d => 30 * d.expectedGoals)
    .on("click", plot_goal)
    .on("mouseover", handleMouseOver)
    .on("mouseleave", handleMouseLeave)
    .style('stroke-width', 0.5)
    .style('stroke', "white")
    .style("filter", "url(#glow)")
    .style('fill', color)
    .style("fill-opacity", 1)
}

function plot() {

  lineColor = "#757272"
  var lineWidth = 1.8
  pitchColor = "#eee"
  pitchWidth = 68
  pitchHeight = 105
  var margin = { top: 10, right: 9, bottom: 0, left: 20 }

  if (window.innerWidth > 1400) {
    var width = 920
    var height = 570
    var pitchMultiplier = 8.5
  }
  else if (window.innerWidth > 1200) {
    var width = 710
    var height = 430
    var pitchMultiplier = 6.5
  }
  else {
    svg_pitch = plot_for_smartphone()

    createTriangle(svg_pitch, "triangle3", 0.8)
    createTriangle(svg_pitch, "triangle2", 0.3)

    check_conditions(svg_pitch, 3.8, true)
    return 0;

  }

  getPitchLines = [{ "x1": 0, "x2": 16.5, "y1": 13.85, "y2": 13.85 }, { "x1": 16.5, "x2": 16.5, "y1": 13.85, "y2": 54.15 }, { "x1": 0, "x2": 16.5, "y1": 54.15, "y2": 54.15 }, { "x1": 0, "x2": 5.5, "y1": 24.85, "y2": 24.85 }, { "x1": 5.5, "x2": 5.5, "y1": 24.85, "y2": 43.15 }, { "x1": 0, "x2": 5.5, "y1": 43.15, "y2": 43.15 }, { "x1": 88.5, "x2": 105, "y1": 13.85, "y2": 13.85 }, { "x1": 88.5, "x2": 88.5, "y1": 13.85, "y2": 54.15 }, { "x1": 88.5, "x2": 105, "y1": 54.15, "y2": 54.15 }, { "x1": 99.5, "x2": 105, "y1": 24.85, "y2": 24.85 }, { "x1": 99.5, "x2": 99.5, "y1": 24.85, "y2": 43.15 }, { "x1": 99.5, "x2": 105, "y1": 43.15, "y2": 43.15 }, { "x1": 0, "x2": 105, "y1": 0, "y2": 0 }, { "x1": 0, "x2": 105, "y1": 68, "y2": 68 }, { "x1": 0, "x2": 0, "y1": 0, "y2": 68 }, { "x1": 105, "x2": 105, "y1": 0, "y2": 68 }, { "x1": 52.5, "x2": 52.5, "y1": 0, "y2": 68 }, { "x1": -1.5, "x2": -1.5, "y1": 30.34, "y2": 37.66 }, { "x1": -1.5, "x2": 0, "y1": 30.34, "y2": 30.34 }, { "x1": -1.5, "x2": 0, "y1": 37.66, "y2": 37.66 }, { "x1": 106.5, "x2": 106.5, "y1": 30.34, "y2": 37.66 }, { "x1": 0, "x2": -1.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 37.66, "y2": 37.66 }]
  getPitchCircles = [{ "cy": 34, "cx": 52.5, "r": 9.15, "color": "none" }, { "cy": 34, "cx": 11, "r": 0.3, "color": "#000" }, { "cy": 34, "cx": 94, "r": 0.3, "color": "#000" }, { "cy": 34, "cx": 52.5, "r": 0.3, "color": "#000" }]
  getArcs = [{ "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 1.5707963267948966, "endAngle": 3.141592653589793 }, "x": 0, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 4.7124, "endAngle": 3.1416 }, "x": 0, "y": 105 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 0, "endAngle": 1.5708 }, "x": 68, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 6.283185307179586, "endAngle": 4.71238898038469 }, "x": 68, "y": 105 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 0.652123807105081, "endAngle": 2.489468846484712 }, "x": 34, "y": 11.5 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": -0.652123807105081, "endAngle": -2.489468846484712 }, "x": 34, "y": 94 }]

  d3.select("div#plot").select("svg").remove();
  const svg = d3.select("div#plot").append("svg")
    .attr("height", height + margin.left + margin.right)
    .attr("width", width + margin.top + margin.bottom)
  //.attr("style", "outline: thin solid red;") ;

  const pitch = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`)

  pitch.append('rect')
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr('height', height + margin.left + margin.right)
    .attr('width', width + margin.top + margin.bottom)
    .style('fill', pitchColor)
    .style("opacity", "0")

  const pitchLineData = getPitchLines;
  pitch.selectAll('.pitchLines')
    .data(pitchLineData)
    .enter().append('line')
    .attr('x1', d => d['x1'] * pitchMultiplier)
    .attr('x2', d => d['x2'] * pitchMultiplier)
    .attr('y1', d => d['y1'] * pitchMultiplier)
    .attr('y2', d => d['y2'] * pitchMultiplier)
    .style('stroke-width', lineWidth)
    .style('stroke', lineColor)
    .style("stroke-dasharray", ("0,0"));

  const pitchCircleData = getPitchCircles;
  pitch.selectAll('.pitchCircles')
    .data(pitchCircleData)
    .enter().append('circle')
    .attr('cx', d => d['cx'] * pitchMultiplier)
    .attr('cy', d => d['cy'] * pitchMultiplier)
    .attr('r', d => d['r'] * pitchMultiplier)
    .style('stroke-width', lineWidth)
    .style('stroke', lineColor)
    .style('fill', d => d['color'])
    .style("stroke-dasharray", ("0,0"));

  const pitchArcData = getArcs;
  const arc = d3.arc();
  pitch.selectAll('.pitchCorners')
    .data(pitchArcData)
    .enter().append('path')
    .attr('d', d => arc(d['arc']))
    .attr('transform', d => `translate(${pitchMultiplier * d.y},${pitchMultiplier * d.x})`)
    .style('fill', "none")
    .style('stroke', lineColor)
    .style("stroke-dasharray", ("0,0"));

  createTriangle(pitch, "triangle3", 0.8)
  createTriangle(pitch, "triangle2", 0.3)

  check_conditions(pitch, pitchMultiplier, false)

}

function check_conditions(pitch, pitchMultiplier, mode) {
  var lineWidth = 1.8

  if (selected_plot_mode == "actions") {
    d3.csv("data/" + selectedSeason + "/" + selectedTeam.replaceAll(" ", "-") + "/events_" + selectedTeam.replaceAll(" ", "-") + ".csv").then((events) => {
      if (all_passes) {
        if (prog_passes) passes = get_data(events, "Pass", "Successful", "False")
        else passes = get_data(events, "Pass", "Successful", null)

        pitch.selectAll('.progressiveLines')
          .data(passes)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", function (d) {
            if (mode) return (68 - Number(d.y)) * pitchMultiplier
            else return (Number(d.x)) * pitchMultiplier
          })
          .attr("y1", function (d) {
            if (mode) return (105 - Number(d.x)) * pitchMultiplier
            else return (68 - Number(d.y)) * pitchMultiplier
          })
          .attr("x2", function (d) {
            if (mode) return (68 - Number(d.endY)) * pitchMultiplier
            else return (Number(d.endX)) * pitchMultiplier
          })
          .attr("y2", function (d) {
            if (mode) return (105 - Number(d.endX)) * pitchMultiplier
            else return (68 - Number(d.endY)) * pitchMultiplier
          })
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");

      }

      if (prog_passes) {
        console.log(selectedPlayer)
        console.log(selectedPlayerId)
        passes = get_data(events, "Pass", "Successful", "True")
        console.log(passes)
        plot_lines(pitch, passes, pitchMultiplier, mode)
        plot_circles(pitch, passes, teams_colors[selectedTeam], pitchMultiplier, mode)
      }

      if (unsuc_passes) {
        passes = get_data(events, "Pass", "Unsuccessful", null)
        pitch.selectAll('.progressiveLines')
          .data(passes)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", function (d) {
            if (mode) return (68 - Number(d.y)) * pitchMultiplier
            else return (Number(d.x)) * pitchMultiplier
          })
          .attr("y1", function (d) {
            if (mode) return (105 - Number(d.x)) * pitchMultiplier
            else return (68 - Number(d.y)) * pitchMultiplier
          })
          .attr("x2", function (d) {
            if (mode) return (68 - Number(d.endY)) * pitchMultiplier
            else return (Number(d.endX)) * pitchMultiplier
          })
          .attr("y2", function (d) {
            if (mode) return (105 - Number(d.endX)) * pitchMultiplier
            else return (68 - Number(d.endY)) * pitchMultiplier
          })
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.1)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle2)");
      }

      if (all_carries) {
        if (prog_carries) carries = get_data(events, "Carry", null, "False")
        else carries = get_data(events, "Carry", null, null)

        pitch.selectAll('.progressiveLines')
          .data(carries)
          .enter().append("line")
          .attr("id", "progressive")
          .attr("x1", function (d) {
            if (mode) return (68 - Number(d.y)) * pitchMultiplier
            else return (Number(d.x)) * pitchMultiplier
          })
          .attr("y1", function (d) {
            if (mode) return (105 - Number(d.x)) * pitchMultiplier
            else return (68 - Number(d.y)) * pitchMultiplier
          })
          .attr("x2", function (d) {
            if (mode) return (68 - Number(d.endY)) * pitchMultiplier
            else return (Number(d.endX)) * pitchMultiplier
          })
          .attr("y2", function (d) {
            if (mode) return (105 - Number(d.endX)) * pitchMultiplier
            else return (68 - Number(d.endY)) * pitchMultiplier
          })
          .style("filter", "url(#glow)")
          .attr("stroke", "white")
          .style("stroke-opacity", 0.8)
          .attr("stroke-width", lineWidth)
          .attr("marker-end", "url(#triangle3)");

      }

      if (prog_carries) {
        carries = get_data(events, "Carry", null, "True")
        plot_lines(pitch, carries, pitchMultiplier, mode)
        plot_circles(pitch, carries, "#48EDDB", pitchMultiplier, mode)
      }

      if (all_touches) {
        touches = get_data(events, ["Carry", "Pass", "Aerial", "BallTouch", "BallRecovery", "Interception", "Tackle", "BlockedPass", "Clearance", "MissedShots", "ShotOnPost", "Goal", "SavedShot", "TakeOn"], null, null)

        const h = pitch
          .append("path")
          .style("stroke", "white")
          .style("fill-opacity", "0.2")
          .style("fill", teams_colors[selectedTeam]);

        if (mode) points = touches.map(o => new Object({ x: (105 - Number(o.x)) * pitchMultiplier, y: (68 - Number(o.y)) * pitchMultiplier }))
        else points = touches.map(o => new Object({ x: Number(o.x) * pitchMultiplier, y: (68 - Number(o.y)) * pitchMultiplier }))

        array = []
        for (i = 0; i < points.length; i++) {
          if (mode) array.push([points[i].y, points[i].x])
          else array.push([points[i].x, points[i].y])
        }

        hull = d3.polygonHull(array)

        for (let i = 2; i <= hull.length; i++) {
          const visible = hull.slice(0, i);
          h.attr("d", `M${visible.join("L")}Z`);
        }

        circles = pitch.selectAll('.progressiveCircles')
          .data(touches)
          .enter().append('circle')
          .attr("id", "progressive")
          .attr("cx", function (d) {
            if (mode) return (68 - Number(d.y)) * pitchMultiplier
            else return (Number(d.x)) * pitchMultiplier
          })
          .attr("cy", function (d) {
            if (mode) return (105 - Number(d.x)) * pitchMultiplier
            else return (68 - Number(d.y)) * pitchMultiplier
          })
          .attr('r', 5)
          .style('stroke-width', 1)
          .style("filter", "url(#glow)")
          .style('stroke', teams_colors[selectedTeam])
          .style('fill', "white")
          .style("fill-opacity", function (d) {
            if (d.outcomeType == "Successful") return 0.5
            else return 0.2
          })
          .style("stroke-opacity", function (d) {
            if (d.outcomeType == "Successful") return 0.7
            else return 0.2
          })

      }

      if (ball_recoveries) {
        touches = get_data(events, "BallRecovery", null, null)
        plot_def_actions(pitch, touches, "#42DC60", pitchMultiplier, mode)
      }

      if (blocked_passes) {
        touches = get_data(events, "BlockedPass", null, null)
        plot_def_actions(pitch, touches, "#42DCD5", pitchMultiplier, mode)
      }

      if (interceptions) {
        touches = get_data(events, "Interception", null, null)
        plot_def_actions(pitch, touches, "red", pitchMultiplier, mode)
      }

      if (clearances) {
        touches = get_data(events, "Clearance", null, null)
        plot_def_actions(pitch, touches, "#D047D6", pitchMultiplier, mode)
      }

      if (tackles) {
        touches = get_data(events, "Tackle", null, null)
        plot_def_actions(pitch, touches, "#E38A18", pitchMultiplier, mode)
      }

    })
  }
  else {
    d3.csv("data/" + selectedSeason + "/allShotsLigaBwin" + selectedSeason.replaceAll("-", "") + ".csv").then((data) => {

      data_temp = structuredClone(data)
      data_temp = data_temp.filter(item => Number(item["playerId"]) === selected_fotmob_player_id)

      if (goals) {
        goals = data_temp.filter(item => item["eventType"] === "Goal")
        plot_shot_circles(pitch, goals, "#55DD31", pitchMultiplier, mode)
      }

      if (attempt_saved) {
        attempts = data_temp.filter(item => item["eventType"] === "AttemptSaved")
        plot_shot_circles(pitch, attempts, "#DD9131", pitchMultiplier, mode)
      }

      if (misses) {
        miss = data_temp.filter(item => item["eventType"] === "Miss")
        plot_shot_circles(pitch, miss, "#DD3131", pitchMultiplier, mode)
      }

      if (posts) {
        post = data_temp.filter(item => item["eventType"] === "Post")
        plot_shot_circles(pitch, post, "#31B1DD", pitchMultiplier, mode)
      }


    }
    )

  }
}

function plot_for_smartphone() {

  lineColor = "#757272"
  var lineWidth = 1.8
  pitchColor = "#eee"
  pitchWidth = 68
  pitchHeight = 105
  var margin = { top: 10, right: 9, bottom: 0, left: 20 }

  var width = 420
  var height = 260
  var pitchMultiplier = 3.8

  getPitchLines = [{ "x1": 0, "x2": 16.5, "y1": 13.85, "y2": 13.85 }, { "x1": 16.5, "x2": 16.5, "y1": 13.85, "y2": 54.15 }, { "x1": 0, "x2": 16.5, "y1": 54.15, "y2": 54.15 }, { "x1": 0, "x2": 5.5, "y1": 24.85, "y2": 24.85 }, { "x1": 5.5, "x2": 5.5, "y1": 24.85, "y2": 43.15 }, { "x1": 0, "x2": 5.5, "y1": 43.15, "y2": 43.15 }, { "x1": 88.5, "x2": 105, "y1": 13.85, "y2": 13.85 }, { "x1": 88.5, "x2": 88.5, "y1": 13.85, "y2": 54.15 }, { "x1": 88.5, "x2": 105, "y1": 54.15, "y2": 54.15 }, { "x1": 99.5, "x2": 105, "y1": 24.85, "y2": 24.85 }, { "x1": 99.5, "x2": 99.5, "y1": 24.85, "y2": 43.15 }, { "x1": 99.5, "x2": 105, "y1": 43.15, "y2": 43.15 }, { "x1": 0, "x2": 105, "y1": 0, "y2": 0 }, { "x1": 0, "x2": 105, "y1": 68, "y2": 68 }, { "x1": 0, "x2": 0, "y1": 0, "y2": 68 }, { "x1": 105, "x2": 105, "y1": 0, "y2": 68 }, { "x1": 52.5, "x2": 52.5, "y1": 0, "y2": 68 }, { "x1": -1.5, "x2": -1.5, "y1": 30.34, "y2": 37.66 }, { "x1": -1.5, "x2": 0, "y1": 30.34, "y2": 30.34 }, { "x1": -1.5, "x2": 0, "y1": 37.66, "y2": 37.66 }, { "x1": 106.5, "x2": 106.5, "y1": 30.34, "y2": 37.66 }, { "x1": 0, "x2": -1.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 30.34, "y2": 30.34 }, { "x1": 105, "x2": 106.5, "y1": 37.66, "y2": 37.66 }]
  getPitchCircles = [{ "cy": 34, "cx": 52.5, "r": 9.15, "color": "none" }, { "cy": 34, "cx": 11, "r": 0.3, "color": "#000" }, { "cy": 34, "cx": 94, "r": 0.3, "color": "#000" }, { "cy": 34, "cx": 52.5, "r": 0.3, "color": "#000" }]
  getArcs = [{ "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 1.5707963267948966, "endAngle": 3.141592653589793 }, "x": 0, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": Math.PI / 2, "endAngle": 0 }, "x": 0, "y": 105 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": Math.PI, "endAngle": 3 * Math.PI / 2 }, "x": 68, "y": 0 }, { "arc": { "innerRadius": 8, "outerRadius": 9, "startAngle": 6.283185307179586, "endAngle": 4.71238898038469 }, "x": 68, "y": 105 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229, "endAngle": 4.0603 }, "x": 34, "y": 5 }, { "arc": { "innerRadius": 73.2, "outerRadius": 74.2, "startAngle": 2.2229 + Math.PI, "endAngle": 4.0603 + Math.PI }, "x": 34, "y": 100 }]


  d3.select("div#plot").select("svg").remove();
  const svg = d3.select("div#plot").append("svg")
    .attr("height", width + margin.top + margin.bottom)
    .attr("width", height + margin.left + margin.right)
  //.attr("style", "outline: thin solid red;") ;

  const pitch = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.right})`)

  pitch.append('rect')
    .attr('x', -margin.left)
    .attr('y', -margin.top)
    .attr('height', width + margin.top + margin.bottom)
    .attr('width', height + margin.left + margin.right)
    .style('fill', pitchColor)
    .style("opacity", "0")

  const pitchLineData = getPitchLines;
  pitch.selectAll('.pitchLines')
    .data(pitchLineData)
    .enter().append('line')
    .attr('x1', d => d['y1'] * pitchMultiplier)
    .attr('x2', d => d['y2'] * pitchMultiplier)
    .attr('y1', d => d['x1'] * pitchMultiplier)
    .attr('y2', d => d['x2'] * pitchMultiplier)
    .style('stroke-width', lineWidth)
    .style('stroke', lineColor)
    .style("stroke-dasharray", ("0,0"));

  const pitchCircleData = getPitchCircles;
  pitch.selectAll('.pitchCircles')
    .data(pitchCircleData)
    .enter().append('circle')
    .attr('cx', d => d['cy'] * pitchMultiplier)
    .attr('cy', d => d['cx'] * pitchMultiplier)
    .attr('r', d => d['r'] * pitchMultiplier)
    .style('stroke-width', lineWidth)
    .style('stroke', lineColor)
    .style('fill', d => d['color'])
    .style("stroke-dasharray", ("0,0"));

  const pitchArcData = getArcs;
  const arc = d3.arc();
  pitch.selectAll('.pitchCorners')
    .data(pitchArcData)
    .enter().append('path')
    .attr('d', d => arc(d['arc']))
    .attr('transform', d => `translate(${pitchMultiplier * d.x},${pitchMultiplier * d.y})`)
    .style('fill', "none")
    .style('stroke', lineColor)
    .style("stroke-dasharray", ("0,0"));

  return pitch

}