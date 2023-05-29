import Avatar from "../avatar";

export function FazerComentario({ usuarioLogado }) {
    return (
        <div className="containerFazerComentario">
            <Avatar src={usuarioLogado.Avatar} />
            <textarea placeholder="Adicione um comentario..."></textarea>
        </div>
    )
}