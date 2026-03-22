from django.db import models
from django.utils.text import slugify
from datetime import date

class Tag(models.Model):
    caption = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.caption

class Author(models.Model):
    first_name = models.CharField(max_length=50, verbose_name="First Name")
    last_name = models.CharField(max_length=50, verbose_name="Last Name")
    email = models.EmailField(unique=True, verbose_name="E-Mail Address")

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Post(models.Model):
    title = models.CharField(max_length=200)
    excerpt = models.TextField(null=True, blank=True)
    image = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField(default=date.today)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
