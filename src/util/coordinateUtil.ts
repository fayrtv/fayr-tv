export const isInRect = (rect: DOMRect, x: number, y: number) => {
    return y < rect.bottom && y > rect.top && x < rect.right && x > rect.left;
};
