const overlay = document.getElementById("overlay");
const overlayDetalhes = document.getElementById("overlayDetalhes");
const overlayEditar = document.getElementById("overlayEditar");
const addContaBtn = document.getElementById("addContaBtn");
const saveBtn = document.getElementById("saveBtn");
const tabelaContas = document.getElementById("tabelaContas").getElementsByTagName('tbody')[0];
const adicionarValorBtn = document.getElementById("adicionarValorBtn");
const diminuirValorBtn = document.getElementById("diminuirValorBtn");
let editando = false;
let contaAtual = null;
let detalhesConta = {};

document.addEventListener("deviceready", function() {
    // Chama listarContas quando o dispositivo está pronto
    listarContas();
    
    // Define o intervalo de atualização a cada segundo
    setInterval(listarContas, 1000);
});

// Mostrar o formulário para adicionar conta
addContaBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
    resetForm();
    editando = false;
});

// Fechar o formulário e resetar campos
function resetForm() {
    document.getElementById("name").value = '';
    document.getElementById("serie").value = '';
    document.getElementById("limit").value = '';
    document.getElementById("value").value = '';
}
// Função para formatar o nome
function formatarNome(input) {
  input.value = input.value.replace(/\d/g, ''); // Remove números
  input.value = input.value.replace(/\b\w/g, char => char.toUpperCase()); // Torna a primeira letra de cada palavra maiúscula
}

// Adiciona o evento de input no campo de nome para formatação automática
document.getElementById("name").addEventListener("input", function() {
  formatarNome(this);
});

// Função para formatar o telefone com máscara atualizada
function formatarTelefone(input) {
  let numero = input.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
  if (numero.length > 2) {
      numero = `(${numero.substring(0, 2)}) ${numero.substring(2)}`; // Adiciona parênteses após o DDD
  }
  if (numero.length > 9) {
      numero = numero.replace(/(\d{5})(\d+)/, '$1-$2'); // Adiciona hífen após o quinto dígito
  }
  input.value = numero.slice(0, 15); // Limita o tamanho total a 14 caracteres
}

// Adiciona o evento de input no campo de telefone
document.getElementById("value").addEventListener("input", function() {
  formatarTelefone(this);
});
// Adicionando inputmode numérico para telefone, valor e limite
document.getElementById("value").setAttribute("inputmode", "numeric");
document.getElementById("limit").setAttribute("inputmode", "numeric");
document.getElementById("valorAdicionar").setAttribute("inputmode", "numeric");
document.getElementById("valorDiminuir").setAttribute("inputmode", "numeric");

// No campo de edição, também adicionar o inputmode
document.getElementById("editValue").setAttribute("inputmode", "numeric");
document.getElementById("editLimit").setAttribute("inputmode", "numeric");

// Função para bloquear letras em campos numéricos
function bloquearLetras(event) {
    const valor = String.fromCharCode(event.which);
    if (!/[0-9]/.test(valor)) {
        event.preventDefault();
    }
}

// Aplicar a função aos campos relevantes
document.getElementById("valorAdicionar").addEventListener("keypress", bloquearLetras);
document.getElementById("valorDiminuir").addEventListener("keypress", bloquearLetras);
document.getElementById("limit").addEventListener("keypress", bloquearLetras);
document.getElementById("editLimit").addEventListener("keypress", bloquearLetras);

// Salvar nova conta ou editar a existente
saveBtn.addEventListener("click", () => {
  const nome = document.getElementById("name").value;
  const serie = document.getElementById("serie").value;
  const telefone = document.getElementById("value").value;
  const limite = parseFloat(document.getElementById("limit").value);
  const erros = [];

  if (!nome || !serie || !telefone || isNaN(limite)) {
      erros.push("Preencha todos os campos.");
  }
  if (limite < 0) {
      erros.push("O limite não pode ser negativo.");
  }
  if (erros.length > 0) {
      alert(erros.join("\n"));
      return; // Interrompe a execução se houver erros
  }
  if (!editando) {

      // Adicionar nova conta
      const newRow = tabelaContas.insertRow();
      const newCell = newRow.insertCell();
      newCell.innerHTML = `
          <div class="conta-info" onclick="mostrarDetalhes('${nome}', '${serie}', '${telefone}', '${limite}', '0')">
              <span>Nome: ${nome}</span><br>
              <span>Série: ${serie}</span><br>
              <span>Telefone: ${telefone}</span><br>
              <span>Limite: ${limite}</span>
          </div>`;
      newCell.classList.add('conta-cell');
      const actionCell = newRow.insertCell();
      actionCell.innerHTML = `<button class="edit-button" onclick="editarConta(this)">Editar</button>`;
  } else {
    
      // Editar conta existente
      contaAtual.innerHTML = `
          <div class="conta-info" onclick="mostrarDetalhes('${nome}', '${serie}', '${telefone}', '${limite}', '0')">
              <span>Nome: ${nome}</span><br>
              <span>Série: ${serie}</span><br>
              <span>Telefone: ${telefone}</span><br>
              <span>Limite: ${limite}</span>
          </div>`;
  }
  overlay.style.display = "none";
  resetForm();
});

// Função para mostrar detalhes da conta
function mostrarDetalhes(nome, serie, telefone, limite, valor) {
  detalhesConta = { nome, serie, telefone, limite, valor: parseFloat(valor) };
  document.getElementById("detalhesConta").innerHTML = `
      Nome: ${detalhesConta.nome}<br>
      Série: ${detalhesConta.serie}<br>
      Telefone: ${detalhesConta.telefone}<br>
      Limite: ${detalhesConta.limite}<br>
      Valor: ${detalhesConta.valor.toFixed(2)}`;
  overlayDetalhes.style.display = "flex";
}
// Função para editar conta
function editarConta(btn) {
  contaAtual = btn.closest('tr').cells[0];
  const contaInfo = contaAtual.querySelector('.conta-info');
  const [nome, serie, telefone, limite] = contaInfo.innerText.split('\n').map(info => info.split(': ')[1]);

  document.getElementById("editName").value = nome;
  document.getElementById("editSerie").value = serie;
  document.getElementById("editValue").value = telefone;
  document.getElementById("editLimit").value = limite;

  document.getElementById("editSaveBtn").onclick = function() {
      const novoLimite = parseFloat(document.getElementById("editLimit").value);
      const editNome = document.getElementById("editName").value;
      const editSerie = document.getElementById("editSerie").value;
      const editValue = document.getElementById("editValue").value;
      const erros = [];

      if (!editNome || !editSerie || !editValue || isNaN(novoLimite)) {
          if (!editNome || !editSerie || !editValue) {
              erros.push("Preencha todos os campos.");
          }
          if (isNaN(novoLimite)) {
              erros.push("Preencha todos os campos.");
          }
          alert(erros.join("\n"));
          return; // Interrompe a função se houver erros
      }

      if (novoLimite < 0) {
          alert("O limite não pode ser negativo.");
          return; // Interrompe a função se houver erros
      }

      // Atualizar a conta
      contaAtual.innerHTML = `
          <div class="conta-info" onclick="mostrarDetalhes('${editNome}', '${editSerie}', '${editValue}', '${novoLimite}', '0')">
              <span>Nome: ${editNome}</span><br>
              <span>Série: ${editSerie}</span><br>
              <span>Telefone: ${editValue}</span><br>
              <span>Limite: ${novoLimite}</span>
          </div>`;
      document.getElementById("overlayEditar").style.display = "none"; // Fecha a sobreposição após salvar
  };
  document.getElementById("overlayEditar").style.display = "flex";
  editando = true;
}
// Função para excluir conta
document.getElementById("editDeleteBtn").onclick = () => {
  if (confirm("Você tem certeza de que deseja excluir esta conta?")) {
      contaAtual.closest('tr').remove();
      overlayEditar.style.display = "none";
  }
};

// Fechar a sobreposição
overlayDetalhes.addEventListener("click", (e) => {
  if (e.target === overlayDetalhes) {
      overlayDetalhes.style.display = "none";
  }
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
      overlay.style.display = "none";
  }
});

overlayEditar.addEventListener("click", (e) => {
  if (e.target === overlayEditar) {
      overlayEditar.style.display = "none";
  }
});

// Adicionar valor
adicionarValorBtn.addEventListener("click", () => {
  const valorAdicionar = parseFloat(document.getElementById("valorAdicionar").value);
  if (!isNaN(valorAdicionar) && valorAdicionar > 0 && Number.isInteger(valorAdicionar)) {
      detalhesConta.valor += valorAdicionar;
      document.getElementById("detalhesConta").innerHTML = `
          Nome: ${detalhesConta.nome}<br>
          Série: ${detalhesConta.serie}<br>
          Telefone: ${detalhesConta.telefone}<br>
          Limite: ${detalhesConta.limite}<br>
          Valor: ${detalhesConta.valor.toFixed(2)}`;
      document.getElementById("valorAdicionar").value = ''; // Limpa o campo após adicionar
  } else {
      alert("Por favor, insira um valor válido.");
  }
});

// Diminuir valor
diminuirValorBtn.addEventListener("click", () => {
  const valorDiminuir = parseFloat(document.getElementById("valorDiminuir").value);
  if (!isNaN(valorDiminuir) && valorDiminuir > 0 && Number.isInteger(valorDiminuir)) {
      if (detalhesConta.valor - valorDiminuir < 0) {
          alert("O valor não pode ser negativo.");
          document.getElementById("valorDiminuir").value = ''; // Limpa o campo para o usuário tentar novamente
      } else {
          detalhesConta.valor -= valorDiminuir;
          document.getElementById("detalhesConta").innerHTML = `
              Nome: ${detalhesConta.nome}<br>
              Série: ${detalhesConta.serie}<br>
              Telefone: ${detalhesConta.telefone}<br>
              Limite: ${detalhesConta.limite}<br>
              Valor: ${detalhesConta.valor.toFixed(2)}`;
          document.getElementById("valorDiminuir").value = ''; // Limpa o campo após diminuir
      }
  } else {
      alert("Por favor, insira um valor válido.");
  }
});

// Função para formatar o nome (remove números)
function formatarNome(input) {
  input.value = input.value.replace(/\d/g, ''); // Remove números
  input.value = input.value.replace(/\b\w/g, char => char.toUpperCase()); // Torna a primeira letra de cada palavra maiúscula
}

// Adiciona o evento de input no campo de nome para formatação automática
document.getElementById("editName").addEventListener("input", function() {
  formatarNome(this);
});

// No botão de salvar da edição
document.getElementById("editSaveBtn").onclick = function() {
  const novoLimite = parseFloat(document.getElementById("editLimit").value);
  const editNome = document.getElementById("editName").value;
  const editSerie = document.getElementById("editSerie").value;
  const editValue = document.getElementById("editValue").value;
  const erros = [];

  if (!editNome || !editSerie || !editValue || isNaN(novoLimite)) {
      if (!editNome || !editSerie || !editValue) {
          erros.push("Preencha todos os campos.");
      }
      if (novoLimite < 0) {
          erros.push("O limite não pode ser negativo.");
      }
      alert        (erros.join("\n"));
      return; // Interrompe a função se houver erros
  }

  // Atualizar a conta
  contaAtual.innerHTML = `
      <div class="conta-info" onclick="mostrarDetalhes('${editNome}', '${editSerie}', '${editValue}', '${novoLimite}', '0')">
          <span>Nome: ${editNome}</span><br>
          <span>Série: ${editSerie}</span><br>
          <span>Telefone: ${editValue}</span><br>
          <span>Limite: ${novoLimite}</span>
      </div>`;
  document.getElementById("overlayEditar").style.display = "none"; // Fecha a sobreposição após salvar
};
