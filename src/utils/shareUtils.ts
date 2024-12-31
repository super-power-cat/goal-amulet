export const shareToKakao = (url: string, title: string) => {
  if (window.Kakao) {
    const kakao = window.Kakao;
    kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);

    kakao.Share.sendCustom({
      templateId: 111,
      templateArgs: {
        title: title,
        description: '설명 영역입니다.',
      },
    });
  }};
  
  export const shareToFacebook = (url: string) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  export const shareToTwitter = (url: string, title: string) => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  export const shareToLinkedIn = (url: string, title: string) => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };