// good luck!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 20,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// /////////////////////// // 

// Import Data
d3.csv("assets/data/data.csv").then(function(weightData) {
  console.log("hello")
    // format data to numerical values
    weightData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
        // console.log(data)
    });
  // Set the domain for the xTimeScale function
  // d3.extent returns the an array containing the min and max values for the property specified
    var xScale = d3.scaleLinear()
    .range([0, chartWidth])
    .domain([8, d3.max(weightData, d => d.poverty)])
    .nice();

// Configure a linear scale with a range between the chartHeight and 0
// Set the domain for the xLinearScale function
    var yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([18, d3.max(weightData, data => data.obesity)])
    .nice();

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append functions
    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(weightData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.obesity))
    .attr("r", "17")
    .attr("fill", "red")
    .attr("opacity", ".8")
    chartGroup.selectAll("null").data(weightData)
    .enter()
    .append("text")
    .text(function(x){return x.abbr})
    .attr("x", d => xScale(d.poverty))
    .attr("y", d => yScale(d.obesity))
    .attr("text-anchor", "middle")
    .attr("font-size", "12")
    ;

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (chartHeight / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percent of Population Obesity");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percent of Population Poverty");
  }).catch(function(error) {
    console.log(error);
  });
