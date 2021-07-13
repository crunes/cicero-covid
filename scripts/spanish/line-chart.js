d3.csv("data/diff_vax.csv").then(function (data) {

    console.log(data)

    data.forEach(row => {
      row.avg_pct = +row.avg_pct
      row.date = new Date(row.date)
    });

    data.sort(function(a, b) {
      return d3.ascending(a.date, b.date)
    })

    let width = 800;
    let height = 500;
    let margin = { top: 40, right: 0, bottom: 10, left: 00 };
    let svg = d3.select("body").select("#compare-avgs")

    let x = d3.scaleTime()
        .domain(d3.extent(data.map(function (d) { return d.date })))
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain([0,.5])
        // .domain(d3.extent(data.map(function (d) { return d.avg_pct })))
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
          .defined(d => !isNaN(d.avg_pct))
          .x(d => x(d.date) )
          .y(d => y(d.avg_pct) )
          .curve(d3.curveMonotoneX)

    let grouped_data = d3.group(data, d => d.group)
    console.log(grouped_data)

    let lines = svg.append("g")
      .attr("id", "lines")
      .selectAll("path")
      .data(grouped_data)
      .join("path")
      .attr("class", d => "line " + d[0])
      .attr("d", d => line(d[1]))
      .style("fill", "none")
      .style("stroke", function(d) {
        if (d[0] == "Highlighted") {
          return "#c51b7d"
        } else if (d[0] == "Other") {
          return "#4d9221"
        }
      })
      .style("stroke-width", "2px")

    // Average vaccination rate of 7 south and west suburbs
    let highlightLabel1 = svg.append("text")
      .attr("id", "highlightLabel1")
      .attr("text-anchor", "left")
      .attr("x", 805)
      .attr("y", 180)
      .style("fill", "#c51b7d")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Siete suburbios")

    let highlightLabel2 = svg.append("text")
      .attr("id", "highlightLabel2")
      .attr("text-anchor", "left")
      .attr("x", 805)
      .attr("y", 195)
      .style("fill", "#c51b7d")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("del sur y oest")

    let otherLabel1 = svg.append("text")
      .attr("id", "otherLabel1")
      .attr("text-anchor", "left")
      .attr("x", 805)
      .attr("y", 75)
      .style("fill", "#4d9221")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("Todos los demás")

    let otherLabel2 = svg.append("text")
      .attr("id", "otherLabel2")
      .attr("text-anchor", "left")
      .attr("x", 805)
      .attr("y", 90)
      .style("fill", "#4d9221")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text("suburbios")

    let gapSizeLabel = svg.append("text")
      .attr("id", "gapSizeLabel")
      .attr("text-anchor", "left")
      .attr("x", 800)
      .attr("y", 155)
      .style("fill", "lightgrey")
      .style("font-size", "70px")
      .style("font-weight", "100")
      .style("opacity", 0.7)
      .text("}")

    let gapTextLabel = svg.append("text")
      .attr("id", "gapTextLabel")
      .attr("text-anchor", "left")
      .attr("x", 830)
      .attr("y", 135)
      .style("fill", "black")
      .style("font-size", "14px")
      .style("font-weight", "100")
      .text("La brecha")

    let note = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "note")
      .attr("x", 0)
      .attr("y", 550)
      .style("fill", "#777")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .text("Nota: Los siete suburbios del sur y el oeste son Berwyn, Blue Island, Calumet City, Cicero, Dolton, Harvey y Maywood.")

    let credit = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "credit")
      .attr("x", 0)
      .attr("y", 570)
      .style("fill", "#777")
      .style("font-size", "12px")
      .style("font-weight", "400")
      .text("Fuente: Solicitudes de registros públicos al Departamento de Salud Pública del Condado de Cook. Visualización de datos por Charmaine Runes")

    let title = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "title")
      .attr("x", 0)
      .attr("y", 0)
      .style("fill", "#555555")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Permanece la disparidad de vacunación entre los suburbios de color y el resto del Condado de Cook")

    let subtitle = svg.append("text")
      .attr("text-anchor", "left")
      .attr("id", "subtitle")
      .attr("x", 0)
      .attr("y", 20)
      .style("fill", "#555555")
      .style("font-size", "14px")
      .style("font-weight", "regular")
      .text("Por ciento de residentes completamente vacunados")

  })
