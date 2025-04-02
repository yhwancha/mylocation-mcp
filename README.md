# MyLocation MCP

위치 정보를 제공하는 Model Context Protocol (MCP) 서버입니다. 좌표 기반 또는 IP 주소 기반으로 위치 정보를 조회할 수 있습니다.

## 주요 기능

- 좌표 기반 위치 정보 조회
- IP 주소 기반 위치 정보 조회 (IPInfo.io 서비스 사용)
- 서비스 상태 확인

## 설치 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/yhwancha/mylocation-mcp.git
   cd mylocation-mcp
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 환경 변수 설정:
   ```bash
   cp .env.example .env
   ```
   `.env` 파일을 열어 IPInfo API 토큰을 설정합니다:
   ```
   IPINFO_TOKEN=your_ipinfo_token_here
   ```
   - IPInfo API 토큰은 [IPInfo.io](https://ipinfo.io)에서 무료로 발급받을 수 있습니다.

4. 프로젝트 빌드:
   ```bash
   npm run build
   ```

## 실행 방법

서버 실행:
```bash
npm start
```

개발 모드로 실행 (자동 재시작):
```bash
npm run dev
```

## 사용 가능한 도구

### 1. get-location-by-coordinates

좌표를 기반으로 위치 정보를 조회합니다.

**매개변수:**
- `latitude`: 위도 (-90 ~ 90)
- `longitude`: 경도 (-180 ~ 180)

**예시 응답:**
```json
{
  "status": "success",
  "source": "user_provided",
  "data": {
    "latitude": 37.5665,
    "longitude": 126.9780
  }
}
```

### 2. get-location-by-ip

IP 주소를 기반으로 위치 정보를 조회합니다.

**매개변수:**
- `ipAddress`: IP 주소 (예: "8.8.8.8")

**예시 응답:**
```json
{
  "status": "success",
  "source": "ip_based",
  "data": {
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "region": "California",
    "country": "US",
    "org": "Google LLC",
    "latitude": 37.386,
    "longitude": -122.0838
  }
}
```

### 3. health

서비스의 상태를 확인합니다.

**매개변수:** 없음

**예시 응답:**
```json
{
  "status": "healthy",
  "service": "mylocation-mcp"
}
```

## 에러 처리

모든 응답은 다음과 같은 형식을 따릅니다:

```json
{
  "status": "success|error",
  "source": "user_provided|ip_based",
  "data": {
    // 성공 시 위치 데이터
  },
  "error": "에러 발생 시 에러 메시지"
}
```

## 기술 스택

- TypeScript
- Model Context Protocol (MCP)
- IPInfo.io API
- Node.js
- Zod (스키마 검증)
- Axios (HTTP 클라이언트)

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.