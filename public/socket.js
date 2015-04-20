var socket = io.connect();

socket.on('date', function(data) {
  $('#date').text(data.date);
});

socket.on('newData', function(data) {
  $('#newData').text(data.lat);
});