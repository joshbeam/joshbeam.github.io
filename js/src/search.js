$(function() {
	var site = location.protocol + "//" + location.host, query;

	$('.search-button').on('click',function() {
		document.location.href="/search/?query="+$('.search-box').val().trim();
	});

	if(/query/.test(location.search) && /search/.test(location.pathname)) {
		query = getParameterByName('query').trim().split(' ');

		$.get(site+'/posts.json',function(data) {
			var queryMatch, posts = [], $results = $('.search-results'), $resultsCount = $('.search-results-count'), currentPost;

			$results.html('');
			$resultsCount.html('');

			$.each(data,function(i,post) {
				currentPost = {};
				currentPost.url = post.url;
				currentPost.title = post.title;

				for(var key in post) {
					/*
						{
							title:
							url:
							//etc.
						}
					*/
					if(post[key].constructor === Array && key !== 'url') {
						$.each(post[key],function(i,item) {
							queryMatch = query.filter(function(qItem) {
								return qItem === item;
							});

							if(queryMatch.length > 0) {
								posts.push(currentPost);
								return false;
							}
						});
					}
				}
			});

			$resultsCount.append(posts.length + (posts.length === 1 ? ' result' : ' results') + ' for "' + query.join(' ') +'"');

			$.each(posts, function(i,post) {
				$results.append('<li><a href="'+ location.protocol + '//' + location.host + post.url +'">'+post.title+'</a></li>');
			});
		});
	}

	//http://stackoverflow.com/a/901144/2714730
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		    results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});