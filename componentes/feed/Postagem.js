import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../avatar";
import deleteIcon from '../../public/imagens/excluir.svg';
import imgCurtir from '../../public/imagens/curtir.svg';
import imgCurtido from '../../public/imagens/curtido.svg';
import imgComentarioAtivo from '../../public/imagens/comentarioAtivo.svg';
import imgComentarioCinza from '../../public/imagens/comentarioCinza.svg';
import { FazerComentario } from "./FazerComentario";
import FeedService from "@/services/FeedService";

const tamanhoLimiteDescricao = 89;
const feedService = new FeedService();

// ✅ Ajustes de toque (mobile)
const TEMPO_DUO_TAP_MS = 300;
const MOVE_THRESHOLD_PX = 12; // passou disso, consideramos scroll/arrasto

export default function Postagem({
    id,
    usuario,
    fotoDoPost,
    descricao,
    comentarios,
    usuarioLogado,
    curtidas,
    onDelete
}) {
    const [curtidasPostagem, setCurtidasPostagem] = useState(curtidas);
    const [comentariosPostagem, setComentariosPostagem] = useState(comentarios);
    const [deveExibirSecaoParaComentar, setDeveExibirSecaoParaComentar] = useState(false);
    const [tamanhoAtualDaDescricao, setTamanhoAtualDaDescricao] = useState(
        tamanhoLimiteDescricao
    );
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);

    // Modal de imagem grande
    const [mostrarModalImagem, setMostrarModalImagem] = useState(false);

    // ✅ Feedback visual rápido ao curtir
    const [mostrarFeedbackCurtida, setMostrarFeedbackCurtida] = useState(false);

    // ✅ Controle para não abrir modal quando for double click/tap
    const singleClickTimerRef = useRef(null);
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

    // ✅ Controle de scroll no mobile
    const touchStartRef = useRef({ x: 0, y: 0 });
    const isScrollingRef = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMostrarModalImagem(false);
                setMostrarModalExclusao(false);
            }
        };

        if (mostrarModalImagem || mostrarModalExclusao) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [mostrarModalImagem, mostrarModalExclusao]);

    useEffect(() => {
        return () => {
            if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        };
    }, []);

    const excluirPublicacao = async () => {
        try {
            await feedService.excluirPublicacao(id);
            setMostrarModalExclusao(false);
            onDelete(id);
        } catch (e) {
            alert(`Erro ao excluir publicação! ${e?.response?.data?.erro || ''}`);
        }
    }

    const handleExcluirClick = () => {
        setMostrarModalExclusao(true);
    }

    const confirmarExclusao = () => {
        setMostrarModalExclusao(false);
        excluirPublicacao();
    }

    const cancelarExclusao = () => {
        setMostrarModalExclusao(false);
    }

    const exibirDescricaoCompleta = () => {
        setTamanhoAtualDaDescricao(Number.MAX_SAFE_INTEGER);
    }

    const descricaoMaiorQueLimite = () => {
        return descricao.length > tamanhoAtualDaDescricao;
    }

    const obterDescricao = () => {
        let mensagem = descricao.substring(0, tamanhoAtualDaDescricao);
        if (descricaoMaiorQueLimite()) {
            mensagem += '...';
        }
        return mensagem;
    }

    const obterImagemComentario = () => {
        return deveExibirSecaoParaComentar
            ? imgComentarioAtivo
            : imgComentarioCinza;
    }

    const comentar = async (comentario) => {
        try {
            await feedService.adicionarComentario(id, comentario);
            setDeveExibirSecaoParaComentar(false);
            setComentariosPostagem([
                ...comentariosPostagem,
                {
                    nome: usuarioLogado.nome,
                    mensagem: comentario
                }
            ]);
        } catch (e) {
            alert(`Erro ao fazer comentario! ${e?.response?.data?.erro || ''}`);
        }
    }

    const usuarioLogadoCurtiuPostagem = () => {
        return curtidasPostagem.includes(usuarioLogado.id);
    }

    const alterarCurtida = async () => {
        try {
            await feedService.alterarCurtida(id);

            if (usuarioLogadoCurtiuPostagem()) {
                setCurtidasPostagem(
                    curtidasPostagem.filter(idUsuarioQueCurtiu => idUsuarioQueCurtiu !== usuarioLogado.id)
                );
            } else {
                setCurtidasPostagem([
                    ...curtidasPostagem,
                    usuarioLogado.id
                ]);

                // ✅ Feedback visual só quando estiver curtindo (não descurtir)
                setMostrarFeedbackCurtida(true);
                setTimeout(() => setMostrarFeedbackCurtida(false), 600);
            }
        } catch (e) {
            alert(`Erro ao alterar a curtida! ${e?.response?.data?.erro || ''}`);
        }
    }

    const obterImagemCurtida = () => {
        return usuarioLogadoCurtiuPostagem()
            ? imgCurtido
            : imgCurtir;
    }

    const abrirImagem = () => setMostrarModalImagem(true);
    const fecharImagem = () => setMostrarModalImagem(false);

    // ✅ Clique único: abre modal (com delay pra permitir cancelar se virar double click)
    const handleImagemClick = () => {
        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);

        singleClickTimerRef.current = setTimeout(() => {
            abrirImagem();
        }, 240); // tempo curto pra diferenciar de double click
    };

    // ✅ Desktop: double click curte e NÃO abre modal
    const handleImagemDoubleClick = () => {
        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        alterarCurtida();
    };

    // ✅ Mobile: touch start (não decide nada ainda)
    const handleTouchStart = (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        isScrollingRef.current = false;
    };

    // ✅ Mobile: se mexeu muito, é scroll -> cancela qualquer abertura
    const handleTouchMove = (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;

        const dx = Math.abs(touch.clientX - touchStartRef.current.x);
        const dy = Math.abs(touch.clientY - touchStartRef.current.y);

        if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
            isScrollingRef.current = true;
            if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        }
    };

    // ✅ Mobile: decide no touch end (tap / double tap / scroll)
    const handleTouchEnd = () => {
        // se estava scrollando, não faz nada
        if (isScrollingRef.current) return;

        const now = Date.now();
        const last = lastTapRef.current;

        const timeDiff = now - last.time;
        const dx = Math.abs(touchStartRef.current.x - last.x);
        const dy = Math.abs(touchStartRef.current.y - last.y);

        const isDoubleTap = timeDiff > 0 && timeDiff < TEMPO_DUO_TAP_MS && dx < 25 && dy < 25;

        if (isDoubleTap) {
            if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
            alterarCurtida();
            lastTapRef.current = { time: 0, x: 0, y: 0 };
            return;
        }

        // atualiza último tap
        lastTapRef.current = {
            time: now,
            x: touchStartRef.current.x,
            y: touchStartRef.current.y
        };

        // toque simples: abre modal (com delay, pra permitir virar double tap)
        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        singleClickTimerRef.current = setTimeout(() => {
            abrirImagem();
        }, 240);
    };

    return (
        <div className="postagem">
            <section className="cabecalhoPostagem">
                <Link href={`/perfil/${usuario.id}`}>
                    <div className="usuarioInfo">
                        <Avatar src={usuario.avatar} />
                        <strong>{usuario.nome}</strong>
                    </div>
                </Link>
                {usuario.id === usuarioLogado.id && (
                    <Image
                        src={deleteIcon}
                        alt="Excluir publicação"
                        width={20}
                        height={20}
                        className="deleteIcon"
                        onClick={handleExcluirClick}
                        role="button"
                        aria-label="Excluir publicação"
                    />
                )}
            </section>

            <div className="fotoDaPostagem">
                <img
                    src={fotoDoPost}
                    alt="foto da postagem"
                    onClick={handleImagemClick}
                    onDoubleClick={handleImagemDoubleClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="button"
                    aria-label="Abrir foto (1 toque) ou curtir (2 toques)"
                    className="fotoClicavel"
                />

                {mostrarFeedbackCurtida && (
                    <div className="feedbackCurtida" aria-hidden="true">
                        <Image src={imgCurtido} alt="" width={70} height={70} />
                    </div>
                )}
            </div>

            <div className="rodapeDaPostagem">
                <div className="acoesDaPostagem">
                    <Image
                        src={obterImagemCurtida()}
                        alt="icone curtir"
                        width={20}
                        height={20}
                        onClick={alterarCurtida}
                    />

                    <Image
                        src={obterImagemComentario()}
                        alt="icone comentar"
                        width={20}
                        height={20}
                        onClick={() => setDeveExibirSecaoParaComentar(!deveExibirSecaoParaComentar)}
                    />

                    <span className="quantidadeCurtidas">
                        Curtido por <strong>{curtidasPostagem.length} pessoas</strong>
                    </span>
                </div>

                <div className="descricaoDaPostagem">
                    <strong className="nomeUsuario">{usuario.nome}</strong>
                    <p className="descricao">
                        {obterDescricao()}
                        {descricaoMaiorQueLimite() && (
                            <span
                                onClick={exibirDescricaoCompleta}
                                className="exibirDescricaoCompleta"
                            >
                                mais
                            </span>
                        )}
                    </p>
                </div>

                <div className="comentariosDaPublicacao">
                    {comentariosPostagem.map((comentario, i) => (
                        <div className="comentario" key={i}>
                            <strong className="nomeUsuario">{comentario.nome}</strong>
                            <p className="descricao">{comentario.mensagem}</p>
                        </div>
                    ))}
                </div>
            </div>

            {deveExibirSecaoParaComentar &&
                <FazerComentario comentar={comentar} usuarioLogado={usuarioLogado} />
            }

            {/* Modal da imagem */}
            {mostrarModalImagem && (
                <div className="modalOverlay imagemOverlay" onClick={fecharImagem}>
                    <div className="modalImagem" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="fecharModalImagem"
                            onClick={fecharImagem}
                            aria-label="Fechar imagem"
                            type="button"
                        >
                            ×
                        </button>

                        <img
                            src={fotoDoPost}
                            alt="Foto ampliada"
                            className="imagemAmpliada"
                        />
                    </div>
                </div>
            )}

            {/* Modal de exclusão */}
            {mostrarModalExclusao && (
                <div className="modalOverlay" onClick={cancelarExclusao}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <p>Deseja realmente excluir esta publicação?</p>
                        <div className="modalButtons">
                            <button className="modalButton confirm" onClick={confirmarExclusao}>
                                Sim, excluir
                            </button>
                            <button className="modalButton cancel" onClick={cancelarExclusao}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}