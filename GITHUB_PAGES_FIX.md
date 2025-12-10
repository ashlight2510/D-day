# GitHub Pages 배포 문제 해결 가이드

## 현재 상황

GitHub Pages가 작동하지 않는 문제를 해결하기 위한 가이드입니다.

## 해결 방법

### 1. GitHub 저장소 설정 확인

1. GitHub 저장소로 이동: https://github.com/ashlight2510/D-day
2. **Settings** > **Pages** 메뉴로 이동
3. **Source** 섹션에서 다음 중 하나를 선택:

   **옵션 A: GitHub Actions 사용 (권장)**
   - Source: "GitHub Actions" 선택
   - 이렇게 하면 `.github/workflows/static.yml`이 자동으로 실행됩니다

   **옵션 B: 브랜치에서 직접 배포**
   - Source: "Deploy from a branch" 선택
   - Branch: `main` 또는 `deploy` 선택
   - Folder: `/ (root)` 선택
   - Save 클릭

### 2. Actions 권한 확인

1. **Settings** > **Actions** > **General**로 이동
2. **Workflow permissions** 섹션에서:
   - "Read and write permissions" 선택
   - "Allow GitHub Actions to create and approve pull requests" 체크 (선택사항)
3. **Save** 클릭

### 3. deploy 브랜치 사용하기 (선택사항)

deploy 브랜치를 사용하려면:

```bash
# deploy 브랜치 생성
git checkout -b deploy

# 현재 변경사항 커밋 (필요한 경우)
git add .
git commit -m "Setup deploy branch"

# deploy 브랜치 푸시
git push origin deploy
```

그 다음 GitHub에서:
- Settings > Pages
- Source: "Deploy from a branch"
- Branch: `deploy` 선택
- Save

### 4. 워크플로우 수동 실행

1. GitHub 저장소의 **Actions** 탭으로 이동
2. "Deploy static content to Pages" 워크플로우 선택
3. 오른쪽의 **Run workflow** 버튼 클릭
4. 브랜치 선택 (main 또는 deploy)
5. **Run workflow** 클릭

### 5. 배포 상태 확인

1. **Actions** 탭에서 워크플로우 실행 상태 확인
2. 녹색 체크 표시가 나타나면 성공
3. 빨간 X 표시가 나타나면 에러 메시지 확인

## 일반적인 문제

### 문제 1: "Page build failed"
- **원인**: Jekyll이 활성화되어 있거나 잘못된 설정
- **해결**: `.nojekyll` 파일이 루트에 있는지 확인 (이미 생성됨)

### 문제 2: "Workflow not found"
- **원인**: 워크플로우 파일이 올바른 위치에 없음
- **해결**: `.github/workflows/static.yml` 파일이 있는지 확인

### 문제 3: "Permission denied"
- **원인**: Actions 권한이 부족함
- **해결**: Settings > Actions > General에서 권한 확인

### 문제 4: 사이트가 404 에러
- **원인**: 배포가 완료되지 않았거나 URL이 잘못됨
- **해결**: 
  - 배포 완료까지 1-2분 대기
  - URL 확인: `https://ashlight2510.github.io/D-day/`
  - 브라우저 캐시 삭제 후 재시도

## 배포 확인

배포가 성공하면 다음 URL에서 사이트를 확인할 수 있습니다:
- `https://ashlight2510.github.io/D-day/`

## 다음 단계

1. 위의 설정을 확인하고 수정
2. 필요하면 deploy 브랜치 생성
3. 변경사항을 푸시하여 배포 트리거
4. Actions 탭에서 배포 상태 확인

