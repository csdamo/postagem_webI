window.onload = function(){

  //console.log("Busca todas postagens");
  getPosts(-1, "GET", "", 0, 0, "");

  // console.log("Busca postagem 3");
  // getPosts(3);

  // console.log("Busca postagem sábado");
  // getPosts(-1, "sábado");

  // console.log("Busca 5 primeiras postages");
  // getPosts(-1, "", "GET", 0, 5);

  // console.log("Insere postagem");
  // obterPostagens(-1, "", "POST", 0, 0, {titulo: "Teste", conteudo: "Teste", categorias: "Teste"});

}


$("#form_id").submit(function(event){
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

  getPosts(post_id, request_method, "", 0, 0, form_data)
  $('#formMessageModal').modal('hide');
  setTimeout(getPosts, 70)
});

$("#bnt_openModalPost").click(function(event){
	event.preventDefault();
  
  // garante que os campos do formuláriio estarão vazios quando abrir a modal para novo registro
  $("#item_id").val("");
  $("#title_id").val("");
  $("#categories_id").val("");
  $("#content_id").val("");

  $('#formMessageModal').modal('show');
});

function sendData(data){
  
  // cria html com os dados vindos da api
  let table = document.getElementById("id_tbody");
  linha = ""
  for (var i = 0; i < data.length; i++) {
    linha += "\
      <tr class=\"\"> \
        <th scope=\"row\">" + data[i].id + "</th> \
        <td onclick='openModal(" + JSON.stringify(data[i]) + ")'>" + data[i].title + "</td> \
        <td onclick='openModal(" + JSON.stringify(data[i]) + ")'>" + data[i].categories + "</td> \
        <td onclick='openModal(" + JSON.stringify(data[i]) + ")'>" + data[i].content + "</td> \
        <td onclick='openModal(" + JSON.stringify(data[i]) + ")'>" + data[i].version + "</td> \
        <td onclick='deletePost(" + JSON.stringify(data[i]) + ")'><i class=\"bi bi-x-lg\"></i></i></td> \
      </tr>\n"
  }
  table.innerHTML = linha;
}

function getPosts(post_id = -1, method="GET", searchTerm = "", start=0, limit=0, data=""){

    let url = 'https://localhost:4567/postagem';

    if (post_id >= 0){
      url += '/' + post_id;
    } else if (searchTerm.length > 0){
      url += '?title=' + searchTerm;
    } else if (start > 0 || limit > 0){
      url += '?start=' + start + '&limit=' + limit;
    }

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
        console.log(resposne);
        sendData(resposne);
        // document.getElementById("resposta").innerHTML = blog.title;
      })
      .fail(function(erro) {
        console.log("erro", erro);
      })
      .always(function() {
        console.log("complete")
      });
}

function openModal(post) {
  $("#item_id").val(post.id);
  $("#title_id").val(post.title);
  $("#categories_id").val(post.categories);
  $("#content_id").val(post.content);
  $('#formMessageModal').modal('show');
}

function deletePost(post){
  $("#post_id").val(post.id)
  $("#confirmModal").modal('show');
};

$("#confirmOk").on("click", function(){
  let post_id = $("#post_id").val()
  let request_method = "DELETE";
  getPosts(post_id, request_method)

  
  $("#confirmModal").modal('hide');
  console.log("Deletado com sucesso")
  getPosts()
});

$("#confirmCancel").on("click", function(){
  console.log("Cancela")
  $("#confirmModal").modal('hide');
});


$("#search_id").bind('change keyup', function() {

  let searchTerm =  $("#search_id").val();
  let post_id = -1;
  let method="GET";

  getPosts(post_id, method, searchTerm)
})


$("#length_id").on("change", function(){
  console.log("njgknbkmv,çc.~x;")
})

