# twitch_dccon_extension

트위치 채팅창에서 스트리머가 지정한 '디시콘'을 보기 위한 크롬 익스텐션입니다.

<img src="https://sfsepark.github.io/images/DCCON_SCREEN1.png" width="90%"></img>
<img src="https://sfsepark.github.io/images/DCCON_SCREEN3.png" width="90%"></img>

# 사용법 

각 방송에서 사용하는 디시콘 문법 그대로, 채팅창에서 사용할 수 있습니다!

정확한 문법은 다음과 같습니다.
- 원하는 채팅 사이에 ~XXX 로 디시콘을 표시

# 설치법

현재 모종의 이유로 크롬웹스토어는 사용이 불가능합니다. 최대한 빠른시일내에 복구하겠습니다 ㅜㅜ

https://chrome.google.com/webstore/detail/twitch-dccon-extension/nljojmgmnidbehhocgkbeejchcmkpgki?hl=ko


대신 다음과 같은 설치방법을 따라주세요.

1. github에서 파일을 다운로드 받으세요.

2.  크롬 주소창에 chrome://extensions 를 입력하세요.

3. 개발자 모드를 활성화 시키세요.

4. '압축해제된 확장 프로그램을 로드합니다.' 버튼을 누르세요.

5. 1.에서 다운로드 받은 twitch_dccon_extension "폴더" 를 선택하여 여세요.

6. ON OFF 버튼을 활성화 시키세요.

최대한 빨리 복구하겠습니다!



# 소스코드 구조

트위치 디시콘 익스텐션은 트위치 채팅창을 찾는 로직 대부분을 공유하는 다른 프로젝트와의 호환을 위해

https://github.com/sfsepark/TwitchChatFramework 트위치 챗 프레임워크(tcf) 위에서 구동되고 있습니다.

디시콘 익스텐션은 트위치 채팅창의 위치를 자동으로 분석해주는 프레임워크 위에서 돌아가도록 하기위해,

특정 트위치 채팅방에 접속했을 경우 그 스트리머가 디시콘을 사용하는지 ( funzinnu_dccon_picker ) 를 담는 모듈과

디시콘 선택기(funzinnu_dccon_picker.js) , 채팅인식후 디시콘으로 변환 하는 작업( dccon_observe.js ) 이  있는 모듈을

main.js 에서 tcf에 등록시킨후, tcf를 작동시킵니다.
