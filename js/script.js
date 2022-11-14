window.onload = function(){

  console.log("Busca todas postagens");
  obterPostagens();

  console.log("Busca postagem 3");
  obterPostagens(3);

  console.log("Busca postagem sábado");
  obterPostagens(-1, "sábado");

  console.log("Busca 5 primeiras postages");
  obterPostagens(-1, "", "GET", 0, 5);

  // console.log("Insere postagem");
  // obterPostagens(-1, "", "POST", 0, 0, {titulo: "Teste", conteudo: "Teste", categorias: "Teste"});

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

});

function obterPostagens(postagem = -1, titulo = "", metodo="GET", inicio=0, limite=0, data){

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
        console.log(postagem);
        // document.getElementById("resposta").innerHTML = blog.title;
      })
      .fail(function(erro) {
        console.log("erro", erro);
      })
      .always(function() {
        console.log("complete");
      });

}
