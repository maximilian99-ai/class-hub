from django.apps import AppConfig

class CoreConfig(AppConfig): # 핵심 앱 설정 클래스
	default_auto_field = "django.db.models.BigAutoField" # 이 앱의 모델들이 사용할 기본 데이터베이스 pk(기본키)의 자동 생성 타입을 BigAutoField로 설정
	name = "apps.core" # Django가 이 앱을 식별할 때 사용하는 고유한 전체 경로(이름)를 지정
