# ClassHub Mobile (Expo + React Native)

## Quick Start

1. Install deps from repo root:

```bash
pnpm install
```

2. Copy env file:

```bash
cp mobile/.env.example mobile/.env
```

3. Run backend first:

```bash
pnpm dev:backend
```

4. Run mobile:

```bash
pnpm dev:mobile
```

## API Base URL Tips

- iOS simulator: `http://127.0.0.1:8000/api`
- Android emulator: `http://10.0.2.2:8000/api`
- Real device: use your local network IP, e.g. `http://192.168.0.10:8000/api`

Set it in `mobile/.env` with `EXPO_PUBLIC_API_BASE_URL`.

## Included Features

- Login / Signup with JWT
- Schedule CRUD
- Attendance CRUD + present toggle
- Class task board CRUD + status toggle
- Read-only mode with mock data before login
- KO/EN locale toggle
