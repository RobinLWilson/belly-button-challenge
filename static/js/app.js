const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// OTUs
const dataOTU = d3.json(url);
console.log(dataOTU);

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
    // Get the names of all individuals
    let names = data.names;

    // Populate the dropdown menu with the names
    let dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .text(function(d) {
        return d;
      });
      
    // Call a function to update the chart when a new individual is selected
    dropdown.on("change", function() {
      let selectedIndividual = dropdown.property("value");
      updateChart(selectedIndividual);
    });

    // Call the updateChart function with the default selected individual
    let defaultIndividual = names[0];
    updateChart(defaultIndividual);

  function updateChart(selectedIndividual) {
    // Get the selected individual's data
    let individualData = data.samples.find(function(sample) {
      return sample.id === selectedIndividual;
    });
  
    // Extract the top 10 OTUs
    let top10OTUs = individualData.otu_ids.slice(0, 10).reverse();
    let top10Values = individualData.sample_values.slice(0, 10).reverse();
    let top10Labels = individualData.otu_labels.slice(0, 10).reverse();
  
    // Create the bar chart
    let trace = {
      x: top10Values,
      y: top10OTUs.map(function(otu) {
        return `OTU ${otu}`;
      }),
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };
  
    let chartData = [trace];
  
    let layout = {
      title: `Top 10 OTUs for Individual ${selectedIndividual}`
    };
  
    Plotly.newPlot("bar", chartData, layout);

    //Create Bubble Chart
    let trace2 = {
      x: individualData.otu_ids,
      y: individualData.sample_values,
      text: individualData.otu_labels,
      mode: "markers",
      marker: {
        size: individualData.sample_values,
        color: individualData.otu_ids,
        colorscale: "Earth"
      }
    }
    let bubbleData = [trace2];

    let layout2 = {
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble", bubbleData, layout2);

    // Get the selected individual's metadata
    let metadata = data.metadata.find(function(item) {
      return item.id == selectedIndividual;
    });

    // Select the HTML element to display the metadata
    let metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Append each key-value pair in the metadata to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
        
  }
}); 
