window.onload = function(){

  getPosts();

}

$("#form_id").submit(function(event){
  // envia formulário

	event.preventDefault(); //prevent default action 
  
  // Pega os valores dos campso do formulário
  let id = $("#item_id").val();
  let title = $("#title_id").val();
  let categories = $("#categories_id").val();
  let content = $("#content_id").val();
  
  let post_id = -1
  let request_method = "POST";
  
  if(id){ // se o formulário contém um id, método deve ser de edição
    request_method = "PUT";
    post_id = id
  }

  let body = {
    "title": title,
    "categories": [categories],
    "content": content
  }

  let form_data = JSON.stringify(body);

  getPosts(post_id, request_method, 0, 0, form_data)
  $('#formMessageModal').modal('hide');
  setTimeout(getPosts, 70)
});

$("#bnt_openModalPost").click(function(event){
  // abre modal com formulário
	event.preventDefault();
  
  // garante que os campos do formuláriio estarão vazios quando abrir a modal para novo registro
  $("#item_id").val("");
  $("#title_id").val("");
  $("#categories_id").val("");
  $("#content_id").val("");

  $('#formMessageModal').modal('show');
});

function writePage(data_length){  
  // escreve as páginas na tela

  let length_id = $("#length_id").val()  // quantidade por página selecionado pelo usuário
  let pages = Math.ceil(data_length / length_id);  // total de páginas que deverá mostrar na tela
  let pages_id  =  document.getElementById("pages_id");  // elemento html onde serão impressos as páginas
  let line = ""
  
  let page_selected = $("#page_selected").val() // valor da página selecionada
  let class_page_selected = ""
  
  for (var i = 0; i < pages; i++) {
    
    if(i == page_selected){
      class_page_selected = "page_selected"
    }
    else if(page_selected == null && i==0){
      class_page_selected = "page_selected"
    }
    else{
      class_page_selected = ""
    }

    line += "<li class=\"page-item "+ class_page_selected +"\" >\
                <a id=\"page_" + i + "\" onclick='changePage(" + i + ")' class=\"page-link\" href=\"#pages_id\" >" + (i + 1) + "</a> \
            </li>"
  }

  pages_id.innerHTML = line
}

function writeData(data, start=0){
  // Escreve html na tela conforme registros parametrizados

  let length_id = parseInt($("#length_id").val())  // quantidade por página selecionado pelo usuário
  let data_length = data.length  // quantidade total de registros

  // verifica o tamanho correto da lista, para cada página, a ser exibida na tela conforme configurações do usuário
  let len_data = data_length - start // previne que na última página o tamanho seja maior do que a quantidade de dados
  let size = ((length_id < len_data) ? length_id : len_data); // previne que o tamanho seja maior do que a quantidade de dados
  size = size + start

  const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  color_hexa = genRanHex(3);

  // cria html com os dados vindos da api
  let data_id = $("#data_id")
  linha = ""
  for (var i = start; i < size; i++) {
    linha += "\
    <div class=\"card text-bg-secondary mb-3\" style=\"max-width: 100%;\">\
				<div class=\"card-header d-flex justify-content-between \"> \
          <p class=\"\">" + data[i].categories + "</p> \
          <i class=\"bi bi-x-lg click\" onclick='deletePost(" + JSON.stringify(data[i]) + ")'></i> \
        </div>\
        <div class=\"card-body click hover_color\" onclick='openModal(" + JSON.stringify(data[i]) + ")'>\
					<h5 class=\"card-title\"><span style =\"color:#" + genRanHex(3) + "\"><i class=\"bi bi-film\"></i></span> " + data[i].title + "</h5>\
					<p class=\"card-text\">" + data[i].content + "</p>\
				</div>\
			</div>\
    "
  }
  data_id.html(linha);
  writePage(data_length)
}

function getPosts(post_id = -1, method="GET", start=0, limit=0, data=""){
  // chama api com através da função ajax

  let url = 'https://localhost:4567/postagem';
  if (method == "GET"){
    // se método get, verifica se há termo de pesquisa
    searchTerm =  $("#search_id").val();
  }
  
  if (post_id >= 0){
    url += '/' + post_id;
  } else if (searchTerm.length > 0){
    url += '?title=' + searchTerm;
  } 
  // desativei essa opção da api, pois o uso de intervalo e termo de pesquisa não funcionam ao mesmo tempo 
  // else if (start > 0 || limit > 0){
  //   url += '?start=' + start + '&limit=' + limit;
  // } 

  console.log("Abriu obter postagem", url, method);
  
  $.ajax({
      url: url,
      type: method,
      data: data,
      dataType: 'json',
      contentType: "application/json"
    })
    .done(function(resposne) {
      console.log("success");
      writeData(resposne, start);
    })
    .fail(function(erro) {
      console.log("erro", erro);
    })
    .always(function() {
      console.log("complete")
    });
}

function openModal(post) {
  // preenche formulário com valores do registro selecionado
  $("#item_id").val(post.id);
  $("#title_id").val(post.title);
  $("#categories_id").val(post.categories);
  $("#content_id").val(post.content);
  $('#formMessageModal').modal('show');
}

function deletePost(post){
  // abre modal de delete
  $("#post_id").val(post.id)  // preenche valor do imput oculto da modal de delete
  $("#confirmModal").modal('show');
};

$("#confirmOk").on("click", function(){
  // confirma delete
  let post_id = $("#post_id").val()
  let request_method = "DELETE";
  getPosts(post_id, request_method)

  
  $("#confirmModal").modal('hide');
  console.log("Deletado com sucesso")
  getPosts()
});

$("#confirmCancel").on("click", function(){
  // cancela delete
  $("#confirmModal").modal('hide');
});

function changePage(page){
  // chama api quando usuário seleciona uma página

  let post_id = -1;
  let method="GET";
  let length_id =  $("#length_id").val()
  let start = page * parseInt(length_id);

  $("#page_selected").val(page)

  getPosts(post_id, method, start)
}

$("#search_id").bind('change keyup', function() {
  // chama api quando usuário digita no campo de pesquisa
  getPosts()
})

$("#length_id").on("change", function(){
  // chama api quando usuário seleciona quantidade de registros por página
  getPosts();
})
