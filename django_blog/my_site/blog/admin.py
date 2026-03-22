from django.contrib import admin
from .models import Post, Author, Tag

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'date', 'slug')
    search_fields = ('title', 'author__first_name', 'author__last_name')

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')
    search_fields = ('first_name', 'last_name', 'email')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('caption',)  
