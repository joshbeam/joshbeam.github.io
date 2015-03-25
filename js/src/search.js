$(function(utils) {
	var query = (function() {
		var q;

		return {
			set: function(val) {
				q = val;
				return this;
			},
			get: function() {
				return q;
			},
			go: function() {
				if(typeof q !== 'undefined' && typeof q === 'string') {
					document.location.href="/search/?query="+q;
				} else {
					return;
				}
			},
			//http://stackoverflow.com/a/901144/2714730
			retrieve: function(name) {
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				    results = regex.exec(location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));				
			}
		}
	})(),
	site = location.protocol + "//" + location.host, $searchBox = $('.search-box'),
	utils = utils;

	console.log(utils);

	$('.search-button').on('click',function() {
		query.set($searchBox.val().trim()).go();
	});

	$searchBox.on('keydown',function(e) {
		if(e.keyCode == 13) {
			query.set($searchBox.val().trim()).go();
		}
	});	

	if(/query/.test(location.search) && /search/.test(location.pathname)) {
		query.set(query.retrieve('query').trim().split(' '));

		$.get(site+'/posts.json',function(data) {
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

			$resultsCount.append(results.length + (results.length === 1 ? ' result' : ' results') + ' for "' + query.get().join(' ') +'"');

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

	return this;
}(utils));