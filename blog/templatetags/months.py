from blog.posts import distinct_months
from django import template

register = template.Library()

@register.inclusion_tag('months.html')
def get_months():
    return {'months':distinct_months()}