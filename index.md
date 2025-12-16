# mag233.github.io

Welcome to my GitHub Pages blog!

## Article List

<ul>
{% if site.posts.size > 0 %}
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      {% if post.categories.size > 0 %}
        <span> | Categories: {{ post.categories | join: ', ' }}</span>
      {% endif %}
    </li>
  {% endfor %}
{% else %}
  <li>No posts found.</li>
{% endif %}
</ul>