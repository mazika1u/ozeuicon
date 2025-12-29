const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const frameImg = new Image();
frameImg.src = "icon.png";

let userImg = null;
let scale = 1;
let pos = { x: 256, y: 256 };
let dragging = false;
let last = { x: 0, y: 0 };

const MASK_RADIUS = 170;
const DIAMETER = MASK_RADIUS * 2;

function draw() {
  ctx.clearRect(0, 0, 512, 512);

  if (userImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, MASK_RADIUS, 0, Math.PI * 2);
    ctx.clip();

    const iw = userImg.width;
    const ih = userImg.height;

    const coverScale = Math.max(
      DIAMETER / iw,
      DIAMETER / ih
    ) * scale;

    const w = iw * coverScale;
    const h = ih * coverScale;

    ctx.drawImage(
      userImg,
      pos.x - w / 2,
      pos.y - h / 2,
      w,
      h
    );

    ctx.restore();
  }

  ctx.drawImage(frameImg, 0, 0, 512, 512);
}

document.getElementById("upload").addEventListener("change", e => {
  userImg = new Image();
  userImg.src = URL.createObjectURL(e.target.files[0]);
  userImg.onload = () => {
    scale = 1;
    pos = { x: 256, y: 256 };
    draw();
  };
});

document.getElementById("zoom").addEventListener("input", e => {
  scale = Number(e.target.value);
  draw();
});

canvas.addEventListener("pointerdown", e => {
  dragging = true;
  last.x = e.offsetX;
  last.y = e.offsetY;
});

canvas.addEventListener("pointermove", e => {
  if (!dragging || !userImg) return;
  pos.x += e.offsetX - last.x;
  pos.y += e.offsetY - last.y;
  last.x = e.offsetX;
  last.y = e.offsetY;
  draw();
});

canvas.addEventListener("pointerup", () => dragging = false);
canvas.addEventListener("pointerleave", () => dragging = false);

document.getElementById("download").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "icon.png";
  a.click();
});

frameImg.onload = draw;
