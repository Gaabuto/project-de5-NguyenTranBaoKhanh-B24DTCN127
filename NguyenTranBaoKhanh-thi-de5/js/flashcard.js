let vocabularies = JSON.parse(localStorage.getItem("vocabularies")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let learnedWords = [];
let currentIndex = 0;

function searchBarCategories() {
  let categorySearch = document.getElementById("categorySearch");
  let categoryError = document.getElementById("categoryError");

  categoryError.textContent = "";

  if (categories.length === 0) {
    categoryError.textContent =
      "Chưa có category nào. Vui lòng thêm category trong trang Categories trước!";
    return false;
  }

  categorySearch.innerHTML = '<option value="">All Categories</option>';
  categories.forEach((category) => {
    categorySearch.innerHTML += `<option value="${category.nameCategory}">${category.nameCategory}</option>`;
  });
  return true;
}

function getFilteredVocab() {
  let selectedCategory = document.getElementById("categorySearch").value;
  let categoryError = document.getElementById("categoryError");
  categoryError.textContent = "";

  let filteredVocab = vocabularies;
  if (selectedCategory) {
    filteredVocab = vocabularies.filter(
      (vocab) => vocab.category === selectedCategory
    );
  }

  if (filteredVocab.length === 0) {
    categoryError.textContent = "Chưa có từ vựng nào trong category này.";
  }

  return filteredVocab;
}

function render() {
  let filteredVocab = getFilteredVocab();
  let front = document.getElementById("frontFlashcard");
  let back = document.getElementById("backFlashcard");

  if (filteredVocab.length === 0) {
    front.textContent = "Không có từ vựng";
    back.textContent = "";
    document.getElementById("numberWord").textContent = "-";
    return;
  }

  if (currentIndex >= filteredVocab.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = filteredVocab.length - 1;
  }

  front.textContent = filteredVocab[currentIndex].word;
  back.textContent = filteredVocab[currentIndex].meaning;
  updateProgress();
}

function prevFlashcard() {
  currentIndex--;
  render();
}

function nextFlashcard() {
  currentIndex++;
  render();
}

function markAsLearned() {
  let filteredVocab = getFilteredVocab();
  if (filteredVocab.length === 0) return;

  let word = filteredVocab[currentIndex].word;
  if (!learnedWords.includes(word)) {
    learnedWords.push(word);
    updateProgress();
    renderWordList();
  }
}

function updateProgress() {
  let filteredVocab = getFilteredVocab();
  let progressBar = document.getElementById("progressBar");
  let numberWord = document.getElementById("numberWord");

  if (filteredVocab.length === 0) {
    numberWord.textContent = "-";
    return;
  }

  let learnedCount = filteredVocab.filter((vocab) =>
    learnedWords.includes(vocab.word)
  ).length;
  let total = filteredVocab.length;
  let percent = (learnedCount / total) * 100;

  numberWord.textContent = `${learnedCount}/${total}`;
  progressBar.style.width = `${percent}%`;
}

function renderWordList() {
  let wordList = document.getElementById("wordList");
  let filteredVocab = getFilteredVocab();

  wordList.innerHTML = "";
  filteredVocab.forEach((vocab) => {
    wordList.innerHTML += `
      <tr style="background-color: white;">
        <td>${vocab.word}</td>
        <td>${vocab.meaning}</td>
        <td>${
          learnedWords.includes(vocab.word) ? "Learned" : "Not Learned"
        }</td>
      </tr>
    `;
  });
}

document.getElementById("categorySearch").addEventListener("change", () => {
  currentIndex = 0;
  learnedWords = [];
  render();
  renderWordList();
});

function create() {
  if (searchBarCategories()) {
    render();
    renderWordList();
  }
}
create();
