# mag233.github.io

Welcome to my GitHub Pages blog!

## Article List

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a>
    {% if post.categories.size > 0 %}
      <span> | Categories: {{ post.categories | join: ', ' }}</span>
    {% endif %}
  </li>
{% endfor %}
</ul>