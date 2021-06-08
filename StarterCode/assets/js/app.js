// Boilerplate code to set up chart area

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// Creating a chart area and importing svg with correct dimensions

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//We need to choose which axes to display first
// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthRisks, err) {
    if (err) throw err;
  
    // parse data
    healthRisks.forEach(function(data) {
      data.age = +data.age;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.abbr = data.abbr;
      data.income = +data.income;
    });

//This will select which column of data to do the peice of code below on
  // xLinearScale function above csv import
    var xLinearScale = xScale(healthRisks, chosenXAxis);
        .domain([0, d3.max(healthRisks, d => d.poverty)])
        .range([width, 0]);

// Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthRisks, d => d.healthcare)])
        .range([height, 0]);

// Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);