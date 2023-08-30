document.addEventListener('DOMContentLoaded', function () {
    // Tất cả mã JavaScript của bạn ở đây
      
function BuildChart(labels, values, chartTitle) {
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels, // Our labels
            datasets: [{
                label: chartTitle, // Name the series
                data: values, // Our values
                backgroundColor: [ // Specify custom colors
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [ // Add custom color borders
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1 // Specify bar border width
            }]
        },
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
        }
    });
    return myChart;
}
// Sử dụng Fetch API để lấy dữ liệu từ server
fetch('/get')
  .then((response) => response.json())
  .then((data) => {
    // Xử lý dữ liệu và trích xuất các giá trị cần thiết (date, led1, led2, temperature, humidity)
    const labels = data.map((entry) => formatDateTime(entry.date));
    const led1Data = data.map((entry) => entry.led1);
    const led2Data = data.map((entry) => entry.led2);
    const temperatureData = data.map((entry) => entry.temperature);
    const humidityData = data.map((entry) => entry.humidity);
    updateTable(data);
    // Sử dụng dữ liệu để vẽ biểu đồ bằng Chart.js
    BuildChart(labels, temperatureData, "Nhiệt Độ");
    BuildChart(labels, humidityData, "Độ Ẩm");
    // console.log('aaa');
    
  })
  .catch((error) => {
    //console.error('Lỗi khi lấy dữ liệu từ server:', error);
  });

// HTML To JSON Script 
// *Forked* from https://johndyer.name/html-table-to-json/
var table = document.getElementById('dataTable');
var json = []; // first row needs to be headers 
var headers = [];
for (var i = 0; i < table.rows[0].cells.length; i++) {
    headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi, '');
}
// go through cells 
for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};
    for (var j = 0; j < tableRow.cells.length; j++) {
        rowData[headers[j]] = tableRow.cells[j].innerHTML;
    }
    json.push(rowData);
}
// console.log(json);
// Map json values back to label array
var labels = json.map(function (e) {
    return e.year;
});
// console.log(labels);
// Map json values back to values array
var values = json.map(function (e) {
    return e.itemssold;
});
// console.log(values);
var chart = BuildChart(labels, values, "Temperature and Humidity over time");
});

function updateTable(data) {
    var tableBody = document.querySelector("#dataTable tbody");

    // Xóa tất cả các hàng hiện tại trong bảng
    tableBody.innerHTML = "";

    // Lặp qua mảng dữ liệu và thêm từng dòng vào bảng
    data.forEach(function(item) {
        var row = document.createElement("tr");
        row.innerHTML = `<td>${formatDateTime(item.date)}</td>
                         <td>${item.led1 === '2' ? 'Bật' : 'Tắt'}</td>
                         <td>${item.led2 === '4' ? 'Bật' : 'Tắt'}</td>
                         <td>${item.temperature}</td>
                         <td>${item.humidity}</td>`;
        tableBody.appendChild(row);
    });
}
/////////////////////////////////////////////////////////////////////////////////////////
document.getElementById('search').addEventListener('click', function() {
    const inputDate = document.getElementById('txt-search').value;
  
    // Chuyển đổi định dạng ngày tháng
    const parts = inputDate.split('-');
    const formattedDate = parts[0] + '-' + parts[1] + '-' + parts[2];
    console.log(formattedDate);
    // Gửi yêu cầu đến API
    fetch(`/${formattedDate}`)
      .then(response => response.json())
      .then(data => {
        // Xử lý dữ liệu trả về từ máy chủ
        updateTable(data);
        //console.log(data);
      })
      .catch(error => {
        console.error('Đã xảy ra lỗi khi gửi yêu cầu:', error);
      });
  });
  function formatDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const formattedDate = dateTime.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = dateTime.toLocaleTimeString('vi-VN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${formattedDate} ${formattedTime}`;
}