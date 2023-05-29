import { useEffect, useState } from "react"
import Postagem from "./postagem";

export default function Feed({ usuarioLogado }) {
        const [listaDePostagens, setListaDePostagens] = useState([]);

        useEffect(() => {
            console.log('carregar o feed');
            setListaDePostagens([
                {
                    id: '1',
                    usuario: {
                        id: '1',
                        nome: 'Gilmar Oliveira',
                        avatar: null,
                    },
                    fotoDoPost: 'https://img.freepik.com/fotos-gratis/respingo-colorido-abstrato-3d-background-generativo-ai-background_60438-2509.jpg',
                    descricao: 'Lorem Ipsum é simplesmente um texto fictício da indústria tipográfica e de impressão. Lorem Ipsum tem sido o texto fictício padrão da indústria desde os anos 1500, quando um impressor desconhecido pegou uma galera de tipos e os embaralhou para fazer um livro de espécimes de tipos. Ele sobreviveu não apenas a cinco séculos, mas também ao salto para a composição eletrônica',
                    curtidas: [],
                    comentarios: [
                        {
                            nome: 'Fulano',
                            mensagem: 'Muito legal'
                        }
                    ]
                },
                {
                    id: '2',
                    usuario: {
                        id: '2',
                        nome: 'Ana Cristina',
                        avatar: null,
                    },
                    fotoDoPost: 'https://t.ctcdn.com.br/5XPASDBUosgmBv5Ptpxcd6eTJso=/512x288/smart/filters:format(webp)/i257652.jpeg',
                    descricao: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
                    curtidas: [],
                    comentarios: [
                        {
                            nome: 'Ciclano',
                            mensagem: 'Muito gata'
                        }
                    ]
                },
            ])
        }, [usuarioLogado]);

        return (
            <div className="feedContainer largura30pctDesktop">
                {listaDePostagens.map(dadosPostagem => (
                     <Postagem 
                        key={dadosPostagem.id}
                        {...dadosPostagem}
                        usuarioLogado={usuarioLogado}
                        />
                ))}
            </div>
        )
}