$(function(utils,Query) {
	var query = new Query(),
	site = location.protocol + "//" + location.host, $searchBox = $('.search-box'),
	utils = utils;

	$('.search-button').on('click',function() {
		query.set($searchBox.val().trim()).goToLocation('/search');
	});

	$searchBox.on('keydown',function(e) {
		if(e.keyCode == 13) {
			query.set($searchBox.val().trim()).goToLocation('/search');
		}
	});	

	if(/query/.test(location.search) && /search/.test(location.pathname)) {

		query
			.setFromURL('query')
			.getJSON('/posts.json')
			.done(function(data) {
				var searchIndex, results, $resultsCount = $('.search-results-count'), $results = $('.search-results'), totalScore = 0, percentOfTotal;

				searchIndex = lunr(function() {
					this.field('title');
					this.field('category');
					this.field('content');
					this.ref('url');
					this.field('date');
				});
				
				$.each(data,function(i,item) {
					searchIndex.add(item);
				});

				results = searchIndex.search(query.get());

				for(result in results) {
					results[result].title = data.filter(function(post) {
						return post.url === results[result].ref;
					})[0].title;
				}

				$resultsCount.append(results.length + (results.length === 1 ? ' result' : ' results') + ' for "' + query.get() +'"');

				$.each(results, function(i, result) {
					totalScore+=result.score;
				});

				$.each(results, function(i,result) {
					percentOfTotal = result.score/totalScore;

					$results.append('<li><a href="'+ site + result.url +'">'+result.title+'</a></li>');
					$results.children('li').last().css({
						'border-left': '20px solid '+utils.shade('#ffffff',-percentOfTotal)
					});
				});
			});
	}

	//return this;
}(utils,Query));