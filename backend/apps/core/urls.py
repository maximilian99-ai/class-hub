from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, ClassTaskViewSet, ScheduleViewSet

router = DefaultRouter() # 자동으로 API URL 주소 체계를 생성하고 관리해 줄 라우터 인스턴스를 생성
router.register("schedules", ScheduleViewSet, basename="schedule") # 'schedules/' 경로로 들어오는 API 요청을 ScheduleViewSet과 연결하며, URL 패턴 이름의 기본값(prefix)을 "schedule"로 지정
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("class-tasks", ClassTaskViewSet, basename="class-task")

urlpatterns = [ # Django가 인식하고 브라우저나 클라이언트의 API 요청을 라우팅할 URL 패턴 정의
	path("", include(router.urls)) # 루트 주소("")로 접근했을 때, 위에서 라우터가 자동으로 생성한 모든 API URL 경로들(router.urls)을 포함시킴
]
