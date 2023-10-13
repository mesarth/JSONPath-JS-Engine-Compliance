---
layout: default
---

# {{ site.title }}

<table>
    <tr>
      <th></th>
      {% for engine in site.data.compliance.engines %}
        <th>{{ engine.name }}</th>
      {% endfor %}
    </tr>
    {% assign summaryList = site.data.compliance.summary | reverse %}
    {% for summary in summaryList %}
      <tr>
        <td>{{ summary.testType }}</td>
        {% for perc in summary.percentages %}
          <td>
            {{ perc | times: 100.0 | round: 2 }}%
          </td>
        {% endfor %}
      </tr>
    {% endfor %}
</table>

<table>
    <tr>
      <th></th>
      {% for engine in site.data.compliance.engines %}
        <th>{{ engine.name }}</th>
      {% endfor %}
    </tr>
    {% for result in site.data.compliance.results %}
      <tr>
        <td>{{ result.testName }}</td>
        {% for engineCompliance in result.engineCompliance %}
          <td>
            {% if engineCompliance == true %}
              ✅
            {% else %}
              ❌
            {% endif %}
          </td>
        {% endfor %}
      </tr>
    {% endfor %}
</table>
