import { useState, FormEvent, useRef } from 'react'
import Head from "next/head"
import {Header} from '../../components/Header'
import styles from './styles.module.scss'

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'

import { canSSRAuth } from '../../utils/canSSRAuth'

import Papa from "papaparse";


export default function Dashboard(){
  const [data_lancamento, setData_lancamento] = useState('')
  const [CsvFile,setCsvFile] = useState()

  const submit  = () => {
    const file = CsvFile;
    const reader = new FileReader();

    reader.onload = function(e) {
      const text = e.target.result;
      console.log(text)

      reader.readAsText(file);
    }
  }

  async function handleRegister(event: FormEvent){


/*
    const apiClient = setupAPIClient();
    await apiClient.post('/info', {
      data_lancamento: data_lancamento
    })
*/
    toast.success('Arquivo enviado com sucesso!')
    setData_lancamento('');

  }


  return(
    <>
    <Head>
      <title>Upload de csv - Test trampay</title>
    </Head>
    <div>
      <Header/>

      <main className={styles.container}>
        <h1>Upload de csv</h1>

        <form className={styles.form} >
          <input 
          type='file' 
          accept='.csv'
          className={styles.input}
          onChange={(e) => 
            setCsvFile(e[0])
        }
        />
   

          <button className={styles.buttonAdd}
          onClick={(e) => {
            e.preventDefault()
            if(CsvFile)submit()
         
          }}
          >
            Enviar
          </button>

        </form>

      </main>
    </div>
    </>
  )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

  return {
    props: {}
  }

})