import { ColorOption } from '../types';

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
  color: ColorOption,
  svg: string,
  text: string,
  fontSize: number
): Promise<void> => {
  // Draw background
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);

  // Draw SVG
  const img = new Image();
  img.src = svg; // svg 파일 파라미터로 받도록 수정 필요
  
  await new Promise<void>((resolve) => {
    img.onload = () => {
      // Calculate aspect ratio to maintain SVG proportions
      const aspectRatio = img.width / img.height;
      const drawWidth = width;
      const drawHeight = width / aspectRatio;
      
      // Center the image vertically
      const yOffset = y + (height - drawHeight) / 2;
      
      ctx.drawImage(img, x, yOffset, drawWidth, drawHeight);
      
      // Draw text
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + width / 2, y + height - fontSize * 2);
      
      resolve();
    };
  });
};

export const createAmuletImage = async (
  color: ColorOption,
  svg: string,
  text: string,
  isWallpaper: boolean = false
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not supported');

  if (isWallpaper) { // 배경화면 용 저장
    canvas.width = WALLPAPER_WIDTH;
    canvas.height = WALLPAPER_HEIGHT;
    
    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Calculate centered position for amulet
    const x = (canvas.width - AMULET_WIDTH) / 2;
    const y = (canvas.height - AMULET_HEIGHT) / 2;
    
    await drawAmulet(ctx, x, y, AMULET_WIDTH, AMULET_HEIGHT, color, svg, text, 24);
  } else {
    canvas.width = AMULET_WIDTH;
    canvas.height = AMULET_HEIGHT;
    await drawAmulet(ctx, 0, 0, AMULET_WIDTH, AMULET_HEIGHT, color, svg,  text, 20);
  }

  return canvas.toDataURL('image/png');
};