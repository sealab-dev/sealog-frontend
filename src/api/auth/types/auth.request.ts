/**
 * 백엔드에 요청할 때 데이터의 형태를 정의
 * 타입을 정의해두면 코드 작성 시점에 에러 발견 가능
 */

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
