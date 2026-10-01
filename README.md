# Class Hub Monorepo

Class Hub는 "수업 운영을 더 적은 클릭으로 관리"하는 B2B 클래스 운영 자동화 SaaS MVP입니다.

- `frontend`: Next.js App Router + Zustand + TanStack Query + Tailwind + shadcn-style UI
- `backend`: Django 5.2 + DRF + JWT + PostgreSQL
- `shared`: frontend/mobile 공통 타입, 상수, 유틸, i18n 리소스
- `mobile`: Expo + React Native + TypeScript 기반 iOS/Android 앱

## 1) Project Storyline

### 1-1. 기획: 문제 정의와 사용자 경험 방향

- 로그인 상태에 따라 전역 내비게이션을 분기
  - 로그인 시: 중앙 환영 메시지 + 우측 `로그아웃`
  - 비로그인 시: 우측 `회원가입 | 로그인`
- 비로그인 사용자도 서비스 핵심 가치를 느끼도록 대시보드는 공개 조회 허용
- MVP 핵심 기능 3개를 교사/강사 운영 관점으로 우선 설계
  - 시간표 및 오늘 일정
  - 출결 체크(리스트 + 토글)
  - 수업/학생 관리(칸반 UI, 상태: 진행/완료)
- 메뉴 이해 비용을 낮추기 위해 이모티콘/아이콘/픽토그램 중심 인터랙션 적용

### 1-2. 개발 명세: 기술 선택과 범위

- LTS 우선 원칙
  - 로컬 Node 20.5.1 환경에서 출발했지만, 배포 안정성을 위해 전역 기준을 LTS로 통일
  - 저장소 기준 Node는 `.nvmrc`의 `22`로 정렬
- 모노레포 구조
  - `frontend`, `backend`, `shared` 3개 폴더 분리
  - 루트 명령으로 각 개발 서버를 함께 실행할 수 있게 구성
- Frontend
  - Next.js App Router
  - 클라이언트 상태: Zustand
  - 서버 상태: TanStack Query
  - UI: shadcn-style + Tailwind (필요 시 Chakra UI / emotion 확장)
  - 반응형: mobile(<768), tablet(768~1024), desktop(>1024)
  - iPhone Duo 해상도 시나리오를 고려한 레이아웃 디테일 반영
  - 기본 다크 모드 + 라이트 모드 선택 가능
- Backend
  - Python 3.12, Django 5.2 LTS
  - REST API 중심 아키텍처(복잡한 TCP/UDP/WebSocket은 최소화)
  - PostgreSQL
  - 인증/암호화: JWT
- Shared
  - frontend/mobile이 공통으로 사용할 타입/상수/유틸
  - i18n: English 기본 + fr/de/es/nl/ko/da 확장

### 1-3. 구축/배포: 실제 운영에서 얻은 교훈

- Vercel 배포 과정에서 `engines` 버전 불일치 이슈 발생
  - 원인: 로컬/CI 런타임 기준이 달라 재현성이 낮아짐
  - 조치: Node 버전 정책을 LTS 기준으로 재정의하고 프로젝트 버전 고정
- Next.js 버전 호환 이슈 발생
  - 원인: 의존성 해석 시점과 런타임 기대치 차이
  - 조치: Next.js 및 관련 패키지 버전 정렬, 빌드/런타임 검증 시나리오 업데이트
- 결과
  - "기능 구현"뿐 아니라 "배포 재현성"까지 포함해 서비스 완주
  - 이후 신규 기능 개발 시, 버전 정책과 릴리즈 체크리스트를 선행하는 운영 습관 정착

### 1-4. 모바일 앱 초기 구축: 웹 MVP를 운영 가능한 앱 경험으로 확장

- 목표
  - 웹에서 검증한 교사/강사 중심 MVP 경험을 iOS/Android에서도 동일하게 제공
  - "조회는 공개, 수정은 인증" 원칙을 모바일에서도 일관되게 유지
- 구현
  - `mobile` 앱을 Expo + React Native + TypeScript 기반으로 초기 구축
  - JWT 기반 로그인/회원가입
  - 시간표/오늘 일정 CRUD
  - 출결 CRUD + present 토글
  - 수업/학생 보드 CRUD + 상태 토글
  - 로그인 전에는 mock data 기반 read-only 모드 제공
  - KO/EN 로케일 토글 지원
- 운영 포인트
  - `EXPO_PUBLIC_API_BASE_URL` 환경변수 전략으로 iOS 시뮬레이터/Android 에뮬레이터/실기기별 API 엔드포인트를 분리
  - 루트 명령 기준으로 backend/mobile 동시 개발 사이클 정착

## 2) MVP Feature Scope

### Public (비로그인)

- 대시보드 조회 가능
- 시간표/오늘 일정, 출결 현황, 수업 상태를 읽기 전용으로 확인

### Authenticated (로그인)

- 기능별 상세 페이지 라우팅
- 시간표/일정, 출결, 수업/학생 관리의 등록/수정/삭제(CRUD)
- 칸반 기반 상태 전환(진행/완료)

## 3) LTS migration first (required)

```bash
nvm install --lts
nvm use --lts
node -v
```

이 리퍼지토리는 `.nvmrc`을 통한 Node `22` 버전을 목표로 함. 

## 4) Quick start

```bash
# root
pnpm install

# frontend
cd frontend
pnpm install
cd ..

# backend
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
cd ..
```

## 5) Run locally from root

```bash
pnpm dev
```

혹은 분리해서:

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm dev:mobile
```

## 6) Environment files

- `frontend/.env.example` 복사 -> `frontend/.env.local`
- `backend/.env.example` 복사 -> `backend/.env`
- `mobile/.env.example` 복사 -> `mobile/.env`

## 7) Deployment outline

- Frontend: Vercel 에 Next.js 프로젝트로 `frontend`를 배포함.
- Backend: Django 호환이 가능한 인프라를 통해 `backend`를 배포함.
- PostgreSQL: backend 환경변수에 `DATABASE_URL` 와 PostgreSQL 관련 설정을 추가함.

## 8) Core principle

Class Hub의 핵심은 "빠르게 만들기"가 아니라 "빠르게 만들고, 실제로 운영 가능한 상태로 끝까지 가져가기"입니다.
이 문서는 그 과정의 의사결정과 운영 학습을 자산으로 남기기 위한 기준 문서입니다.
