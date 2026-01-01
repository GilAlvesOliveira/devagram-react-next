import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'
import imgSetaEsquerda from '../../public/imagens/setaEsquerda.svg';
import imgLogout from '../../public/imagens/logout.svg';
import CabecalhoComAcoes from '../cabecalhoComAcoes';
import Botao from '../botao';
import Avatar from '../avatar';
import UsuarioService from '@/services/UsuarioService';

const usuarioService = new UsuarioService();

// ✅ Ajustes de toque (mobile)
const TEMPO_DUO_TAP_MS = 300;
const MOVE_THRESHOLD_PX = 12;

export default function CabecalhoPerfil({
    usuario,
    estaNoPerfilPessoal
}) {
    const [estaSeguindoOUsuario, setEstaSeguindoOUsuario] = useState(false);
    const [quantidadeSeguidores, setQuantidadeSeguidores] = useState(0);

    // ✅ Modal do avatar
    const [mostrarModalAvatar, setMostrarModalAvatar] = useState(false);

    // ✅ Controle de scroll no mobile (evita abrir ao rolar)
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });
    const singleTapTimerRef = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const isScrollingRef = useRef(false);

    const router = useRouter();

    useEffect(() => {
        if (!usuario) {
            return;
        }

        setEstaSeguindoOUsuario(usuario.segueEsseUsuario);
        setQuantidadeSeguidores(usuario.seguidores);
    }, [usuario]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMostrarModalAvatar(false);
            }
        };

        if (mostrarModalAvatar) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [mostrarModalAvatar]);

    useEffect(() => {
        return () => {
            if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
        };
    }, []);

    const obterTextoBotaoSeguir = () => {
        if (estaNoPerfilPessoal) {
            return 'Editar Perfil';
        }
        if (estaSeguindoOUsuario) {
            return 'Deixar de seguir';
        }

        return 'Seguir';
    }

    const obterCorDoBotaoSeguir = () => {
        if (estaSeguindoOUsuario || estaNoPerfilPessoal) {
            return 'invertido';
        }

        return 'primaria';
    }

    const manipularCliqueBotaoPrincipal = async () => {
        if (estaNoPerfilPessoal) {
            return router.push('/perfil/editar');
        }

        try {
            await usuarioService.altenarSeguir(usuario._id);
            setQuantidadeSeguidores(
                estaSeguindoOUsuario
                    ? (quantidadeSeguidores - 1)
                    : (quantidadeSeguidores + 1)
            );
            setEstaSeguindoOUsuario(!estaSeguindoOUsuario);
        } catch (error) {
            alert(`Erro ao seguir/deixar de seguir!`);
        }
    }

    const aoClicarSetaEsquerda = () => {
        router.back();
    }

    const logout = () => {
        usuarioService.logout();
        router.push('/');
    }

    const obterElementoDiteitaCabecalho = () => {
        if (estaNoPerfilPessoal) {
            return (
                <Image
                    src={imgLogout}
                    alt='icone logout'
                    onClick={logout}
                    width={23}
                    height={23}
                />
            );
        }

        return null;
    }

    const abrirModalAvatar = () => {
        if (!usuario?.avatar) return;
        setMostrarModalAvatar(true);
    }

    const fecharModalAvatar = () => {
        setMostrarModalAvatar(false);
    }

    // ✅ Desktop: clique abre
    const handleAvatarClick = () => {
        if (!usuario?.avatar) return;
        if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);

        // pequeno delay pra não “brigar” com toques duplos (se você quiser expandir depois)
        singleTapTimerRef.current = setTimeout(() => {
            abrirModalAvatar();
        }, 200);
    };

    // ✅ Mobile: start (não decide ainda)
    const handleAvatarTouchStart = (e) => {
        if (!usuario?.avatar) return;
        const touch = e.touches && e.touches[0];
        if (!touch) return;

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        isScrollingRef.current = false;
    };

    // ✅ Mobile: se mexeu muito, é scroll -> cancela abertura
    const handleAvatarTouchMove = (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;

        const dx = Math.abs(touch.clientX - touchStartRef.current.x);
        const dy = Math.abs(touch.clientY - touchStartRef.current.y);

        if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
            isScrollingRef.current = true;
            if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
        }
    };

    // ✅ Mobile: decide no end (tap real abre / scroll não faz nada)
    const handleAvatarTouchEnd = () => {
        if (!usuario?.avatar) return;

        if (isScrollingRef.current) return;

        const now = Date.now();
        const last = lastTapRef.current;

        const timeDiff = now - last.time;
        const dx = Math.abs(touchStartRef.current.x - last.x);
        const dy = Math.abs(touchStartRef.current.y - last.y);

        const isDoubleTap = timeDiff > 0 && timeDiff < TEMPO_DUO_TAP_MS && dx < 25 && dy < 25;

        // aqui, no perfil, double tap não faz nada especial — só evita executar 2x
        if (isDoubleTap) {
            if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
            lastTapRef.current = { time: 0, x: 0, y: 0 };
            return;
        }

        lastTapRef.current = {
            time: now,
            x: touchStartRef.current.x,
            y: touchStartRef.current.y
        };

        if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = setTimeout(() => {
            abrirModalAvatar();
        }, 200);
    };

    return (
        <div className='cabecalhoPerfil largura30pctDesktop'>
            <CabecalhoComAcoes
                iconeEsquerda={estaNoPerfilPessoal ? null : imgSetaEsquerda}
                aoClicarAcaoEsquerda={aoClicarSetaEsquerda}
                titulo={usuario.nome}
                elementoDireita={obterElementoDiteitaCabecalho()}
            />

            <hr className='linhaDivisoria' />

            <div className='statusPerfil'>
                <div
                    className={`avatarClicavel ${usuario?.avatar ? '' : 'avatarSemClique'}`}
                    onClick={handleAvatarClick}
                    onTouchStart={handleAvatarTouchStart}
                    onTouchMove={handleAvatarTouchMove}
                    onTouchEnd={handleAvatarTouchEnd}
                    role={usuario?.avatar ? 'button' : undefined}
                    aria-label={usuario?.avatar ? 'Abrir foto de perfil' : undefined}
                >
                    <Avatar src={usuario.avatar} />
                </div>

                <div className='informacoesPerfil'>
                    <div className='statusContainer'>
                        <div className='status'>
                            <strong>{usuario.publicacoes}</strong>
                            <span>Publicações</span>
                        </div>

                        <div className='status'>
                            <strong>{quantidadeSeguidores}</strong>
                            <span>Seguidores</span>
                        </div>

                        <div className='status'>
                            <strong>{usuario.seguindo}</strong>
                            <span>Seguindo</span>
                        </div>
                    </div>

                    <Botao
                        texto={obterTextoBotaoSeguir()}
                        cor={obterCorDoBotaoSeguir()}
                        manipularClique={manipularCliqueBotaoPrincipal}
                    />
                </div>
            </div>

            {/* ✅ Modal do avatar (imagem grande) */}
            {mostrarModalAvatar && (
                <div className="modalOverlay imagemOverlay" onClick={fecharModalAvatar}>
                    <div className="modalImagem" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="fecharModalImagem"
                            onClick={fecharModalAvatar}
                            aria-label="Fechar imagem"
                            type="button"
                        >
                            ×
                        </button>

                        <img
                            src={usuario.avatar}
                            alt="Foto de perfil ampliada"
                            className="imagemAmpliada"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}