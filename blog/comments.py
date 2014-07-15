from django.forms import ModelForm, Textarea, TextInput
from blog.models import Comment, BlogPost

class CommentForm(ModelForm):
    class Meta():
        model = Comment
        fields = ['name', 'comment']
        widgets = {
            'name': TextInput(attrs={'class': 'form-control'}),
            'comment':Textarea(attrs={'class': 'form-control'})
        }
        
def get_comments_post(id):
    comments = Comment.objects.filter(blogPost__id__exact=id).order_by('created')
    commentsList = []
    for comment in comments:
        
        commentsList.append((comment.name, comment.created, comment.comment, comment.name.strip("\'"))
    
    return commentsList

def add_comment_to_post(id, subName, subComment):
    
    blogPostObj = BlogPost.objects.get(pk=id)
    addComment = Comment(name=subName, comment=subComment, blogPost=blogPostObj)
    addComment.save()
    
    return True
