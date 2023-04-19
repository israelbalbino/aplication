import { useState, FormEvent, useContext  } from 'react'

import Head from 'next/head'
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import Link from 'next/link';

export default function Recuperar() {
  const {recuperar}  = useContext(AuthContext);

  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent){
    event.preventDefault();

    if(email === ''){
      toast.error("Preencha com seu E-mail")
      return;
    }

    let data = {email};

    await recuperar(data)

    setLoading(false);

  }

  return (
    <>
    <Head>
      <title>Recupere sua senha - Test trampay</title> 
    </Head>
    <div className={styles.containerCenter}>
      
    <span className={styles.text}>Recupere sua senha - Test trampay</span>

      <div className={styles.login}>
      

        <form onSubmit={handleSignUp}>
       

          <Input
            placeholder="Digite seu email"
            type="text"
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
          />

    
          
          <Button
            type="submit"
            loading={loading}
          >
            Recuperar
          </Button>
        </form>

        <Link href="/">
           <a className={styles.text}>Faça login!</a>
        </Link>

      </div>
    </div>
    </>
  )
}
