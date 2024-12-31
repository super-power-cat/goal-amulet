export const shareToKakao = (url: string, title: string) => {
  if (window.Kakao) {
    const kakao = window.Kakao;
    console.log("log가 안찍혀욤?..?")
    console.log(import.meta.env.VITE_KAKAO_JS_KEY);
    if (!kakao.isInitialized()) {
      kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }

    kakao.Link.sendDefault({
      objectType: "feed", 
      content: {
        title: "제목입니다",
        description: "설명란입니다",
        imageUrl:
          "https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png",
        link: {
          mobileWebUrl: "https://www.naver.com",
          webUrl: "https://www.google.com",
        },
      },
      buttons: [
        {
          title: "자세히 보러 가기",
          link: {
            mobileWebUrl: "https://www.naver.com",
            webUrl: "https://www.google.com",
          },
        },
      ],
    });

    // kakao.Share.sendCustom({
    //   templateId: 115848,
    //   templateArgs: {
    //     title: title,
    //     description: '설명 영역입니다.',
    //   },
    // });
  } else {
    console.log("카카오 공유 실패");
  }
};
  
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