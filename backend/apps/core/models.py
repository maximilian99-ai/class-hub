from django.db import models
from django.contrib.auth.models import User


class Schedule(models.Model):
  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="schedules")
  title = models.CharField(max_length=120)
  time = models.CharField(max_length=20)
  room = models.CharField(max_length=80)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.title} ({self.time})"


class Attendance(models.Model):
  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendances")
  student_name = models.CharField(max_length=100)
  present = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.student_name}: {'present' if self.present else 'absent'}"


class ClassTask(models.Model):
  STATUS_CHOICES = (("ongoing", "ongoing"), ("completed", "completed"))

  teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="class_tasks")
  class_name = models.CharField(max_length=120)
  topic = models.CharField(max_length=200)
  assignee = models.CharField(max_length=100)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="ongoing")
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return f"{self.class_name}: {self.topic}"
