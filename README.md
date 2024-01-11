# <span id='top'> YEOUN </span>
[YEOUN 바로가기](https://yeoun.netlify.app/)

테스트 계정

> ID: `test@yeoun.com`
 
> PW: `123123`

### 목차
1. [YEOUN 서비스 소개](#1-yeoun-서비스-소개)
2. [역할 분담](#2-역할-분담)
3. [개발 환경](#3-개발-환경)
4. [컨벤션 및 브랜치 전략 ](#4-컨벤션-및-브랜치-전략)
5. [업무 세부 내용 및 구현 기능](#5-업무-세부-내용-및-구현-기능)
6. [핵심 코드](#6-핵심-코드)
7. [데모 영상](#7-데모-영상)
8. [폴더 구조](#8-폴더-구조)
9. [팀 소개](#9-팀-소개)
10. [출처](#10-출처)

## 1. YEOUN 서비스 소개
**YEOUN (여행의 운치, 여운) : 전국 여행 정보를 모아볼 수 있는 여행 커뮤니티 서비스**
- 각 지역의 여행 정보를 실시간으로 얻고 공유할 수 있습니다. 
- 지도 기반으로 지역별 인기도를 한눈에 볼 수 있고, 지역별 관광지 정보도 확인할 수 있습니다.

## 2. 역할 분담
>### 공통
- 기획 및 아이디어 구체화
- Figma 초기 화면 디자인
- GitHub 관리
- 작업 진행 상황 관리
- 버그 관리
- README 작성

![image](https://github.com/YE0UN/YEOUN/assets/112460383/aea08354-e078-4739-a39d-87f34ed66a5f)

## 3. 개발 환경
### 3.1 기술 스택
- FE
  - React / Styled-components / Axios  
  - ESLint / Prettier
- BE
  - Node.js
  - Express.js
  - MongoDB
  - JWT
    
### 3.2 협업 툴
- 버전 관리 : Git, GitHub
- 이슈 관리 : GitHub Issues
- 문서 관리 : Notion, Excel (API 명세서)
- 디자인 : Figma
- 메신저 : Discord

### 3.3 테스트
- API 테스트 : Postman

### 3.4 배포
- FE: Netlify
- BE: GCP (+ Koyeb)

## 4. 컨벤션 및 브랜치 전략
### 4.1 컨벤션
#### FE
<details>
  <summary>코드 컨벤션</summary>
  <div>
    <ul>
      <li>들여쓰기(tab) 2칸 사용한다.</li>
      <li>JavaScript ES6+ 문법 사용한다.</li>
      <li>var 사용 금지한다.</li>
      <li>세미콜론 필수로 사용한다.</li>
      <li>작은 따옴표 사용한다.</li>
      <li>for, if문은 길이가 짧더라도 중괄호로 사용한다.</li>
      <li>리액트 컴포넌트 확장자는 jsx로 통일한다.</li>
      <li>함수 선언시에는 화살표 함수 사용한다.</li>
    </ul>
  </div>
</details>
<details>
  <summary>네이밍 컨벤션</summary>
  <div>
    <ul>
      <li>폴더명
        <ul>
          <li>
            camelCase : 직접적으로 바로 React 컴포넌트가 들어있지 않은 간접적인 관계의 폴더
          </li>
          <li>
            PascalCase : React 컴포넌트가 바로 들어 있는 폴더
          </li>
        </ul>
      </li>
      <li>파일명
        <ul>
          <li>
            React 컴포넌트 : PascalCase
          </li>
          <li>
            이미지파일 : kebab-case
          </li>
          <li>
            jsx : PascalCase
          </li>
        </ul>
      </li>
    </ul>
  </div>
</details>
<details>
  <summary>커밋 컨벤션</summary>
  <div>
    <ul>
      <li>   
        커밋 메시지는 타입: 주제 (#이슈번호)와 같이 작성한다.
      </li>
      <li>   
        타입은 종류 중 하나만 선택하며, 영어 소문자로 시작한다.
      </li>
      <li>타입 종류
        <ul>
          <li>
            fix: 올바르지 않은 동작을 고친 경우
          </li>
          <li>
            feat: 새로운 기능을 추가한 경우
          </li>
          <li>
            refactor: 내부 로직은 변경하지 않고 코드를 개선한 경우
          </li>
          <li>
            style: 코드 개선과 상관없이 사소하게 코드를 수정한 경우
          </li>
          <li>
            design: 사용자 UI를 추가, 수정한 경우 (마크업, 퍼블리싱 작업)
          </li>
          <li>
            add: 폴더, 파일 등을 추가한 경우
          </li>
          <li>
            move: 폴더, 파일, 코드 등의 위치를 이동한 경우
          </li>
          <li>
            rename: 폴더명, 파일명 등을 수정한 경우
          </li>
          <li>
            remove: 폴더, 파일, 코드 등을 삭제한 경우
          </li>
          <li>
            assets: 에셋을 추가, 수정한 경우
          </li>
          <li>
            docs: 문서를 추가, 수정한 경우
          </li>
          <li>
            chore: 위의 모든 경우에 포함되지 않는 기타 수정사항
          </li>
        </ul>
      </li>
    </ul> 
  </div>
</details>

#### BE
<details>
  <summary>네이밍 컨벤션</summary>
  <div>
    <ul>
      <li>폴더명
        <ul>
          <li>
            소문자로 시작하여 복수형으로 끝내기
          </li>
        </ul>
      </li>
      <li>파일명
        <ul>
          <li>
            Mongoose Schema 파일 : 대문자로 시작
          </li>
          <li>
            라우팅 파일 : 소문자로 시작하여 복수형으로 끝내기
          </li>
          <li>
            유틸리티 함수 파일 : kebab-case
          </li>
        </ul>
      </li>
    </ul>
  </div>
</details>
<details>
  <summary>커밋 컨벤션</summary>
  <div>
    <ul>
      <li>   
        커밋 메시지는 '타입: 주제'와 같이 작성한다.
      </li>
      <li>   
        타입은 종류 중 하나만 선택하며, 영어 소문자로 시작한다.
      </li>
      <li>타입 종류
        <ul>
          <li>
            fix: 올바르지 않은 동작을 고친 경우
          </li>
          <li>
            feat: 새로운 기능을 추가한 경우
          </li>
          <li>
            refactor: 내부 로직은 변경하지 않고 코드를 개선한 경우
          </li>
          <li>
            style: 코드 개선과 상관없이 사소하게 코드를 수정한 경우
          </li>
          <li>
            add: 폴더, 파일 등을 추가한 경우
          </li>
          <li>
            docs: 문서를 추가, 수정한 경우
          </li>
          <li>
            chore: 위의 모든 경우에 포함되지 않는 기타 수정사항
          </li>
        </ul>
      </li>
    </ul> 
  </div>
</details>

### 4.2 브랜치 전략
#### FE
```
main
├── develop
│   ├── feature/#1
│   │   │feature/#2
│___│___└── feature/#3
```
`feature/이슈 번호` 개인 작업 브랜치 생성, 기능 구현 후 develop에 PR

#### BE
```
main
├── dev
│   ├── feat/기능
│   │   │fix/기능
│___│___└── refactor/기능
```
`타입/기능` 개인 작업 브랜치 생성, 기능 구현 후 dev에 PR

<p align="right"><a href="#top">TOP</a></p>

## 5. 업무 세부 내용 및 구현 기능
## FE 김의호
### 🎨 디자인
- Figma 디자인 제안 / 구체화 / 구현
- 프로젝트에 필요한 Asset 제작

### 🖌️ UI
- 헤더 / 푸터 / 레이아웃 / 지도 / 모달 / 버튼 / 캐러셀 / 로딩 스피너 컴포넌트 제작
- 메인 / 로그인 / 회원가입 / 마이 페이지 / 게시글(상세, 등록, 수정) / 프로필 설정 / 관광지 / 404 페이지 퍼블리싱
- 체크박스 커스텀

### ⚙️ 기능
- 회원가입 / 로그인 / 로그아웃 기능 / 회원 정보 설정 / 회원 탈퇴
  - 유효성 검증에 따른 버튼 활성화 여부 결정
  - 로그인 성공 시, 토큰을 쿠키에 저장
  - 프로필 이미지 리사이징을 통한 성능 향상
- 지도 기능
  - 커뮤니티 내 지역별 인기도 확인
  - 원하는 지역 클릭 시, 해당하는 지역의 관광지 페이지로 이동
- 게시물 필터링 / 검색 기능
  - 최신 순, 인기 순, 댓글 순 필터링 (검색 키워드에도 적용) 
  - 지역별 필터링 (검색 키워드에도 적용)
  - 로딩 스피너를 통한 UX 향상
- 게시물 무한 스크롤
    - react-intersection-observer를 활용한 무한 스크롤 구현
- 게시물 등록 / 수정 / 삭제 기능
  - 이미지 리사이징을 통해 성능 향상
  - 지역 선택, 글 제목, 내용, 이미지(필수 아님)에 따른 (작성, 수정)버튼 상태관리
  - 사용자가 이미지 등록하지 않을 경우 기본 이미지 설정
  - 게시물 삭제 클릭 시, 모달 창으로 확인 요구
- 게시물 좋아요 / 댓글 / 스크랩 기능
  - (본인의 댓글만 삭제 가능) 댓글 삭제 시, 모달 창으로 확인 요구
  - 스크랩 클릭 시, 해당 유저의 카테고리 목록을 가져오며 추가 카테고리 생성 가능 (최대 10개)
  - 동일한 게시물을 여러 카테고리에 스크랩 가능
  - 스크랩 해제 시, 스낵바를 통해 UX 향상
- 마이 페이지
  - 내가 쓴 글 확인 기능
  - 내가 쓴 댓글 확인 및 삭제 기능
  - 스크랩 목록 확인 기능
  - 스크랩 카테고리명 수정 및 삭제 기능
- 관광지
  - 페이지네이션을 통한 성능 향상
  - 해당 관광지 클릭 시, 포털 사이트로 이동하여 추가 정보 획득 가능
- 회원 정보 조회 기능
  - 각 페이지에 맞는 형태(카드 플립, 모달)로 유저의 프로필 이미지, 닉네임, 소개 확인 기능 
- 탈퇴한 회원에 대한 처리 기능
  - 탈퇴한 회원의 게시물은 확인 가능, 회원 정보(프로필 이미지, 소개)는 확인 불가능 
  - 탈퇴한 회원의 게시물에 좋아요, 스크랩 차단
- 인증(로그인) 여부에 따른 각 페이지 접근 제한

### 📌 기타
- [SVG Sprite](#6-핵심-코드)
- 배포(Netlify) 및 버그 관리

## BE 서민경
### ⚙️ 기능
- 회원가입 / 로그인
  - Crypto 패키지 사용해 비밀번호 암호화
  - 회원 정보 유효성 검사를 통해 오류 처리
  - 이메일, 닉네임 중복 확인
- 지역별 관광지 정보
  - 오픈 API 활용해 데이터 가공
  - 지역 기반 필터링
  - 관광지명, 위치, 이미지 데이터 반환
  - 시도명 정식 명칭과 매핑 작업 ex) 충북 -> 충청북도
  - 관광지 정보 페이지네이션 구현
- 마이페이지
  - 내가 쓴 글 조회
  - 프로필 조회
  - 회원 정보(이미지, 닉네임, 이메일, 소개) 변경
  - 비밀번호 변경
  - 회원 탈퇴
## BE 조세영
### 📝 기획
- 프로젝트 아이디어 제안
- Figma 초기 화면 디자인 / 구체화
  
### ⚙️ 기능
- 로그인 / 로그아웃 / 회원 탈퇴 (토큰, 쿠키 활용)
	- 로그인 시 토큰이 생성되어 쿠키에 저장됨
	- 로그아웃, 회원 탈퇴 시 쿠키가 삭제됨
- 메인페이지
	- 게시물 전체 목록 조회
 	- 로그인 시 게시물마다 좋아요, 스크랩 여부 보이게 처리
	- lean으로 성능 개선

   	\* 아래 4개의 기능 중복 적용 가능
	- 무한스크롤을 위한 페이지네이션
	- 지역별 필터링
	- 최신순, 인기순, 댓글순 정렬
	- 게시물 검색
- 게시물 조회 / 등록 / 수정 / 삭제 기능
	- 기능마다 유효성 검사를 통해 오류 처리
	- 게시물 삭제 시 관련 댓글, 좋아요, 스크랩 함께 삭제
- 게시물 좋아요 / 댓글 / 스크랩 기능
	- 기능마다 유효성 검사를 통해 오류 처리
	- 게시물마다 회원의 좋아요, 스크랩 여부 보이게 처리
  	- 댓글 작성시간 한국시간으로 변환
- 마이페이지
  	- 내가 쓴 댓글 확인 기능
	- 내가 스크랩한 글 확인 기능
  	- lean으로 성능 개선
- 지도 기능
	- 커뮤니티 내 지역별 인기도 확인
- 탈퇴한 회원에 대한 처리 기능
	- 탈퇴한 회원의 게시물과 댓글은 확인 가능
	- 탈퇴한 회원의 스크랩 삭제, 회원 정보 확인 불가능
- 인증(로그인) 여부에 따른 각 기능 제한

### 🌏 배포
- Koyeb: 깃허브 기반 배포 -> 서버 성능 및 속도 저하 문제로 인해 GCP로 대체
- GCP (Google Cloud Platform): Compute Engine 사용 -> 도메인을 위해 최종적으로 App Engine 사용
  
### 📌 기타
- 개발 과정에서 편리함 고려 (ex. 상태코드 문자화)
- 파일 및 보안 관리 (ex. .gitignore, .env)

<p align="right"><a href="#top">TOP</a></p>

## 6. 핵심 코드
## FE 김의호
> ### useColorInterpolator
- 지도 기반 인기도 확인 기능
- 인기도는 각 지역별 게시물 수 + 좋아요 수 + 댓글 수로 산정
- 지역별 인기도 시각화를 위해 컬러를 보간하는 커스텀 훅 개발
  
```jsx
  /*useColorInterpolator.jsx 일부*/

  const useColorInterpolator = (sortedPopularity) => {
    const getColor = useCallback(
      (score) => {
        const minScore = ... // 인기가 가장 낮은 지역의 인기도 점수
        const maxScore = ... // 인기가 가장 높은 지역의 인기도 점수
  
        // 최소값과 최대값 사이에서 점수를 정규화
        const normalizedScore = Math.min(Math.max(score, minScore), maxScore);
  
        // 컬러 스케일 설정
        const lightColor = [220, 230, 240];
        const darkColor = [87, 127, 160];
  
        // 정규화된 점수에 따라 색상을 계산
        const interpolatedColor = lightColor.map((channel, index) => {
          const minChannelValue = channel;
          const maxChannelValue = darkColor[index];
          const channelRange = maxChannelValue - minChannelValue;
  
          // 정규화된 점수에 따라 색상 채널 값을 계산
          const channelValue = minChannelValue + (normalizedScore / maxScore) * channelRange;
  
          return Math.round(channelValue);
        });
  
        return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
      },
      [sortedPopularity],
    );
  
    return getColor;
  };
  
  export default useColorInterpolator;  
```
<br>

> ###  SVGSprite
- [Spritebot](https://github.com/thomasjbradley/spritebot) 활용을 통해 sprite-sheet를 생성
- SVG sprite를 통해 이미지 용량 경량화 및 퍼포먼스 향상 (lighthouse 측정 결과 퍼포먼스 점수 10% 상승)
<img width="400" alt="image" src="https://github.com/YE0UN/YEOUN/assets/112460383/9d0353a3-0e48-4bc4-8212-d50a51fd9115">

- 생성된 sprite-sheet를 컴포넌트화해서 사용
```jsx
/*GlobalSVGSprite.jsx 일부*/

const spriteSheet = (
  <svg xmlns='http://www.w3.org/2000/svg'>...</svg>
);

const GlobalSVGSprite = () => {
  const GlobalSVG = document.querySelector('#GlobalSVG');
  
  return createPortal(spriteSheet, GlobalSVG);
};

export default GlobalSVGSprite;
```
- [createPortal](https://react.dev/reference/react-dom/createPortal)을 활용해 지정된 id(GlobalSVG)에 해당 요소를 넣음
- 필요한 아이콘들이 하나의 파일로 제공되기 때문에 브라우저는 한 번 다운로드한 후 이를 캐시  
- 때문에 불필요한 네트워크 요청이 줄어들며, 이로 인해 웹 페이지의 로딩 시간이 단축되어 사용자 경험이 향상
- aria-label 사용으로 접근성 보완
```jsx
/*LocalSVGSprite.jsx 일부*/

const LocalSVGSprite = ({
  id,
  color,
  width = '100%',
  height = '100%',
  ariaLabel,
  onClickHandler,
  $ref,
  cursor = 'pointer',
}) => {
  return (
    <svg
      fill={color}
      width={width}
      height={height}
      aria-label={ariaLabel}
      onClick={onClickHandler}
      ref={$ref}
      style={{ cursor: `${cursor}` }}
    >
      <use href={`#${id}`} />
    </svg>
  );
};

export default LocalSVGSprite;
```

## BE 서민경
> ### Crypto
- 비밀번호 암호화를 위해 해시 함수 사용
- sha1 알고리즘으로 해싱
```js
const crypto = require('crypto');

module.exports = (password) => {
    const hash = crypto.createHash('sha1');
    hash.update(password);
    return hash.digest("hex");
}
```
> ### 관광지 정보
- 매번 오픈 API 호출할 경우 성능 저하 이슈 발생하므로, 필요한 데이터 파싱해서 리스트에 저장 후 사용
```js
/*tour-info.js*/
var tourData = [];
request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    if(error) {
        console.log(error)
    }

    var parsedJson = JSON.parse(response.body);

    for(i in parsedJson['response']['body']['items']['item']) {
                tourData.push({
                    name : parsedJson['response']['body']['items']['item'][i]['galTitle'], // 관광지명
                    location : parsedJson['response']['body']['items']['item'][i]['galPhotographyLocation'], // 관광지 위치
                    img : parsedJson['response']['body']['items']['item'][i]['galWebImageUrl'] // 관광지 이미지
                })
            }
});
module.exports = tourData;
```
- 지역명에 맞는 정보 필터링해서 반환
```js
/*tours.js 일부*/
const filteredTours = tourInfo.filter((tour) => {
	const location = JSON.stringify(tour.location).split(' ')[0];
        return location.includes(region) || location.includes(mappedRegion);
    }
);
```
## BE 조세영
> ### Passport-anonymous
- 하나의 API에서 로그인/로그아웃 시 서로 다른 동작이 필요함
- passport-jwt는 토큰 정보가 필수여서 새로운 패키지 도입
  
```js
router.get('/', passport.authenticate(['jwt', 'anonymous'], { session: false }), asyncHandler(async (req, res) => {
	const userId = req.user ? req.user._id : null;

	// 메인페이지 로직 ...
});
```
<br>

> ### 게시물 좋아요/스크랩 여부 표시
- 로그인 상태에서는 해당 유저의 각 게시물마다 좋아요/스크랩 여부를 표시해야 함
- Promise.all()을 사용해 각 await이 끝날 때까지 기다리게 하여 알맞은 응답값을 리턴함
  
```js
result = await Promise.all(
	posts.map(async(post) => {
    		let likeState = false;
                let scrap = false;

                if (await Like.exists({user: userId, post: post})) {
                    likeState = true;
                }
                if (await Collection.exists({user: userId, posts: post})) {
                    scrap = true;
                }
    
                return {post, likeState, scrap};
	})
);
```

<p align="right"><a href="#top">TOP</a></p>

## 7. 데모 영상
|회원가입 / 로그인 / 로그아웃|
|:---------:|
|![회원가입, 로그인, 로그아웃](https://github.com/YE0UN/YEOUN/assets/112460383/1ca79c57-8493-44db-9e91-ea7ff9c47b6e)| 

|프로필 설정|
|:---------:|
|![회원 정보 설정](https://github.com/YE0UN/YEOUN/assets/112460383/4bd96cca-8a59-4152-87a3-5f27029a2c6c)|

|게시글 작성|
|:---------:|
|![새 글 작성](https://github.com/YE0UN/YEOUN/assets/112460383/c0a42a73-7756-4fa5-9d16-2650b38a750c)|

|게시글 수정|
|:---------:|
|![글 수정](https://github.com/YE0UN/YEOUN/assets/112460383/71bd3ef5-d2f3-4378-9644-0d927fdc6568)|

|게시글 삭제|
|:---------:|
|![게시글 삭제](https://github.com/YE0UN/YEOUN/assets/112460383/aecfdc41-fdf7-46bf-b3be-d89f555b5b42)|

|게시글 검색|
|:---------:|
|![게시글 검색](https://github.com/YE0UN/YEOUN/assets/112460383/673d3322-b2c3-45d2-97e0-b73a439be753)|

|게시글 정렬|
|:---------:|
|![게시글 정렬](https://github.com/YE0UN/YEOUN/assets/112460383/58cc5010-69e7-4626-88f5-7b394427557b)|

|게시글 필터링|
|:---------:|
|![게시글 필터링](https://github.com/YE0UN/YEOUN/assets/112460383/5bc0ef35-25f6-4704-9832-d73d83817e72)|

|좋아요, 댓글|
|:---------:|
|![좋아요, 댓글](https://github.com/YE0UN/YEOUN/assets/112460383/eb79ea16-66db-4563-892a-bbb672d37eee)|

|프로필 확인|
|:---------:|
|![유저 프로필 확인](https://github.com/YE0UN/YEOUN/assets/112460383/94598885-0bd2-4d1b-bf56-0b2ddd660739)|

|관광지 페이지|
|:---------:|
|![관광지 페이지](https://github.com/YE0UN/YEOUN/assets/112460383/68b0ccde-8276-467f-bacf-365de1545320)|

|지도|
|:---------:|
|![지도](https://github.com/YE0UN/YEOUN/assets/112460383/c23cb9cb-698d-4ea2-8f0d-0e48505b5692)|

|내가 쓴 글 / 내가 쓴 댓글|
|:---------:|
|![내가 쓴 글, 내가 쓴 댓글](https://github.com/YE0UN/YEOUN/assets/112460383/c4638466-c04c-46b4-8b28-855787ecec35)|

|스크랩|
|:---------:|
|![스크랩, 카테고리 생성, 내 스크랩 확인](https://github.com/YE0UN/YEOUN/assets/112460383/0693c949-71c1-49f5-93b7-caa29b699d79)|

|스크랩 해제 / 카테고리 수정 및 삭제|
|:---------:|
|![스크랩 해제, 카테고리 수정 및 삭제](https://github.com/YE0UN/YEOUN/assets/112460383/9d2f07de-dece-4f9f-b38b-55b09b9e52bb)|

|회원 탈퇴|
|:---------:|
|![회원 탈퇴](https://github.com/YE0UN/YEOUN/assets/112460383/bab264ac-302a-4e31-a449-6b302de90e3c)|

<p align="right"><a href="#top">TOP</a></p>

## 8. 폴더 구조
### FE
```
📂 yeoun-client
├─ 📂 public
│  ├─ ⭐ favicon.ico
│  └─ 📜 index.html
└─ 📂 src
   ├─ 📂 api
   ├─ 📂 assets
   │  ├─ 📂 fonts
   │  └─ 📂 images
   ├─ 📂 components
   │  ├─ 📂 carousel
   │  ├─ 📂 common
   │  ├─ 📂 Loading
   │  ├─ 📂 map
   │  ├─ 📂 routes
   │  ├─ 📂 ScrollToTop
   │  └─ 📂 SVGSprite
   ├─ 📂 context
   ├─ 📂 hooks
   ├─ 📂 pages
   │  ├─ 📂 homePage
   │  ├─ 📂 LoginPage
   │  ├─ 📂 myPage
   │  ├─ 📂 NotFoundPage
   │  ├─ 📂 postPage
   │  ├─ 📂 ProfileSettingPage
   │  ├─ 📂 signupPage
   │  └─ 📂 touristAttractionPage
   ├─ 📂 styles
   ├─ 📄 App.jsx
   └─ 📄 index.jsx
```
* `src/api/` : API 클라이언트 및 엔드포인트 URL을 정의
* `src/assets/` : 서비스에서 사용하는 에셋 파일
* `src/components/` : 재사용 가능한 컴포넌트
* `src/context/` : 전역 데이터를 공유하기 위해 정의한 Context 파일
* `src/hooks/` : 재사용 가능한 Custom Hook
* `src/pages/` : 공통 컴포넌트를 사용해 만든 페이지
* `src/styles/` : 전역 스타일 파일

### BE
```
📂 yeoun-server
├─ 📂 config
├─ 📂 models
├─ 📂 routes
│  └─ 📄 index.js
├─ 📂 utils
└─ 📄 app.js
```
* `config/` : 설정 관련 파일 (ex. 사용자 인증 위한 passport.js)
* `models/` : Mongoose Schema 정의
* `routes/` : 기능별 라우팅 및 비즈니스 로직
* `utils/` : 유틸리티 함수 파일

<p align="right"><a href="#top">TOP</a></p>

## 9. 팀 소개 
|**김의호**|**배자현**|**서민경**|**조세영**|
| :------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <img width="180" alt="euihokim's profile" src="https://avatars.githubusercontent.com/euihokim"> | <img width="180"  alt="bizbaeja's profile" src="https://avatars.githubusercontent.com/bizbaeja"> | <img width="180" alt="slz6k's profile" src="https://avatars.githubusercontent.com/slz6k"> | <img width="180" alt="ilu25's profile" src="https://avatars.githubusercontent.com/ilu25" > |
| [euihokim](https://github.com/euihokim) | [bizbaeja](https://github.com/bizbaeja) | [slz6k](https://github.com/slz6k) | [ilu25](https://github.com/ilu25) |
| FE | FE | BE | BE |

<p align="right"><a href="#top">TOP</a></p>

## 10. 출처
- [공공데이터포털 (한국관광공사)](https://www.data.go.kr/data/15101914/openapi.do) : 오픈 API를 활용하여 관광지 정보 제공
- [Lorem Picsum](https://picsum.photos/) : 캐러셀 및 게시물 default 이미지로 사용
- [Unsplash](https://unsplash.com/) : 프로필 / 게시물 이미지 사용
- [지도](https://www.amcharts.com/svg-maps/) : 지도

<p align="right"><a href="#top">TOP</a></p>
