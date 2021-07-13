// Helper function to wrap long labels
function wrap(text, width) {
  text.each(function () {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0, //parseFloat(text.attr("dy")),
          tspan = text.text(null)
                      .append("tspan")
                      .attr("x", x)
                      .attr("y", y)
                      .attr("dy", dy + "em");
      while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan")
                          .attr("x", x)
                          .attr("y", y)
                          .attr("dy", ++lineNumber * lineHeight + dy + "em")
                          .text(word);
          }
      }
  });
}

d3.csv("data/recent_demog.csv").then(function (data) {

    console.log(data)
    data.forEach(row => {
      row.MEDINC = +row.MEDINC
      row.pct_complete_vax = +row.pct_complete_vax
    });

    let width = 1050;
    let height = 500;
    let margin = { top: 30, right: 10, bottom: 10, left: 10 };
    let svgBubbles = d3.select("body").select("#scatterplot");

    let x = d3.scaleLinear()
        .domain(d3.extent(data.map(function (d) { return d.MEDINC })))
        .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
        .domain(d3.extent(data.map(function (d) { return d.pct_complete_vax })))
        .range([height - margin.bottom, margin.top])

    // let z = d3.scaleSqrt()
    //     .domain(d3.extent(data.map(function (d) { return d.growth_pctile_for_subgroup })))
    //     .range([0, 25])

    // const annotations = [
    //     {
    //       note: {
    //         label: "",
    //         title: "Chicago Public Schools"
    //       },
    //       color: "#43481c",
    //       x: x(-1.2862),
    //       y: y(1.664),
    //       dy: 100,
    //       dx: 100
    //     },
    //     {
    //       note: {
    //         label: "",
    //         title: "Shrewsbury School District"
    //       },
    //       color: "#43481c",
    //       x: x(1.7546),
    //       y: y(6.439),
    //       dy: 20,
    //       dx: -50
    //     }
    //   ]

    let yAxisSettings = d3.axisLeft(y) //set axis to the left
        .ticks(7)
        .tickSize(-width)
        .tickFormat(d3.format(".0%"))

    let xAxisSettings = d3.axisBottom(x)
        .tickSize(0)
        .tickFormat(d3.format("$,"))

    let bg = svgBubbles.append("rect")
        .attr("x", margin.left + 100)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .style("fill", "rgba(0,0,0,0)")

    let xAxisTicks = svgBubbles.append("g")
        .attr("class", "x axis") //give each axis a class
        .call(xAxisSettings)
        .attr("transform", `translate(0,${height - margin.bottom})`)

    let yAxisTicks = svgBubbles.append("g")
        .attr("class", "y axis")
        .call(yAxisSettings)
        .attr("transform", `translate(${margin.left},0)`)

    let popup = d3.select("#bubbles");
    let shuffled = d3.shuffle(data);

    // Add bubbles
    let bubbles = svgBubbles.append("g")
       .selectAll("dot")
       .data(shuffled.filter(d => !isNaN(d.MEDINC)))
       .enter()
       .append("circle")
          .attr("class", function (d) { return "points p-" + d.city } )
          .attr("cx", function (d) { return x(d.MEDINC); } )
          .attr("cy", function (d) { return y(d.pct_complete_vax); } )
          .attr("r", 10)
          .style("fill", "#df94a3")
          .style("opacity", "0.7")
          .style("stroke", "#d66982")
          .style("stroke-width", 0.5)

    // let highlights = svgBubbles.append("g")
    //   .selectAll("dot")
    //   .data(data.filter(d => selectedDistricts.includes(d.newname)))
    //   .enter()
    //   .append("circle")
    //      .attr("cx", function (d) { return x(d.ses); } )
    //      .attr("cy", function (d) { return y(d.mnav3poolgcs); } )
    //      .attr("r", function (d) { return z(d.growth_pctile_for_subgroup); } )
    //      .style("fill", "#a0aa5d")
    //      .style("opacity", "1")
    //      .attr("stroke", "#43481c")
    //
    // let xaxis_annotation_poor = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", margin.left)
    //   .attr("y", height / 2 + 10)
    //   .text("Poorer districts")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let xaxis_annotation_rich = svgBubbles.append("text")
    //   .attr("text-anchor", "end")
    //   .attr("x", width + margin.left)
    //   .attr("y", height / 2 + 10)
    //   .text("Richer districts")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let two_yrs_behind = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57)
    //   .text("2 years behind")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let one_yr_behind = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57 - (1*80))
    //   .text("1 year behind")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let average_scores = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57 - (2*80))
    //   .style("font-weight", "bold")
    //   .text("AVERAGE")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let one_yr_ahead = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57 - (3*80))
    //   .text("1 year ahead")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let two_yrs_ahead = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57 - (4*80))
    //   .text("2 years ahead")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // let three_yrs_ahead = svgBubbles.append("text")
    //   .attr("text-anchor", "start")
    //   .attr("x", width + margin.left + 20)
    //   .attr("y", height - 57 - (5*80))
    //   .text("3 years ahead")
    //   .style("font-size", "14px")
    //   .style("opacity", 0.5)
    //
    // const makeAnnotations = d3.annotation()
    //   .annotations(annotations)
    //
    // let annotation = svgBubbles.append("g")
    //   .call(makeAnnotations)

})
