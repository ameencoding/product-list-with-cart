"use strict";
import { data } from "./data.js";

let total;

const container = document.querySelector(".products");
const render = function () {
  container.innerHTML = data
    .map((d) => {
      return ` <div class="product scale">
                <div class="product-img">
                  <img src="${d.image.desktop}" alt="" class="item-img"/>
                  <div class="btn btn-product flex">
                      <img src="./assets/images/icon-add-to-cart.svg" alt="" class="item-cart-img"/>
                      <p class="t-sm">Add to Cart</p>
                  </div>
                </div>
                <div class="product-details">
                  <p class="t-xs">${d.category}</p>
                  <p class="t-md">${d.name}</p>
                  <p class="t-sm">$${d.price.toFixed(2)}</p>
                </div>
        </div>`;
    })
    .join(" ");
};

const init = function () {
  container.classList.remove("animate");
  render();

  const toCartBtns = container.querySelectorAll(".product .btn-product");
  const btnCart = document.querySelector(".cart");
  const cartContainer = document.querySelector(".card");
  const items = document.querySelector(".card .items");

  const totalContainer = document.querySelector(".card .total");
  const carbonContainer = document.querySelector(".card .carbon");
  const btnOrder = document.querySelector(".btn-order");

  const successContainer = document.querySelector(".success");

  const carts = [];

  let parent;
  toCartBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      parent = this.parentElement.parentElement;

      const getName = parent.querySelector(
        ".product-details .t-md"
      ).textContent;

      // check if already added
      if (isContain(getName)) return;

      const item = {
        name: parent.querySelector(".product-details .t-md").textContent,
        price: parent.querySelector(".product-details .t-sm").textContent,
      };
      carts.push(item);

      // if user clicks the add button while cart is open and empty, then i have to render.
      if (!cartContainer.className.includes("hide")) {
        renderCart();
      }

      btnCart.querySelector(".cart-count").classList.remove("hide");
      btnCart.querySelector(".cart-count").textContent++;

      activeProduct(parent, this);
    });
  });

  btnCart.querySelector("img").addEventListener("click", function () {
    cartContainer.classList.toggle("hide");
    renderCart();
  });

  btnOrder.addEventListener("click", function () {
    container.classList.add("blur");
    this.parentElement.classList.add("hide");
    successContainer.querySelector("strong").textContent = `$${total.toFixed(
      2
    )}`;
    successContainer.classList.remove("hide");

    // prevent btns from click
    container
      .querySelectorAll(".btn-product")
      .forEach((btn) => btn.classList.add("hide"));
  });

  // reload
  successContainer
    .querySelector(".btn-dismiss")
    .addEventListener("click", function () {
      location.reload();
    });

  const renderCart = function () {
    if (carts.length < 1) {
      items.innerHTML = `<div class="empy-cart">
                          <img src="./assets/images/illustration-empty-cart.svg" alt="" />
                          <blockquote class="t-md">Your added items will appear here!</blockquote>
                        </div>`;
      hide([btnOrder, totalContainer, carbonContainer]);
      return;
    }

    items.innerHTML = carts
      .map((cart) => {
        return `<div class="item flex">
                  <div class="info">
                    <p class="t-sm">${cart.name}</p>
                    <p class="t-xs">${cart.price}</p>
                  </div>
                  <div class="remove">
                    <img src="./assets/images/check-mark.svg" alt="" />
                  </div>
              </div>`;
      })
      .join("");

    show([btnOrder, totalContainer, carbonContainer]);
    totalContainer.style.display = "flex";

    total = carts.map((c) => +c.price.slice(1)).reduce((a, b) => a + b, 0);
    totalContainer.querySelector("strong").textContent = `$${total.toFixed(2)}`;
  };

  const hide = (labels) => labels.forEach((lb) => (lb.style.display = "none"));
  const show = (labels) => labels.forEach((lb) => (lb.style.display = "block"));

  const isContain = function (item) {
    return carts.filter((i) => i.name === item).length > 0 ? true : false;
  };

  const activeProduct = function (parent, btn) {
    parent.querySelector(".product-img img").classList.add("active-product");
    btn.querySelector(".product-img img").style.display = "none";
    btn.querySelector(".btn-product .t-sm").textContent = "Cart Added!";
  };
};

setTimeout(init, 1500);
