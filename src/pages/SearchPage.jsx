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
        <span className="eyebrow">The archive</span>
        <h1>Search stories</h1>
        <p>Find reporting, perspectives, and literary work from the ANG PAMATOK collection.</p>
      </header>
      <form className="search-box" role="search" onSubmit={(event) => {
        event.preventDefault()
        setParams({ q: event.currentTarget.elements.query.value.trim() })
      }}>
        <Search size={21} />
        <label className="sr-only" htmlFor="archive-search">Search articles</label>
        <input id="archive-search" name="query" defaultValue={query} placeholder="Search by title, topic, author…" autoComplete="off" />
        <button className="button button--primary" type="submit">Search</button>
      </form>
      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <div className="notice">{error}</div>
      ) : (
        <section>
          <div className="results-count">
            {query ? `${articles.length} ${articles.length === 1 ? 'result' : 'results'} for “${query}”` : `${articles.length} latest stories`}
          </div>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} columns={3} />
          ) : (
            <EmptyState
              title={query ? 'No stories found' : 'The archive is empty'}
              description={query ? 'Try a broader search term.' : 'Published stories will appear here.'}
            />
          )}
        </section>
      )}
    </main>
  )
}
