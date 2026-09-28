from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
def signup(request):
	nickname = request.data.get("nickname", request.data.get("name", "")).strip()
	email = request.data.get("email", "").strip()
	password = request.data.get("password", "").strip()

	if not nickname or not email or not password:
		return Response({"detail": "nickname, email, password are required"}, status=400)

	if User.objects.filter(username=email).exists():
		return Response({"detail": "email already exists"}, status=400)

	user = User.objects.create_user(
		username=email,
		email=email,
		password=password,
		first_name=nickname,
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
@permission_classes([IsAuthenticated])
def me(request):
	user = request.user
	return Response(
		{
			"id": user.id,
			"nickname": user.first_name,
			"email": user.email,
		},
		status=status.HTTP_200_OK,
	)
