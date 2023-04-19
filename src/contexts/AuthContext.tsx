import { createContext, ReactNode, useState, useEffect } from 'react';

import { api } from '../services/apiClient';

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router';

import { toast } from 'react-toastify'


type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  recuperar: (credentials: RecuperarProps) => Promise<void>;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type RecuperarProps = {
  email: string;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)


export function signOut(){
  try{
    destroyCookie(undefined, '@nextauth.token')
    Router.push('/')
  }catch{
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user;

  useEffect(() => {

    // tentar pegar algo no cookie
    const { '@nextauth.token': token } = parseCookies();

    if(token){
      api.get('/me').then(response => {
        const { id, name, email } = response.data;

        setUser({
          id,
          name,
          email
        })

      })
      .catch(() => {
        //Se deu erro deslogamos o user.
        signOut();
      })
    }


  }, [])

  async function signIn({ email, password }: SignInProps){
    try{
      const response = await api.post('/session', {
        email,
        password
      })
      // console.log(response.data);

      const { id, name, token } = response.data;

      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUser({
        id,
        name,
        email,
      })

      //Passar para proximas requisiçoes o nosso token
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success('Logado com sucesso!')

      //Redirecionar o user para /dashboard
      Router.push('/dashboard')


    }catch(err){
      toast.error("Erro ao acessar!")
      console.log("ERRO AO ACESSAR ", err)
    }
  }


  async function recuperar({email}: RecuperarProps){
    try{

      Router.push('/')

    }catch(err){
      toast.error("Erro ao recuper senha!")
      console.log("erro ao recuper senha ", err)
    }
  }

  return(
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, recuperar }}>
      {children}
    </AuthContext.Provider>
  )
}