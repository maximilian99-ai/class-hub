from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, ClassTaskViewSet, ScheduleViewSet

router = DefaultRouter()
router.register("schedules", ScheduleViewSet, basename="schedule")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("class-tasks", ClassTaskViewSet, basename="class-task")

urlpatterns = [
	path("", include(router.urls))
]
