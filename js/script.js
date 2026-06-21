// ==========================================
// CONSTANTES E CONFIGURAÇÕES INICIAIS
// ==========================================

const DEFAULT_QUESTIONS = [
  { q: "Qual rede social é famosa pelas dancinhas e vídeos curtos?" },
  { q: "Qual jogo tem os modos Battle Royale e Construção?" },
  { q: "Em qual série os personagens enfrentam o Demogorgon?" },
];

function getAvatarUrl(name) {
  return name ? name.trim() : "Jogador";
}

const DEFAULT_TEAMS = [
  {
    name: "Grupo Alfa",
    players: [
      { id: "p-0-0", name: "Jogador 1", photo: "Jogador 1", alive: true },
      { id: "p-0-1", name: "Jogador 2", photo: "Jogador 2", alive: true },
    ],
  },
  {
    name: "Grupo Beta",
    players: [
      { id: "p-1-0", name: "Jogador 1", photo: "Jogador 1", alive: true },
      { id: "p-1-1", name: "Jogador 2", photo: "Jogador 2", alive: true },
    ],
  },
];

// ==========================================
// ESTADOS DA APLICAÇÃO (LOCAL STORAGE)
// ==========================================
let teams = JSON.parse(localStorage.getItem("trivia_teams")) || DEFAULT_TEAMS;
let questions =
  JSON.parse(localStorage.getItem("trivia_questions")) || DEFAULT_QUESTIONS;
let currentQuestionIndex =
  parseInt(localStorage.getItem("trivia_question_idx")) || 0;

function saveToLocalStorage() {
  localStorage.setItem("trivia_teams", JSON.stringify(teams));
  localStorage.setItem("trivia_questions", JSON.stringify(questions));
  localStorage.setItem("trivia_question_idx", currentQuestionIndex.toString());
}

// ==========================================
// RENDERIZAÇÃO DA INTERFACE DE JOGO
// ==========================================
function renderGameTeams() {
  const container = document.getElementById("teams-display-container");
  if (!container) return;
  container.innerHTML = "";

  // Paleta de cores divertidas inspiradas nas fases do Super Mario
  const bgColors = [
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#facc15",
    "#a855f7",
    "#ec4899",
  ];

  teams.forEach((team, tIdx) => {
    let playersHTML = "";
    team.players.forEach((player) => {
      const disabledClass = !player.alive ? "disabled" : "";
      const isUpload = player.photo && player.photo.startsWith("data:image/");

      let avatarVisualHTML = "";

      if (isUpload) {
        avatarVisualHTML = `<img src="${player.photo}" alt="Foto" style="width:100%; height:100%; object-fit:cover; border-radius:18px;">`;
      } else {
        const nameString = player.photo || player.name || "J";
        const firstLetter = nameString.trim().charAt(0).toUpperCase();
        const charCode = firstLetter.charCodeAt(0) || 0;
        const chosenBg = bgColors[charCode % bgColors.length];

        avatarVisualHTML = `
          <div style="width:100%; height:100%; background-color:${chosenBg}; border-radius:18px; display:flex; align-items:center; justify-content:center; color:white; font-family:sans-serif; font-size:42px; font-weight:bold; user-select:none; text-shadow: 2px 2px 0px #000000;">
            ${firstLetter}
          </div>
        `;
      }

      const overlayXHTML = !player.alive
        ? '<span class="overlay-x">✕</span>'
        : "";

      playersHTML += `
        <div id="${player.id}" class="player-item ${disabledClass}" onclick="eliminatePlayer('${player.id}', ${tIdx})">
          <div class="avatar-wrapper">
            ${avatarVisualHTML}
            ${overlayXHTML}
          </div>
          <span class="player-name">${player.name}</span>
        </div>
      `;
    });

    container.innerHTML += `
      <div id="team-card-${tIdx}" class="team-card">
        <h3 class="team-title">${team.name}</h3>
        <div class="players-list">${playersHTML}</div>
      </div>
    `;
  });
}

// ==========================================
// OPERAÇÕES DO MODAL (ESTRUTURA E INTERFACES)
// ==========================================
function openModal() {
  const inputsContainer = document.getElementById("modal-teams-inputs");
  if (!inputsContainer) return;
  inputsContainer.innerHTML = "";

  teams.forEach((team, tIdx) => {
    let rowsHTML = "";
    team.players.forEach((player, pIdx) => {
      rowsHTML += `
        <div class="form-row-players">
          <input type="text" id="input-p-${tIdx}-${pIdx}-name" value="${player.name}" placeholder="Nome">
          <input type="file" id="input-p-${tIdx}-${pIdx}-file" accept="image/*">
        </div>
      `;
    });

    inputsContainer.innerHTML += `
      <div class="modal-section">
        <div class="form-group">
          <label>Nome do Grupo ${tIdx + 1}:</label>
          <input type="text" id="input-team-${tIdx}" value="${team.name}">
        </div>
        <h4>Integrantes e Fotos:</h4>
        <div id="players-rows-container-${tIdx}">${rowsHTML}</div>
        <button type="button" class="btn btn-add-p" onclick="addNewPlayerField(${tIdx})">➕ Adicionar Pessoa</button>
      </div>
    `;
  });

  let questionsHTML = "";
  questions.forEach((qObj, qIdx) => {
    questionsHTML += `
      <div class="form-row-questions" id="q-row-${qIdx}">
        <input type="text" id="input-q-${qIdx}" value="${qObj.q}" placeholder="Digite a pergunta aqui...">
        <button type="button" class="btn-danger" onclick="deleteQuestionField(${qIdx})">Remover</button>
      </div>
    `;
  });

  inputsContainer.innerHTML += `
    <div class="modal-section">
      <h4>📋 Gerenciar Perguntas do Jogo</h4>
      <div id="questions-rows-container">${questionsHTML}</div>
      <button type="button" class="btn btn-add-p" onclick="addNewQuestionField()">➕ Criar Nova Pergunta</button>
    </div>
  `;

  // CORREÇÃO ASSEGURADA: Força a remoção do display-none independente do seletor CSS do overlay
  const modal = document.getElementById("setup-modal");
  if (modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex"; // Garante a renderização do bloco acima do cenário
  }
}

function closeModal() {
  const modal = document.getElementById("setup-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}

function addNewPlayerField(tIdx) {
  const container = document.getElementById(`players-rows-container-${tIdx}`);
  if (!container) return;
  const nextIdx = container.children.length;
  const div = document.createElement("div");
  div.className = "form-row-players";
  div.innerHTML = `
    <input type="text" id="input-p-${tIdx}-${nextIdx}-name" placeholder="Novo Integrante">
    <input type="file" id="input-p-${tIdx}-${nextIdx}-file" accept="image/*">
  `;
  container.appendChild(div);
}

function addNewQuestionField() {
  const container = document.getElementById("questions-rows-container");
  if (!container) return;
  const nextIdx = container.children.length;
  const div = document.createElement("div");
  div.className = "form-row-questions";
  div.id = `q-row-${nextIdx}`;
  div.innerHTML = `
    <input type="text" id="input-q-${nextIdx}" placeholder="Escreva a nova pergunta...">
    <button type="button" class="btn-danger" onclick="deleteQuestionField(${nextIdx})">Remover</button>
  `;
  container.appendChild(div);
}

function deleteQuestionField(idx) {
  const field = document.getElementById(`q-row-${idx}`);
  if (field) field.remove();
}
// ==========================================
// PROCESSAMENTO E SALVAMENTO DE DADOS DO MODAL
// ==========================================
function saveModalData() {
  let readersLoaded = 0;
  let totalFiles = 0;

  for (let t = 0; t < 2; t++) {
    const container = document.getElementById(`players-rows-container-${t}`);
    if (!container) continue;
    const totalP = container.children.length;
    for (let p = 0; p < totalP; p++) {
      const fileInput = document.getElementById(`input-p-${t}-${p}-file`);
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        totalFiles++;
      }
    }
  }

  function finishSaving() {
    if (readersLoaded === totalFiles) {
      const qContainer = document.getElementById("questions-rows-container");
      const savedQuestions = [];
      if (qContainer) {
        Array.from(qContainer.children).forEach((row) => {
          const input = row.querySelector('input[type="text"]');
          if (input && input.value.trim() !== "") {
            savedQuestions.push({ q: input.value.trim() });
          }
        });
      }
      questions =
        savedQuestions.length > 0 ? savedQuestions : DEFAULT_QUESTIONS;

      if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;

      saveToLocalStorage();
      closeModal();
      updateUI();
    }
  }

  for (let t = 0; t < 2; t++) {
    const teamInput = document.getElementById(`input-team-${t}`);
    teams[t].name = teamInput
      ? teamInput.value || `Grupo ${t + 1}`
      : `Grupo ${t + 1}`;

    const container = document.getElementById(`players-rows-container-${t}`);
    const totalP = container ? container.children.length : 0;

    if (teams[t].players.length > totalP) {
      teams[t].players = teams[t].players.slice(0, totalP);
    }

    for (let p = 0; p < totalP; p++) {
      const nameInput = document.getElementById(`input-p-${t}-${p}-name`);
      const nameVal = nameInput
        ? nameInput.value || `Jogador ${p + 1}`
        : `Jogador ${p + 1}`;
      const fileInputElement = document.getElementById(
        `input-p-${t}-${p}-file`,
      );
      const fileInput = fileInputElement ? fileInputElement.files : null;

      if (!teams[t].players[p]) {
        teams[t].players[p] = {
          id: `p-${t}-${p}`,
          name: nameVal,
          photo: getAvatarUrl(nameVal),
          alive: true,
        };
      } else {
        const oldPhoto = teams[t].players[p].photo;
        if (
          teams[t].players[p].name !== nameVal &&
          (!oldPhoto || !oldPhoto.startsWith("data:image/"))
        ) {
          teams[t].players[p].photo = getAvatarUrl(nameVal);
        }
        teams[t].players[p].name = nameVal;
      }

      if (fileInput && fileInput.length > 0) {
        const reader = new FileReader();
        const curT = t,
          curP = p;
        reader.onload = function (e) {
          teams[curT].players[curP].photo = e.target.result;
          readersLoaded++;
          finishSaving();
        };
        reader.readAsDataURL(fileInput[0]);
      }
    }
  }

  if (totalFiles === 0) finishSaving();
}

// ==========================================
// MECÂNICAS E EVENTOS DE REGRAS DO JOGO
// ==========================================
function eliminatePlayer(playerId, teamIndex) {
  const team = teams[teamIndex];
  const player = team.players.find((p) => p.id === playerId);

  if (player && player.alive) {
    player.alive = false;
    saveToLocalStorage();
    updateUI();

    if (team.players.every((p) => !p.alive)) {
      endGame(teams[teamIndex === 0 ? 1 : 0].name);
    }
  }
}

function nextQuestion() {
  if (questions.length === 0) return;
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  saveToLocalStorage();
  updateUI();
}

function updateUI() {
  const numElem = document.getElementById("question-number");
  const textElem = document.getElementById("question-text");

  if (numElem && textElem) {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      numElem.innerText = `Pergunta #${currentQuestionIndex + 1}`;
      textElem.innerText = questions[currentQuestionIndex].q;
    } else {
      numElem.innerText = `Pergunta #0`;
      textElem.innerText =
        "Abra as configurações para cadastrar novas perguntas!";
    }
  }
  renderGameTeams();
}

function endGame(winnerName) {
  const mainScreen = document.getElementById("screen-main");
  const overScreen = document.getElementById("screen-game-over");
  const winnerElem = document.getElementById("winner-name");

  if (mainScreen) mainScreen.classList.add("hidden");
  if (overScreen) overScreen.classList.remove("hidden");
  if (winnerElem) winnerElem.innerText = winnerName;
}

function resetGame() {
  currentQuestionIndex = 0;
  teams.forEach((t) => t.players.forEach((p) => (p.alive = true)));
  saveToLocalStorage();

  const overScreen = document.getElementById("screen-game-over");
  const mainScreen = document.getElementById("screen-main");

  if (overScreen) overScreen.classList.add("hidden");
  if (mainScreen) mainScreen.classList.remove("hidden");

  updateUI();
}

// ==========================================
// CRIAÇÃO DO FOOTER DINÂMICO (LEO GOMES DEV)
// ==========================================
function injectFooter() {
  if (document.getElementById("game-footer")) return;

  const footer = document.createElement("footer");
  footer.id = "game-footer";

  footer.style.cssText = `
    width: 100%;
    text-align: center;
    padding: 20px 10px;
    margin-top: 40px;
    font-family: sans-serif;
    font-weight: bold;
    font-size: 1.1rem;
    text-transform: uppercase;
  `;

  footer.innerHTML = `
    <span style="color: #ffffff; text-shadow: 2px 2px 0px #000000; letter-spacing: 0.5px;">Desenvolvido por </span>
    <a href="https://leogomesdev.com" target="_blank" style="color: #facc15; text-decoration: none; text-shadow: 2px 2px 0px #000000; border-bottom: 3px dashed #ffffff; padding-bottom: 2px; transition: color 0.1s ease;">
      Leo Gomes Developer
    </a>
  `;

  const link = footer.querySelector("a");
  if (link) {
    link.onmouseenter = () => (link.style.color = "#4ade80");
    link.onmouseleave = () => (link.style.color = "#facc15");
  }

  document.body.appendChild(footer);
}

window.onload = function () {
  updateUI();
  injectFooter();
};
