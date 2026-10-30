from django.apps import AppConfig

class AccountsConfig(AppConfig): # 계정을 위한 환경 설정
	default_auto_field = "django.db.models.BigAutoField" # 기본 키 필드 유형 설정
	name = "apps.accounts" # 앱 이름 설정
