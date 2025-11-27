# SEO 최적화 가이드

이 문서는 D-day 계산기 웹사이트의 SEO 최적화를 위한 가이드입니다.

## 구현된 SEO 기능

### 1. 메타 태그
- ✅ 기본 SEO 메타 태그 (title, description, keywords)
- ✅ Open Graph 태그 (페이스북, 카카오톡 공유)
- ✅ Twitter Card 태그
- ✅ 네이버 검색 등록용 메타 태그
- ✅ 구글 검색 등록용 메타 태그
- ✅ Canonical URL

### 2. 구조화된 데이터 (JSON-LD)
- ✅ WebApplication 스키마
- ✅ FAQPage 스키마 (검색 결과에 FAQ 표시)

### 3. 파일
- ✅ robots.txt (검색 엔진 크롤러 가이드)
- ✅ sitemap.xml (사이트 구조 정보)
- ✅ .htaccess (서버 최적화 설정)

## 배포 전 필수 작업

### 1. 도메인 설정
다음 파일들에서 `yourdomain.com`을 실제 도메인으로 변경하세요:

1. **index.html**
   - Open Graph 이미지 URL
   - Canonical URL
   - 구조화된 데이터의 URL

2. **sitemap.xml**
   - 모든 URL의 도메인

3. **robots.txt**
   - Sitemap URL

### 2. 검색 엔진 등록

#### 구글 검색 등록
1. [Google Search Console](https://search.google.com/search-console) 접속
2. 사이트 추가
3. HTML 태그 방식으로 소유권 확인
4. `index.html`의 `google-site-verification` 메타 태그에 확인 코드 입력
5. sitemap.xml 제출

#### 네이버 검색 등록
1. [네이버 서치어드바이저](https://searchad.naver.com/) 접속
2. 사이트 등록
3. HTML 태그 방식으로 소유권 확인
4. `index.html`의 `naver-site-verification` 메타 태그에 확인 코드 입력
5. 사이트맵 제출

### 3. Open Graph 이미지
현재는 favicon.svg를 사용하고 있지만, 더 나은 공유 이미지를 만들 것을 권장합니다:
- 권장 크기: 1200x630px
- JPG 또는 PNG 형식
- 파일명: `og-image.jpg` 또는 `og-image.png`
- `index.html`의 `og:image`와 `twitter:image` 메타 태그 업데이트

### 4. .htaccess 설정
Apache 서버를 사용하는 경우 `.htaccess` 파일이 자동으로 적용됩니다.
다른 서버를 사용하는 경우:
- **Nginx**: nginx.conf에 해당 설정 추가
- **Netlify**: `_redirects` 파일 사용
- **Vercel**: `vercel.json` 설정

### 5. HTTPS 설정
`.htaccess` 파일의 HTTPS 강제 리다이렉트 주석을 해제하세요:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## SEO 체크리스트

### 기본 설정
- [x] 메타 타이틀 최적화 (60자 이내)
- [x] 메타 설명 최적화 (160자 이내)
- [x] 키워드 메타 태그
- [x] Canonical URL 설정
- [x] 파비콘 설정

### 소셜 미디어
- [x] Open Graph 태그
- [x] Twitter Card 태그
- [ ] 실제 OG 이미지 생성 및 업로드

### 기술적 SEO
- [x] robots.txt 생성
- [x] sitemap.xml 생성
- [x] 구조화된 데이터 (JSON-LD)
- [x] 시맨틱 HTML 태그 사용
- [x] 모바일 반응형 디자인
- [x] 페이지 로딩 속도 최적화

### 검색 엔진 등록
- [ ] 구글 Search Console 등록
- [ ] 네이버 서치어드바이저 등록
- [ ] sitemap.xml 제출

## 키워드 전략

### 주요 키워드
- D-day 계산기
- 디데이 계산기
- 날짜 계산기
- 카운트다운 계산기
- 목표일 계산

### 롱테일 키워드
- 목표일까지 며칠 남았는지 계산
- 생일까지 며칠 남았나
- 시험일까지 며칠
- 기념일까지 며칠 남았는지

## 성능 최적화

### 이미지 최적화
- SVG 파비콘 사용 (이미 최적화됨)
- OG 이미지는 WebP 또는 최적화된 JPG 사용 권장

### 코드 최적화
- CSS/JS 파일 압축 (배포 시)
- Gzip 압축 활성화 (.htaccess에 포함)

## 모니터링

### 구글 Analytics (선택사항)
배포 후 Google Analytics를 추가하여 트래픽을 모니터링할 수 있습니다.

### 검색 순위 추적
- Google Search Console에서 검색 성과 확인
- 네이버 서치어드바이저에서 노출 현황 확인

## 추가 권장사항

1. **콘텐츠 추가**: 블로그나 사용 가이드 페이지 추가
2. **백링크**: 관련 사이트에서 링크 받기
3. **소셜 미디어**: SNS 공유로 트래픽 유도
4. **사용자 경험**: 빠른 로딩 속도, 직관적인 UI 유지

## 문의

SEO 관련 문의사항이 있으시면 언제든지 연락주세요.

