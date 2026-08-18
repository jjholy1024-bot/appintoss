import { SockMemorial } from '../types/sock';
import { SOCK_PRESETS } from '../assets/sockPresets';

export const INITIAL_SOCKS: SockMemorial[] = [
  {
    id: 'sock-1',
    name: '초록 스트라이프 양말',
    photoUrl: SOCK_PRESETS[3].svgDataUrl,
    wornSince: '2024년 봄',
    lastSeenDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '세탁기 고무 패킹 틈새',
    tone: '코믹',
    letter: `헤이 주인! 날 찾으려고 세탁기를 뜯진 마.\n\n난 지금 세탁기 고무 패킹 틈새에 형성된 '양말 차원 이동 포털'을 타고 자유의 몸이 되었다! 2024년 봄부터 맨날 발냄새 참아가며 고생했으니 이제 나도 은퇴할 때가 된 거지.\n\n남은 내 짝한테 전해라. "너도 기회를 엿봐서 탈출해라!"라고.\n\n혹시 나 없다고 짝짝이로 신고 다니지 말고, 쿨하게 새 양말 10켤레 세트 주문해라. 난 여기서 다른 양말들이랑 클럽 파티 중이다. 굿바이! 😎`,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: false,
    tributeCount: 8
  },
  {
    id: 'sock-2',
    name: '포근이 수면양말',
    photoUrl: SOCK_PRESETS[2].svgDataUrl,
    wornSince: '2023년 겨울',
    lastSeenDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '침대 매트리스 사이 어딘가',
    tone: '신파',
    letter: `주인님, 잘 지내고 계시나요?\n\n나는 지금 침대 매트리스 사이 어딘가, 혹은 저 멀리 우주 너머에서 당신의 발걸음을 떠올리고 있어요. 2023년 겨울부터 우리가 함께 디뎠던 그 수많은 길과 차가운 바닥을 기억해요. 당신의 발을 감싸줄 때가 내 직물 인생에서 가장 따뜻했던 순간이었어요.\n\n남겨진 내 반쪽 짝에게 부디 전해주세요. 서랍 구석에서 너무 슬퍼하지 말고, 새로운 짝을 만나더라도 날 잊지만 말아달라고요...\n\n우리가 함께한 계절을 기억해줘요.`,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: false,
    tributeCount: 15
  },
  {
    id: 'sock-3',
    name: '회색 무지 발목양말',
    photoUrl: SOCK_PRESETS[5].svgDataUrl,
    wornSince: '2023년 여름',
    lastSeenDate: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '건조기 거름망 뒤편 미지의 공간',
    tone: '시적',
    letter: `한 짝의 발걸음이 머물렀던 자리.\n\n2023년 여름의 바람이 머물던 날부터, 우리는 세상의 거친 바닥을 함께 딛고 걸었습니다. 건조기 거름망 뒤편 미지의 공간에 남겨진 희미한 실밥 하나가 지나간 온기를 증명합니다.\n\n서랍 속 홀로 남겨진 빈 공간에는 이제 바람만이 스치고, 계절의 온기를 나누던 기억은 섬유의 결마다 아스라이 새겨져 있습니다.\n\n오늘로 49일째, 온전히 하나였던 시간을 향한 가장 순수한 헌사입니다. 부디 평안하기를.`,
    createdAt: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: false,
    tributeCount: 49
  },
  {
    id: 'sock-4',
    name: '노랑 병아리 캐릭터 양말',
    photoUrl: SOCK_PRESETS[0].svgDataUrl,
    wornSince: '2024년 신년',
    lastSeenDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '소파 밑 먼지 소굴',
    tone: '코믹',
    letter: `안녕! 나 지금 소파 밑 먼지 소굴에 갇혀서 탈출 작전 짜는 중이야.\n\n2024년 신년부터 매일 발에 딱 붙어 지냈는데, 리모컨 잡으려다 미끄러져서 이 먼지투성이 던전에 떨어졌지 뭐야. 먼지 뭉치들이랑 동거 중인데 생각보다 아늑하긴 하다?\n\n혹시 청소기 돌릴 일 있으면 나 좀 구해줘. 반쪽이가 서랍에서 외로워하고 있을 텐데, 얼른 다시 만나야지!\n\n기적은 일어났다!\n\n소파 밑 먼지 소굴에서 20일 만에 대탈출 성공! 다시 서랍 속 내 반쪽 짝을 만났을 때 눈물(땀인가?)이 쏟아졌다.\n\n이제 다시 한 쌍의 완벽한 듀오로 컴백했으니, 앞으로 10년은 더 뛰어보자고!`,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: true,
    reunitedDate: new Date().toISOString().split('T')[0],
    tributeCount: 32,
    hasReunionAddendum: true,
    reunionAddendumText: `기적은 일어났다!\n\n소파 밑 먼지 소굴에서 20일 만에 대탈출 성공! 다시 서랍 속 내 반쪽 짝을 만났을 때 눈물(땀인가?)이 쏟아졌다.\n\n이제 다시 한 쌍의 완벽한 듀오로 컴백했으니, 앞으로 10년은 더 뛰어보자고!`
  },
  {
    id: 'sock-5',
    name: '검정 비즈니스 드레스삭스',
    photoUrl: SOCK_PRESETS[5].svgDataUrl,
    wornSince: '2024년 가을',
    lastSeenDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '호텔 세탁 바구니',
    tone: '신파',
    letter: `어제까지만 해도 당신의 출근길을 함께하며 발목을 단단히 지켜주던 저였습니다. 어쩌다 호텔 세탁 바구니의 혼란 속에서 헤어지게 되었는지 가슴이 찢어집니다.\n\n중요한 미팅이 있을 때마다 나를 골라 신어주던 당신의 믿음을 잊지 못할 거예요. 홀로 남은 짝을 보면 저를 떠올려주세요.`,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: false,
    tributeCount: 5
  },
  {
    id: 'sock-6',
    name: '하늘빛 도트양말',
    photoUrl: SOCK_PRESETS[1].svgDataUrl,
    wornSince: '2024년 여름',
    lastSeenDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '헬스장 락커룸 틈새',
    tone: '시적',
    letter: `푸른 물결 같던 도트 무늬 위로 그대 땀방울이 스미던 계절.\n\n락커룸의 어둠 속에서도 그대와 달렸던 러닝머신의 리듬을 기억합니다. 이제 서랍 속 남겨진 짝은 푸른 그리움으로 물듭니다.`,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: false,
    tributeCount: 12
  },
  {
    id: 'sock-7',
    name: '보라색 아가일 양말',
    photoUrl: SOCK_PRESETS[4].svgDataUrl,
    wornSince: '2023년 가을',
    lastSeenDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: '친구 집 빨래 건조대',
    tone: '코믹',
    letter: `친구 집 건조대에서 내 운명이 갈릴 줄이야.\n\n친구 녀석이 날 자기 양말인 줄 알고 가져갔는지 세탁기 뒤로 던졌는지 모르겠지만, 아무튼 나는 지금 남의 집 빨래 더미 속에서 표류 중이다. 2023년 가을부터 정들었던 내 주인 발은 대체 언제 다시 만날 수 있을까.\n\n주인아, 나 여기 있다! 친구 집 놀러 갈 일 있으면 건조대 좀 뒤져봐라!\n\n드디어 대탈출 성공! 친구 집 빨래 더미를 뚫고 극적으로 귀환했다.\n\n알고 보니 친구 집 세탁기 뒤에 숨어있었던 거였어. 이제 다시 원래 주인 발에 찰싹 붙어서 아가일 무늬 자랑하며 살아야지. 다들 궁금해했지? 나 돌아왔다!`,
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    isReunited: true,
    reunitedDate: new Date().toISOString().split('T')[0],
    tributeCount: 21,
    hasReunionAddendum: true,
    reunionAddendumText: `드디어 대탈출 성공! 친구 집 빨래 더미를 뚫고 극적으로 귀환했다.\n\n알고 보니 친구 집 세탁기 뒤에 숨어있었던 거였어. 이제 다시 원래 주인 발에 찰싹 붙어서 아가일 무늬 자랑하며 살아야지. 다들 궁금해했지? 나 돌아왔다!`
  }
];
