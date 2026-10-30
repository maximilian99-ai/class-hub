import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "classhub_backend.settings")

application = get_wsgi_application() # WSGI (Web Server Gateway Interface) 애플리케이션 객체 생성
