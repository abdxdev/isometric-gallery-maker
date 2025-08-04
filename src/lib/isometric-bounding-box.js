export function calculateIsometricBoundingBox(width, height) {
  const rad = (deg) => (deg * Math.PI) / 180;

  const rotateXOuter = rad(35.264);
  const rotateYOuter = rad(-45);
  const rotateXInner = rad(-90);
  const translateZInner = height / 2;

  // Start with corners of floor (z=0)
  const corners = [
    [-width / 2, -height / 2, 0],
    [width / 2, -height / 2, 0],
    [width / 2, height / 2, 0],
    [-width / 2, height / 2, 0],
  ];

  // Step 1: Inner rotateX(-90deg) + translateZ(height/2)
  const afterInner = corners.map(([x, y, z]) => {
    // rotateX(-90)
    const y1 = y * Math.cos(rotateXInner) - z * Math.sin(rotateXInner);
    const z1 = y * Math.sin(rotateXInner) + z * Math.cos(rotateXInner);
    return [x, y1, z1 + translateZInner];
  });

  // Step 2: Outer rotateY(-45) then rotateX(35.264)
  const afterOuter = afterInner.map(([x, y, z]) => {
    // rotateY(-45)
    const x1 = x * Math.cos(rotateYOuter) + z * Math.sin(rotateYOuter);
    const z1 = -x * Math.sin(rotateYOuter) + z * Math.cos(rotateYOuter);

    // rotateX(35.264)
    const y1 = y * Math.cos(rotateXOuter) - z1 * Math.sin(rotateXOuter);
    const z2 = y * Math.sin(rotateXOuter) + z1 * Math.cos(rotateXOuter);

    return [x1, y1]; // only care about screen projection
  });

  const xs = afterOuter.map(([x]) => x);
  const ys = afterOuter.map(([, y]) => y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    width: (maxX - minX),
    height: (maxY - minY),
    bounds: { minX, maxX, minY, maxY },
    corners: afterOuter,
  };
}
