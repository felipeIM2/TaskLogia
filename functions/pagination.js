// Função para atualizar a paginação com botões de navegação para a primeira, última, anterior e próximo
function updatePagination(getUser, currentPage, totalPages, displayPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ''; // Limpar conteúdo anterior da paginação

  // Botão de "Primeira Página" - visível somente se não estivermos na primeira página
  if (currentPage > 1) {
    const firstPageButton = document.createElement("a");
    firstPageButton.href = "#";
    firstPageButton.classList.add("first-page");
    firstPageButton.innerHTML = "1";

    firstPageButton.addEventListener('click', (event) => {
      currentPage = 1;
      sessionStorage.setItem("currentPage", currentPage);  // Salvar a página selecionada
      displayPage(currentPage, getUser); // Exibir a primeira página
      updatePagination(getUser, currentPage, totalPages, displayPage); // Atualizar a paginação
      event.preventDefault();
    });

    paginationContainer.appendChild(firstPageButton);
  }

  // Botão de "Anterior" - visível somente se não estivermos na primeira página
  const prevButton = document.createElement("a");
  prevButton.href = "#";
  prevButton.classList.add("prev");
  prevButton.innerHTML = "&laquo;";

  if (currentPage > 1) {
    prevButton.addEventListener('click', (event) => {
      currentPage--;
      sessionStorage.setItem("currentPage", currentPage);  // Salvar a página selecionada
      displayPage(currentPage, getUser);  // Exibir a página correspondente
      updatePagination(getUser, currentPage, totalPages, displayPage); // Atualizar a paginação
      event.preventDefault();
    });
  } else {
    prevButton.classList.add("disabled"); // Desabilita o botão se estiver na primeira página
  }

  paginationContainer.appendChild(prevButton);

  // Exibir sempre 4 páginas intermediárias
  const visiblePages = 4; // Número fixo de páginas a exibir
  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  // Ajustar as páginas para garantir que não ultrapassem o total
  if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  // Gerar os links de páginas
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = "#";
    pageLink.classList.add('page-link');
    pageLink.textContent = i;

    if (i === currentPage) {
      pageLink.classList.add('active'); // Marcar a página ativa
    }

    pageLink.addEventListener('click', (event) => {
      currentPage = i;
      sessionStorage.setItem("currentPage", currentPage);  // Salvar a página selecionada
      displayPage(currentPage, getUser); // Exibir a página correspondente
      updatePagination(getUser, currentPage, totalPages, displayPage); // Atualizar a paginação
      event.preventDefault();
    });

    paginationContainer.appendChild(pageLink);
  }

  // Botão de "Próxima" - visível somente se não estivermos na última página
  const nextButton = document.createElement("a");
  nextButton.href = "#";
  nextButton.classList.add("next");
  nextButton.innerHTML = "&raquo;";

  if (currentPage < totalPages) {
    nextButton.addEventListener('click', (event) => {
      currentPage++;
      sessionStorage.setItem("currentPage", currentPage);  // Salvar a página selecionada
      displayPage(currentPage, getUser); // Exibir a página correspondente
      updatePagination(getUser, currentPage, totalPages, displayPage); // Atualizar a paginação
      event.preventDefault();
    });
  } else {
    nextButton.classList.add("disabled"); // Desabilita o botão se estiver na última página
  }

  paginationContainer.appendChild(nextButton);

  // Botão "Ir para a Última Página" - visível somente se não estivermos na última página
  if (currentPage < totalPages) {
    const lastPageButton = document.createElement("a");
    lastPageButton.href = "#";
    lastPageButton.classList.add("last-page");
    lastPageButton.innerHTML = `${totalPages}`;

    lastPageButton.addEventListener('click', (event) => {
      currentPage = totalPages;
      sessionStorage.setItem("currentPage", currentPage);  // Salvar a página selecionada
      displayPage(currentPage, getUser); // Exibir a última página
      updatePagination(getUser, currentPage, totalPages, displayPage); // Atualizar a paginação
      event.preventDefault();
    });

    paginationContainer.appendChild(lastPageButton);
  }
}

export default updatePagination;
