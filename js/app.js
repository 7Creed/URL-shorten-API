"use strict";

// Menu fade animation
// Psuedo code
// 1. call the nav class
const nav = document.querySelector(".nav");
const navcta = document.querySelector("#navbar-cta");
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");
console.log(nav, navcta);

// navcta.addEventListener("click", function (e) {
//     if (e.target.classList.contains('nav__link')) {
//         console.log('clicked');

//     }
// });
// nav.addEventListener("click", () => {
//   console.log("hey");
// });

btn.addEventListener("click", () => {
  menu.classList.toggle("flex");
  menu.classList.toggle("hidden");
});

const handleHover = function (e, opacity) {
  // console.log(this, e.target);
  if (e.target.classList.contains("nav__link")) {
    const link = e.target.closest(".nav").querySelectorAll(".nav__link");
    console.log(link); // a nodelist
    console.log(e.target);
    const logo = e.target.closest(".nav").querySelector("img");
    const login = e.target.closest(".nav").querySelector(".nav__link_L");
    console.log(login);
    link.forEach((el) => {
      if (el !== e.target) {
        el.style.opacity = this;
        // logo.style.opacity = this;
      }

      // else {
      //   // el.style.color = "black";
      //   el.style.opacity = 1;
      // }
      // el.style.opacity = 0.5

      if (e.target.closest(".nav__link_L")) {
        console.log(e.target.closest(".nav__link_L"));
        e.target.closest(".nav__link_L").style.opacity = 1;
        // login.style.opacity = 1;
        el.style.opacity = this;
        console.log("this");
      }
    });

    // logo.style.opacity = this;
  }
};

nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

let arrObj = [];

const inp = document.querySelector("#inp");
const but = document.querySelector("#but");
const cover = document.querySelector(".cover");
const addLink = document.querySelectorAll(".addLink");

cover.innerHTML = "";

const arrFromLocalStorage = JSON.parse(localStorage.getItem("myArr"));

function startNow() {
  if (arrFromLocalStorage) {
    arrObj = arrFromLocalStorage;
    displayArr(arrObj);
  }
}
startNow();

const handleAPI = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  console.log("clicked");

  if (inp.value === "") {
    inp.classList.add("custom_red");
    addLink.forEach((itm) => itm.classList.add("p_red"));
  } else {
    inp.classList.remove("custom_red");
    addLink.forEach((itm) => itm.classList.remove("p_red"));
  }

  // https://api.shrtco.de/v2/shorten?url=example.org/very/long/link.html

  try {
    const res = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${inp.value}`
    );
    const data = await res.json();

    if (!res.ok) {
      throw new Error(res.status);
    }
    // arrObj = [...arrObj, data.result];
    arrObj.push(data.result);
    localStorage.setItem("myArr", JSON.stringify(arrObj));
    console.log(data);
    console.log(data.result);
    console.log(arrObj);

    displayArr(arrObj);
  } catch (error) {
    console.log(
      "Could not fetch data, try resetting your connection or check the url"
    );
    console.log(error);

    let html = `
    <div class="relative real">
        <div
        class="flex flex-col md:flex-row justify-between items-center bg-white w-full p-3 pl-10 text-sm text-gray-900 rounded-lg my-3"
        id="search"
        >
            <div>
                <p>${error}</p>
            </div>
        </div>
    </div>
`;

    cover.innerHTML = html;
    setTimeout(() => displayArr(arrObj), 4000);
  }
  inp.value = "";
  // displayArr(arrObj)
};

but.addEventListener("click", handleAPI);

function displayArr(arr) {
  cover.innerHTML = "";
  arr.forEach((data, i) => {
    let html = `
          <div class="relative real">
              <div
              class="flex flex-col md:flex-row justify-between md:items-center bg-white w-full p-3 md:pl-5 text-sm text-gray-900 rounded-lg my-3"
              id="search"
              >
                  <div class="flex bord__t md:justify-between space-x-4 delDiv">
                    <div class="">
                      <button type="" class="del p-1 rounded" data-id="${
                        i + 1
                      }">
                        &#128473;
                      </button>
                    </div>
                    <div class="">  
                      <p class="">${data.original_link}</p>
                    </div>
                  </div>
                  <div class="flex flex-col md:flex-row md:items-center md:space-x-4 copyDiv">
                    <a href="${
                      data.full_short_link
                    }" target="_blank" class="text-start bord__b text-cyan link">${
      data.full_short_link
    }</a>
                    <button
                    type=""
                    class="copy text-white bg-cyan font-medium rounded-lg text-sm px-5 py-2"
                    data-id="${i + 1}"
                    >
                    Copy
                    </button>
                  </div>
              </div>
          </div>
      `;

    cover.insertAdjacentHTML("afterbegin", html);
    // cover.insertAdjacentHTML("beforeend", html);
  });
}

// Copy button
const handleCopy = () => {
  cover.addEventListener("click", function (e) {
    // console.log(container);
    // console.log(text);
    // console.log(e.target);

    if (e.target.classList.contains("copy")) {
      const container = e.target.closest(".copyDiv");
      const text = container.firstElementChild.innerHTML;
      console.log(e.target);
      navigator.clipboard.writeText(text);
      e.target.textContent = "Copied!";
      e.target.classList.add("bg-slate-800");

      setTimeout(() => {
        revert(e.target);
      }, 3000);
    }

    document.querySelectorAll(".copy").forEach((item, i) => {
      if (item !== e.target) {
        revert(item);
      }
    });

    if (e.target.classList.contains("del")) {
      // const deleteBtn = e.target.closest(".delDiv");
      console.log("del");
      arrObj = arrObj.filter((el, i) => {
        el.id = i + 1;
        return el.id !== Number(e.target.dataset.id);
      });
      console.log(arrObj);
      localStorage.setItem("myArr", JSON.stringify(arrObj));
      displayArr(arrObj);
    }
  });
};
handleCopy();

function revert(val) {
  val.textContent = "Copy";
  val.classList.remove("bg-slate-800");
}
