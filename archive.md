---
layout: page
comments: false
title: Archive
permalink: /archive/
---
<h1 class="page-heading">Posts ({{site.posts | size}})</h1>
<ul class="unstyled archive-list">
{% for post in site.posts %}
	<li>
	  <span class="archive-list-meta">{{ post.date | date_to_string }}</span>
	  <a href="{{ post.url }}">{{post.title}}</a>
	</li>
{% endfor %}
</ul>