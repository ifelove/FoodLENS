let page = 1;
const limit = 12;
let sorted=""
let searchValue=""

//Get HTML elements
const btnContainer = document.querySelector(".btn-container");

const select = document.querySelector("#select");
const sortIcon = document.querySelector(".bx-sort");
const searchInput = document.querySelector("#search-box");

const sectionCenter = document.querySelector(".section-center");

//listening on page load to create categories page elements
window.addEventListener("DOMContentLoaded", () => {
  fetchItems();
});

//function that displays All category section
function displayMenuItem(menuItems) {
  let displayMenu = menuItems.map((item) => {
    return `<div id="${item.food_name}" class="menu-item">
        <img src=${item.img_url} class="photo" alt="">
        <div class="item-info">
          <h4 id="${item.food_name}">${item.food_name}</h4>
          <p class="item-text">${item.cuisine}
          </p>
        </div>
      </div>`;
  });
  displayMenu = displayMenu.join("");
  sectionCenter.innerHTML = displayMenu;
}
function displayPaginateBtn(totalItem, limit, activeIndex) {
  const pageCount = Math.ceil(totalItem / limit);
  btnContainer.innerHTML = "";
  let btns = Array.from(
    { length: pageCount },
    (_, pageIndex) => pageIndex + 1
  ).map((_, pageIndex) => {
    return `<div class="page-btn ${
      activeIndex === pageIndex ? "active-btn" : "null "
    }" data-index="${pageIndex}">
${pageIndex + 1}
</div>`;
  });
  btns.push(`<div class="next-btn">next</div>`);
  btns.unshift(`<div class="prev-btn">prev</div>`);
  btnContainer.innerHTML = btns.join("");

  const pageBtns = document.querySelectorAll(".page-btn");

  pageBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      let btnPressed = parseInt(e.target.textContent);
      console.log(btnPressed);
      page = btnPressed;
      fetchItems();
    });
  });

  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  nextBtn.addEventListener("click", () => {
    page++;
    if (page > pageCount) {
      page = 1;
    }
    fetchItems();
  });

  prevBtn.addEventListener("click", () => {
    page--;
    if (page < 0) {
      page = pageCount;
    }
    fetchItems();
  });
}

function fetchItems() {
  fetch(
    `http://localhost:3000/api/v1/all-foods-item/all?page=${page}&limit=${limit}&sort=${sorted}&search=${searchValue}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const { foods, totalCount, numOfPages } = data;
      console.log(foods);
      displayMenuItem(foods);
      displayPaginateBtn(totalCount, limit, (activeIndex = page - 1));
    });
}

//handling sort

select.addEventListener("change", () => {
  sorted = select.options[select.selectedIndex].text;
  console.log(select.options[select.selectedIndex].value);
  console.log(sorted);
  fetchItems();
});

sortIcon.addEventListener("click", () => {
  sortIcon.classList.toggle("des");
  if (sortIcon.classList.contains("des")) {
    console.log("hi");
    sorted = `${-sorted}`;
    fetchItems();
  }
});

//handling search functionality

searchInput.addEventListener("input", () => {
  searchValue = searchInput.value;
  fetchItems();
});
