# GitHub Pages 배포 가이드

## 현재 설정

이 프로젝트는 GitHub Actions를 사용하여 자동으로 GitHub Pages에 배포됩니다.

## 배포 방법

### 방법 1: main 브랜치 사용 (현재 설정)

1. 변경사항을 커밋하고 푸시:
```bash
git add .
git commit -m "Update site"
git push origin main
```

2. GitHub에서 자동으로 배포가 시작됩니다.
3. Actions 탭에서 배포 상태를 확인할 수 있습니다.

### 방법 2: deploy 브랜치 사용

deploy 브랜치를 사용하려면:

1. deploy 브랜치 생성 및 전환:
```bash
git checkout -b deploy
git push origin deploy
```

2. GitHub 저장소 설정에서:
   - Settings > Pages
   - Source: "Deploy from a branch" 선택
   - Branch: `deploy` 선택
   - Folder: `/ (root)` 선택
   - Save 클릭

3. 이후 main 브랜치의 변경사항을 deploy 브랜치로 병합:
```bash
git checkout deploy
git merge main
git push origin deploy
```

## 문제 해결

### GitHub Pages가 작동하지 않는 경우

1. **저장소 설정 확인**
   - Settings > Pages로 이동
   - Source가 "GitHub Actions"로 설정되어 있는지 확인
   - 또는 "Deploy from a branch"로 설정하고 브랜치 선택

2. **Actions 탭 확인**
   - Actions 탭에서 워크플로우 실행 상태 확인
   - 실패한 경우 에러 메시지 확인

3. **권한 확인**
   - Settings > Actions > General
   - "Workflow permissions"가 "Read and write permissions"로 설정되어 있는지 확인

4. **브랜치 확인**
   - 현재 워크플로우는 `main` 브랜치에서 작동합니다
   - 다른 브랜치를 사용하려면 워크플로우 파일을 수정하세요

## 배포 확인

배포가 완료되면 다음 URL에서 사이트를 확인할 수 있습니다:
- `https://[사용자명].github.io/D-day/`
- 또는 커스텀 도메인이 설정된 경우 해당 도메인

## 참고사항

- 배포는 보통 1-2분 정도 소요됩니다
- 첫 배포는 더 오래 걸릴 수 있습니다
- 배포 후 변경사항이 반영되기까지 몇 분이 걸릴 수 있습니다

