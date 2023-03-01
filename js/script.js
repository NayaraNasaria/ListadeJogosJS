let btnAdd = document.querySelector("#btnAdd");
let btnImportar = document.querySelector("#btnImportar");
let btnModalDownload = document.querySelector("#btnDownload");
let btnFazerDownload = document.querySelector("#btnFazerDownload");
let indiceItemEdicao = null;

let jogos = [
  {
    img: "img/god.jpg",
    nome: "God of War Ragnarok",
    preco: 300.0,
  },
  {
    img: "img/tlou.png",
    nome: "The Last Of Us",
    preco: 250.0,
  },
];

renderizarJogos();

function renderizarJogos() {
  document.querySelector("ul").innerHTML = "";
  jogos.forEach((jogo, indice) => {
    let li = document.createElement("li");
    li.setAttribute("data-indice", indice);
    li.addEventListener("dblclick", function () {
      indiceItemEdicao = indice;
      const { img, nome, preco } = jogos[indice];
      document.querySelector("#nome").value = nome;
      document.querySelector("#preco").value = preco;
      document.querySelector("#img").value = img;
      modal.adicionar();
    });

    let precoFormatado = parseFloat(jogo.preco).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      style: "currency",
      currency: "BRL",
    });

    li.innerHTML = `
     <div>
    <img src="${jogo.img}" />
  </div>
  <div class="game-info">
    <h2>${jogo.nome}</h2>
    <h3>${precoFormatado}</h3>
  </div>
  <span class="icon-remove" data-indice= "${indice}">
    <span class="material-symbols-outlined">delete</span>
  </span>`;

    document.querySelector("ul").appendChild(li);
  });

  if (jogos.length < 1) {
    document.querySelector("ul").innerHTML = `
    <li style="padding: 2rem">
        <h2 style="text-align: center">Nenhum Jogo Cadastrado!</h2>
    </h1>
    `;
  }

  document.querySelectorAll(".icon-remove").forEach((x) => {
    x.removeEventListener("click", deletar);
    x.addEventListener("click", deletar);
  });
}

function deletar(e) {
  if (window.confirm("Você tem certeza?")) {
    const indice = e.target.parentElement.getAttribute("data-indice");
    if (indice) {
      jogos.splice(indice, 1);
      renderizarJogos();
    }
  }
}

document.querySelector("#btnSalvar").addEventListener("click", function (e) {
  e.preventDefault();

  const nome = document.querySelector("#nome").value;
  const preco = document.querySelector("#preco").value;

  if (!nome) {
    alert("Por favor Informe o Nome!");
    return;
  }

  if (!preco) {
    alert("Por favor Informe o Preço!");
    return;
  }

  const jogo = {
    img:
      document.querySelector("#img").value ||
      "https://via.placeholder.com/120?text=IMG",
    nome,
    preco,
  };

  if (indiceItemEdicao) {
    jogos[indiceItemEdicao] = jogo;
  } else {
    jogos.push(jogo);
  }

  renderizarJogos();
  modal.adicionar();
  indiceItemEdicao = null;

  document.querySelector("#nome").value = "";
  document.querySelector("#preco").value = "";
  document.querySelector("#img").value = "";
});

function fecharModalAddJogo() {
  document
    .querySelector('[data-modal="adicionar-jogo"]')
    .classList.toggle("abrir");

  document.querySelector(".background-modal").classList.toggle("abrir");
}

btnAdd.addEventListener("click", () => {
  modal.adicionar();
});

btnImportar.addEventListener("click", () => {
  modal.importar();
});

btnModalDownload.addEventListener("click", () => {
  modal.download();
});

document.querySelectorAll(".btn-fechar-modal").forEach((x) => {
  x.addEventListener("click", function () {
    console.log(x);
    this.parentElement.classList.toggle("abrir");
    document.querySelector(".background-modal").classList.toggle("abrir");
  });
});

btnFazerDownload.addEventListener("click", (e) => {
  e.preventDefault();
  if (!document.querySelector("#nomeArquivo").value) {
    alert("Informe o nome do Arquivo!");
    return;
  }
  download()(jogos, `${nomeArquivo}.json`);
});

const download = function () {
  const a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  return function (dados, nomeArquivo) {
    const json = JSON.stringify(dados);
    const blob = new Blob([json], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    window.URL.revokeObjectURL(url);
  };
};

const modal = {
  download: function () {
    document
      .querySelector('[data-modal="download-jogos"]')
      .classList.toggle("abrir");

    document.querySelector(".background-modal").classList.toggle("abrir");
  },
  importar: function () {
    document
      .querySelector('[data-modal="upload-jogos"]')
      .classList.toggle("abrir");

    document.querySelector(".background-modal").classList.toggle("abrir");
  },
  adicionar: function () {
    document
      .querySelector('[data-modal="adicionar-jogo"]')
      .classList.toggle("abrir");

    document.querySelector(".background-modal").classList.toggle("abrir");
  },
};

document
  .querySelector("#arquivo")

  .addEventListener("change", (e) => {
    const [arquivo] = e.target.files;
    const leitor = new FileReader();

    leitor.addEventListener("load", () => {
      jogos = JSON.parse(leitor.result);
      renderizarJogos();
      modal.importar();
    });

    if (arquivo) {
      leitor.readAsText(arquivo);
    }
  });
