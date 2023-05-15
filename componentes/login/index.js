import InputPublico from "../inputPublico";
import Image from "next/image";
import imagemEnvelope from "../../public/imagens/envelope.svg";
import imagemChave from "../../public/imagens/chave.svg";
import imagemLogo from "../../public/imagens/logo.svg";
import Botao from "../botao";

export default function Login() {
    return (
        <section className={`paginaLogin paginaPublica`}>
            <div className="logoContainer">
                <Image
                    src={imagemLogo}
                    alt="logotipo"
                    layout="fill"
                />
            </div>

            <div className="conteudoPaginaPublica">
                <form>
                    <InputPublico
                        imagem={imagemEnvelope}
                        texto="E-mail"
                        tipo="email"
                        aoAlterarValor={() => console.log('digitando email')}
                    />

                    <InputPublico
                        imagem={imagemChave}
                        texto="Senha"
                        tipo="passoword"
                        aoAlterarValor={() => console.log('digitando senha')}
                    />

                    <Botao
                        texto={'Login'}
                        tipo="submit"
                        desabilitado={false}
                    />
                </form>

                <div className="rodapePaginaPublica">
                    <p>Não possui uma conta?</p>
                </div>
            </div>
        </section>
    );
}