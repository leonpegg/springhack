var twitter = {
	url: "http://api.twitter.com/1/statuses/user_timeline.json?include_rts=1&count=20&exclude_replies=true",
	screenname: '',
	updateTweets : function() {
		// need to add some cache and only add new tweets
		$.ajax({
        	dataType: 'jsonp',
        	url: this.url + '&screen_name=' + this.screenname,
        	success: function (data) {
	        	$('#tweets').html('');
            	$.each(data, function (i, item) {
                	$("#tweets").append("<div class='tweetCloud'><div id='tweetArrow'></div><div id='tweetText'>" + item.text + "</div></div>");
                	$('#tweets').highlightRegex("@([A-Za-z0-9_]+)");
                })
            }
        });
    }
}