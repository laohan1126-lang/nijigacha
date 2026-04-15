// script.js

function drawCard() {
 const cn = document.getElementById('user-cn').value;
 if (!cn) { alert("請輸入你的 CN 名號！"); return; }

 const gachaBtn = document.querySelector('.btn-gacha');
 gachaBtn.disabled = true;
 gachaBtn.innerText = "召喚中...";

 // 隨機邏輯
 const char = characters[Math.floor(Math.random() * characters.length)];
 const rarity = rarities[Math.floor(Math.random() * rarities.length)];

 // 模擬抽卡動畫延遲
 setTimeout(() => {
 renderResult(cn, char, rarity);
 gachaBtn.disabled = false;
 gachaBtn.innerText = "開始單抽";
 }, 1500); // 1.5秒的「轉圈圈」時間
}

function renderResult(cn, char, rarity) {
 const colorMap = {
 "μ's": "#ff7e00",
 "Aqours": "#009fe8",
 "虹咲": "#fb7d39",
 "Liella!": "#ff7e1f"
 };

 const themeColor = colorMap[char.group] || "#ff69b4";
 document.body.style.backgroundColor = themeColor + "22"; // 透明度背景
 document.querySelector('.btn-back').style.backgroundColor = themeColor;

 const content = `
 <div class="result-header">
 <p>【${cn}】召喚到了：</p>
 <div class="rarity-badge badge-${rarity}">${rarity}</div>
 <h1 class="char-name">${char.name}</h1>
 </div>
 <div class="info-grid card-appear">
 <p><strong>✨ 所屬：</strong> ${char.group} (${char.subUnit})</p>
 <p><strong>🎭 性格：</strong> ${char.personality}</p>
 <p><strong>📊 數據：</strong> ${char.stats}</p>
 <p><strong>📖 劇情：</strong> ${char.hotStory}</p>
 <p><strong>🎵 代表曲：</strong> ${char.mainSong}</p>
 <div class="trivia-box">
 <p>💡 <strong>小知識：</strong> ${char.trivia}</p>
 </div>
 </div>
 `;
 document.getElementById('card-content').innerHTML = content;
 switchPage('result-page');
}

function switchPage(pageId) {
 document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
 document.getElementById(pageId).classList.add('active');
}

function backToHome() {
 switchPage('home-page');
}

// 背景音樂切換
let musicPlaying = false;
function toggleMusic() {
 const bgm = document.getElementById('bgm');
 if (!bgm) return;
 if (musicPlaying) {
 bgm.pause();
 musicPlaying = false;
 } else {
 bgm.play().catch(() => {});
 musicPlaying = true;
 }
}
