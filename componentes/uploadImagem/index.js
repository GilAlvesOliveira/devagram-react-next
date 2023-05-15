import { useEffect, useRef } from "react";

export function UploadImagem({
    className = '',
    setImagem,
    imagemPreview,
    imagemPreviewClassName = '',
    aoSetarAReferencia
}) {
    const referenciaInput = useRef(null);

    useEffect(() => {
        if(!aoSetarAReferencia) {
            return;
        }

        aoSetarAReferencia(referenciaInput?.current);
    }, [referenciaInput.current]);

    const abrirSeletorArquivos = () => {
        referenciaInput?.current?.click();
    }

    const aoAlterarImagem = () => {
        if (!referenciaInput?.current?.files?.lenght) {
            return;
        }
        const arquivo = referenciaInput?.current?.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(arquivo);
        fileReader.onloadend = () => {
            setImagem({
                preview:fileReader.result,
                arquivo
            });
        }
    }

    return (
        <div className={`uploadImagemContainer ${className}`} onClick={abrirSeletorArquivos}>
        {imagemPreview && (
            <div className="imagemPreviewContainer">
                <img
                    src={imagemPreview}
                    alt='imagem preview'
                    className={imagemPreviewClassName}
                />
            </div>
        )}
        <input 
            type='file' 
            className='oculto' 
            accept="image/*" 
            ref={referenciaInput}
            onChange={aoAlterarImagem}
        />
        </div>
    );
}