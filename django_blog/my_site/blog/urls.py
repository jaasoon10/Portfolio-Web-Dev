from django.urls import path
from . import views

urlpatterns = [
    path('', views.starting_page, name='starting-page'),
    path('posts/', views.all_posts, name='all-posts-page'),
    path('posts/<slug:slug>/', views.post_detail, name='posts-detail-page'),
    path('authors/', views.all_authors, name='authors-list'),
    path('authors/<int:id>/', views.author_detail, name='author-detail-page'),
    path('tags/', views.all_tags, name='tags-list'),
    path('tags/<str:tag_caption>/', views.posts_by_tag, name='posts-by-tag-page'),
    path('404/', views.test_404, name='test_404'),
]
