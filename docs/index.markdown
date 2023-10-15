---
layout: default
---

# {{ site.title }}

This project evaluates how well different JavaScript JSONPath engines align with the evolving [JSONPath standard]({{ site.standard }}). The compliance tests are provided by [{{ site.compliance_tests_repo }}]( {{ site.compliance_tests_repo }} ).

The project is inspired by [cburgmer's JSONPath comparison]({{ site.consensus_comparison }}) which uses consensus among the engines instead of compliance with the standard.

---

[View source]({{ site.repo }})

## Overview

<table>
    {% include engine_table_header.md %}
    <tbody>
    {% assign summaryList = site.data.compliance.summary | reverse %}
    {% for summary in summaryList %}
      <tr>
        <td>{{ summary.testType }}</td>
        {% for perc in summary.percentages %}
          <td>
            {% if forloop.parentloop.last == true %}<strong>{% endif %}
            {{ perc | times: 100.0 | round: 2 }}%
            {% if forloop.parentloop.last == true %}</strong>{% endif %}
          </td>
        {% endfor %}
      </tr>
    {% endfor %}
    </tbody>

</table>

## Detailed Results

<table>
  {% include engine_table_header.md %}
  <tbody>
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
  </tbody>
</table>

---

[View source]({{ site.repo }})

Made by [Tobias Schranz]({{ site.github }})
