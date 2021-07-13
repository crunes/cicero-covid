d3.csv("data/vax_rates.csv").then(function (data) {

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
    let margin = { top: 40, right: 0, bottom: 10, left: 00 };
    let svg = d3.select("body").select("#wilmette-harvey")

    let x = d3.scaleTime()
        .domain(d3.extent(data.map(function (d) { return d.date })))
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain([0,1])
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
              .defined(d => !isNaN(d.fully_vax))
              .x(d => x(d.date) )
              .y(d => y(d.fully_vax) )
              .curve(d3.curveMonotoneX)

        let grouped_data = d3.group(data, d => d.city)
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
        if (d[0] == "Harvey") {
          return "#c51b7d"
        } else if (d[0] == "Wilmette") {
          return "#4d9221"
        } else {
          return "#ddd"
        }
      })
      .style("stroke-width", function(d) {
        if (d[0] == "Harvey" | d[0] == "Wilmette") {
          return "2px"
        } else {
          return "1px"
        }
      })
      .style("stroke-opacity", function(d) {
        if (d[0] == "Harvey" | d[0] == "Wilmette") {
          return 1
        } else {
          return 0.5
        }
      })

      let harveyLabel = svg.append("text")
        .attr("text-anchor", "left")
        .attr("id", "harveyLabel")
        .attr("x", 805)
        .attr("y", 400)
        .style("fill", "#c51b7d")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Harvey")

      let wilmetteLabel = svg.append("text")
        .attr("text-anchor", "left")
        .attr("id", "wilmetteLabel")
        .attr("x", 805)
        .attr("y", 210)
        .style("fill", "#4d9221")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Wilmette")

      let credit = svg.append("text")
        .attr("text-anchor", "left")
        .attr("id", "credit")
        .attr("x", 0)
        .attr("y", 550)
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
        .text("A pesar de tener poblacionales de tamaño similar, Wilmette y Harvey tienen tasas de vacunación significativamente diferentes")

      let subtitle = svg.append("text")
        .attr("text-anchor", "left")
        .attr("id", "subtitle")
        .attr("x", 0)
        .attr("y", 20)
        .style("fill", "#555555")
        .style("font-size", "14px")
        .style("font-weight", "regular")
        .text("Por ciento de residentes completamente vacunados, por municipalidad")

  })
