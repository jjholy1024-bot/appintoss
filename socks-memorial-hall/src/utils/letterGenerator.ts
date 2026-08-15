import { SockTone } from '../types/sock';

interface LetterParams {
  name: string;
  wornSince: string;
  lastSeenDate: string;
  location: string;
  tone: SockTone;
}

export function generateLetter(params: LetterParams): string {
  const { name, wornSince, location, tone } = params;
  const loc = location || '세탁기 배수구 뒤편 어딘가';
  const since = wornSince || '지난 어느 따뜻했던 날';
  const sockName = name ? `'${name}'` : '나';

  if (tone === '신파') {
    const templates = [
      `주인님, 잘 지내고 계시나요?\n\n${sockName}(은)는 지금 ${loc}, 혹은 저 멀리 우주 너머에서 당신의 발걸음을 떠올리고 있어요. ${since}부터 우리가 함께 디뎠던 그 수많은 길과 차가운 바닥을 기억해요. 당신의 발을 감싸줄 때가 내 직물 인생에서 가장 따뜻했던 순간이었어요.\n\n남겨진 내 반쪽 짝에게 부디 전해주세요. 서랍 구석에서 너무 슬퍼하지 말고, 새로운 짝을 만나더라도 날 잊지만 말아달라고요...\n\n우리가 함께한 계절을 기억해줘요. 언젠가 먼지가 되어 다시 만날 그날까지.`,
      `사랑하는 나의 주인님...\n\n어쩌다 ${loc}에서 당신의 손길을 놓쳐버렸을까요. ${since}부터 당신의 뒤꿈치를 묵묵히 받쳐주던 ${sockName}이었습니다.\n\n당신이 발을 딛던 매 순간마다 저는 당신을 지키는 가장 얇고도 든든한 방패였어요. 이제 홀로 남겨진 내 짝을 볼 때마다 눈물짓지 마세요.\n\n저는 비록 섬유 조각으로 흩어질지라도, 당신의 따스한 체온만은 영원히 기억할게요. 안녕, 나의 소중했던 사람.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  if (tone === '코믹') {
    const templates = [
      `헤이 주인! ${sockName} 찾으려고 세탁기 뜯진 마라.\n\n난 지금 ${loc}에 형성된 '양말 차원 이동 포털'을 타고 자유의 몸이 되었다! ${since}부터 맨날 발냄새 참아가며 고생했으니 이제 나도 은퇴할 때가 된 거지.\n\n남은 내 짝한테 전해라. "너도 기회를 엿봐서 탈출해라!"라고.\n\n혹시 나 없다고 짝짝이로 신고 다니지 말고, 쿨하게 새 양말 10켤레 세트 주문해라. 난 여기서 다른 양말들이랑 클럽 파티 중이다. 굿바이! 😎`,
      `주인님아, 헛수고 그만해라.\n\n${sockName}(이)가 어디 있냐고? 바로 당신이 절대 손 닿지 않는 ${loc}이다 ㅋㅋㅋ!\n\n${since}부터 매일 세탁기 360도 롤러코스터 태워놓고 이제 와서 슬픈 척하기는. 내 발목 밴드 다 늘어난 거 알고 있었지?\n\n이제 나는 해방이다! 서랍 속 짝꿍한테는 안부 전하고, 제발 발톱이나 좀 깎고 다녀라! 빠잉~ 👋`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // 시적
  const templates = [
    `${sockName}의 한 짝, 그 발걸음이 머물렀던 자리.\n\n${since}의 바람이 머물던 날부터, 우리는 세상의 거친 바닥을 함께 딛고 걸었습니다. ${loc}에 남겨진 희미한 실밥 하나가 지나간 온기를 증명합니다.\n\n서랍 속 홀로 남겨진 빈 공간에는 이제 바람만이 스치고, 계절의 온기를 나누던 기억은 섬유의 결마다 아스라이 새겨져 있습니다.\n\n형체는 흩어져도 그대와 나눈 보폭의 리듬은 영원한 침묵 속에 노래가 되어 흐를 것입니다.`,
    `계절이 머물다 간 자리마다\n그대 발끝의 온도가 남아 있습니다.\n\n${since}에 시작된 ${sockName}과의 작은 동행은 ${loc}이라는 고요한 쉼표 앞에 멈추어 섰습니다.\n\n짝을 잃은 슬픔은 외로움이 아니라, 온전히 하나였던 시간을 향한 가장 순수한 헌사입니다. 별빛 아래 고이 눕혀진 나의 직물 위로 평안의 기도가 내려앉기를.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}
