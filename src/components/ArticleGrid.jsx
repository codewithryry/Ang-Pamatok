import { ArticleCard } from './ArticleCard'

export const ArticleGrid = ({ articles, columns = 3, compact = false }) => (
  <div className={`article-grid article-grid--${columns} ${compact ? 'article-grid--compact' : ''}`}>
    {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
  </div>
)
