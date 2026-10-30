from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [ # 웹 애플리케이션의 URL 패턴 목록 정의
	path("admin/", admin.site.urls), # /admin/ 경로를 Django 관리자 페이지에 매핑
	path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"), # JWT 액세스 및 리프레시 토큰을 발급하는 API 엔드포인트
	path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"), # 리프레시 토큰으로 액세스 토큰을 재발급하는 API 엔드포인트
	path("api/", include("apps.core.urls")), # /api/로 시작하는 경로를 core 앱의 URL 설정으로 연결
	path("api/", include("apps.accounts.urls")) # /api/로 시작하는 경로를 accounts 앱의 URL 설정으로 연결
]
