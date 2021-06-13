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

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, data => data[chosenXAxis]) * 0.8,
        d3.max(healthData, data => data[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, data => data[chosenYAxis]) * 0.8,d3.max(healthData, data => data[chosenYAxis]) * 1.2])
      .range([height, 0]);
  
    return yLinearScale;
  
}

// function used for updating xAxis var upon click on axis label
// renderAxes resets the axes depending on what you select
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// functions used for updating circles group with a transition to
// new circles for x axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", data => newXScale(data[chosenXAxis]));
  
    return circlesGroup;
}
// new circles for y
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", data => newYScale(data[chosenYAxis]));
  
    return circlesGroup;
}
// Updating text so it moves with with a transition to new circles
function renderXText(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dx", data => newXScale(data[chosenXAxis]));
  
    return circlesGroup;
}
function renderYText(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("dy", data => newYScale(data[chosenYAxis]));
  
    return circlesGroup;
}

//They are making sure the tooltip is attached to the correct circles when graph changes
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "In Poverty:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    else if (chosenXAxis === "income"){
        xlabel = "Household income:"
    }

    if (chosenYAxis === 'healthcare'){
        ylabel = "Lacks Healthcare:"
    }
    else if (chosenYAxis === 'obesity'){
        ylabel = "Obesity:"
    }
    else if (chosenYAxis === 'smokes'){
        ylabel = "Smokes:"
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("color", "white")
      .style("background", 'black')
      .html(function(data) {
        return (`${data.state}<br>${xlabel} ${data[chosenXAxis]}%<br>${ylabel} ${data[chosenYAxis]}%`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(healthData) {
      toolTip.show(healthData);
    })
      // onmouseout event
    .on("mouseout", function(healthData, index) {
      toolTip.hide(healthData);
    });
  
    return circlesGroup;
}

//This is the actual code for what is happening
// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
    // console.log(healthData)
    if (err) throw err;
  
    // parse data
    healthData.forEach(data => {
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });
  
    //This will select which column of data to do the peice of code below on
    // xLinearScale function above csv import
    var xLinearScale = xScale(healthData, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(healthData, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);
  
    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("g");

    //we are placing the cirlces on the page and putting the label on x and y axis
    var circles = circlesGroup.append("circle")
      .attr("cx", data => xLinearScale(data[chosenXAxis]))
      .attr("cy", data => yLinearScale(data[chosenYAxis]))
      .attr("r", 15)
      .classed('stateCircle', true);

    // append text inside circles
    var circlesText = circlesGroup.append("text")
      .text(data => data.abbr)
      .attr("dx", data => xLinearScale(data[chosenXAxis]))
      .attr("dy", data => yLinearScale(data[chosenYAxis]))
      .classed('stateText', true);
  
    
    });
  }).catch(function(error) {
    console.log(error);
  });