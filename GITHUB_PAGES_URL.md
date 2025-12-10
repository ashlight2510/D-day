# GitHub Pages 접속 URL

## 기본 URL

GitHub Pages 기본 URL:
- **https://ashlight2510.github.io/D-day/**

## 문제 해결

### CNAME 파일 제거됨

CNAME 파일이 제거되었으므로 이제 GitHub Pages 기본 URL로 접근해야 합니다.

### 도메인 설정이 필요한 경우

만약 `day.ashlight.store` 도메인을 사용하고 싶다면:

1. **DNS 설정** (도메인 제공업체에서):
   - CNAME 레코드 추가
   - 이름: `day`
   - 값: `ashlight2510.github.io`

2. **CNAME 파일 다시 생성**:
   ```bash
   echo "day.ashlight.store" > CNAME
   ```

3. **모든 HTML 파일의 URL을 `day.ashlight.store`로 변경**

### 현재 상태

- CNAME 파일: 제거됨
- 접속 URL: `https://ashlight2510.github.io/D-day/`
- 모든 링크: 상대 경로 사용 (정상 작동)

## 확인 방법

1. 브라우저에서 `https://ashlight2510.github.io/D-day/` 접속
2. 배포가 완료되었는지 Actions 탭에서 확인
3. 브라우저 캐시 삭제 후 재시도 (Ctrl+Shift+R 또는 Cmd+Shift+R)

