from django.contrib import admin
from .models import Attendance, ClassTask, Schedule

admin.site.register(Schedule)
admin.site.register(Attendance)
admin.site.register(ClassTask)
