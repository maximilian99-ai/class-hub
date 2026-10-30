from rest_framework import serializers
from .models import Attendance, ClassTask, Schedule

class ScheduleSerializer(serializers.ModelSerializer): # 수업 일정을 직렬화하기 위한(데이터를 JSON 등으로 변환하기 위한) 시리얼라이저 클래스 정의
	class Meta: # 메타 데이터를 정의하는 내부 클래스
		model = Schedule # 직렬화할 모델 지정
		fields = ["id", "title", "time", "room", "created_at"] # 외부 API로 노출하거나 받아올 데이터 필드를 지정


class AttendanceSerializer(serializers.ModelSerializer):
	class Meta:
		model = Attendance
		fields = ["id", "student_name", "present", "created_at"]


class ClassTaskSerializer(serializers.ModelSerializer):
	class Meta:
		model = ClassTask
		fields = ["id", "class_name", "topic", "assignee", "status", "created_at"]
