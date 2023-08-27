// Server:
var url = window.location.host; // hàm trả về url của trang hiện tại kèm theo port
var ws = new WebSocket('ws://' + url + '/ws'); // mở 1 websocket với port 3000 
function GetButtonData(data) {
  switch (data)
  {
      case 2:
        var tx = "2"
        document.getElementById('myImage').src='/pic_bulbon.gif'
        console.log('bat den 1');
        ws.send(tx);
        break;
      case 3:
        var tx = "3"
        document.getElementById('myImage').src='/pic_bulboff.gif'
        console.log('tat den 1');
        ws.send(tx);
        break;
    case 4:
      var tx = "4"
      document.getElementById('myImage2').src='/pic_bulbon.gif'
      console.log('bat den 2');
      ws.send(tx);
      break;
      case 5:
      var tx = "5"
      document.getElementById('myImage2').src='/pic_bulboff.gif'
      console.log('tat den 2');
      ws.send(tx);
      break;
  }
}

window.addEventListener('load', getReadings);

// Create Temperature Gauge
var gaugeTemp = new LinearGauge({
  renderTo: 'gauge-temperature',
  width: 120,
  height: 400,
  units: "Temperature C",
  minValue: 0,
  startAngle: 90,
  ticksAngle: 180,
  maxValue: 40,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueDec: 2,
  valueInt: 2,
  majorTicks: [
      "0",
      "5",
      "10",
      "15",
      "20",
      "25",
      "30",
      "35",
      "40"
  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 30,
          "to": 40,
          "color": "rgba(200, 50, 50, .75)"
      }
  ],
  colorPlate: "#fff",
  colorBarProgress: "#CC2936",
  colorBarProgressEnd: "#049faa",
  borderShadowWidth: 0,
  borders: false,
  needleType: "arrow",
  needleWidth: 2,
  needleCircleSize: 7,
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear",
  barWidth: 10,
}).draw();
  
// Create Humidity Gauge
var gaugeHum = new RadialGauge({
  renderTo: 'gauge-humidity',
  width: 300,
  height: 300,
  units: "Humidity (%)",
  minValue: 0,
  maxValue: 100,
  colorValueBoxRect: "#049faa",
  colorValueBoxRectEnd: "#049faa",
  colorValueBoxBackground: "#f1fbfc",
  valueInt: 2,
  majorTicks: [
      "0",
      "20",
      "40",
      "60",
      "80",
      "100"

  ],
  minorTicks: 4,
  strokeTicks: true,
  highlights: [
      {
          "from": 80,
          "to": 100,
          "color": "#03C0C1"
      }
  ],
  colorPlate: "#fff",
  borderShadowWidth: 0,
  borders: false,
  needleType: "line",
  colorNeedle: "#007F80",
  colorNeedleEnd: "#007F80",
  needleWidth: 2,
  needleCircleSize: 3,
  colorNeedleCircleOuter: "#007F80",
  needleCircleOuter: true,
  needleCircleInner: false,
  animationDuration: 1500,
  animationRule: "linear"
}).draw();

function getReadings(){
  var nhiet,am;
  ws.onmessage = function (message) {
    var t = message.data;
    const a = JSON.parse(t);
    nhiet = a.temperature;
    am = a.humidity;
    gaugeTemp.value = nhiet;
    gaugeHum.value = am;
  } 
} 
