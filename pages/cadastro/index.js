import Link from "next/link";
import Image from "next/image";
import Botao from "@/componentes/botao";
import imagemLogo from "../../public/imagens/logo.svg";
import imagemUsuarioAtivo from "../../public/imagens/usuarioAtivo.svg";
import imagemAvatar from "../../public/imagens/avatar.svg";
import imagemEnvelope from "../../public/imagens/envelope.svg";
import imagemChave from "../../public/imagens/chave.svg";
import InputPublico from "@/componentes/inputPublico";
import { UploadImagem } from "../../componentes/uploadImagem";
import { useState } from "react";
import {validarEmail, validarSenha, validarNome, validarConfirmacaoSenha} from "../../utils/validadores";

export default function Cadastro() {
    const [imagem, setImagem] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacaosenha, setConfirmacaoSenha] = useState("");

    return (
        <section className={`paginaCadastro paginaPublica`}>
            <div className="logoContainer desktop">
                <Image
                    src={imagemLogo}
                    alt="logotipo"
                    layout="fill"
                    className="logo"
                />
            </div>

            <div className="conteudoPaginaPublica">
                <form>
                    <UploadImagem
                        imagemPreviewClassName="avatar avatarPreview"
                        imagemPreview={imagem?.preview || imagemAvatar.src}
                        setImagem={setImagem}
                    />

                    <InputPublico
                        imagem={imagemUsuarioAtivo}
                        texto="Nome completo"
                        tipo="text"
                        aoAlterarValor={e => setNome(e.target.value)}
                        valor={nome}
                    />
                    <InputPublico
                        imagem={imagemEnvelope}
                        texto="E-mail"
                        tipo="email"
                        aoAlterarValor={e => setEmail(e.target.value)}
                        valor={email}
                    />
                    
                      <InputPublico
                        imagem={imagemChave}
                        texto="Senha"
                        tipo="password"
                        aoAlterarValor={e => setSenha(e.target.value)}
                        valor={senha}
                    />

                    <InputPublico
                        imagem={imagemChave}
                        texto="Confirmar senha"
                        tipo="password"
                        aoAlterarValor={e => setConfirmacaoSenha(e.target.value)}
                        valor={confirmacaosenha}
                    />

                    <Botao
                        texto="Cadastrar"
                        tipo="submit"
                        desabilitado={false}
                    />
                </form>
                <div className="rodapePaginaPublica">
                    <p>Já possui uma conta?</p>
                    <Link href="/">Faça seu login agora!</Link>
                </div>
            </div>
            </section>
    );
}