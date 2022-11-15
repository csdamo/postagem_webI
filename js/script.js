window.onload = function(){

  //console.log("Busca todas postagens");
  getPosts();

  // console.log("Busca postagem 3");
  // getPosts(3);

  // console.log("Busca postagem sábado");
  // getPosts(-1, "sábado");

  // console.log("Busca 5 primeiras postages");
  // getPosts(-1, "", "GET", 0, 5);

}

// método para chamar rota api com ajax
function runAjax(post_url, request_method, form_data){
  $.ajax({
		url : post_url,
		type: request_method,
		data : form_data,
    dataType: 'json',
    contentType: "application/json"
	})
  .done(function() {
    console.log("success");
  })
  .fail(function(erro) {
    console.log("erro", erro);
  })
  .always(function() {
    console.log("complete");
  });
}

// Quando form é enviado, identifica chama a rota de post ou put
$("#form_id").submit(function(event){
	event.preventDefault(); //prevent default action 
  
  let id = $("#item_id").val();
  let title = $("#title_id").val();
  let categories = $("#categories_id").val();
  let content = $("#content_id").val();

  let post_url = 'https://localhost:4567/postagem';
  let request_method = "POST";
  
  if(id){
    request_method = "PUT";
    post_url = post_url + "/" + id;
  }

  let body = {
    "title": title,
    "categories": [categories],
    "content": content
  }

  let form_data = JSON.stringify(body);

  runAjax(post_url, request_method, form_data)
  $('#formMessageModal').modal('hide');
});

$("#button_id").click(function(event){
	event.preventDefault(); //prevent default action 
  
  let id = $("#item_id").val("");
  let title = $("#title_id").val("");
  let categories = $("#categories_id").val("");
  let content = $("#content_id").val("");

  $('#formMessageModal').modal('show');
});

function sendData(postagem){
  let tabela = document.getElementById("id_tbody");
  linha = ""
  for (var i = 0; i < postagem.length; i++) {

    linha += "\
      <tr class=\"\" onclick='abrirModal(" + JSON.stringify(postagem[i]) + ")'> \
        <th scope=\"row\">" + postagem[i].id + "</th> \
        <td>" + postagem[i].title + "</td> \
        <td>" + postagem[i].categories + "</td> \
        <td>" + postagem[i].content + "</td> \
        <td>" + postagem[i].version + "</td> \
      </tr>\n"
  }
  tabela.innerHTML = linha;
}

function getPosts(postagem = -1, titulo = "", metodo="GET", inicio=0, limite=0, data){

    let url = 'https://localhost:4567/postagem';

    if (postagem >= 0){
      url += '/' + postagem;
    } else if (titulo.length > 0){
      url += '?title=' + titulo;
    } else if (inicio > 0 || limite > 0){
      url += '?start=' + inicio + '&limit=' + limite;
    }

    console.log("Abriu obter postagem", url, metodo);

    $.ajax({
        url: url,
        type: metodo,
        data: data,
        dataType: 'json',
      })
      .done(function(postagem) {
        console.log("success");
        sendData(postagem);
        // document.getElementById("resposta").innerHTML = blog.title;
      })
      .fail(function(erro) {
        console.log("erro", erro);
      })
      .always(function() {
        console.log("complete")
      });
}

function abrirModal(postagem) {

  console.log(postagem.id);

  let id = $("#item_id").val(postagem.id);
  let title = $("#title_id").val(postagem.title);
  let categories = $("#categories_id").val(postagem.categories);
  let content = $("#content_id").val(postagem.content);
  $('#formMessageModal').modal('show');

}
