window.onload = function(){

    obterPostagens();

}

function obterPostagens(postagem = "", titulo = ""){

    let url = 'https://localhost:4567/postagem';

    if (postagem !== null){
        $url += '/' + postagem
    } else if (titulo !== null){
        url += '?titel=' + titulo
    }

    console.log("Abriu obter postagem")

    $.ajax({
        url: url,
        type: 'GET',
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