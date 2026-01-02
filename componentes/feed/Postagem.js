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

// Ajustes de toque (mobile)
const TEMPO_DUO_TAP_MS = 300;
const MOVE_THRESHOLD_PX = 12;

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
    const [tamanhoAtualDaDescricao, setTamanhoAtualDaDescricao] = useState(tamanhoLimiteDescricao);
    const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);

    // Modal imagem
    const [mostrarModalImagem, setMostrarModalImagem] = useState(false);
    const [mostrarFeedbackCurtida, setMostrarFeedbackCurtida] = useState(false);

    // ✅ Modal curtidas
    const [mostrarModalCurtidas, setMostrarModalCurtidas] = useState(false);
    const [listaUsuariosCurtidas, setListaUsuariosCurtidas] = useState([]);
    const [carregandoCurtidas, setCarregandoCurtidas] = useState(false);
    const [erroCurtidas, setErroCurtidas] = useState("");

    // Controle de clique vs double click/tap
    const singleClickTimerRef = useRef(null);
    const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

    // Controle de scroll no mobile
    const touchStartRef = useRef({ x: 0, y: 0 });
    const isScrollingRef = useRef(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setMostrarModalImagem(false);
                setMostrarModalExclusao(false);
                setMostrarModalCurtidas(false);
            }
        };

        if (mostrarModalImagem || mostrarModalExclusao || mostrarModalCurtidas) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [mostrarModalImagem, mostrarModalExclusao, mostrarModalCurtidas]);

    useEffect(() => {
        return () => {
            if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        };
    }, []);

    // ✅ Normaliza o retorno do backend para [{id, nome, avatar}]
    const normalizarUsuariosCurtidas = (data) => {
        // exemplos possíveis:
        // 1) [{id, nome, avatar}]
        // 2) [{_id, nome, avatar}]
        // 3) { usuarios: [...] }
        // 4) { curtidas: [...] }
        // 5) array de ids (string) -> fallback não ideal
        const lista =
            Array.isArray(data) ? data :
            Array.isArray(data?.usuarios) ? data.usuarios :
            Array.isArray(data?.curtidas) ? data.curtidas :
            [];

        // se veio só ids: ["id1","id2"]
        if (lista.length && typeof lista[0] === "string") {
            return lista.map((idUsuario) => ({
                id: idUsuario,
                nome: idUsuario,
                avatar: null
            }));
        }

        // se veio objetos
        return lista.map((u) => ({
            id: u.id || u._id || u.idUsuario,
            nome: u.nome || u.username || u.email || "Usuário",
            avatar: u.avatar || u.foto || null
        })).filter(u => !!u.id);
    };

    // ✅ Carrega curtidas ao abrir modal
    useEffect(() => {
        const carregarCurtidas = async () => {
            if (!mostrarModalCurtidas) return;

            setErroCurtidas("");
            setCarregandoCurtidas(true);
            setListaUsuariosCurtidas([]);

            try {
                const { data } = await feedService.listarCurtidas(id);
                const lista = normalizarUsuariosCurtidas(data);
                setListaUsuariosCurtidas(lista);
            } catch (e) {
                setErroCurtidas(`Erro ao carregar curtidas! ${e?.response?.data?.erro || ''}`);
            } finally {
                setCarregandoCurtidas(false);
            }
        };

        carregarCurtidas();
    }, [mostrarModalCurtidas, id]);

    const excluirPublicacao = async () => {
        try {
            await feedService.excluirPublicacao(id);
            setMostrarModalExclusao(false);
            onDelete(id);
        } catch (e) {
            alert(`Erro ao excluir publicação! ${e?.response?.data?.erro || ''}`);
        }
    };

    const handleExcluirClick = () => setMostrarModalExclusao(true);

    const confirmarExclusao = () => {
        setMostrarModalExclusao(false);
        excluirPublicacao();
    };

    const cancelarExclusao = () => setMostrarModalExclusao(false);

    const exibirDescricaoCompleta = () => setTamanhoAtualDaDescricao(Number.MAX_SAFE_INTEGER);

    const descricaoMaiorQueLimite = () => descricao.length > tamanhoAtualDaDescricao;

    const obterDescricao = () => {
        let mensagem = descricao.substring(0, tamanhoAtualDaDescricao);
        if (descricaoMaiorQueLimite()) mensagem += '...';
        return mensagem;
    };

    const obterImagemComentario = () => (
        deveExibirSecaoParaComentar ? imgComentarioAtivo : imgComentarioCinza
    );

    const comentar = async (comentario) => {
        try {
            await feedService.adicionarComentario(id, comentario);
            setDeveExibirSecaoParaComentar(false);
            setComentariosPostagem([
                ...comentariosPostagem,
                { nome: usuarioLogado.nome, mensagem: comentario }
            ]);
        } catch (e) {
            alert(`Erro ao fazer comentario! ${e?.response?.data?.erro || ''}`);
        }
    };

    const usuarioLogadoCurtiuPostagem = () => curtidasPostagem.includes(usuarioLogado.id);

    const alterarCurtida = async () => {
        try {
            await feedService.alterarCurtida(id);

            if (usuarioLogadoCurtiuPostagem()) {
                setCurtidasPostagem(
                    curtidasPostagem.filter(uid => uid !== usuarioLogado.id)
                );
            } else {
                setCurtidasPostagem([...curtidasPostagem, usuarioLogado.id]);
                setMostrarFeedbackCurtida(true);
                setTimeout(() => setMostrarFeedbackCurtida(false), 600);
            }
        } catch (e) {
            alert(`Erro ao alterar a curtida! ${e?.response?.data?.erro || ''}`);
        }
    };

    const obterImagemCurtida = () => (usuarioLogadoCurtiuPostagem() ? imgCurtido : imgCurtir);

    const abrirImagem = () => setMostrarModalImagem(true);
    const fecharImagem = () => setMostrarModalImagem(false);

    // Clique único abre modal de imagem
    const handleImagemClick = () => {
        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);

        singleClickTimerRef.current = setTimeout(() => {
            abrirImagem();
        }, 240);
    };

    // Double click curte
    const handleImagemDoubleClick = () => {
        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        alterarCurtida();
    };

    // Touch handlers (mobile)
    const handleTouchStart = (e) => {
        const touch = e.touches && e.touches[0];
        if (!touch) return;

        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        isScrollingRef.current = false;
    };

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

    const handleTouchEnd = () => {
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

        lastTapRef.current = {
            time: now,
            x: touchStartRef.current.x,
            y: touchStartRef.current.y
        };

        if (singleClickTimerRef.current) clearTimeout(singleClickTimerRef.current);
        singleClickTimerRef.current = setTimeout(() => {
            abrirImagem();
        }, 240);
    };

    // ✅ Modal curtidas
    const temCurtidas = curtidasPostagem?.length > 0;

    const abrirModalCurtidas = () => {
        if (!temCurtidas) return;
        setMostrarModalCurtidas(true);
    };

    const fecharModalCurtidas = () => {
        setMostrarModalCurtidas(false);
        setErroCurtidas("");
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
                        Curtido por{" "}
                        <strong>
                            {curtidasPostagem.length}{" "}
                            <span
                                className={temCurtidas ? "linkCurtidas" : ""}
                                onClick={abrirModalCurtidas}
                                role={temCurtidas ? "button" : undefined}
                                aria-label={temCurtidas ? "Ver pessoas que curtiram" : undefined}
                            >
                                pessoas
                            </span>
                        </strong>
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

            {/* ✅ Modal de curtidas */}
            {mostrarModalCurtidas && (
                <div className="modalOverlay" onClick={fecharModalCurtidas}>
                    <div className="modalCurtidas" onClick={(e) => e.stopPropagation()}>
                        <div className="modalCurtidasHeader">
                            <h3>Curtidas</h3>
                            <button
                                className="fecharModalCurtidas"
                                onClick={fecharModalCurtidas}
                                aria-label="Fechar curtidas"
                                type="button"
                            >
                                ×
                            </button>
                        </div>

                        {carregandoCurtidas && (
                            <p className="modalCurtidasStatus">Carregando...</p>
                        )}

                        {!carregandoCurtidas && erroCurtidas && (
                            <p className="modalCurtidasStatus erro">{erroCurtidas}</p>
                        )}

                        {!carregandoCurtidas && !erroCurtidas && (
                            <div className="listaCurtidas">
                                {listaUsuariosCurtidas.length > 0 ? (
                                    listaUsuariosCurtidas.map((u) => (
                                        <Link href={`/perfil/${u.id}`} key={u.id}>
                                            <div className="itemCurtida" role="button">
                                                {u.avatar ? (
                                                    <Avatar src={u.avatar} />
                                                ) : (
                                                    <div className="avatarPlaceholder" />
                                                )}
                                                <span className="nomeCurtida">{u.nome}</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="modalCurtidasStatus">Nenhuma curtida encontrada.</p>
                                )}
                            </div>
                        )}
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