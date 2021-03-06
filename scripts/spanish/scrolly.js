const container = d3.select('#scrolly-overlay');
const stepSel = container.selectAll('.step');

function updateChart(index) {
    console.log("Updating with", index);
    const sel = container.select(`[data-index='${index}']`);
    stepSel.classed('is-active', (d, i) => i === index);

    if (index == "-1") {
      container.select('#june13AverageLine').style("stroke-opacity", 0.75);
      container.select('#june13AverageLabel1').style("opacity", 1);
      container.select('#june13AverageLabel2').style("opacity", 1);
      container.select('#june13AverageLabel3').style("opacity", 1);

      container.select('#allMunicipalities').style("stroke-opacity", 0);
      container.select("#compareMunicipalities").style("stroke-opacity", 0);
      container.select("#wilmetteLabel").style("opacity", 0);
      container.select("#harveyLabel").style("opacity", 0);

      container.select("#focusMunicipalities").style("stroke-opacity", 0);
      container.select("#berwynLabel").style("opacity", 0);
      container.select("#ciceroLabel").style("opacity", 0);
      container.select("#blueIslandLabel").style("opacity", 0);
      container.select("#maywoodLabel").style("opacity", 0);
      container.select("#doltonLabel").style("opacity", 0);

    } else if (index == "0") {
      container.select('#june13AverageLine').style("stroke-opacity", 0.75);
      container.select('#june13AverageLabel').style("opacity", 1);
      container.select('#june13AverageLabel2').style("opacity", 1);
      container.select('#june13AverageLabel3').style("opacity", 1);

      container.select('#allMunicipalities').style("stroke-opacity", 0);
      container.select("#compareMunicipalities").style("stroke-opacity", 0);
      container.select("#wilmetteLabel").style("opacity", 0);
      container.select("#harveyLabel").style("opacity", 0);

      container.select("#focusMunicipalities").style("stroke-opacity", 0);
      container.select("#berwynLabel").style("opacity", 0);
      container.select("#ciceroLabel").style("opacity", 0);
      container.select("#blueIslandLabel").style("opacity", 0);
      container.select("#maywoodLabel").style("opacity", 0);
      container.select("#doltonLabel").style("opacity", 0);

    } else if (index == "1") {
      container.select('#june13AverageLine').style("stroke-opacity", 0.75);
      container.select('#june13AverageLabel').style("opacity", 1);
      container.select('#june13AverageLabel2').style("opacity", 1);
      container.select('#june13AverageLabel3').style("opacity", 1);

      container.select('#allMunicipalities').style("stroke-opacity", 0.5);
      container.select("#compareMunicipalities").style("stroke-opacity", 1);
      container.select("#wilmetteLabel").style("opacity", 1);
      container.select("#harveyLabel").style("opacity", 1);

      container.select("#focusMunicipalities").style("stroke-opacity", 0);
      container.select("#berwynLabel").style("opacity", 0);
      container.select("#ciceroLabel").style("opacity", 0);
      container.select("#blueIslandLabel").style("opacity", 0);
      container.select("#maywoodLabel").style("opacity", 0);
      container.select("#doltonLabel").style("opacity", 0);

    } else if (index == "2") {
      container.select('#june13AverageLine').style("stroke-opacity", 0.75);
      container.select('#june13AverageLabel').style("opacity", 1);
      container.select('#june13AverageLabel2').style("opacity", 1);
      container.select('#june13AverageLabel3').style("opacity", 1);

      container.select('#allMunicipalities').style("stroke-opacity", 0.5);
      container.select("#compareMunicipalities").style("stroke-opacity", 0);
      container.select("#wilmetteLabel").style("opacity", 0);
      container.select("#harveyLabel").style("opacity", 1);

      container.select("#focusMunicipalities").style("stroke-opacity", 0.75);
      container.select("#berwynLabel").style("opacity", 1);
      container.select("#ciceroLabel").style("opacity", 1);
      container.select("#blueIslandLabel").style("opacity", 1);
      container.select("#maywoodLabel").style("opacity", 1);
      container.select("#doltonLabel").style("opacity", 1);

    } else {
      container.select('#june13AverageLine').style("stroke-opacity", 0);
      container.select('#june13AverageLabel').style("opacity", 0);
      container.select('#june13AverageLabel2').style("opacity", 0);
      container.select('#june13AverageLabel3').style("opacity", 0);

      container.select('#allMunicipalities').style("stroke-opacity", 0.5);
      container.select("#compareMunicipalities").style("stroke-opacity", 0);
      container.select("#wilmetteLabel").style("opacity", 0);
      container.select("#harveyLabel").style("opacity", 0);

      container.select("#focusMunicipalities").style("stroke-opacity", 0);
      container.select("#berwynLabel").style("opacity", 0);
      container.select("#ciceroLabel").style("opacity", 0);
      container.select("#blueIslandLabel").style("opacity", 0);
      container.select("#maywoodLabel").style("opacity", 0);
      container.select("#doltonLabel").style("opacity", 0);
    }
}

function init() {

    enterView({
        selector: stepSel.nodes(),
        offset: 0.5,
        enter: el => {
            console.log(el, "entering view...")
            const index = +d3.select(el).attr('data-index');
            updateChart(index);
        },
        exit: el => {
            let index = +d3.select(el).attr('data-index');
            index = Math.max(0, index - 1);
            updateChart(index);
        }
    });
}


init();

d3.csv('data/vax_rates.csv')
  .then(function (data) {

    console.log(data)

    data.forEach(row => {
      row.date = new Date(row.date)
      row.fully_vax = +row.pct_complete_vax
    });

    data.sort(function(a, b) {
      return d3.ascending(a.date, b.date)
    })

    let width = 800;
    let height = 500;
    let margin = { top: 30, right: 10, bottom: 10, left: 30 };
    let svg = d3.select("body").select("#line-chart")

    let x = d3.scaleTime()
        .domain(d3.extent(data.map(function (d) { return d.date })))
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain([0,1])
        // .domain(d3.extent(data.map(function (d) { return d.fully_vax })))
        .range([height - margin.bottom, margin.top])

    let yAxisSettings = d3.axisLeft(y)
        .ticks(10)
        .tickSize(-width)
        .tickFormat(d3.format(".0%"))
        .tickPadding(10)

    let xAxisSettings = d3.axisBottom(x)
        .ticks(6)
        .tickSize(10)
        .tickPadding(10)
        .tickFormat(d3.timeFormat("%B"))

    let bg = svg.append("rect")
        .attr("x", margin.left)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "rgba(0, 0, 0, 0)")

    let xAxisTicks = svg.append("g")
        .attr("class", "x axis")
        .call(xAxisSettings)
        .attr("transform", `translate(0,${height - margin.bottom})`)

    let yAxisTicks = svg.append("g")
        .attr("class", "y axis")
        .call(yAxisSettings)
        .attr("transform", `translate(${margin.left},0)`)

    let line = d3.line()
          .defined(d => !isNaN(d.fully_vax))
          .x(d => x(d.date) )
          .y(d => y(d.fully_vax) )
          .curve(d3.curveMonotoneX)

    let grouped_data = d3.group(data, d => d.city)
    console.log(grouped_data)

    let allFocus = ["Blue Island", "Calumet City", "Cicero", "Dolton", "Harvey", "Maywood", "Berwyn", "Stickney"]
    let comparison = ["Wilmette", "Harvey"]

    let focusVax = d3.filter(grouped_data, d => allFocus.includes(d[0]))
    let compareVax = d3.filter(grouped_data, d => comparison.includes(d[0]))

    console.log(focusVax)
    console.log(compareVax)

    let allMunicipalities = svg.append("g")
      .attr("id", "allMunicipalities")
      .selectAll("path")
      .data(grouped_data)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", "#aaa")
      .style("stroke-width", "0.5px")

    let focusMunicipalities = svg.append("g")
      .attr("id", "focusMunicipalities")
      .selectAll("path")
      .data(focusVax)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", "#c51b7d")
      .style("stroke-width", "2px")

    let compareMunicipalities = svg.append("g")
      .attr("id", "compareMunicipalities")
      .selectAll("path")
      .data(compareVax)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", function(d) {
        if (d[0] == "Harvey") {
          return "#c51b7d"
        } else if (d[0] == "Wilmette") {
          return "#4d9221"
        }
      })
      .style("stroke-width", "2px")

    let berwynLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "berwynLabel")
      .attr("x", 800)
      .attr("y", 300)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Berwyn")

    let ciceroLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "ciceroLabel")
      .attr("x", 800)
      .attr("y", 320)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Cicero")

    let blueIslandLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "blueIslandLabel")
      .attr("x", 800)
      .attr("y", 335)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Blue Island")

    let maywoodLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "maywoodLabel")
      .attr("x", 800)
      .attr("y", 350)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Maywood")

    let doltonLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "doltonLabel")
      .attr("x", 800)
      .attr("y", 365)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Dolton/Calumet City")

    let harveyLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "harveyLabel")
      .attr("x", 800)
      .attr("y", 400)
      .style("fill", "#c51b7d")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Harvey")

    let wilmetteLabel = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "wilmetteLabel")
      .attr("x", 800)
      .attr("y", 210)
      .style("fill", "#4d9221")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Wilmette")

    let june13AverageLine = svg.append("line")
      .attr("id", "june13AverageLine")
      .attr("x1", margin.left)
      .attr("x2", width - 10)
      .attr("y1", y(0.49))
      .attr("y2", y(0.49))
      .style("stroke", "#555555")
      .style("stroke-width", "2px")

    let june13AverageLabel1 = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "june13AverageLabel1")
      .attr("x", 800)
      .attr("y", 250)
      .style("fill", "#555555")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("Promedio de")

    let june13AverageLabel2 = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "june13AverageLabel2")
      .attr("x", 800)
      .attr("y", 265)
      .style("fill", "#555555")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("los suburbios del")

    let june13AverageLabel3 = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "june13AverageLabel3")
      .attr("x", 800)
      .attr("y", 280)
      .style("fill", "#555555")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text("condado (junio 13)")

    let baseline = svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width + margin.left)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .style("stroke", "#aaa")
      .style("stroke-width", "2px")

    let subtitle = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "subtitle")
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", "#555555")
      .style("font-size", "14px")
      .style("font-weight", "regular")
      .text("Por ciento de residentes completamente vacunados, por municipalidad")

    let credit = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "credit")
      .attr("x", 0)
      .attr("y", 550)
      .style("fill", "#777")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .text("Solicitudes de registros p??blicos al Departamento de Salud P??blica del Condado de Cook. Visualizaci??n de datos por Charmaine Runes")

    updateChart("-1") // Remove most labels to start

  })
