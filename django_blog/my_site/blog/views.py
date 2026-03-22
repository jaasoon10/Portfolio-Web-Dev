from django.shortcuts import render, get_object_or_404
from datetime import date
from .models import Post, Author, Tag
from django.http import Http404

def custom_404(request, exception):
    return render(request, "blog/404.html", status=404)

def starting_page(request):
    latest_posts = Post.objects.order_by("-date")[:3]
    return render(request, "blog/index.html", {"all_posts": latest_posts})

def all_posts(request):
    posts = Post.objects.order_by("-date")
    return render(request, "blog/posts.html", {"all_posts": posts})

def post_detail(request, slug):
    if slug == "no-slug":
        return render(request, "blog/no_slug_error.html")
    post = get_object_or_404(Post, slug=slug)
    return render(request, "blog/post_detail.html", {"post": post})

def all_authors(request):
    authors = Author.objects.all()
    return render(request, 'blog/authors.html', {'authors': authors})

def author_detail(request, id):
    author = get_object_or_404(Author, id=id)
    posts = author.posts.all().prefetch_related('tags')
    return render(request, 'blog/author_detail.html', {'author': author, 'posts': posts})

def all_tags(request):
    tags = Tag.objects.all()
    return render(request, 'blog/tags.html', {'tags': tags})

def posts_by_tag(request, tag_caption):
    tag = get_object_or_404(Tag, caption=tag_caption)
    posts = tag.posts.all().prefetch_related('tags', 'author')
    return render(request, 'blog/posts_by_tag.html', {'tag': tag, 'posts': posts})

def test_404(request):
    raise Http404("Pàgina no trobada")