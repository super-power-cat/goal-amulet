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
  fontSize: number
): Promise<void> => {
  // Draw background
  ctx.fillStyle = colorCode;
  ctx.fillRect(x, y, width, height);

  // Draw SVG
  const img = new Image();
  img.src = svg;
  
  await new Promise<void>((resolve) => {
    img.onload = () => {
      // SVG를 imageWrapper 크기와 위치에 맞게 조정
      const imageWrapperHeight = height * 0.667; // 320px / 480px
      const imageWrapperTop = height * 0.0625; // 30px / 480px
      
      // Calculate aspect ratio to maintain SVG proportions
      const aspectRatio = img.width / img.height;
      const drawWidth = Math.min(width, imageWrapperHeight * aspectRatio);
      const drawHeight = Math.min(imageWrapperHeight, drawWidth / aspectRatio);
      
      // Center the image horizontally and position it below the title
      const xOffset = x + (width - drawWidth) / 2;
      const yOffset = y + imageWrapperTop;
      
      ctx.drawImage(img, xOffset, yOffset, drawWidth, drawHeight);
      
      // Draw title (상단 10% 위치)
      ctx.font = `bold 2.5rem amulet_content4`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(title, x + width / 2, y + height * 0.1);
      
      // Draw text (75% 위치)
      ctx.font = `2rem amulet_content2`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + width / 2, y + height * 0.75);
      
      resolve();
    };
  });
};

export const createAmuletImage = async (
  color: ColorOption,
  svg: string,
  title: string,
  text: string,
  isWallpaper: boolean = false
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not supported');
  const colorInfo = getColorInfo(color);

  if (isWallpaper) {
    canvas.width = WALLPAPER_WIDTH;
    canvas.height = WALLPAPER_HEIGHT;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const x = (canvas.width - AMULET_WIDTH) / 2;
    const y = (canvas.height - AMULET_HEIGHT) / 2;
    
    await drawAmulet(ctx, x, y, AMULET_WIDTH, AMULET_HEIGHT, colorInfo.code, svg, title, text, 24);
  } else {
    canvas.width = AMULET_WIDTH;
    canvas.height = AMULET_HEIGHT;
    await drawAmulet(ctx, 0, 0, AMULET_WIDTH, AMULET_HEIGHT, colorInfo.code, svg, title, text, 20);
  }

  return canvas.toDataURL('image/png');
};