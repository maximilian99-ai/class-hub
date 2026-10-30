from django.contrib import admin
from .models import Attendance, ClassTask, Schedule

'''
코어 모델들을 관리자 사이트 등록
'''
admin.site.register(Schedule)
admin.site.register(Attendance)
admin.site.register(ClassTask)
