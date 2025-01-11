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
  img.src = svg;

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
      ctx.font = `${2 * scale}rem amulet_content2`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText(text, x + width / 2, y + height * 0.75);

      ctx.restore();
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

    // Fill the background with white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const amuletWidth = canvas.width * 0.8;
    const amuletHeight = (amuletWidth / AMULET_WIDTH) * AMULET_HEIGHT;

    const x = (canvas.width - amuletWidth) / 2;
    const y = (canvas.height - amuletHeight) / 2;

    await drawAmulet(ctx, x, y, amuletWidth, amuletHeight, colorInfo.code, svg, title, text);
  } else {
    canvas.width = AMULET_WIDTH;
    canvas.height = AMULET_HEIGHT;
    await drawAmulet(ctx, 0, 0, AMULET_WIDTH, AMULET_HEIGHT, colorInfo.code, svg, title, text);
  }

  return canvas.toDataURL('image/png');
};
