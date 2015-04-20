var socket = io.connect();

socket.on('connect', function () {
  console.log('User connected!');
});

socket.on('date', function(data) {
  $('#date').text(data.date);
});

socket.on('newPkt', function(pkt) {
  var str = pkt.date + '\n' + pkt.noise + '\n' + pkt.temparature + '\n' + pkt.humidity + '\n' + pkt.lat + '\n' + pkt.lng;
  $('#newData').text(str);
});

socket.on('historyPkt', function(pkt) {
  var str = pkt.date + '\n' + pkt.noise + '\n' + pkt.temparature + '\n' + pkt.humidity + '\n' + pkt.lat + '\n' + pkt.lng;
  console.log("History data got: " + str);
});