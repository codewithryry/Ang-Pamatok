import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArticleGrid } from '../components/ArticleGrid'
import { EmptyState } from '../components/EmptyState'
import { LoadingState } from '../components/LoadingState'
import { getPublishedArticles } from '../services/articles'

export const SearchPage = () => {
  const [params, setParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const query = params.get('q') || ''

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      const result = await getPublishedArticles({ search: query, limit: 24 })
      if (!active) return
      setArticles(result.data)
      setError(result.error)
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [query])

  return (
    <main className="container page-shell search-page">
      <header className="search-header">
        <span className="eyebrow">Ang sinupan</span>
        <h1>Hanapin ang mga akda</h1>
        <p>Hanapin ang mga ulat, pananaw, at akdang pampanitikan sa kalipunan ng ANG PAMATOK.</p>
      </header>
      <form className="search-box" role="search" onSubmit={(event) => {
        event.preventDefault()
        setParams({ q: event.currentTarget.elements.query.value.trim() })
      }}>
        <Search size={21} />
        <label className="sr-only" htmlFor="archive-search">Maghanap ng mga akda</label>
        <input id="archive-search" name="query" defaultValue={query} placeholder="Pamagat, paksa, o may-akda…" autoComplete="off" />
        <button className="button button--primary" type="submit">Hanapin</button>
      </form>
      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <div className="notice">{error}</div>
      ) : (
        <section>
          <div className="results-count">
            {query ? `${articles.length} ${articles.length === 1 ? 'akda ang tumugma' : 'akda ang tumugma'} sa “${query}”` : `${articles.length} pinakabagong akda`}
          </div>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} columns={3} />
          ) : (
            <EmptyState
              title={query ? 'Walang nakitang akda' : 'Walang laman ang sinupan'}
              description={query ? 'Subukan ang mas malawak na salita sa paghahanap.' : 'Dito lilitaw ang mga nailathalang akda.'}
            />
          )}
        </section>
      )}
    </main>
  )
}
