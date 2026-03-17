# Sealog Frontend 개발 컨벤션 (Coding Convention)

이 문서는 Sealog 프론트엔드 프로젝트의 일관성 있는 코드 작성과 유지보수를 위한 최종 규칙을 정의합니다.

## 1. 기술 스택 (Tech Stack)

- **Framework**: React 19 (Vite 기반)
- **Language**: TypeScript
- **State Management**: Zustand 5
- **Data Fetching**: TanStack Query (React Query) 5
- **Styling**: CSS Modules (필수)
- **API Client**: Axios

## 2. 파일 및 폴더 구조 (Directory Structure)

```text
src/
├── components/     # 공통 UI/Layout 컴포넌트
│   ├── layout/     
│   └── ui/         
├── features/       # 도메인별 기능 단위
│   ├── [domain]/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/  # UI 및 도메인 전용 타입
├── pages/          # 라우트 페이지
├── services/       # Data Layer (API, Query, Mutation)
│   └── [domain]/   
│       └── types/  # API Request/Response 타입 (이전 _types)
├── store/          # Zustand 스토어
├── styles/         # 전역 스타일 (variables.css 등)
└── utils/          # 공통 유틸리티
```

## 3. 네이밍 규칙 (Naming Conventions)

### 3.1 파일 및 폴더
- **컴포넌트**: `PascalCase.tsx`
- **스타일 파일**: `FileName.module.css` (필수)
- **폴더명**: 소문자 (예: `components`, `types`, `auth`)
- **타입 폴더**: 항상 `types`를 사용하며 언더바(`_`)를 붙이지 않음.

### 3.2 코드 내부
- **변수/함수**: `camelCase`
- **컴포넌트 선언**: `const` 화살표 함수 사용.
- **스타일 클래스명**: CSS Modules 내에서 **`camelCase`** 사용 (예: `.postCardTitle`).
    - *이유: JS에서 `styles.postCardTitle` 형태로 접근하기 위함.*

## 4. 컴포넌트 작성 규칙 (Standard Component)

- **선언**: `const` 화살표 함수 사용.
- **내보내기**: 파일 하단에서 `export default` 사용.
- **Props**: `interface` 정의 및 구조 분해 할당 사용.

```tsx
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
}

const MyComponent = ({ title }: MyComponentProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

## 5. 데이터 및 타입 관리

- **API 타입**: `services/[domain]/types/`에 위치.
- **도메인 타입**: `features/[domain]/types/`에 위치.
- **불필요한 코드 제거**: `src/design`과 같은 퍼블리싱용 정적 파일은 프로젝트에서 제외함.
