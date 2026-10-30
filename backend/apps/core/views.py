from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Attendance, ClassTask, Schedule
from .serializers import AttendanceSerializer, ClassTaskSerializer, ScheduleSerializer

class OwnerScopedQuerysetMixin: # 로그인한 사용자의 데이터만 필터링하고 저장할 때 본인을 자동으로 지정해 주는 공통 기능을 모아둔 믹스인(Mixin) 클래스
	permission_classes = [IsAuthenticated] # 인증된 사용자만 접근 허용

	def get_queryset(self): # 클라이언트가 데이터 목록이나 상세 내용을 요청할 때, 데이터베이스에서 뽑아올 데이터 범위를 지정하는 메서드
		queryset = self.queryset # 각 뷰셋에 기본으로 정의된 전체 데이터셋(Schedule, Attendance 등)을 가져오기
		user = self.request.user # 현재 API 요청을 보낸 로그인된 사용자(선생님) 객체를 가져오기
		return queryset.filter(teacher=user).order_by("-created_at") # 전체 데이터 중 teacher 필드가 현재 로그인한 사용자와 일치하는 것만 필터링하고, 생성일(created_at) 기준 최신순('-')으로 정렬

	def perform_create(self, serializer): # 클라이언트가 새로운 데이터를 저장(POST 요청)할 때 호출되는 메서드
		serializer.save(teacher=self.request.user) # 데이터를 저장할 때, 요청 바디(Body)에 없더라도 현재 로그인한 사용자를 'teacher' 필드에 자동으로 채워서 저장


class ScheduleViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet): # Schedule(일정) API 요청을 처리하는 뷰셋으로, 공통 기능인 믹스인과 모든 CRUD가 구현된 ModelViewSet을 상속받아 사용
	queryset = Schedule.objects.all() # 믹스인에서 필터링하기 전, 기본 베이스가 될 Schedule 테이블의 전체 데이터를 지정
	serializer_class = ScheduleSerializer # 데이터를 JSON 포맷과 상호 변환할 때 사용할 ScheduleSerializer를 매핑


class AttendanceViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet):
	queryset = Attendance.objects.all()
	serializer_class = AttendanceSerializer


class ClassTaskViewSet(OwnerScopedQuerysetMixin, viewsets.ModelViewSet):
	queryset = ClassTask.objects.all()
	serializer_class = ClassTaskSerializer
