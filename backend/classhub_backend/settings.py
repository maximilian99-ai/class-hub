from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured

load_dotenv() # .env 파일의 환경 변수를 불러옴

BASE_DIR = Path(__file__).resolve().parent.parent # 현재 설정 파일의 부모의 부모 디렉터리를 프로젝트 루트 경로(BASE_DIR)로 지정함

DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True" # 환경 변수에서 디버그 모드 여부를 읽어와서 True/False 논리값으로 저장함 (기본값 False)

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY") # 환경 변수에서 장고 암호화 키를 가져와서 비밀 키로 설정
if not SECRET_KEY: # 비밀 키가 설정되지 않은 경우 처리
  if DEBUG: # 디버그 모드일 경우
    SECRET_KEY = "unsafe-local-key-dev-only" # 로컬 개발용 임시 키 설정
  else:
    raise ImproperlyConfigured("DJANGO_SECRET_KEY must be set when DEBUG is False") # 비밀 키가 설정되지 않은 경우 예외 발생

ALLOWED_HOSTS = [ # 허용된 호스트 설정
  h.strip() # 각 호스트 문자열의 앞뒤 공백 제거
  for h in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") # 환경 변수에서 허용된 호스트 목록 가져오기
  if h.strip() # 공백이 아닌 호스트만 포함
]

INSTALLED_APPS = [ # 프로젝트에서 사용할 장고 기본 기능 및 외부/자체 패키지들을 등록하는 리스트
  "django.contrib.admin",
  "django.contrib.auth",
  "django.contrib.contenttypes",
  "django.contrib.sessions",
  "django.contrib.messages",
  "django.contrib.staticfiles",
  "corsheaders",
  "rest_framework",
  "rest_framework_simplejwt.token_blacklist",
  "apps.core",
  "apps.accounts"
]

MIDDLEWARE = [ # HTTP 요청과 응답 과정에서 순차적으로 실행되는 보안 및 편의 기능 플러그인 리스트
  "corsheaders.middleware.CorsMiddleware",
  "django.middleware.security.SecurityMiddleware",
  "whitenoise.middleware.WhiteNoiseMiddleware",
  "django.contrib.sessions.middleware.SessionMiddleware",
  "django.middleware.common.CommonMiddleware",
  "django.middleware.csrf.CsrfViewMiddleware",
  "django.contrib.auth.middleware.AuthenticationMiddleware",
  "django.contrib.messages.middleware.MessageMiddleware",
  "django.middleware.clickjacking.XFrameOptionsMiddleware"
]

ROOT_URLCONF = "classhub_backend.urls" # 전체 웹사이트의 기본 URL 주소 경로 설정을 지정하는 파일의 위치를 나타냄

TEMPLATES = [ # HTML 화면(템플릿)을 렌더링할 때 사용하는 엔진 및 전역 변수 관련 설정
  {
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {
      "context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages"
      ]
    }
  }
]

WSGI_APPLICATION = "classhub_backend.wsgi.application" # 동기식 웹 서버(WSGI) 구동을 위한 진입점 설정
ASGI_APPLICATION = "classhub_backend.asgi.application" # 비동기식 웹 서버(ASGI) 구동을 위한 진입점 설정

DATABASE_URL = os.getenv("DATABASE_URL") # 환경 변수에서 데이터베이스 URL을 가져옴
if DATABASE_URL: # 데이터베이스 URL이 설정된 경우
  DATABASES = { 
    "default": dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=False)  # 외부 DB 주소를 파싱하여 지정하고, 커넥션 유지 시간을 600초로 설정함
  }
else:
  DATABASES = {
    "default": { # 로컬 개발용 SQLite로 설정
      "ENGINE": "django.db.backends.sqlite3",
      "NAME": BASE_DIR / "db.sqlite3"
    }
  }

AUTH_PASSWORD_VALIDATORS = [ # 회원가입 및 비밀번호 변경 시 엄격한 보안을 유지하기 위한 유효성 검사 규칙 리스트
  {
    "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
  },
  {
    "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"
  },
  {
    "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"
  },
  {
    "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"
  }
]

LANGUAGE_CODE = "en-us" # 시스템의 기본 언어를 영어(미국)로 지정함
TIME_ZONE = "Asia/Seoul" # 시스템의 기본 시간대를 서울로 지정함
USE_I18N = True # 장고의 번역 및 국제화 시스템 사용을 활성화함
USE_TZ = True # 데이터베이스에 시간을 저장할 때 시간대(Timezone) 정보를 포함하도록 함

STATIC_URL = "static/" # 웹 브라우저에서 정적 파일(CSS, JS 등)에 접근할 때 사용할 URL 주소 접두사
STATIC_ROOT = BASE_DIR / "staticfiles" # 서비스 배포 시 모든 정적 파일을 한데 모아 저장할 서버 상의 디렉터리 경로
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage" # 정적 파일을 서빙할 때 압축 및 고유 해시값 관리를 적용해 효율성을 높여주는 스토리지 지정

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField" # 데이터베이스 테이블의 기본키(PK) 데이터 타입을 증가하는 64비트 정수형으로 설정함

REST_FRAMEWORK = { # 장고 REST 프레임워크(DRF) 전역 API 처리 방식 설정
  "DEFAULT_AUTHENTICATION_CLASSES": [ # API 요청 시 사용할 인증 방식 지정
    "rest_framework_simplejwt.authentication.JWTAuthentication", # API 접근 시 JWT 인증 방식을 기본으로 채택
  ],
  "DEFAULT_PERMISSION_CLASSES": [ # API 요청 시 사용할 권한 방식 지정
    "rest_framework.permissions.IsAuthenticated", # 기본적으로 인증된 사용자만 API 호출을 허용함
  ]
}

SIMPLE_JWT = { # 단순 JWT 인증 관련 세부 기간 및 보안 규칙 설정
  "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60), # API 접근용 토큰의 유효 기간을 60분으로 설정
  "REFRESH_TOKEN_LIFETIME": timedelta(days=7), # 토큰 갱신용 리프레시 토큰의 유효 기간을 7일로 설정
  "ROTATE_REFRESH_TOKENS": True, # 토큰 갱신 요청 시 리프레시 토큰을 새로 발급해줌
  "BLACKLIST_AFTER_ROTATION": True  # 사용이 끝난 이전 리프레시 토큰은 재사용하지 못하도록 즉시 블랙리스트에 올림
}

CORS_ALLOWED_ORIGINS = [ # CORS 허용 출처 리스트
  o.strip() # 각 출처 문자열의 앞뒤 공백을 제거함
  for o in os.getenv( # 환경 변수에서 CORS 허용 출처를 가져옴
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001" # 기본적으로 로컬 개발 환경의 포트 3000, 3001을 허용함
  ).split(",") # 쉼표(,)를 기준으로 문자열을 나누어 리스트로 변환함
  if o.strip() # 공백만 있는 문자열은 제외함
]

if not DEBUG: # 서비스 운영 환경(DEBUG = False)일 때 실행되는 엄격한 보안 강화 설정
  SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https") # 프록시(로드밸런서 등) 뒷단에 있을 때 HTTPS 통신 여부를 감지할 헤더 규칙 지정
  SECURE_SSL_REDIRECT = True # 일반 HTTP 요청이 들어오면 보안이 강화된 HTTPS 주소로 자동 리다이렉트함
  SESSION_COOKIE_SECURE = True # 세션 쿠키가 HTTPS 보안 연결 상태에서만 전송되도록 제한함
  CSRF_COOKIE_SECURE = True # CSRF 토큰 쿠키가 HTTPS 보안 연결 상태에서만 전송되도록 제한함
  SECURE_HSTS_SECONDS = 31536000 # 브라우저에 1년(31,536,000초) 동안 무조건 HTTPS로만 접속하라는 규칙(HSTS)을 내림
  SECURE_HSTS_INCLUDE_SUBDOMAINS = True # HSTS 보안 규칙을 모든 하위 서브 도메인 영역까지 강제로 적용함
  SECURE_HSTS_PRELOAD = True # 브라우저 공식 프리로드(Preload) 리스트에 도메인을 추가할 수 있도록 허용함
