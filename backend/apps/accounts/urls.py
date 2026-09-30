from django.urls import path
from .views import health, me, signup

urlpatterns = [
	path("auth/signup/", signup, name="signup"),
	path("auth/me/", me, name="me"),
	path("health/", health, name="health"),
]
