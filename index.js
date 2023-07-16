const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let values = [];
let baseTemperature;

let xScale;
let yScale;

const width = 1200;
const height = 600;
const padding = 100;
let yearsRange;

const svg = d3.select("svg");
const legend = d3.select("legend");
const tooltip = d3.select("#tooltip");

function drawCanvas() {
  svg.attr("width", width).attr("height", height);
}

function generateScales() {
  yearsRange = d3.max(values, (d) => d.year) - d3.min(values, (d) => d.year);

  xScale = d3
    .scaleLinear()
    .domain([d3.min(values, (d) => d.year), d3.max(values, (d) => d.year)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
}

function drawCell() {
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .attr("width", (width - 2 * padding) / yearsRange)
    .attr("height", (height - 2 * padding) / 12)
    .attr("fill", (d) => {
      if (d.variance < -2.5) return "#4575b4";
      else if (d.variance < -0.5) return "#abd9e9";
      else if (d.variance < 0.5) return "#ffffbf";
      else if (d.variance < 2.5) return "#fdae61";
      else if (d.variance > 2.5) return "#d73027";
    })
    .on("mouseover", (d) => {
      let year = d.year;
      tooltip
        .attr("data-year", year)
        .style("left", d3.event.pageX - 100 + "px")
        .style("top", Math.ceil((d3.event.pageY + 1) / 10) * 10 - 120 + "px")
        .style("visibility", "visible")
        .text(
          `${d.year} ${parseMonth(d.month)} Temperature: ${(
            baseTemperature + d.variance
          ).toFixed(1)}°C Variance: ${
            d.variance > 0 ? "+" + d.variance.toFixed(1) : d.variance.toFixed(1)
          }°C`
        );
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));
}

function generateAxes() {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  svg
    .append("text")
    .attr("id", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height - 40)
    .style("text-anchor", "middle")
    .text("Years");

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);

  svg
    .append("text")
    .attr("id", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", 25)
    .attr("x", 0 - height / 2)
    .style("text-anchor", "middle")
    .text("Months");
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    values = data.monthlyVariance;
    baseTemperature = data.baseTemperature;
    drawCanvas();
    generateScales();
    drawCell();
    generateAxes();
  });

function parseMonth(num) {
  switch (num) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}