from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext, Template
import blog.posts
from blog.comments import CommentForm, get_comments_post, add_comment_to_post
from django.utils import simplejson as json

# Create your views here.

def month_post_items(filterObjs):
    
    blogPosts = []
    first = True
    for obj in filterObjs:
        if first:
            first = False
            month = obj.pub_date.strftime('%B %Y')
            print month
        blogPosts.append((obj.title, obj.body, obj.pub_date, obj.image, obj.id))
    
    return{'blogposts': blogPosts,
           'month': month
           }
    
    
def template_post_items(postObj):
    
    '''returns the items needed for creating a blog post page. Includes: blogpost, comments and add comment form'''
    tagsList = []
    for tag in postObj.tags.all():
        tagsList.append(str(tag))
        
    postItems = (postObj.title, postObj.body, postObj.pub_date, postObj.image , postObj.id, tagsList)

    comments = get_comments_post(postObj.id)
    
    commentForm = CommentForm()
    
    return {'blogpost': postItems, 
            'comments': comments,
            'form': commentForm
            }
 
def index(request):
    context = RequestContext(request)
    latestPost = blog.posts.get_latest_post()
    latestPostItems = template_post_items(latestPost)
    if request.method == 'GET':
        return render_to_response('index.html', latestPostItems, context )

 
def latest_post(request):
    context = RequestContext(request)
    latestPost = blog.posts.get_latest_post()
    latestPostItems = template_post_items(latestPost)
    if request.method == 'GET':
        return render_to_response('blogpost.html', latestPostItems, context )
    
def get_post(request, id):
    context = RequestContext(request)
    post = blog.posts.get_post(id)
    if post.pub_bool:
        postItems = template_post_items(post)
        return render_to_response('blogpost.html', postItems, context )

def permanent_post(request, id):
    context = RequestContext(request)
    post = blog.posts.get_post(id)
    if post.pub_bool:
        postItems = template_post_items(post)
        return render_to_response('index.html', postItems, context )


def next_post(request, id):
    context = RequestContext(request)
    nextPost = blog.posts.get_next_post(id)
    
    if request.method == 'GET':
            
        if nextPost:
            nextPostItems = template_post_items(nextPost)
            
            return render_to_response('blogpost.html', nextPostItems, context )
        
        else:
            responseData = {}
            responseData['success'] = False
            responseData['message'] = 'No more pages'
            return HttpResponse(json.dumps(responseData), mimetype='application/json')

def previous_post(request, id):
    context = RequestContext(request)
    previousPost = blog.posts.get_previous_post(id)
    
    if request.method == 'GET':
        
        if previousPost:
            previousPostItems = template_post_items(previousPost)
            
            return render_to_response('blogpost.html', previousPostItems, context )
        
        else:
            responseData = {}
            responseData['success'] = False
            responseData['message'] = 'No more pages'
            return HttpResponse(json.dumps(responseData), mimetype='application/json')
        
def add_comment(request, id):
    
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data.get('name')
            comment = form.cleaned_data.get('comment')
            add_comment_to_post(id, name, comment)
            
            return get_post(request,id)
        
        else:
            return False
        
def get_month(request):
    
    if request.method == 'GET':

        context = RequestContext(request)
        monthYear=request.GET['month'].split('-')
        month = monthYear[0]
        year = monthYear[1]
        posts = blog.posts.get_posts_by_month(month, year)

        postItems = month_post_items(posts)

        return render_to_response('month.html', postItems, context)