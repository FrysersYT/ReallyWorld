document.addEventListener("DOMContentLoaded", function () {
  var toggleMenuBool = false;
  function parallax(event) {
    this.querySelectorAll(".parallax").forEach((element) => {
      let speed = element.offsetWidth / 25;

      element.style.transform = `translateX(${
        (event.clientX * speed) / 400 - 20
      }px)`;
    });
  }

  document.addEventListener("mousemove", parallax);

  var storeElement = document.getElementById("store");
  var btn = document.getElementById("goToStore");

  function handleGoToStore() {
    if (document.location.pathname === "/") {
      storeElement.scrollIntoView({ behavior: "smooth" });
      var x = document.getElementById("header_menu");
      var y = document.getElementById("menu");
      //x.style.display = "none";
      if (toggleMenuBool) {
        toggleMenu();
      }
      y.classList.remove("button_menu_fixed");
    } else {
      document.location = "/#store";
    }
  }

  btn.addEventListener("click", handleGoToStore);

  var copy = document.querySelectorAll(".my-copy-clipboard");
  copy.forEach((element) => {
    element.addEventListener("click", handleCopy);
  });

  function handleCopy(e) {
    var target = $(e.target);

    if (target.is("span") || target.is("i")) {
      target = target.parent();
    }

    target.css("width", target.width());
    target.find("span").css("width", target.find("span").width());
    var copyText = $(target).attr("data-clipboard-text");

    console.log(copyText);
    copyTextToClipboard(copyText);

    $(target).find("span").text("Скопировано!");

    setTimeout(function () {
      target.css("width", "");
      target.find("span").css("width", "");
      $(target).find("span").text(copyText);
    }, 2000);
  }

  $("nav [href]").each(function () {
    if (
      this.href == window.location.href ||
      `${location.protocol}//${location.host}/#${$(this).attr("data-page")}` ==
        document.location.href
    ) {
      $(this).parent().addClass("active");
    }
  });

  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {},
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  }

  var coin_bar = document.getElementById("coin_bar");
  var coin_bar_fill = document.getElementById("coin_bar_fill");
  var coin_bar_slider = document.getElementById("coin_bar_slider");

  var coin_rub = document.getElementById("coin_rub");
  var coin_currency = document.getElementById("coin_currency");

  const body = document.body;

  coin_bar.addEventListener("mousedown", mouseDown);
  coin_bar_slider.addEventListener("mousedown", mouseDown);

  coin_bar.addEventListener("wheel", wheelChange);
  coin_bar_slider.addEventListener("wheel", wheelChange);
  coin_bar.addEventListener("touchstart", mouseDown);
  coin_bar_slider.addEventListener("touchstart", mouseDown);
  coin_bar.addEventListener("click", click);
  coin_bar_slider.addEventListener("click", click);

  body.addEventListener("mousemove", mouseMove);
  body.addEventListener("touchend", mouseUp);
  body.addEventListener("mouseup", mouseUp);

  var md = false;
  var currency = 500;

  function click(event) {
    if (event.clientX == 0 && event.clientY == 0) return;

    var sx = event.clientX;
    var ex = coin_bar.getBoundingClientRect().left;
    var max = coin_bar.getBoundingClientRect().width;

    var x = sx - ex;

    if (x < 0) x = 0;
    if (x > max) x = max;

    var proc = 100 / (max / x);
    currency = Math.round((4950 * proc) / 100 + 50);
    currency = Math.round(currency / 5) * 5;
    updateCurrency();
  }

  function mouseMove(event) {
    if (!md) return;

    if (event.clientX == 0 && event.clientY == 0) return;

    var sx = event.clientX;
    var ex = coin_bar.getBoundingClientRect().left;
    var max = coin_bar.getBoundingClientRect().width;

    var x = sx - ex;

    if (x < 0) x = 0;
    if (x > max) x = max;

    var proc = 100 / (max / x);
    currency = Math.round((4950 * proc) / 100 + 50);
    currency = Math.round(currency / 5) * 5;
    updateCurrency();
  }

  function wheelChange(event) {
    event.preventDefault();
    var dir = event.deltaY * -0.01;

    currency += 5 * dir;
    updateCurrency();
  }

  function mouseDown() {
    md = true;
  }

  function mouseUp() {
    md = false;
  }

  function updateCurrency() {
    if (currency < 50) currency = 50;
    if (currency > 5000) currency = 5000;

    var currencyFinal = currency;

    if (currency <= 1500) {
      currencyFinal = currency;
    } else if (currency <= 2000) {
      currencyFinal = currency + currency * 0.1;
    } else {
      currencyFinal = currency + currency * 0.2;
    }
    coin_rub.innerHTML = currency;
    coin_currency.innerHTML = Math.round(currencyFinal);

    coin_bar.setAttribute("rubles", currency);

    var proc = 100 / (5000 / currency);
    coin_bar_fill.style.width = `${proc}%`;
  }

  updateCurrency();
});

function toggleMenu() {
  var x = document.getElementById("header_menu");
  var y = document.getElementById("menu");
  if (x.style.display === "block") {
    x.style.display = "none";
    y.classList.remove("button_menu_fixed");
    toggleMenuBool = false;
  } else {
    toggleMenuBool = true;
    x.style.display = "block";
    y.classList.add("button_menu_fixed");
  }
}

function toast(title, content, type, time = 5000) {
  let div = document.createElement("div");
  div.className = "toast";
  div.innerHTML = `
<div class="toast_title toast-${type}">${title}</div>
<div class="toast_content">${content}</div>
`;

  let divClose = document.createElement("div");
  divClose.className = "toast_close";
  divClose.innerHTML = `<i class="fas fa-times" data-modal-close="true"></i>`;

  divClose.addEventListener("click", () => {
    removeToast(div);
  });

  div.appendChild(divClose);

  document.getElementById("toasts").appendChild(div);

  div.style.opacity = "1";
  div.animate(
    [
      {
        opacity: "0",
      },
      {
        opacity: "1",
      },
    ],
    {
      duration: 1000,
      easing: "ease",
      iterations: 1,
    }
  );

  setTimeout(function () {
    removeToast(div);
  }, time);

  return div;
}

function removeToast(div) {
  if (div.classList.contains("removed")) return;
  div.classList.add("removed");

  div.style.opacity = "0";
  div.animate(
    [
      {
        opacity: "1",
      },
      {
        opacity: "0",
      },
    ],
    {
      duration: 1000,
      easing: "ease",
      iterations: 1,
    }
  );
  setTimeout(function () {
    div.remove();
  }, 1000);
}
