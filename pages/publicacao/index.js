import CabecalhoComAcoes from "@/componentes/cabecalhoComAcoes";
import UploadImagem from "@/componentes/uploadImagem";
import comAutorizacao from "@/hoc/comAutorizacao"
import { useState } from "react";
import imagemPublicacao from '../../public/imagens/imagemPublicacao.svg';
import Botao from "@/componentes/botao";

function Publicacao(){
    const [imagem, setImagem]= useState();
    const [inputImagem, setInputImagem] = useState();

    return (
        <div className="paginaPublicacao largura30pctDesktop">
            <CabecalhoComAcoes
                textoEsquerda='Cancelar'
                elementoDireita={'Avançar'}
                titulo='Nova publicação'
            />

            <div className="conteudoPaginaPublicacao">
                <div className="primeiraEtapa">
                <UploadImagem
                    setImagem={setImagem}
                    aoSetarAReferencia={setInputImagem}
                    imagemPreviewClassName={imagem ? 'previewImagemPublicacao' : ''}
                    imagemPreview={imagem?.preview || imagemPublicacao.src}
                />

                <span className="desktop testoDradAndDrop">Arraste sua foto aqui!</span>

                <Botao
                    texto='Selecionar uma Imagem'
                    manipularClique={() => console.log('Teste ok')}
                />
                </div>
            </div>
        </div>
    );
}

export default comAutorizacao(Publicacao);