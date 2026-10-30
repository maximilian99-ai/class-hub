from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(["POST"]) # 회원가입 엔드포인트를 나타내기 위해 api_view 데코레이터 사용하고 이 뷰가 HTTP POST 요청만 처리하도록 제한
@permission_classes([AllowAny]) # 모든 사용자가 접근 가능하도록 permission_classes 데코레이터 사용
def signup(request): # request를 받아 회원가입 처리하는 함수
	nickname = request.data.get("nickname", request.data.get("name", "")).strip() # 닉네임 또는 이름 가져오는 기능을 위해 request.data.get 사용하고 앞뒤 공백을 제거
	email = request.data.get("email", "").strip()
	password = request.data.get("password", "").strip()

	if not nickname or not email or not password: # 필수 입력값이 없는 경우
		return Response({"detail": "nickname, email, password are required"}, status=400) # Response 반환하여 클라이언트에 400 Bad Request 상태 코드 전달

	if User.objects.filter(username__iexact=email).exists():
		return Response({"detail": "email already exists"}, status=400)

	try:
		validate_password(password) # 비밀번호 유효성 검사 수행
	except ValidationError as exc:
		message = exc.messages[0] if exc.messages else "password is invalid" # ValidationError에서 첫 번째 메시지를 가져오거나 기본 메시지 사용
		return Response({"detail": message}, status=400)

	user = User.objects.create_user( # Django 내부에서 비밀번호를 안전하게 암호화(해싱)하여 User 객체 생성 및 저장
		username=email.lower(),
		email=email.lower(),
		password=password,
		first_name=nickname
	)

	return Response(
		{
			"id": user.id,
			"nickname": user.first_name,
			"email": user.email
		},
		status=status.HTTP_201_CREATED
	)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
	return Response({"status": "ok"}, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
	user = request.user
	return Response(
		{
			"id": user.id,
			"nickname": user.first_name,
			"email": user.email
		},
		status=status.HTTP_200_OK
	)
