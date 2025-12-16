---
layout: default
title: Categories
permalink: /categories/
---

<header class="page-header">
  <h1>Categories</h1>
  <p class="muted">Browse posts by topic.</p>
</header>

<div class="category-index">
  {% assign categories_sorted = site.categories | sort %}
  {% for cat in categories_sorted %}
    {% assign name = cat[0] %}
    {% assign posts = cat[1] %}
    <section class="category-section" id="{{ name | slugify }}">
      <div class="category-section__header">
        <h2 class="category-title">{{ name }}</h2>
        <span class="muted">{{ posts | size }} post{% if posts.size != 1 %}s{% endif %}</span>
      </div>
      <ul class="list">
        {% for post in posts %}
          <li class="list__item">
            <a class="link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="muted">· {{ post.date | date: "%Y-%m-%d" }}</span>
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
</div>
