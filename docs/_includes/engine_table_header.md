    <thead>
      <tr>
        <th></th>
        {% for engine in site.data.compliance.engines %}
          <th>
            <a href="https://github.com/{{ engine.repo }}" target="_blank">
              {{ engine.name }}
              {% if engine.version %} (v{{ engine.version }}) {% endif %}
            </a>
          </th>
        {% endfor %}
      </tr>
    </thead>
