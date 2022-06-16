import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head'
import Image from 'next/image';
import style from '../styles/Home.module.scss';
import { PaginationComponent } from '../components/pagination/index';
import { args } from '../config/api';
import { GetServerSideProps } from 'next';

interface IPropsComponent{
  list: []
  page: number
  total_pages: number
  search: boolean
  searchParam: string
}

export default function Home({
  list,
  page,
  total_pages,
  search,
  searchParam
}: IPropsComponent) {
  const [ responseDataApiTmdb, setResponseDataApiTmdb ] = useState('');
  const [ searchMovie, setSearchMovie ] = useState(searchParam)
  const [ savingValueSearchMovie, setSavingValueSearchMovie ] = useState<undefined | string>(undefined)
  const router = useRouter()

  function handleChange(event: React.ChangeEvent<unknown>, value: number) {
    if(searchMovie) {
      return router.push(`?search=${search}&page=${value}`)
    } else {
      return router.push(`?page=${value}`)
    }
  }

  function handlesubmitSearchMovie(event: FormEvent) {
    event.preventDefault()

    return router.push(`/?search=${searchMovie}&page=1`)
  }

  return (
    <main id={style.layouPage}>
      <Head>
        <title>movies</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      </Head>

      <section className={style['search-movie']}>
        <form onSubmit={handlesubmitSearchMovie}>
          <label htmlFor="searchMovieName">pesquise o filme que desejar</label>
          
          <div className={style.inputWrapper}>
            <input
              type="text"
              id="searchMovieName"
              onChange={(e) => setSearchMovie(e.target.value)}
              placeholder="Qual filme deseja buscar?"
            />
            <button type="submit">enviar</button>
          </div>
        </form>
      </section>

      <section className={style.moviesContainer}>
        <h2>Acompanhe as novidadades dos filmes mais visto no cinema </h2>


        <ul>
          { Object.entries(list).map(([key, value]) => {
            const { backdrop_path, title, overview , adult, vote_average, vote_count } = value
            
            return <li 
              key={key}
              className={style.movie}
            >
              <div className="image-movie">
                <Image 
                  src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
                  alt='imagem filme'
                  width={407.17}
                  height={300}
                  layout='fixed'
                  style={{
                    borderRadius: '10px 10px 0 0'
                  }}
                />
              </div>

              <div className={style['information-movie']}>
                <div className={style.description}>
                  <h2 style={{
                    color: 'black'
                  }}>
                    {title}
                  </h2>

                  <p>
                    { overview }
                  </p>
                </div>

                <div className={style.classification}>
                  <h3>classificação</h3>

                  <span>
                    { adult == false ? 'filme livre para todos os publicos' : 'filme não recomendado para menores de 18 anos'
                    }
                  </span>
                </div>

                <div className={style.vote}>
                  <span className='vote-average'>
                    <h3>média de votos</h3>

                    { vote_average }
                  </span>

                  <span className='vote-count'>
                    <h3>contagem de votos</h3>

                    {vote_count}
                  </span>

                </div>

                <small className={style['information-license']}>
                  *Não fornecemos os vídeo, somente as informações dos filmes*
                </small>
              </div>
            </li>
          })

          }
        </ul>
      </section>

      <PaginationComponent 
        page={page}
        totalPage={total_pages}
        handleChange={handleChange}
      />
    </main>
  )
}

export const getServerSideProps:GetServerSideProps = async ({
  query
}: {
  query: {
    page?: string,
    search?: string
  }
}) => {
  if(query.search) {
    const response = await axios.get(`${args.base_url}/search/movie?api_key=${args.key}&query=${query.search}&page=${query.page ? query.page : 1}&language=pt-BR`)

    const { results, page, total_pages} = (await response.data) as any
  
    return {
      props: {
        list: results,
        page,
        total_pages,
        searchParam: query.search
      }
    }
  } else {
    const response = await axios.get(`${args.base_url}/trending/movie/week?api_key=${args.key}&query=${query.search}&page=${query.page ? query.page : 1}&language=pt-BR`)

    const { results, page, total_pages } = (await response.data) as any

    return {
      props: {
        list: results,
        page,
        total_pages,
        searchParam: ''
      }
    }
  }
}