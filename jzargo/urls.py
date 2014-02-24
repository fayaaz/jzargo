from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
admin.autodiscover()
import os

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'jzargo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'blog.views.index', name='root'),
    url(r'^next/(\w+)/$', 'blog.views.next_post', name='get_next'),
    url(r'^previous/(\w+)/$', 'blog.views.previous_post', name='get_previous'),
    url(r'^post/(\w+)/$', 'blog.views.get_post', name='get_post'),
    url(r'^addcomment/(\w+)/$', 'blog.views.add_comment', name='add_comment'),
    url(r'^month/$', 'blog.views.get_month', name='month'),
    url(r'^perm/(\w+)/$', 'blog.views.permanent_post', name='get_post'),
)


urlpatterns += patterns('', 
    url(r'^static/(?P<path>.*)$','django.views.static.serve',
        {'document_root': os.path.join(settings.SITE_ROOT, 'static')})
)

urlpatterns += patterns('', 
    url(r'^media/(?P<path>.*)$','django.views.static.serve',
        {'document_root': os.path.join(settings.SITE_ROOT, 'media')})
)

