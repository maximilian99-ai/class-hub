from rest_framework import serializers
from .models import Attendance, ClassTask, Schedule


class ScheduleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Schedule
		fields = ["id", "title", "time", "room", "created_at"]


class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attendance
		fields = ["id", "student_name", "present", "created_at"]


class ClassTaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = ClassTask
		fields = ["id", "class_name", "topic", "assignee", "status", "created_at"]
