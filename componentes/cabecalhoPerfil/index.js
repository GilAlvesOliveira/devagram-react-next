import imgSetaEsquerda from '../../public/imagens/setaEsquerda.svg';
import CabecalhoComAcoes from '../cabecalhoComAcoes';
import Botao from '../botao';
import Avatar from '../avatar';

export default function CabecalhoPerfil({
    usuario
}) {
    return (
        <div className='cabecalhoPerfil largura30pctDesktop'>
            <CabecalhoComAcoes
                iconeEsquerda={imgSetaEsquerda}
                titulo={usuario.nome}
            />

            <hr className='bordaCabecalhoPerfil' />
            
            <div className='statusPerfil'>
                <Avatar src={usuario.avatar} />
                <div className='informacoesPerfil'>
                    <div className='statusContainer'>
                        <div className='status'>
                            <strong>{usuario.publicacoes}</strong>
                            <span>Publicações</span>
                        </div>

                        <div className='status'>
                            <strong>{usuario.seguidores}</strong>
                            <span>Seguidores</span>
                        </div>

                        <div className='status'>
                            <strong>{usuario.seguindo}</strong>
                            <span>Seguindo</span>
                        </div>
                    </div>

                    <Botao
                        texto={'Seguir'}
                        cor='primaria'
                    />
                </div>
            </div>

        </div>
    )
}