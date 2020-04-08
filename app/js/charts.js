d3.json("PLP_with_coords_1.json").then(function(data) {
    drawChart(data);
});

function drawChart(data){
      var minYear = 1960;
      var maxYear = 2017;
      var month_maping = {"ene":1, "feb":2, "mar":3, "abr":4, "may":5, "jun":6, "jul":7, "ago":8, "sep":9, "oct":10, "nov":11, "dic":12}
      var months_names = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

      var pieChart = dc.pieChart('#centrals_pie');
      var yearlineChart = dc.lineChart('#years_line');
      var monthbarChart = dc.barChart('#months_line');
      var heatmapChart =  dc.heatMap("#heatmap");
      var countChart = dc.dataCount("#mystats");

      var mycrossfilter = crossfilter(data);

      
      var facilities = mycrossfilter.dimension(function(d) { return d.geo; });
      var facilitiesGroup = facilities.group().reduceSum(function(d){return d.caudal});
      

      var weekMonthDimension = mycrossfilter.dimension(function(data){
          mes = data.mes.split(" ")[0]
          mes_maping = month_maping[mes] 
          return [mes_maping, data.week]
      })
      var weekMonthGroup = weekMonthDimension.group().reduceSum(function(d){return d.caudal});

      var monthDimension = mycrossfilter.dimension(function(data){
          mes = data.mes.split(" ")[0]
          maping = month_maping[mes]
          return maping
      })
      var monthGroup = monthDimension.group().reduceSum(function(d){return d.caudal})
       
      var yearDimension = mycrossfilter.dimension(function(data){
          var year = data.año;
          if (year < 20){
              return year + 2000
          } 
          return year + 1900
      })
      var yearGroup = yearDimension.group().reduceSum(function(d){return d.caudal;})
      
      var centralDimension = mycrossfilter.dimension(function(data) { 
          return data.central; 
      });
      var centralGroup = centralDimension.group().reduceSum(function(d) { return d.caudal; });

      
      var bubble = dc_leaflet.bubbleChart("#demo1 .map")
        .dimension(facilities)
        .group(facilitiesGroup)
        .width(250)
        .height(700)
        .center([-39,-72])
        .zoom(6)
        .selectedColor("red")
        .unselectedColor("blue")
        .r(d3.scaleLinear().domain([0, facilitiesGroup.top(1)[0].value]).range([0,100]))
        .on('preRedraw', function() {
             bubble.r(d3.scaleLinear().domain([0, facilitiesGroup.top(1)[0].value]).range([0,100]));
          });


      var heatColorMapping = d3.scaleLinear()
          .domain([0, 20000])
          .range(["red" , "green"]);

      heatmapChart
          .width(400)
          .height(250)
          .dimension(weekMonthDimension)
          .group(weekMonthGroup)
          .keyAccessor(function(d) { return d.key[0]; })
          .valueAccessor(function(d) { return d.key[1]; })
          .colorAccessor(function(d) { return d.value; })
          .colors(heatColorMapping)
          .calculateColorDomain()
          .on('preRedraw', function() {
              heatmapChart.calculateColorDomain();
          })

      heatmapChart.xBorderRadius(0);
      heatmapChart.yBorderRadius(0);


      monthbarChart
      .width(400)
      .height(250)
      .margins({left: 60, top: 0, right: 10, bottom: 60})
      .dimension(monthDimension)
      .group(monthGroup)
      .x(d3.scaleBand())
      .xUnits(dc.units.ordinal)  
      .elasticX(true) 
      .elasticY(true)

      monthbarChart
      .xAxis().tickFormat(function(d) { return months_names[d - 1]; });

      monthbarChart
      .on('renderlet',function(chart){
              chart.selectAll("g.x text")
                .attr('dx', '-15')
                .attr('transform', "rotate(-55)");
            });
          

      yearlineChart
      .width(400)
      .height(250)
      .margins({left: 60, top: 0, right: 10, bottom: 20})
      .dimension(yearDimension)
      .group(yearGroup)
      .x(d3.scaleLinear().domain([minYear,maxYear]))   
      .elasticX(true) 
      .elasticY(true)
      .renderArea(true)
      .xAxis().tickFormat(function(d) { return d.toString(); });
      

      pieChart
      .width(250)
      .height(250)
      .dimension(centralDimension)
      .innerRadius([45])
      .group(centralGroup)
      .on('renderlet', function(chart) {
          chart.selectAll('rect').on('click', function(d) {
              console.log('click!', d);
              });
          });

      countChart
          .dimension(mycrossfilter)
          .group(mycrossfilter.groupAll()); 
      
          
         
  dc.renderAll(); 
}

function lockButtonOnClick(){
    state = document.getElementById("lockButton").value;
    if (state == "Lock"){
      document.getElementById("lockButton").value = "Unlock"
      console.log(dc.chartRegistry.list())
      dc.chartRegistry.list()[5].on('preRedraw', function(){})
    }
    else{
      document.getElementById("lockButton").value = "Lock"
      var mapChart = dc.chartRegistry.list()[5]
          mapChart.on('preRedraw', function(){
              mapChart.r(d3.scaleLinear().domain([0, mapChart.group().top(1)[0].value]).range([0,100]))
          })
     
    }
} 