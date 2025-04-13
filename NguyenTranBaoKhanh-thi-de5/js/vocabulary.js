let vocabularies = JSON.parse(localStorage.getItem("vocabularies")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];
let editIndex = -1;
let currentPage = 1;
let taskPerPage = 5;
let totalPage = Math.ceil(vocabularies.length / taskPerPage);

function searchBarCategories() {
  let categoryOption = document.getElementById("categorySelect");
  let categorySearch = document.getElementById("categorySearch");

  if (categories.length === 0) {
    let errorContainer =
      document.getElementById("categoryError") || document.createElement("div");
    errorContainer.id = "categoryError";
    errorContainer.style.color = "red";
    errorContainer.textContent =
      "Chưa có category nào. Vui lòng thêm category trong trang Categories trước!";
    categoryOption.insertAdjacentElement("afterend", errorContainer);
    return;
  }

  categoryOption.innerHTML = '<option value="">Select a category</option>';
  categorySearch.innerHTML = '<option value="">All Categories</option>';
  categories.forEach((category) => {
    categoryOption.innerHTML += `<option value="${category.nameCategory}">${category.nameCategory}</option>`;
    categorySearch.innerHTML += `<option value="${category.nameCategory}">${category.nameCategory}</option>`;
  });
}

function getFilteredVocab() {
  let selectedCategory = document.getElementById("categorySearch").value;
  alert;
  let searchVocab = document.getElementById("searchInput").value.toLowerCase();
  let filteredVocab = vocabularies;

  if (selectedCategory) {
    filteredVocab = filteredVocab.filter(
      (vocab) => vocab.category === selectedCategory
    );
  }
  if (searchVocab) {
    filteredVocab = filteredVocab.filter((vocab) =>
      vocab.word.toLowerCase().includes(searchVocab)
    );
  }
  return filteredVocab;
}

function renderPagination() {
  let paginateContainer = document.getElementById("paginate-container");
  let filteredVocab = getFilteredVocab();
  totalPage = Math.ceil(filteredVocab.length / taskPerPage);

  if (currentPage > totalPage && totalPage > 0) {
    currentPage = totalPage;
  } else if (totalPage === 0) {
    currentPage = 1;
  }

  paginateContainer.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    if (i === currentPage) {
      paginateContainer.innerHTML += `<span class="paginate-button current-page" onclick="changePage(${i})">${i}</span>`;
    } else {
      paginateContainer.innerHTML += `<span class="paginate-button" onclick="changePage(${i})">${i}</span>`;
    }
  }
}

function changePage(page) {
  currentPage = page;
  render();
  renderPagination();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    render();
    renderPagination();
  }
}

function nextPage() {
  if (currentPage < totalPage) {
    currentPage++;
    render();
    renderPagination();
  }
}

function addNewWord(e) {
  e.preventDefault();
  let word = document.getElementById("wordInput").value;
  let meaning = document.getElementById("meaningInput").value;
  let category = document.getElementById("categorySelect").value;
  let wordError = document.getElementById("wordError");
  let meanError = document.getElementById("meaningError");
  let categoryError = document.getElementById("categoryError");

  // xoa loi
  wordError.textContent = "";
  categoryError.textContent = "";

  if (editIndex === -1) {
    if (word === "") {
      wordError.textContent = "Bạn cần nhập từ vựng";
      return;
    } else if (meaning === "") {
      meanError.textContent = "Bạn cần nhập nghĩa";
      return;
    } else if (category === "") {
      categoryError.textContent = "Bạn cần chọn một category";
      return;
    } else if (
      vocabularies.some(
        (vocab) => vocab.word.toLowerCase() === word.toLowerCase()
      )
    ) {
      wordError.textContent = "Từ vựng không được trùng";
      return;
    } else {
      let newVocab = { word, meaning, category };
      vocabularies.push(newVocab);
      localStorage.setItem("vocabularies", JSON.stringify(vocabularies));
      let modal = bootstrap.Modal.getInstance(
        document.getElementById("vocabModal")
      );
      modal.hide();
      render();
      renderPagination();
    }
  } else {
    if (word === "") {
      wordError.textContent = "Bạn cần nhập từ vựng";
      return;
    } else if (meaning === "") {
      meanError.textContent = "Bạn cần nhập nghĩa";
    } else if (category === "") {
      categoryError.textContent = "Bạn cần chọn một category";
      return;
    } else if (
      vocabularies.some(
        (vocab, index) =>
          vocab.word.toLowerCase() === word.toLowerCase() && index !== editIndex
      )
    ) {
      wordError.textContent = "Từ vựng không được trùng";
      return;
    } else {
      vocabularies[editIndex] = { word, meaning, category };
      localStorage.setItem("vocabularies", JSON.stringify(vocabularies));
      editIndex = -1;
      let modal = bootstrap.Modal.getInstance(
        document.getElementById("vocabModal")
      );
      modal.hide();
      render();
      renderPagination();
    }
  }

  document.getElementById("wordInput").value = "";
  document.getElementById("meaningInput").value = "";
  document.getElementById("categorySelect").value = "";
}

function render() {
  let body = document.getElementById("tbody");
  let filteredVocab = getFilteredVocab();

  let startVocab = (currentPage - 1) * taskPerPage;
  let endVocab = startVocab + taskPerPage;
  let filteredPaginationVocab = filteredVocab.slice(startVocab, endVocab);

  body.innerHTML = "";
  filteredPaginationVocab.forEach((vocab) => {
    body.innerHTML += `
      <tr style="background-color: white;">
        <td>${vocab.word}</td>
        <td>${vocab.meaning}</td>
        <td>${vocab.category}</td>
        <td>
          <button onclick="editWord(${vocabularies.indexOf(vocab)})" 
            style="border: none; color: #4667E2; background-color: white; margin-right: 10px;">edit</button>
          <button onclick="delWord(${vocabularies.indexOf(vocab)})" 
            style="border: none; color: #CA533B; background-color: white;">delete</button>
        </td>
      </tr>
    `;
  });
  renderPagination();
}

function editWord(index) {
  editIndex = index;
  document.getElementById("wordInput").value = vocabularies[index].word;
  document.getElementById("meaningInput").value = vocabularies[index].meaning;
  document.getElementById("categorySelect").value =
    vocabularies[index].category;
  document.getElementById("vocabModalLabel").innerText = "Edit Vocabulary";

  let modal = new bootstrap.Modal(document.getElementById("vocabModal"));
  modal.show();
}

function delWord(index) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        vocabularies.splice(index, 1);
        localStorage.setItem("vocabularies", JSON.stringify(vocabularies));
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your word has been deleted.",
          icon: "success",
        });
        render();
        renderPagination();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your word is safe :)",
          icon: "error",
        });
      }
    });
}

document
  .getElementById("vocabModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("wordInput").value = "";
    document.getElementById("meaningInput").value = "";
    document.getElementById("categorySelect").value = "";
    document.getElementById("vocabModalLabel").innerText = "Add Vocabulary";
    document.getElementById("wordError").textContent = "";
    document.getElementById("meaningError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    editIndex = -1;
  });

document.getElementById("categorySearch").addEventListener("change", () => {
  currentPage = 1;
  render();
  renderPagination();
});

document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1;
  render();
  renderPagination();
});

searchBarCategories();
render();
