# ── 변수 선언 ─────────────────────────────────────────────────────────────────
# 백엔드 로컬 스웨거 API 주소 (JSON 데이터 반환 URL)
BACKEND_API_URL := http://localhost:8080/v3/api-docs
# 다운로드할 스웨거 문서 저장 경로
API_DOC_FILE := docs/sealog-swagger.json

# ── 기본 타겟 ─────────────────────────────────────────────────────────────────
.DEFAULT_GOAL := help
.PHONY: help \
        api-fetch type-check \

help:
	@echo ""
	@echo "  Sealog Frontend — 사용 가능한 명령어"
	@echo "  ─────────────────────────────────────────────────────"
	@echo "  [API & Type]"
	@echo "    make api-fetch    백엔드 Swagger 문서 다운로드"
	@echo "    make type-check  프로젝트 전체 타입스크립트 에러 검사"
	@echo ""
	@echo "  ─────────────────────────────────────────────────────"
	@echo ""

# ── API & Type ────────────────────────────────────────────────────────────────
api-fetch:
	@echo "Swagger(OpenAPI) 문서를 다운로드합니다..."
	curl -s $(BACKEND_API_URL) -o $(API_DOC_FILE)

type-check:
	@echo "TypeScript 타입 검사를 실행합니다..."
	npx tsc --noEmit