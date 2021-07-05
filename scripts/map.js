console.log({ d3 })
console.log({ topojson })

Promise.all([
    d3.json('data/municipality_vax_unproj_topo_june.json'),
])
    .then(ready)
    .catch((err) => {
        console.log(err);
    });

function ready(res) {
    console.log(res[0])
    let raw = res[0]

    let municipality = topojson.feature(raw, raw.objects.Municipality);
    let popup = d3.select(".pop-up");

    let width = 1050;
    let height = 500;

    console.log(municipality)

    let svg = d3.select("body").select("#interactive-map")

    let myProjection = d3.geoTransverseMercator()
        .rotate([88 + 20 / 60, -36 - 40 / 60])
        .fitSize([width, height], municipality);

    let path = d3.geoPath()
        .projection(myProjection)

    let color = d3.scaleThreshold()
      .domain([10,20,30,40,50,60,70,80,90])
      // .range(['#c51b7d','#de77ae','#f1b6da','#fde0ef','#f7f7f7','#e6f5d0','#b8e186','#7fbc41','#4d9221'])
      .range(['#8e0152','#c51b7d','#de77ae','#f1b6da','#fde0ef','#e6f5d0','#b8e186','#7fbc41','#4d9221','#276419'])

    let municipalities = svg.append("g")
      .selectAll(".municipality")
      .data(municipality.features)
      .attr("class", d => "p-" + d.properties.MUNICIPALITY)
      .join("path")
      .attr("d", path)
      .attr("fill", function(d) {
        if (d.properties.percent_with_complete_vaccine_series !== null) {
          return color(d.properties.percent_with_complete_vaccine_series)
        } else {
          return "#ccc"
        }
      })
      .style("stroke-width", "0")

    // Add town lines
    svg
      .selectAll(".municipality")
      .data(municipality.features)
      .join("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", 0.1)
      .attr("fill", "none")
      .style("pointer-events", "none")

    // Pop-ups! Need to fix this
    municipalities.on("mouseover", (event, d) => {
      municipalities.select(".p-" + d.properties.MUNICIPALITY)
        .style("stroke-width", 0.25)
        .raise()

      let lang = ""
      if (d.properties.pct_complete_vax !== null && d.properties.MUNICIPALITY != null) {
        lang += "In " + d.properties.MUNICIPALITY + ", "
        lang += d3.format(".0%")(d.properties.pct_complete_vax) + " of residents have completed their COVID-19 vaccine series."
      } else if (d.properties.pct_complete_vax == null && d.properties.MUNICIPALITY != null) {
        lang += "In " + d.properties.MUNICIPALITY + ", data for complete vaccine series are missing."
      } else {
        lang += "Municipality is missing from data."
      }

      popup
        .style("opacity", 1)
        .style("left", (event.x) + "px")
        .style("top", (event.y + 400) + "px")
        .html(lang)

    })

    municipalities.on("mouseout", (event, d) => {
      popup
        .style("opacity", 0)
    })

}
