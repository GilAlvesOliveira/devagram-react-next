import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import CabecalhoComAcoes from "@/componentes/cabecalhoComAcoes";
import UploadImagem from "@/componentes/uploadImagem";
import comAutorizacao from "@/hoc/comAutorizacao"
import imgAvatarPadrao from '../../public/imagens/avatar.svg';
import imgLimpar from '../../public/imagens/limpar.svg';

function EditarPerfil() {
    const [avatar, setAvatar] = useState();
    const [nome, setNome] = useState('');
    const [inputAvatar, setInputAvatar] = useState();
    const router = useRouter();

    const aoCancelarEdicao = () => {
        router.push('/perfil/eu');
    }

    const abrirSeletorArquivos = () => {
        console.log("abrir seletor de arquivos");
    }

    return (
        <div className="paginaEditarPerfil largura30pctDesktop">
            <div className="conteudoPaginaEditarPerfil">
                <CabecalhoComAcoes
                    titulo={'Editar perfil'}
                    aoClicarAcaoEsquerda={aoCancelarEdicao}
                    textoEsquerda='Cancelar'
                    elementoDireita={'Concluir'}
                    aoClicarElementoDireita={() => console.log('clicou elemento direita')}
                />

            <hr className='linhaDivisoria' />

            <div className="edicaoAvatar">
                <UploadImagem
                    setImagem={setAvatar}
                    imagemPreview={avatar?.preview || imgAvatarPadrao.src}
                    imagemPreviewClassName="avatar"
                    aoSetarAReferencia={setInputAvatar}
                />

                <span onClick={abrirSeletorArquivos}>Alterar foto do perfil</span>
            </div>

            <hr className='linhaDivisoria' />

            <div className="edicaoNome">
                <label>Nome</label>

                <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

                <Image
                    src={imgLimpar}
                    alt='icone Limpar'
                    width={16}
                    height={16}
                    onClick={() => setNome('')}
                />
            </div>

            <hr className='linhaDivisoria' />
            </div>

        </div>
    );
}

export default comAutorizacao(EditarPerfil);