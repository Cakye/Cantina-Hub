const barraDePesquisa = document.querySelector("#pesquisa")//<input/>
const lista = document.querySelector("#lista");//<ul></ul>
const itens = document.querySelectorAll("#lista__item");//<li><li/>

barraDePesquisa.addEventListener("input", ()=>{
    let valorDigitado = barraDePesquisa.value.toLowerCase();
    itens.forEach((item)=>{
         if(item.textContent.toLowerCase().includes(valorDigitado)){
            item.style.display = "block"
         } else {
             item.style.display = "none"
        }

         if(valorDigitado == ""){
            item.style.display = "block"
         }
    })
})