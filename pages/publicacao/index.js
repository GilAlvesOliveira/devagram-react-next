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
                textoEsquerda=''
                elementoDireita={''}
                titulo='Nova publicação'
            />

                <hr className='linhaDivisoria' />

            <div className="conteudoPaginaPublicacao">
                <div className="primeiraEtapa">
                <UploadImagem
                    setImagem={setImagem}
                    aoSetarAReferencia={setInputImagem}
                    imagemPreviewClassName={!imagem ? 'previewImagemPublicacao' :'previewImagemSelecionado'}
                    imagemPreview={imagem?.preview || imagemPublicacao.src}
                />

                <span className="desktop textoDradAndDrop">Arraste sua foto aqui!</span>

                <Botao
                    texto='Selecionar uma Imagem'
                    manipularClique={() => inputImagem?.click()}
                />
                </div>
            </div>
        </div>
    );
}

export default comAutorizacao(Publicacao);