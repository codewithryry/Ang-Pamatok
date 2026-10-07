import { useParams } from 'react-router-dom'
import { ArticleEditor } from '../components/ArticleEditor'

export const EditorArticlePage = () => {
  const { id } = useParams()
  return <ArticleEditor edit={Boolean(id)} />
}
