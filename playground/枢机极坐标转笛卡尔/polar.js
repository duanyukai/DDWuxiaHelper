
//围绕半径分别为0, 153, 307, 460

const rs = [153, 307, 460];

let points = [[0, 0]];

let c = 1;
let i;
for(i = 0; i < rs.length; i++) {
  for(let j = -90; j <270; j += 45) {
    let x = Math.round(rs[i] * Math.cos(j * Math.PI / 180));
    let y = Math.round(rs[i] * Math.sin(j * Math.PI / 180));
    // console.log(`<circle id="shuji-${c}" cx="${x}" cy="${y}" r="41" style="stroke:#9cd2fe;stroke-width:5;filter:url(#glow)" />`);
    points.push([x, y]);

    console.log(`[${x}, ${y}],`);

    c++;
  }
}

console.log("\n\n\n\n");
// 生成线坐标

// 顺序为先内圈纵向，再内圈环状，再外圈纵向，外圈环状

for(let circle = 0; circle < 3; circle++) {
  let a, b;
  for(i = 1; i <= 8; i++) {
    a = (circle - 1) * 8 < 0 ? 0 : (circle - 1) * 8 + i;
    b = circle * 8 + i;
    // console.log(a, b);
    // console.log(`<line id="line-${a}-${b}" x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" style="fill: none; stroke-width: 5; stroke: #9cd2fe; filter: url(#glow)" />`);
  }

  for(i = 1; i < 8; i++) {
    a = circle * 8 + i;
    b = circle * 8 + i + 1;
    // console.log(a, b);
    // console.log(`<line id="line-${a}-${b}" x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" style="fill: none; stroke-width: 5; stroke: #9cd2fe; filter: url(#glow)" />`);
  }
  a = circle * 8 + 1;
  b = circle * 8 + 8;
  // console.log(a, b);
  // console.log(`<line id="line-${a}-${b}" x1="${points[a][0]}" y1="${points[a][1]}" x2="${points[b][0]}" y2="${points[b][1]}" style="fill: none; stroke-width: 5; stroke: #9cd2fe; filter: url(#glow)" />`);
}

