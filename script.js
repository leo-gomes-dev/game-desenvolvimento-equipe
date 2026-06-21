// Perguntas mockadas caso o LocalStorage esteja vazio no primeiro acesso
const DEFAULT_QUESTIONS = [
  { q: "Qual rede social é famosa pelas dancinhas e vídeos curtos?" },
  { q: "Qual jogo tem os modos Battle Royale e Construção?" },
  { q: "Em qual série os personagens enfrentam o Demogorgon?" },
];

const DEFAULT_TEAMS = [
  {
    name: "Grupo Alfa",
    players: [
      { id: "p-0-0", name: "Leo", photo: "https://dicebear.com", alive: true },
      { id: "p-0-1", name: "Bia", photo: "https://dicebear.com", alive: true },
    ],
  },
  {
    name: "Grupo Beta",
    players: [
      { id: "p-1-0", name: "Mel", photo: "https://dicebear.com", alive: true },
      { id: "p-1-1", name: "Tom", photo: "https://dicebear.com", alive: true },
    ],
  },
];

// Estados carregados do LocalStorage
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

function renderGameTeams() {
  const container = document.getElementById("teams-display-container");
  container.innerHTML = "";

  teams.forEach((team, tIdx) => {
    let playersHTML = "";
    team.players.forEach((player) => {
      const disabledClass = !player.alive ? "disabled" : "";
      playersHTML += `
        <div id="${player.id}" class="player-item ${disabledClass}" onclick="eliminatePlayer('${player.id}', ${tIdx})">
          <div class="avatar-wrapper">
            <img src="${player.photo}" alt="Foto">
            <span class="overlay-x">✕</span>
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

function openModal() {
  const inputsContainer = document.getElementById("modal-teams-inputs");
  inputsContainer.innerHTML = "";

  // 1. Inputs das Equipes e Participantes
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

  // 2. Inputs de Gerenciamento das Perguntas
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

  document.getElementById("setup-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("setup-modal").classList.add("hidden");
}

function addNewPlayerField(tIdx) {
  const container = document.getElementById(`players-rows-container-${tIdx}`);
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
  document.getElementById(`q-row-${idx}`).remove();
}

function saveModalData() {
  let readersLoaded = 0;
  let totalFiles = 0;

  // Conta uploads de imagens
  for (let t = 0; t < 2; t++) {
    const totalP = document.getElementById(`players-rows-container-${t}`)
      .children.length;
    for (let p = 0; p < totalP; p++) {
      if (document.getElementById(`input-p-${t}-${p}-file`).files.length > 0)
        totalFiles++;
    }
  }

  function finishSaving() {
    if (readersLoaded === totalFiles) {
      // Coleta e salva as perguntas ativas do formulário do modal
      const qContainer = document.getElementById("questions-rows-container");
      const savedQuestions = [];
      Array.from(qContainer.children).forEach((row) => {
        const input = row.querySelector('input[type="text"]');
        if (input && input.value.trim() !== "") {
          savedQuestions.push({ q: input.value.trim() });
        }
      });
      questions =
        savedQuestions.length > 0 ? savedQuestions : DEFAULT_QUESTIONS;

      // Reseta index de perguntas caso fique fora do escopo
      if (currentQuestionIndex >= questions.length) currentQuestionIndex = 0;

      saveToLocalStorage();
      closeModal();
      updateUI();
    }
  }

  // Coleta os times e participantes
  for (let t = 0; t < 2; t++) {
    teams[t].name =
      document.getElementById(`input-team-${t}`).value || `Grupo ${t + 1}`;
    const totalP = document.getElementById(`players-rows-container-${t}`)
      .children.length;

    if (teams[t].players.length > totalP)
      teams[t].players = teams[t].players.slice(0, totalP);

    for (let p = 0; p < totalP; p++) {
      const nameVal =
        document.getElementById(`input-p-${t}-${p}-name`).value ||
        `Jogador ${p + 1}`;
      const fileInput = document.getElementById(`input-p-${t}-${p}-file`).files;

      if (!teams[t].players[p]) {
        teams[t].players[p] = {
          id: `p-${t}-${p}`,
          name: nameVal,
          photo: `https://dicebear.com{nameVal}`,
          alive: true,
        };
      } else {
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

function eliminatePlayer(playerId, teamIndex) {
  const team = teams[teamIndex];
  const player = team.players.find((p) => p.id === playerId);

  if (player && player.alive) {
    player.alive = false;
    document.getElementById(playerId).classList.add("disabled");
    saveToLocalStorage();

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
  if (questions.length > 0 && questions[currentQuestionIndex]) {
    document.getElementById("question-number").innerText =
      `Pergunta #${currentQuestionIndex + 1}`;
    document.getElementById("question-text").innerText =
      questions[currentQuestionIndex].q;
  } else {
    document.getElementById("question-number").innerText = `Pergunta #0`;
    document.getElementById("question-text").innerText =
      "Abra as configurações para cadastrar novas perguntas!";
  }
  renderGameTeams();
}

function endGame(winnerName) {
  document.getElementById("screen-main").classList.add("hidden");
  document.getElementById("screen-game-over").classList.remove("hidden");
  document.getElementById("winner-name").innerText = winnerName;
}

function resetGame() {
  currentQuestionIndex = 0;
  teams.forEach((t) => t.players.forEach((p) => (p.alive = true)));
  saveToLocalStorage();
  document.getElementById("screen-game-over").classList.add("hidden");
  document.getElementById("screen-main").classList.remove("hidden");
  updateUI();
}

window.onload = updateUI;
