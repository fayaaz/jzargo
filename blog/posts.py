from blog.models import BlogPost
from django.db.models.base import ObjectDoesNotExist
import datetime


######################################################################################


def get_latest_post():
    
    latestPost = BlogPost.objects.filter(pub_bool=True).latest('pub_date')
    
    return latestPost

def get_post(getID):
    
    post = BlogPost.objects.get(id = getID)
    
    return post
    
def get_next_post(originalID):
    
    originalPost = BlogPost.objects.get(id = originalID)
    try:
        nextPost = originalPost.get_next_by_pub_date()
        
        if nextPost.pub_bool:
            return nextPost
            
        else:
            raise Exception('ObjectDoesNotExist')
    except ObjectDoesNotExist:
     
        return False
    

def get_previous_post(originalID):
    
    originalPost = BlogPost.objects.get(id = originalID)
    try:
        previousPost = originalPost.get_previous_by_pub_date()
        
        if previousPost.pub_bool:
            return previousPost    
    except ObjectDoesNotExist:
       return False
   
def get_posts_by_month(month, year):
    
    postsFromMonth = BlogPost.objects.filter(pub_bool=True, pub_date__month=month, pub_date__year=year)
    
    return postsFromMonth

def distinct_months():
    
    allPosts = BlogPost.objects.filter(pub_bool = True)
    blogMonths = [('All','All')]
    for post in allPosts:
        year = str(post.pub_date.date().year)
        month = str(post.pub_date.date().month)
        wordMonth = post.pub_date.date().strftime("%B") 
        monthYear = wordMonth + " " + year
        monthYearID = month + '-' + year
        if (monthYear, monthYearID) not in blogMonths:
            blogMonths.append((monthYear, monthYearID))
    return blogMonths
        