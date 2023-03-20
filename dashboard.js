(function () {
  feather.replace({ 'aria-hidden': 'true' })

  var getMax = function(chart) {
    datasets = chart.data.datasets;
    max = 0;
    for(var i=0; i<datasets.length; i++) {
        dataset=datasets[i]
        if(chart.data.datasets[i].hidden) {
            continue;
        }
        dataset.data.forEach(function(d) {
            if(typeof(d)=="number" && d>max) {
                max = d
            }
        })
    }
    return max;
  }

  // Graphs
  var sensorchart1 = new Chart(document.getElementById('sensorchart1'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Reported X Deviation',
        lineTension: 0.1,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },
      {
        label: 'Reported Y Deviation',
        lineTension: 0.1,
        backgroundColor: 'transparent',
        borderColor: '#FF0000',
        borderWidth: 5,
        pointBackgroundColor: '#FF0000'
      }]
    },
    options: {
      legend: {
        display: true
      }
    }
  })
  var sensorchart2 = new Chart(document.getElementById('sensorchart2'), {
    type: 'line',
    data: {
      datasets: [{
        label: 'Reported X Deviation',
        lineTension: 0.1,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      },
      {
        label: 'Reported Y Deviation',
        lineTension: 0.1,
        backgroundColor: 'transparent',
        borderColor: '#FF0000',
        borderWidth: 5,
        pointBackgroundColor: '#FF0000'
      }]
    },
    options: {
      legend: {
        display: true
      }
    }
  })
  

  pubnub = new PubNub({ // Your PubNub keys here. Get them from https://dashboard.pubnub.com.
    publishKey : 'pub-c-a2daf68e-5588-4854-ba05-3f84a92d0d09',
    subscribeKey : 'sub-c-fec9355f-951f-48bb-811f-c573dd48e003',
    uuid : 'dashboard'
  });

var lastUpdate;
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
  
 pubnub.fetchMessages( 
      {
          channels: ['monitoringchannel'],
          count: 40,
      },
      function (status, response) {
              response.channels['monitoringchannel'].forEach((message) => {
                  var date = new Date(Math.trunc((message.timetoken / 10000), 16)); 
                  lastUpdate = date;
                  var timedisplay = date.toLocaleString();
                  //console.log(message);
                  sensorchart1.data.labels.push(timedisplay);
                  sensorchart1.data.datasets[0].data.push([message.message.channel1]);
                  sensorchart1.data.datasets[1].data.push([message.message.channel2]);
                  sensorchart2.data.labels.push(timedisplay);
                  sensorchart2.data.datasets[0].data.push([message.message.channel3]);
                  sensorchart2.data.datasets[1].data.push([message.message.channel4]);

                  if (sensorchart1.data.datasets[0].data.length > 40) {
                    // Remove the oldest data and label
                    sensorchart1.data.datasets[0].data.shift();
                    sensorchart1.data.datasets[1].data.shift();
                    sensorchart1.data.labels.shift();
                  }
                  if (sensorchart2.data.datasets[0].data.length > 40) {
                    // Remove the oldest data and label
                    sensorchart2.data.datasets[0].data.shift();
                    sensorchart2.data.datasets[1].data.shift();
                    sensorchart2.data.labels.shift();
                  }
                  var maxarray = sensorchart1.data.datasets[0].data.concat(sensorchart1.data.datasets[1].data);
                  sensorchart1.options.scales = {
                    xAxes: [],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: false,
                          max: Math.max(...maxarray)+1  
                        }
                      }
                    ]
                  };
                
                  sensorchart1.update();
                  maxarray = sensorchart2.data.datasets[0].data.concat(sensorchart2.data.datasets[1].data);
                  sensorchart2.options.scales = {
                    xAxes: [],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: false,
                          max: Math.max(...maxarray)+1  
                        }
                      }
                    ]
                  };
                
                  sensorchart2.update();
                  
              }); 
      }
  );
  
  pubnub.addListener({
    message: function(message) {
          var date = new Date(Math.trunc((message.timetoken / 10000), 16)); 
          lastUpdate = date;
          var timedisplay = date.toLocaleString();
          //console.log(message);
          sensorchart1.data.labels.push(timedisplay);
          sensorchart1.data.datasets[0].data.push([message.message.channel1]);
          sensorchart1.data.datasets[1].data.push([message.message.channel2]);
          document.getElementById("c1_last_x").textContent=message.message.channel1;
          document.getElementById("c1_last_y").textContent=message.message.channel2;

          sensorchart2.data.labels.push(timedisplay);
          sensorchart2.data.datasets[0].data.push([message.message.channel3]);
          sensorchart2.data.datasets[1].data.push([message.message.channel4]);
          document.getElementById("c2_last_x").textContent=message.message.channel3;
          document.getElementById("c2_last_y").textContent=message.message.channel4;

          if (sensorchart1.data.datasets[0].data.length > 40) {
            // Remove the oldest data and label
            sensorchart1.data.datasets[0].data.shift();
            sensorchart1.data.datasets[1].data.shift();
            sensorchart1.data.labels.shift();
          }
          if (sensorchart2.data.datasets[0].data.length > 40) {
            // Remove the oldest data and label
            sensorchart2.data.datasets[0].data.shift();
            sensorchart2.data.datasets[1].data.shift();
            sensorchart2.data.labels.shift();
          }
          var maxarray = sensorchart1.data.datasets[0].data.concat(sensorchart1.data.datasets[1].data);
          sensorchart1.options.scales = {
            xAxes: [],
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  max: Math.max(...maxarray)+1  
                }
              }
            ]
          };

          document.getElementById("c1_max_x").textContent = Math.max(...sensorchart1.data.datasets[0].data);
          document.getElementById("c1_max_y").textContent = Math.max(...sensorchart1.data.datasets[1].data);

          if (Math.max(...maxarray) < 3) { // low vibration. OS=warn and VS=low
            document.getElementById('C1OSD').classList.add("d-none");
            document.getElementById('C1OSW').classList.remove("d-none");
            document.getElementById('C1OSN').classList.add("d-none");
            document.getElementById('C1VSD').classList.add("d-none");
            document.getElementById('C1VSW').classList.add("d-none");
            document.getElementById('C1VSS').classList.remove("d-none");
          } else if (Math.max(...maxarray) >= 3 && Math.max(...maxarray) < 12 ) { // med vibration. OS=ok and VS=warn
            document.getElementById('C1OSD').classList.add("d-none");
            document.getElementById('C1OSW').classList.add("d-none");
            document.getElementById('C1OSN').classList.remove("d-none");
            document.getElementById('C1VSD').classList.add("d-none");
            document.getElementById('C1VSW').classList.remove("d-none");
            document.getElementById('C1VSS').classList.add("d-none");
          } else if (Math.max(...maxarray) >= 12) { // danger  OS=ok and VS=danger
            document.getElementById('C1OSD').classList.add("d-none");
            document.getElementById('C1OSW').classList.add("d-none");
            document.getElementById('C1OSN').classList.remove("d-none");
            document.getElementById('C1VSD').classList.remove("d-none");
            document.getElementById('C1VSW').classList.add("d-none");
            document.getElementById('C1VSS').classList.add("d-none");
          } 
      
          sensorchart1.update();
          maxarray = sensorchart2.data.datasets[0].data.concat(sensorchart2.data.datasets[1].data);
          sensorchart2.options.scales = {
            xAxes: [],
            yAxes: [
              {
                ticks: {
                  beginAtZero: false,
                  max: Math.max(...maxarray)+1  
                }
              }
            ]
          };

          document.getElementById("c2_max_x").textContent = Math.max(...sensorchart2.data.datasets[0].data);
          document.getElementById("c2_max_y").textContent = Math.max(...sensorchart2.data.datasets[1].data);

          if (Math.max(...maxarray) < 3) { // low vibration. OS=warn and VS=low
            document.getElementById('C2OSD').classList.add("d-none");
            document.getElementById('C2OSW').classList.remove("d-none");
            document.getElementById('C2OSN').classList.add("d-none");
            document.getElementById('C2VSD').classList.add("d-none");
            document.getElementById('C2VSW').classList.add("d-none");
            document.getElementById('C2VSS').classList.remove("d-none");
          } else if (Math.max(...maxarray) >= 3 && Math.max(...maxarray) < 12 ) { // med vibration. OS=ok and VS=warn
            document.getElementById('C2OSD').classList.add("d-none");
            document.getElementById('C2OSW').classList.add("d-none");
            document.getElementById('C2OSN').classList.remove("d-none");
            document.getElementById('C2VSD').classList.add("d-none");
            document.getElementById('C2VSW').classList.remove("d-none");
            document.getElementById('C2VSS').classList.add("d-none");
          } else if (Math.max(...maxarray) >= 12) { // danger  OS=ok and VS=danger
            document.getElementById('C2OSD').classList.add("d-none");
            document.getElementById('C2OSW').classList.add("d-none");
            document.getElementById('C2OSN').classList.remove("d-none");
            document.getElementById('C2VSD').classList.remove("d-none");
            document.getElementById('C2VSW').classList.add("d-none");
            document.getElementById('C2VSS').classList.add("d-none");
          } 
          sensorchart2.update();
      }
  });

pubnub.subscribe({
    channels: ['monitoringchannel'] // Listen for data.
});

function checkStatus() {
  var currenttime = new Date();
  if(currenttime-lastUpdate > 20*1000){ // Data stream went offline if no data in 20 seconds
    document.getElementById('C1OSD').classList.remove("d-none");
    document.getElementById('C1OSW').classList.add("d-none");
    document.getElementById('C1OSN').classList.add("d-none");
    document.getElementById('C1VSD').classList.add("d-none");
    document.getElementById('C1VSW').classList.add("d-none");
    document.getElementById('C1VSS').classList.remove("d-none");
  }
}

setInterval(checkStatus, 500);

const myModal = new bootstrap.Modal('#staticBackdrop');
myModal.show();


})()
