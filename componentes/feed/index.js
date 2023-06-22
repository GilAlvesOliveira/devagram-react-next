import { useState, useEffect } from "react";
import Postagem from "./Postagem";
import FeedService from "@/services/FeedService";

const feedService = new FeedService();

export default function Feed({ usuarioLogado, idUsuario }) {
  const [listaDePostagens, setListaDePostagens] = useState([]);

  useEffect(() => {
    setListaDePostagens([]);
    const carregarPostagens = async () => {
      const { data } = await feedService.carregarPostagens(idUsuario);
      console.log(data);
      const postagensFormatadas = data.map((postagem) => ({
        id: postagem._id,
        usuario: {
          id: postagem.idUsuario,
        },
        fotoDoPost: postagem.foto,
        descricao: postagem.descricao,
        curtidas: postagem.likes,
        comentarios: postagem.comentarios.map((c) => ({
          nome: c.nome,
          mensagem: c.comentario
        }))
      }));
      setListaDePostagens(postagensFormatadas);
    };

    carregarPostagens();
  }, [usuarioLogado, idUsuario]);

  if (!listaDePostagens.length) {
    return null;
  }

  return (
    <div className="feedContainer largura30pctDesktop">
        {listaDePostagens.map((dadosPostagem) => (
          <Postagem
            key={dadosPostagem.id}
            {...dadosPostagem}
            usuarioLogado={usuarioLogado}
          />
        ))
      }
    </div>
  );
}