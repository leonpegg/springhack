
console.log($('#police'));
$('document').ready( function () {
	$('#police').on('click', function () {
		$.get('/data/policeData?latitude='+mapHandler.latitude+'&longitude='+mapHandler.longitude, function(a) {
			console.log(a);
		});
	});
});