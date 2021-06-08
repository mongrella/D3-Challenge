var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
// Creating a chart area and importing svg with correct dimensions
var svg = d3.select("#scatter")
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
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

  //This will select which column of data to do the peice of code below on
  //Scale
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthRisks, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthRisks, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append to our axess
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  // we are placing the cirlces on the page and putting the label on x and y axis
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthRisks)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5");  

