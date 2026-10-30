import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "classhub_backend.settings") # 환경 변수에 장고 설정 파일(settings.py)의 위치를 'classhub_backend.settings'로 등록함

application = get_asgi_application() # ASGI (Asynchronous Server Gateway Interface) 애플리케이션 객체 생성
