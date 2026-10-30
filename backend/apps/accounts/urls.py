from django.urls import path
from .views import health, me, signup

urlpatterns = [  # 웹 애플리케이션의 URL 패턴들을 정의
	path("auth/signup/", signup, name="signup"), # 'auth/signup/' 경로로 요청이 오면 signup 뷰를 실행하고, 이 URL 패턴의 이름을 'signup'으로 지정
	path("auth/me/", me, name="me"),
	path("health/", health, name="health"),
]