from django.urls import path
from .views import me, signup

urlpatterns = [
	path("auth/signup/", signup, name="signup"),
	path("auth/me/", me, name="me"),
]
