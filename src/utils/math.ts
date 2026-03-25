/**
 * 線分(x1, y1)-(x2, y2)が、矩形(rx, ry, rw, rh)と交差しているか判定する
 */
export function lineRectIntersect(
  x1: number, y1: number, x2: number, y2: number,
  rx: number, ry: number, rw: number, rh: number
): boolean {
  // 1. まず、開始点か終了点のどちらかが矩形の中にあればヒット
  if ((x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) ||
      (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh)) {
    return true;
  }

  // 2. 線分と矩形の4辺との交差をチェック
  const left = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx, ry + rh);
  const right = lineLineIntersect(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
  const top = lineLineIntersect(x1, y1, x2, y2, rx, ry, rx + rw, ry);
  const bottom = lineLineIntersect(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  return left || right || top || bottom;
}

function lineLineIntersect(
  x1: number, y1: number, x2: number, y2: number,
  x3: number, y3: number, x4: number, y4: number
): boolean {
  const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (den === 0) return false;
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}