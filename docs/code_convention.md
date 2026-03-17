# Sealog Frontend 개발 컨벤션 (Coding Convention)

이 문서는 Sealog 프론트엔드 프로젝트의 일관성 있는 코드 작성과 유지보수를 위한 규칙을 정의합니다.

## 1. 기술 스택 (Tech Stack)

- **Framework**: React 19 (Vite 기반)
- **Language**: TypeScript
- **State Management**: Zustand 5
- **Data Fetching**: TanStack Query (React Query) 5
- **Styling**: CSS Modules (권장) & Plain CSS
- **API Client**: Axios

## 2. 파일 및 폴더 구조 (Directory Structure)

```text
src/
├── components/     # 여러 도메인에서 공통으로 사용되는 UI/Layout 컴포넌트
│   ├── layout/     # AppLayout, Header, Footer 등
│   └── ui/         # Button, Input, Toast 등 원자 단위 컴포넌트
├── features/       # 도메인별 기능 단위 (컴포넌트, 훅, 타입 포함)
│   ├── auth/
│   ├── blog/
│   └── admin/
├── pages/          # 라우트와 매핑되는 페이지 컴포넌트
├── services/       # API 호출 및 서버 상태 관리 (Data Layer)
│   └── [domain]/   # 도메인별 분리 (api, queries, mutations, keys, _types)
├── store/          # Zustand 전역 상태 저장소
├── routes/         # 라우팅 설정
├── styles/         # 전역 스타일 및 CSS 변수
└── utils/          # 공통 유틸리티 함수
```

## 3. 네이밍 규칙 (Naming Conventions)

### 3.1 파일 및 폴더

- **컴포넌트**: `PascalCase.tsx` (예: `PostCard.tsx`, `HomePage.tsx`)
- **컴포넌트 외 로직**: `camelCase.ts` (예: `authStore.ts`, `post.api.ts`)
- **스타일 파일**:
  - CSS Modules: `FileName.module.css` (권장)
  - 일반 CSS: `FileName.css`
- **폴더명**: 소문자 중심 (예: `components`, `features`, `user`), 도메인이 명확할 경우 `camelCase`
- **서비스 파일**: 도메인.목적.ts 형태 (예: `user.api.ts`, `post.queries.ts` 등)

### 3.2 코드 내부

- **변수 및 함수**: `camelCase`
- **상수**: `UPPER_SNAKE_CASE` (예: `API_BASE_URL`)
- **타입/인터페이스**: `PascalCase`
- **Props 타입**: `Component명Props` (예: `PostCardProps`)

## 4. 컴포넌트 작성 규칙

### 4.1 선언 방식

- 기본적으로 **함수 선언문(`function`)**을 사용하거나 **화살표 함수(`const`)**를 사용하되, 한 프로젝트 내에서 일관성을 유지합니다. (현재 프로젝트는 `function` 선언문이 다수 사용됨)
- 컴포넌트 파일의 기본 내보내기(`export default`)를 사용합니다.

```tsx
interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return <div className='post-card'>{/* ... */}</div>;
}
```

### 4.2 스타일링

- **CSS Modules** 사용을 권장합니다. (`styles` 객체로 import)
- 클래스 네이밍은 **BEM** 형식을 지향하되, CSS Modules 사용 시에는 간결하게 작성할 수 있습니다.

## 5. 데이터 계층 (Data Layer - Services)

`src/services/[domain]/` 구조를 엄격히 따릅니다.

- `domain.api.ts`: Axios를 사용한 순수 API 호출 함수
- `domain.queries.ts`: `useQuery`, `useInfiniteQuery` 정의
- `domain.mutations.ts`: `useMutation` 정의
- `domain.keys.ts`: Query Key 관리
- `_types/`: 해당 도메인의 Request/Response 타입 정의

## 6. 타입 관리 (Type Management)

- **API 타입**: `services/[domain]/_types/`에 위치시키며 `PostResponse`, `PostRequest` 등으로 구분합니다.
- **UI/도메인 타입**: `features/[domain]/types/`에 위치시키며 화면 UI에서 사용되는 인터페이스를 정의합니다.
- API 응답 데이터와 UI 데이터의 구조가 다를 경우, `toPost`와 같은 **Mapper 함수**를 사용하여 변환하는 것을 지향합니다.

---
