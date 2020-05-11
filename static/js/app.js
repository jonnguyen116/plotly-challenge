function buildMetadata(sample) {
  let url = `/metadata/${sample}`;
  
  d3.json(url).then(function(response) {
    d3.select("#sample-metadata").html("");
    Object.entries(response).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
    });
  });
}; 

function buildCharts(sample) {
  let url = `/samples/${sample}`;
  d3.json(url).then(function(response) {
    let otu_ids = response["otu_ids"]; 
    let sample_otu_ids = otu_ids.slice(0, 10);
    let values = response["sample_values"];
    let sample_values = values.slice(0, 10);
    let text = response["otu_labels"]; 

    let trace1 = {
      labels: otu_ids,
      values: sample_values, 
      hovertext: text,
      type: 'pie'
    }; 
    let data1 = [trace1];
    let layout1 = {
      title: "Belly Button Diversity Pie Chart"
    };

    let trace2 = {
      x: otu_ids, 
      y: values, 
      mode: 'markers',
      marker: {
        size: values, 
        color: otu_ids, 
      },
      text: text, 
      type: 'scatter'
    };
    let data2 = [trace2];
    let layout2 = {
      title: 'Belly Button Diversity Bubble Chart',
      showlegend: false,
      height: 750,
      width: 750
    };

    Plotly.newPlot("pie", data1, layout1);
    Plotly.newPlot("bubble", data2, layout2);
  });
}; 

function init() {
  let selector = d3.select("#selDataset");

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();
