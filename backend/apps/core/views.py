from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Attendance, ClassTask, Schedule
from .serializers import AttendanceSerializer, ClassTaskSerializer, ScheduleSerializer


class OwnerScopedQuerysetMixin:
	permission_classes = [IsAuthenticatedOrReadOnly]

	def get_queryset(self):
		queryset = self.queryset
		user = self.request.user

		if user.is_authenticated:
			return queryset.filter(teacher=user).order_by("-created_at")
		return queryset.order_by("-created_at")

	def perform_create(self, serializer):
		serializer.save(teacher=self.request.user)


class ScheduleViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet):
	queryset = Schedule.objects.all()
	serializer_class = ScheduleSerializer


class AttendanceViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet):
	queryset = Attendance.objects.all()
	serializer_class = AttendanceSerializer


class ClassTaskViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet):
	queryset = ClassTask.objects.all()
	serializer_class = ClassTaskSerializer
