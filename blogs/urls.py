from django.urls import path
from .views import post_list


urlpatterns = [
    path('blogs/list/', post_list, name='list_blog_posts'),
]
