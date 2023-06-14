import { useState, useEffect } from "react";
import Postagem from "./Postagem";
import FeedService from "@/services/FeedService";

const feedService = new FeedService();

export default function Feed({ usuarioLogado, idUsuario }) {
  const [listaDePostagens, setListaDePostagens] = useState([]);

  useEffect(() => {
    const carregarPostagens = async () => {
      const { data } = await feedService.carregarPostagens(idUsuario);
      const postagensFormatadas = data.map((postagem) => ({
        id: postagem._id,
        usuario: {
          id: postagem.idUsuario,
          nome: postagem.usuario.nome,
          avatar: postagem.usuario.avatar
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

  return (
    <div className="feedContainer largura30pctDesktop">
      {listaDePostagens.map((dadosPostagem) => (
        <Postagem
          key={dadosPostagem.id}
          {...dadosPostagem}
          usuarioLogado={usuarioLogado}
        />
      ))}
    </div>
  );
}