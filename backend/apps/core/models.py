from django.db import models
from django.contrib.auth.models import User

class Schedule(models.Model): # 수업 일정을 나타내는 모델
  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="schedules") # 수업을 담당하는 교사를 나타내기 위해 외래 키 사용
  title = models.CharField(max_length=120) # 수업 제목을 나타내는 문자열 필드
  time = models.CharField(max_length=20)
  room = models.CharField(max_length=80)
  created_at = models.DateTimeField(auto_now_add=True) # 데이터가 처음 생성된 시간(등록일)이 자동으로 저장되는 날짜/시간 필드

  def __str__(self): # self 객체를 문자열로 표현할 때 사용하는 메서드
    return f"{self.title} ({self.time})" # 예: "수학 수업 (14:00)" 형태로 표시됨


class Attendance(models.Model): # 출석 정보를 나타내는 모델
  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendances")
  student_name = models.CharField(max_length=100)
  present = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.student_name}: {'present' if self.present else 'absent'}" # 삼항 연산자를 사용하여 참이면 'present'(출석), 거짓이면 'absent'(결석)로 표현함. (예: "홍길동: present")


class ClassTask(models.Model): # 수업 과제를 나타내는 모델
  STATUS_CHOICES = (("ongoing", "ongoing"), ("completed", "completed")) # 과제 상태 선택 옵션을 정의하는 상수로 status 필드에 들어갈 선택지(진행중/완료)를 튜플로 지정

  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="class_tasks")
  class_name = models.CharField(max_length=120)
  topic = models.CharField(max_length=200)
  assignee = models.CharField(max_length=100)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ongoing")
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.class_name}: {self.topic}" # 예: "수학 수업: 과제 주제" 형태로 표시됨
