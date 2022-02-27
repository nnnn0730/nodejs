// Xiao Xiaole
// board 本身為二維陣列
// [
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 9, 17, 16, 8, 14, 13, 0],
//   [0, 19, 9, 1, 2, 3, 2, 0],
//   [0, 9, 5, 13, 3, 2, 19, 0],
//   [0, 16, 8, 11, 3, 1, 2, 0],
//   [0, 8, 9, 4, 16, 11, 10, 0],
//   [0, 14, 19, 14, 9, 10, 18, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0]
// ]
// 傳給前端為一維陣列
// 這邊 p 為一維座標 
//   - @param {number[]} p
//
// pXY 為二維座標
//   - @param {Object} pXY info of coordinate
//   - @param {number} pXY.x x coordinate
//   - @param {number} pXY.y y coordinate

const XI = function XI() {
  this.w = 8;
  this.h = 8;
  this.itemKinds = 20;
  this.allItem = [...Array(this.itemKinds).keys()];
  this.board = [...Array(this.h)].map(() => Array(this.w).fill(0));
}

// 開始一局新遊戲
XI.prototype.startNewGame = function startNewGame() {
  // for (let i = 1; i < this.h - 1; ++i) {
  //   for (let j = 1; j < this.w - 1; ++j) {
  //     this.board[i][j] = this.getRandomItem();
  //   }
  // }
  // 9 13 17 27
  this.board = [
    [0,0,0,0,0,0,0,0],
    [0,18,1,0,0,18,15,0],
    [0,0,0,0,14,15,12,0],
    [0,0,0,18,2,11,6,0],
    [0,14,4,19,14,17,9,0],
    [0,14,13,16,16,19,2,0],
    [0,3,7,5,2,11,6,0],
    [0,0,0,0,0,0,0,0]
  ];
}

// 產生物件
XI.prototype.getRandomItem = function getRandom() {
  const min = 1;
  const max = this.itemKinds;
  const ans = Math.random() * (max - min) + min;
  return Math.floor(ans);
}

// 編號轉座標
XI.prototype.to2D = function to2D(p) {
  this.isPointInBoard(p);
  return {
    x: Math.floor((p / this.h)),
    y: Math.floor((p % this.h)),
  };
}

// 座標轉編號
XI.prototype.to1D = function to1D(pXY) {
  this.isCoordinateInBoard(pXY);
  return (pXY.x * this.h) + pXY.y;
}

// 找到兩點路徑上的水平垂直編號
XI.prototype.getCrossPoint = function getCrossPoint(p) {
  const pXY = this.to2D(p);
  const arrX = [...Array(this.h).keys()].reduce((acc, y) => acc.concat(this.to1D({ x: pXY.x, y })), []);
  const arrY = [...Array(this.w).keys()].reduce((acc, x) => acc.concat(this.to1D({ x, y: pXY.y })), []);

  console.log(arrX, arrY)

  const set = new Set([...arrX, ...arrY]);
  set.delete(p);

  return [...set];
}

// 編號是否合法
XI.prototype.isPointInBoard = function isPointInBoard(p) {
  if (p < 0 || p >= (this.w * this.h))
    throw new Error(`p = ${p} is out of range w=${this.w}, h=${this.h}`);
}

// 座標是否合法
XI.prototype.isCoordinateInBoard = function isCoordinateInBoard(pXY) {
  if (pXY.x < 0 || pXY.x >= this.w)
    throw new Error(`pXY = ${JSON.stringify(pXY)} is out of range w=${this.w}, h=${this.h}`);
  if (pXY.y < 0 || pXY.y >= this.h)
    throw new Error(`pXY = ${JSON.stringify(pXY)} is out of range w=${this.w}, h=${this.h}`);
}
// --------------------------------------
// --------------------------------------
// 連線相關的檢查
XI.prototype.isPathClear = function isPathClear(pXY) {
  if (this.board[pXY.x][pXY.y] === 0) return true;
  return false;
}

XI.prototype.isDifferentItem = function isDifferentItem(p1, p2) {
  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);
  const p1Item = this.board[p1XY.x][p1XY.y];
  const p2Item = this.board[p2XY.x][p2XY.y];
  if (p1Item !== p2Item) return true;
  return false;
}


// 是否符合可以連線的規則
// 1. 如果兩個物件相同
// 2. 一個非0物件配一個0物件
XI.prototype.islegalItem = function islegalItem(p1, p2) {
  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);
  const p1Item = this.board[p1XY.x][p1XY.y];
  const p2Item = this.board[p2XY.x][p2XY.y];
  const isTheSame = (p1Item === p2Item);
  const p1Empty = (p1Item === 0) && (p2Item !== 0);
  const p2Empty = (p2Item === 0) && (p1Item !== 0);

  return !(isTheSame || p1Empty || p2Empty);
}

XI.prototype.isAnyZeroItems = function isAnyZeroItems(p1, p2) {
  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);
  const p1Item = this.board[p1XY.x][p1XY.y];
  const p2Item = this.board[p2XY.x][p2XY.y];
  if (p1Item === 0) return true;
  if (p2Item === 0) return true;
  return false;
}
// --------------------------------------
// --------------------------------------
// 實際三種連線的實作

// 水平連線
// 1. 先檢查是否為同一個點
// 2. 檢查是否同水平座標
// 3. 是否為不同物件
// 4. 找出 兩點之間所有的 y 變量，並檢查是否沒有阻礙
// @return {false or array} array 為連線編號
XI.prototype.horizon = function horizon(p1, p2) {
  if (p1 === p2) return false;

  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);

  if (p1XY.x !== p2XY.x) return false;
  if (this.islegalItem(p1, p2)) return false;

  const maxPy = Math.max(p1XY.y, p2XY.y);
  const minPy = Math.min(p1XY.y, p2XY.y) + 1;

  console.log(p1XY.y, p2XY.y)
  console.log(maxPy, minPy)
  const yRange = [...Array(maxPy - minPy).keys()].map(v => (v + minPy));
  const res = yRange.every(y => this.isPathClear({ x: p1XY.x, y }));

  if (!res) return res
  return [p1, p2, ...yRange.map(y => this.to1D({ x: p1XY.x, y }))].sort((a, b) => (a - b));
}

// 垂直連線
// 1. 先檢查是否為同一個點
// 2. 檢查是否同垂直座標
// 3. 是否為不同物件
// 4. 找出 兩點之間所有的 x 變量，並檢查是否沒有阻礙
// @return {false or array} array 為連線編號
XI.prototype.vertical = function vertical(p1, p2) {
  if (p1 === p2) return false;

  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);

  if (p1XY.y !== p2XY.y) return false;
  if (this.islegalItem(p1, p2)) return false;

  const maxPx = Math.max(p1XY.x, p2XY.x);
  const minPx = Math.min(p1XY.x, p2XY.x) + 1;
  const xRange = [...Array(maxPx - minPx).keys()].map(v => (v + minPx));
  const res = xRange.every(x => this.isPathClear({ x, y: p1XY.y }));

  if (!res) return res
  return [p1, p2, ...xRange.map(x => this.to1D({ x, y: p1XY.y }))].sort((a, b) => (a - b));
}

// 一次轉彎的連線
// 1. 先檢查是否為同一個點
// 2. 找出一次轉折的中繼點 p3 p4
// 3. 對 1->3->2 的路徑做檢查
// 4. 對 1->4->2 的路徑做檢查
XI.prototype.turnOnce = function horizon(p1, p2) {
  if (p1 === p2) return false;

  const p1XY = this.to2D(p1);
  const p2XY = this.to2D(p2);

  const p3XY = { x: p1XY.x, y: p2XY.y };
  const p4XY = { x: p2XY.x, y: p1XY.y };
  const p3 = this.to1D(p3XY);
  const p4 = this.to1D(p4XY);

  // 編號 1->3->2 路徑判斷
  const isp3Clear = this.isPathClear(p3XY);
  const p1To3 = this.horizon(p1, p3);
  const p3To2 = this.vertical(p3, p2);

  console.log(isp3Clear, p1To3, p3To2)

  // 編號 1->4->2 路徑判斷
  const isp4Clear = this.isPathClear(p4XY);
  const p1To4 = this.vertical(p1, p4);
  const p4To2 = this.horizon(p4, p2);

  console.log(isp4Clear, p1To4, p4To2, p1, p4, p2)

  const fstPathConnect = isp3Clear && p1To3 && p3To2;
  const sndPathConnect = isp4Clear && p1To4 && p4To2;

  console.log('!!',fstPathConnect, sndPathConnect)

  if (fstPathConnect) {
    return [...new Set([...p1To3, ...p3To2])];
  } else if (sndPathConnect) {
    return [...new Set([...p1To4, ...p4To2])];
  }

  return false;
}

XI.prototype.turnTwice = function turnTwice(p1, p2) {

}
// --------------------------------------
// --------------------------------------
XI.prototype.toFixed = function toFixed(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

module.exports = XI
// --------------------------------------
// --------------------------------------
const xi = new XI();
xi.startNewGame();
console.log(JSON.stringify(xi.board))
// console.log( xi.horizon(9, 11) );
// console.log( xi.vertical(9, 25) );

// console.log( xi.turnOnce(9, 27) );
console.log( xi.getCrossPoint(10) )


// console.log(xi.to2D(100))
// console.log(xi.to1D({x: 10, y: 2}))