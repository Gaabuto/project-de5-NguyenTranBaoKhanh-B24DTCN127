let categories = JSON.parse(localStorage.getItem("categories")) || [];
let vocab = JSON.parse(localStorage.getItem("vocabularies")) || [];
let editIndex = -1;
let currentPage = 1;
let taskPerPage = 5;
let totalPage = Math.ceil(categories.length / taskPerPage);

// Them + sua category
function addNewCategory(e) {
  e.preventDefault();
  let nameCategory = document.getElementById("addName").value;
  let description = document.getElementById("description").value;
  let nameError = document.getElementById("nameError");

  nameError.textContent = "";

  if (editIndex === -1) {
    if (nameCategory === "") {
      nameError.textContent = "Bạn cần đặt tên cho category";
      return;
    } else if (
      categories.some(
        (category) =>
          category.nameCategory.toLowerCase() === nameCategory.toLowerCase()
      )
    ) {
      nameError.textContent = "Tên không được trùng";
      return;
    } else {
      let newCategory = { nameCategory, description };
      categories.push(newCategory);
      localStorage.setItem("categories", JSON.stringify(categories));
      render();
      renderPagination();
    }
  } else {
    if (nameCategory === "") {
      nameError.textContent = "Bạn cần đặt tên cho category";
      return;
    } else if (
      categories.some(
        (category, index) =>
          category.nameCategory.toLowerCase() === nameCategory.toLowerCase() &&
          index !== editIndex
      )
    ) {
      nameError.textContent = "Tên không được trùng";
      return;
    } else {
      categories[editIndex] = { nameCategory, description };
      localStorage.setItem("categories", JSON.stringify(categories));
      editIndex = -1;
      document.getElementById("exampleModalLabel").innerText = "Add Category";
      render();
      renderPagination();
    }
  }

  document.getElementById("addName").value = "";
  document.getElementById("description").value = "";
  document.getElementById("nameError").textContent = "";
  document.getElementById("descriptionError").textContent = "";
  let modal = bootstrap.Modal.getInstance(
    document.getElementById("exampleModal")
  );
  modal.hide();
}

function getFilteredCategories() {
  let search = document.getElementById("searchInput").value.toLowerCase();
  let filteredCategories = categories;

  if (search) {
    filteredCategories = categories.filter((category) =>
      category.nameCategory.toLowerCase().includes(search)
    );
  }
  return filteredCategories;
}

function render() {
  let body = document.getElementById("tbody");
  let filteredCategories = getFilteredCategories();

  let startIndex = (currentPage - 1) * taskPerPage;
  let endIndex = startIndex + taskPerPage;
  let paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  body.innerHTML = "";
  paginatedCategories.forEach((category) => {
    body.innerHTML += `
      <tr style="background-color: white;">
        <td>${category.nameCategory}</td>
        <td>${category.description}</td>
        <td>
          <button onclick="editCategory(${categories.indexOf(category)})" 
            style="border: none; color: #4667E2; background-color: white; margin-right: 10px;">edit</button>
          <button onclick="delCategory(${categories.indexOf(category)})" 
            style="border: none; color: #CA533B; background-color: white;">delete</button>
        </td>
      </tr>
    `;
  });

  renderPagination();
}

function renderPagination() {
  let paginateContainer = document.getElementById("paginate-container");
  let filteredCategories = getFilteredCategories();
  totalPage = Math.ceil(filteredCategories.length / taskPerPage);

  if (currentPage > totalPage && totalPage > 0) {
    currentPage = totalPage;
  } else if (totalPage === 0) {
    currentPage = 1;
  }

  paginateContainer.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    if (i === currentPage) {
      paginateContainer.innerHTML += `<span class="current-page" onclick="changePage(${i})">${i}</span>`;
    } else {
      paginateContainer.innerHTML += `<span class="pages" onclick="changePage(${i})">${i}</span>`;
    }
  }
}

function changePage(page) {
  currentPage = page;
  render();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
}

function nextPage() {
  if (currentPage < totalPage) {
    currentPage++;
    render();
  }
}

function delCategory(index) {
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
      text: "This will also delete all related vocabulary!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        vocab = vocab.filter(
          (item) => item.category !== categories[index].nameCategory
        );
        categories.splice(index, 1);
        localStorage.setItem("categories", JSON.stringify(categories));
        localStorage.setItem("vocabularies", JSON.stringify(vocab));
        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your category and related vocabulary have been deleted.",
          icon: "success",
        });
        render();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your category and vocabulary are safe :)",
          icon: "error",
        });
      }
    });
}

function editCategory(index) {
  editIndex = index;
  document.getElementById("addName").value = categories[index].nameCategory;
  document.getElementById("description").value = categories[index].description;
  document.getElementById("exampleModalLabel").innerText = "Edit Category";

  let modal = new bootstrap.Modal(document.getElementById("exampleModal"));
  modal.show();
}

document
  .getElementById("exampleModal")
  .addEventListener("hidden.bs.modal", () => {
    document.getElementById("addName").value = "";
    document.getElementById("description").value = "";
    document.getElementById("nameError").textContent = "";
    document.getElementById("descriptionError").textContent = "";
    document.getElementById("exampleModalLabel").innerText = "Add Category";
    editIndex = -1;
  });

document.getElementById("searchInput").addEventListener("input", () => {
  currentPage = 1;
  render();
});

render();
