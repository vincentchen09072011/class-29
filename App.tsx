import { useCallback, useEffect, useState } from 'react';

const api_read_access_token = import.meta.env.VITE_API_READ_ACCESS_TOKEN;

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path?: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

function App() {
  const [movies,setmovies]= useState<Movie[]>([])
  const [pagination, setpagination] = useState({
    page: 1,
    total_pages: 1,
    total_results: 0,
  })
  const [searchQurey, setSearchQuery] = useState('')

  const searchMovies = useCallback(async () => {
    const data = await fetch(
      'https://api.themoviedb.org/3/search/movie?' + 
        new URLSearchParams({
          page: pagination.page.toString(),
          query: searchQurey,
        }),
      {
        headers: {
          Authorization: `Bearer ${api_read_access_token}`,
        },
      }
    ).then((res) => res.json())
    setmovies(data.results)
    setpagination({
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    })
  }, [pagination.page, searchQurey])

  const fetchmovie = useCallback(async () => {
    const data = await fetch('https://api.themoviedb.org/3/movie/popular?' + new URLSearchParams({page:pagination.page.toString()}), {
      headers: {
        Authorization: `Bearer ${api_read_access_token}`,
      },

    }).then((res) => res.json())
    setmovies(data.results)
    setpagination({
      page: data.page,
      total_pages: data.total_pages,
      total_results: data.total_results
    })

  }, [pagination.page])
  const handlechangepage = useCallback((page:number) => {
    setpagination({
      ...pagination,
      page,
    })
  }, [pagination])
  useEffect(() => {
    if (searchQurey) {
      searchMovies()
    } else {
      fetchmovie()
    }
  }, [pagination.page, searchMovies, fetchmovie, searchQurey])
  const firstpage = '<<'
  const lastpage = '>>'
  const minusPage = '<'
  const addpage = '>'
  return (
    <div className='flex max-w-4xl py-4 mx-auto'>
      <div className=''>
      <div>

      <label htmlFor="searchQuery  className='block text-sm font-medium leading-6 text-gray-900">search by title</label>
      <div className='mt-2'>

      
      <input placeholder='Avengers' className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' id='searchQuery'  type="text" value={searchQurey} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
        if (e.key === "Enter") {if (searchQurey) {
          searchMovies()
        }else {
          fetchmovie()
        }}
      }}/>
      </div>
      </div>
      <h1 className=''>Popular movies this week</h1>
      <div className='grid grid-cols-4 grid-rows-5 px-4 gap-2 max-w-4xl mx-auto'>
        {
          movies.map((movie,index) => (
            <div key={index} className=''>
              <img className='' src={'https:///image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} />
              <div className=''>

                <p className=''>{movie.title}</p>
              </div>
              
              
            </div>
          ))
          }
      </div>
      <div className='justify-center flex'>
        
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded' onClick={() => handlechangepage(pagination.page = 1)}>{firstpage}</button>
        <button disabled={pagination.page === 1} onClick={() => handlechangepage(pagination.page - 1)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>{minusPage}</button>
        <p className='text-center mx-4 font-bold'> Page {pagination.page} of {pagination.total_pages}</p>
        <button disabled={pagination.page === pagination.total_pages} onClick={() => handlechangepage(pagination.page + 1)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>{addpage}</button>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded'onClick={() => handlechangepage(pagination.page = pagination.total_pages)}>{lastpage}</button>
      </div>
      </div>
    </div>
  )
}
export default App