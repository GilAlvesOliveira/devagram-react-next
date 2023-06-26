import CabecalhoComAcoes from "@/componentes/cabecalhoComAcoes";
import UploadImagem from "@/componentes/uploadImagem";
import comAutorizacao from "@/hoc/comAutorizacao"
import { useState } from "react";
import imagemPublicacao from '../../public/imagens/imagemPublicacao.svg';
import Botao from "@/componentes/botao";
import imagemSetaEsquerda from '../../public/imagens/setaEsquerda.svg';


function Publicacao(){
    const [imagem, setImagem]= useState();
    const [inputImagem, setInputImagem] = useState();
    const [etapaAtual, setEtapaAtual] = useState(1);

    const estaNaEtapaUm = () => etapaAtual === 1; 

    const obterTextoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm() && imagem) {
            return 'cancelar';
        }

        return '';
    }

    const obterTextoDireitaCabecalho = () => {
        if (!imagem) {
            return '';
        }

        if (estaNaEtapaUm()) {
            return 'Avançar';
        }

        return 'Compatilhar';
    }

    const aoClicarAcaoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm()) {
            inputImagem.value = null;
            setImagem(null);
            return;
        }

        setEtapaAtual(1);
    }

    const aoClicarAcaoDireitaCabecalho = () => {
        setEtapaAtual(2);
    }

    return (
        <div className="paginaPublicacao largura30pctDesktop">
            <CabecalhoComAcoes
                iconeEsquerda={estaNaEtapaUm() ? null : imagemSetaEsquerda}
                textoEsquerda={obterTextoEsquerdaCabecalho()}
                aoClicarAcaoEsquerda={aoClicarAcaoEsquerdaCabecalho}
                elementoDireita={obterTextoDireitaCabecalho()}
                aoClicarElementoDireita={aoClicarAcaoDireitaCabecalho}
                titulo='Nova publicação'
            />

                <hr className='linhaDivisoria' />

            <div className="conteudoPaginaPublicacao">
                {estaNaEtapaUm()
                    ? (
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
                    ) : (
                        <div className="segundaEtapa">
                            
                        </div>
                    )}
            </div>
        </div>
    );
}

export default comAutorizacao(Publicacao);