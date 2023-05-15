import Head from 'next/head';
import Image from 'next/image';
import Botao from '../componentes/botao';
import Avatar from '../componentes/avatar';
import { UploadImagem } from '../componentes/uploadImagem';
import { useRef, useState } from 'react';

export default function Home() {
  const [imagem, setImage] = useState(null);
  const referenciaInput = useRef(null);

  return (
    <>
      <h1>Ola mundo!</h1>
      <button onClick={() => referenciaInput?.current?.click()}>abrir seletor de arquivos</button>

      <UploadImagem 
      setImagem={setImage} 
      imagemPreview={imagem?.preview} 
      aoSetarAReferencia={(ref) => referenciaInput.current = ref}
      />

      <div style={{width: 200}}>
        <Avatar />
        <Botao texto={'Login'} cor='primaria' manipularClique={() => console.log('Botao clicado')} />
      </div>
    </>
  )
}
