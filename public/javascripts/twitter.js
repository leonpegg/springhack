var twitter = {
	url: "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=tfltravelalerts&include_rts=1&count=20",
	updateTweets : function() {
		$.ajax({
        	dataType: 'jsonp',
        	url: this.url,
        	success: function (data) {
            	$.each(data, function (i, item) {
                	$("#twitter").append("<div class='tweetCloud'><div id='tweetArrow'></div><div id='tweetText'>" + item.text + "</div></div>");
                })
            }
        });
    }
}