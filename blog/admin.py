from django.contrib import admin
import models

# Register your models here.

admin.site.register(models.Title)
admin.site.register(models.BlogPost)
admin.site.register(models.Comment)

