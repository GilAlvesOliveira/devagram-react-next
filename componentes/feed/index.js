import { useState, useEffect } from "react";
import Postagem from "./Postagem";
import FeedService from "@/services/FeedService";

const feedService = new FeedService();

export function Feed({ usuarioLogado }) {
  const [listaDePostagens, setListaDePostagens] = useState([]);

  useEffect(() => {
    const carregarPostagens = async () => {
    const { data } = await feedService.carregarPostagens();
    console.log(data);

    const postagensFormatadas = data.map((postagem) => (
        {
            id: postagem._id,
            usuario: {
                id: postagem.userId,
                nome: postagem.usuario.nome,
                avatar: postagem.usuario.avatar
            },
            fotoDoPost: postagem.foto,
            descricao: postagem.descricao,
            curtidas: postagem.likes,
            comentarios: postagem.comentarios.map(c => ({
                nome: c.nome,
                mensagem: c.comentario
            }))
        }
    ));

    setListaDePostagens(postagensFormatadas);

      setListaDePostagens([
        {
            id: '1',
            usuario: {
                id: '1',
                nome: 'Gilmar Oliveira',
                avatar: null
            },
            fotoDoPost: 'https://img.freepik.com/fotos-gratis/respingo-colorido-abstrato-3d-background-generativo-ai-background_60438-2509.jpg',
            descricao: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to m',
            curtidas: [],
            comentarios: [
                {
                    nome: 'Fulano',
                    mensagem: 'Muito legal'
                },
                {
                    nome: 'Fulano de tal',
                    mensagem: 'Imagem muito bacana!'
                },
                {
                    nome: 'Fulano da esquina',
                    mensagem: 'Isso ai! continue assim'
                }
            ]
        },
        {
            id: '2',
            usuario: {
                id: '2',
                nome: 'Ana Cristana',
                avatar: null
            },
            fotoDoPost: 'https://ciclovivo.com.br/wp-content/uploads/2018/10/iStock-536613027.jpg',
            descricao: 'Neque porro quisquam est qui dolorem ipsum olor sit amet, consectetur, adipisci velit',
            curtidas: [],
            comentarios: [
                {
                    nome: 'Ciclano',
                    mensagem: 'Muito bom'
                }
            ]
        },
    ])
    };

    carregarPostagens();
  }, [usuarioLogado]);

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