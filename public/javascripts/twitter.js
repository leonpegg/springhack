var twitter = {
	url: "http://api.twitter.com/1/statuses/user_timeline.json?include_rts=1&count=20&exclude_replies=true",
	screenname: '',
	updateTweets : function() {
		$.ajax({
        	dataType: 'jsonp',
        	url: this.url + '&screen_name=' + this.screenname,
        	success: function (data) {
	        	$('#twitter').html('');
            	$.each(data, function (i, item) {
                	$("#twitter").append("<div class='tweetCloud'><div id='tweetArrow'></div><div id='tweetText'>" + item.text + "</div></div>");
                })
            }
        });
    }
}