import Image from 'next/image';
import imgHomeAtivo from '../../public/imagens/homeAtivo.svg';
import imgHomeCinza from '../../public/imagens/homeCinza.svg';
import imgPublicacaoAtivo from '../../public/imagens/publicacaoAtivo.svg';
import imgPublicacaoCinza from '../../public/imagens/publicacaoCinza.svg';
import imgUsuarioAtivo from '../../public/imagens/usuarioAtivo.svg';
import imgUsuarioCinza from '../../public/imagens/usuarioCinza.svg';
import { useState } from 'react';

const mapaDeRotas = {
    home: {
        imagemAtivo: imgHomeAtivo,
        rotasAtivacao: ['/'],
        imagemPadrao: imgHomeCinza
    },
    publicacao: {
        imagemAtivo: imgPublicacaoAtivo,
        rotasAtivacao: ['/publicacao'],
        imagemPadrao: imgPublicacaoCinza
    },
    perfil: {
        imagemAtivo: imgUsuarioAtivo,
        rotasAtivacao: ['/perfil/eu', '/perfil/eu/editar'],
        imagemPadrao: imgUsuarioCinza
    }
}

export default function Navegacao({ className }) {
    const [rotaAtiva, setRotaAtiva] = useState('home')

    return (
        <nav className={`barraNavegacao ${className}`}>
            <ul>
                <li>
                    <Image
                        src={imgHomeAtivo}
                        alt='icone home'
                        width={20}
                        height={20}
                    />
                </li>

                <li>
                    <Image
                        src={imgPublicacaoCinza}
                        alt='icone publicacao'
                        width={20}
                        height={20}
                    />
                </li>

                <li>
                    <Image
                        src={imgUsuarioCinza}
                        alt='icone usuario'
                        width={20}
                        height={20}
                    />
                </li>
            </ul>
        </nav>
    );
}