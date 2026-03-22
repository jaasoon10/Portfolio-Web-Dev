from django.test import TestCase, Client
from django.urls import reverse
from blog.models import Author, Post, Tag

class AuthorModelTest(TestCase):
    def setUp(self):
        self.author = Author.objects.create(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com"
        )

    def test_author_creation(self):
        self.assertEqual(self.author.first_name, "John")
        self.assertEqual(self.author.last_name, "Doe")
        self.assertEqual(self.author.email, "john.doe@example.com")

    def test_author_str_representation(self):
        self.assertEqual(str(self.author), "John Doe")


class PostModelTest(TestCase):
    def setUp(self):
        self.author = Author.objects.create(
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@example.com"
        )
        self.post = Post.objects.create(
            title="Sample Post",
            content="This is a sample post content.",
            author=self.author
        )

    def test_post_creation(self):
        self.assertEqual(self.post.title, "Sample Post")
        self.assertEqual(self.post.content, "This is a sample post content.")
        self.assertEqual(self.post.author, self.author)

    def test_post_str_representation(self):
        self.assertEqual(str(self.post), "Sample Post")


class TagModelTest(TestCase):
    def setUp(self):
        self.tag = Tag.objects.create(caption="Python")

    def test_tag_creation(self):
        self.assertEqual(self.tag.caption, "Python")

    def test_tag_str_representation(self):
        self.assertEqual(str(self.tag), "Python")

    def test_tag_name_unique(self):
        with self.assertRaises(Exception):
            Tag.objects.create(caption="Python")


class BlogUrlTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_home_page(self):
        response = self.client.get(reverse('starting-page'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog/index.html')

    def test_posts_list(self):
        response = self.client.get(reverse('all-posts-page'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog/posts.html')

    def test_tags_list(self):
        response = self.client.get(reverse('tags-list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog/tags.html')

class PostTagRelationshipTest(TestCase):
    def setUp(self):
        self.author = Author.objects.create(
            first_name="Jane",
            last_name="Smith",
            email="jane.smith@example.com"
        )
        self.post = Post.objects.create(
            title="Sample Post",
            content="This is a sample post content.",
            author=self.author
        )
        self.tag1 = Tag.objects.create(caption="Python")
        self.tag2 = Tag.objects.create(caption="Django")

    def test_post_tags_relationship(self):
        self.post.tags.add(self.tag1, self.tag2)
        self.assertEqual(self.post.tags.count(), 2)
        self.assertIn(self.tag1, self.post.tags.all())
        self.assertIn(self.tag2, self.post.tags.all())

    def test_tag_posts_relationship(self):
        self.post.tags.add(self.tag1)
        self.assertEqual(self.tag1.posts.count(), 1)
        self.assertIn(self.post, self.tag1.posts.all())

class HomePageContentTest(TestCase):
    def setUp(self):
        self.author = Author.objects.create(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com"
        )
        self.post1 = Post.objects.create(
            title="Post 1",
            content="Content of Post 1",
            author=self.author
        )
        self.post2 = Post.objects.create(
            title="Post 2",
            content="Content of Post 2",
            author=self.author
        )

    def test_home_page_displays_posts(self):
        response = self.client.get(reverse('starting-page'))
        self.assertContains(response, "Post 1")
        self.assertContains(response, "Post 2")

class ErrorHandlingTests(TestCase):
    def test_invalid_url(self):
        response = self.client.get('/invalid-url/')
        self.assertEqual(response.status_code, 404)
        self.assertTemplateUsed(response, 'blog/404.html')

class PostDetailViewTest(TestCase):
    def setUp(self):
        self.author = Author.objects.create(
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )
        self.post = Post.objects.create(
            title="Post Detail",
            content="Test",
            author=self.author
        )

    def test_post_detail_view(self):
        response = self.client.get(reverse('posts-detail-page', args=[self.post.slug]))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'blog/post_detail.html')
