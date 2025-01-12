import { ColorOption, getColorInfo } from '../types';

const AMULET_WIDTH = 360;
const AMULET_HEIGHT = 480;
const WALLPAPER_WIDTH = 1080;
const WALLPAPER_HEIGHT = 1920;

export const drawAmulet = async (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  colorCode: string,
  svg: string,
  title: string,
  text: string,
  textSize: number,
  textTop: number
): Promise<void> => {
  // Calculate scale for font size adjustment
  const scale = width / AMULET_WIDTH;

  // Apply border-radius
  const borderRadius = 20 * scale; // Scale border-radius as well
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + borderRadius, y);
  ctx.lineTo(x + width - borderRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
  ctx.lineTo(x + width, y + height - borderRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
  ctx.lineTo(x + borderRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
  ctx.lineTo(x, y + borderRadius);
  ctx.quadraticCurveTo(x, y, x + borderRadius, y);
  ctx.closePath();
  ctx.clip();

  // Draw background
  ctx.fillStyle = colorCode;
  ctx.fillRect(x, y, width, height);

  // Draw SVG
  const img = new Image();
  img.src = "/"+svg;

  await new Promise<void>((resolve) => {

    img.onload = () => {
      const imageWrapperHeight = height * 0.667; // 320px / 480px
      const imageWrapperTop = height * 0.0625; // 30px / 480px

      const aspectRatio = img.width / img.height;
      const drawWidth = Math.min(width, imageWrapperHeight * aspectRatio);
      const drawHeight = Math.min(imageWrapperHeight, drawWidth / aspectRatio);

      const xOffset = x + (width - drawWidth) / 2;
      const yOffset = y + imageWrapperTop;

      ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);

      // Draw title
      ctx.font = `bold ${2.5 * scale}rem amulet_content4`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(title, x + width / 2, y + height * 0.1);

      // Draw text
      ctx.font = `${textSize * scale}rem amulet_content2`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      
      // 텍스트를 줄바꿈하여 그리기
      const lines = text.split('\n');
      const lineHeight = textSize * scale * 16; // 줄 간격 설정
      
      lines.forEach((line, index) => {
        const yPos = y + height * textTop + (index - 1) * lineHeight; // 기준점에서 위아래로 배치
        ctx.fillText(line, x + width / 2, yPos);
      });

      ctx.restore();
      resolve();
    };
    img.onerror = (err) => {
      console.error('Error loading SVG image:', err);
    };
  });
};

export const createAmuletImage = async (
  color: ColorOption,
  svg: string,
  title: string,
  text: string,
  textSize: number,
  textTop: number,
  isWallpaper: boolean = false
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not supported');
  const colorInfo = getColorInfo(color);

  // 고해상도 캔버스 크기 설정
  const scaleFactor = 2; // 두 배로 해상도를 높임
  const actualWidth = isWallpaper ? WALLPAPER_WIDTH * scaleFactor : AMULET_WIDTH * scaleFactor;
  const actualHeight = isWallpaper ? WALLPAPER_HEIGHT * scaleFactor : AMULET_HEIGHT * scaleFactor;

  canvas.width = actualWidth;
  canvas.height = actualHeight;

  // 화면에 표시할 크기
  if (isWallpaper) {
    canvas.style.width = `${WALLPAPER_WIDTH}px`;
    canvas.style.height = `${WALLPAPER_HEIGHT}px`;
  } else {
    canvas.style.width = `${AMULET_WIDTH}px`;
    canvas.style.height = `${AMULET_HEIGHT}px`;
  }

  // 배경 화면
  if (isWallpaper) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, actualWidth, actualHeight);

    const amuletWidth = actualWidth * 0.8; // 고해상도 기반 비율
    const amuletHeight = (amuletWidth / AMULET_WIDTH) * AMULET_HEIGHT;

    const x = (actualWidth - amuletWidth) / 2;
    const y = (actualHeight - amuletHeight) / 2;

    ctx.scale(scaleFactor, scaleFactor); // 스케일 적용
    await drawAmulet(ctx, x / scaleFactor, y / scaleFactor, amuletWidth / scaleFactor, amuletHeight / scaleFactor, colorInfo.code, svg, title, text, textSize, textTop);
  } else {
    ctx.scale(scaleFactor, scaleFactor); // 스케일 적용
    await drawAmulet(ctx, 0, 0, AMULET_WIDTH, AMULET_HEIGHT, colorInfo.code, svg, title, text, textSize, textTop);
  }

  return canvas.toDataURL('image/png');
};