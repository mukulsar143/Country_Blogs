from django.shortcuts import render
from .models import BlogPost
from .utils import get_user_country
from django.core.paginator import Paginator

def post_list(request):
    country = get_user_country(request=request)
    
    # Filter posts by country
    filtered_posts = BlogPost.objects.filter(country=country)
    
    posts = filtered_posts if filtered_posts.exists() else BlogPost.objects.all()
    
    # Paginate the posts
    paginator = Paginator(posts, 8) 
    page_number = request.GET.get('page') 
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'blog/blogs.html', {
        'page_obj': page_obj,
        'country': country,
    })