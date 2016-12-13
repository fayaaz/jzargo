from django.db import models
from markdown import markdown
from taggit.managers import TaggableManager
from django.core.exceptions import ValidationError
import datetime

###########################################
#          Settings

markdown_extensions = ['tables', 'toc' , 'nl2br', 'wikilinks']


def validate_only_one_instance(obj):
    ''' Used for making sure only one entry exists on a model. For example the title of the site '''
    model = obj.__class__
    if (model.objects.count() > 0 and
            obj.id != model.objects.get().id):
        raise ValidationError("Can only create 1 %s instance" % model.__name__)

# Create your models here.

class Title(models.Model):
    '''Title of the site: only allows one entry'''    
    
    title = models.CharField(max_length=255)
    tag = models.CharField(max_length=255, blank=True, null=True)
    def clean(self):
        validate_only_one_instance(self)

    def __unicode__(self):
        return self.title
    
class Comment(models.Model):
    
    name = models.CharField(max_length=255)
    comment = models.TextField('Comment', help_text='Enter your comment')
    blogPost = models.ForeignKey('BlogPost')
    created = models.DateTimeField(editable=False)
         
    def __unicode__(self):
        return self.comment
    
    def save(self):
        if not self.id:
            self.created = datetime.datetime.today()
            self.name = self.name.replace (" ", "_")
        
        super(Comment, self).save()
    
class BlogPost(models.Model):
    '''A gallery for projects and art pieces'''
    
    title = models.CharField(max_length=255)
    pub_date = models.DateTimeField(default="0", editable=False, null=True, blank=True)
    pub_bool = models.BooleanField('Published?', default=False)
    body_markdown = models.TextField('Entry Body', help_text='Write in Markdown! <a href=\'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet/\'  target=\'_blank\'>Help</a>', blank=True)
    body = models.TextField('Entry HTML', help_text='HTML from markdown', blank=True)
    image = models.FileField(upload_to = 'upload/blogpost', blank=True, null=True)
    created = models.DateTimeField(editable=False)
    modified = models.DateTimeField(editable=False)
    tags = TaggableManager()
    
    def __unicode__(self):
        return self.title
    
    def save(self):
        '''Extra methods for save'''
        #Save the markdown to HTML
        self.body = markdown(self.body_markdown, extensions=markdown_extensions)
        
        #add dates if being created, change modified date if not
        if not self.id:
            self.created = datetime.datetime.today()
        
        self.modified = datetime.datetime.today()
        
        #if it's ready to be published add modify date, otherwise set it to the epoch time
        #(to workaround sort by date in django requiring a field to be not NULL) 
        if self.pub_bool:
            if not self.id:
                self.pub_date = datetime.datetime.today()
            else:
                orig = BlogPost.objects.get(pk=self.pk)
                if not orig.pub_bool:
                    self.pub_date = datetime.datetime.today()
        else:
            self.pub_date = datetime.datetime.fromtimestamp(int("0"))
        
            
        super(BlogPost, self).save() # Call the "real" save() method.
        

