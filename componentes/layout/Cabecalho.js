import Image from 'next/image';
import logoHorizontalImg from '../../public/imagens/logoHorizontal.svg';
import imagemLupa from '../../public/imagens/lupa.svg';
import Navegacao from './Navegacao';
import { useState } from 'react';
import ResultadoPesquisa from './ResultadoPesquisa';

export default function Cabecalho() {
    const [resultdoPesquisa, setResultadoPesquisa] = useState([]);
    const [termoPesquisado, setTermoPesquisado] = useState([]);

    const aoPesquisar = (e) => {
        setTermoPesquisado(e.target.value);
        setResultadoPesquisa([]);

        if (termoPesquisado.length > 3) {
            return;
        }

        setResultadoPesquisa([
            {
                avatar: '',
                nome: 'Gilmar',
                email: 'gilmar@devagram.com',
                _id: '123456'
            },
            {
                avatar: '',
                nome: 'Ana',
                email: 'ana@devagram.com',
                _id: '567890'
            },
            {
                avatar: '',
                nome: 'Yasmin',
                email: 'yasmin@devagram.com',
                _id: '13579'
            }
        ])
    }

    const aoClicarResultadoPesquisa = (id) => {
        console.log('aoClicarResultadoPesquisa', {id})
    }

    return (
        <header className='cabecalhoPrincipal'>
            <div className='conteudoCabecalhoPrincipal'>
                <div className='logoCabecalhoPrincipal'>
                    <Image
                        src={logoHorizontalImg}
                        alt='logo devagram'
                        layout='fill'
                    />
                </div>

                <div className='barraPesquisa'>
                    <div className='containerImagemLupa'>
                        <Image
                            src={imagemLupa}
                            alt='Icone Lupa'
                            layout='fill'
                        />
                    </div>

                    <input
                        type='text'
                        placeholder='Pesquisar'
                        value={termoPesquisado}
                        onChange={aoPesquisar}
                        />
                </div>

                <Navegacao className='desktop' />
            </div>

            {resultdoPesquisa.length > 0 && (
            <div className='resultadoPesquisaContainer'>
                {resultdoPesquisa.map(r => (
                    <ResultadoPesquisa
                        avatar={r.avatar}
                        name={r.nome}
                        email={r.email}
                        key={r._id}
                        id={r._id}
                        onClick={aoClicarResultadoPesquisa}
                    />
                ))}
            </div>
            )}
        </header>
    );
}