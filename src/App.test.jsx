import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('ANG PAMATOK application', () => {
  it('renders the public homepage without a runtime exception', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(screen.getByRole('link', { name: /ANG PAMATOK/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Stories from the campus/i })).toBeInTheDocument()
  })

  it('renders the category page for a public route', () => {
    window.history.replaceState({}, '', '/news')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'News' })).toBeInTheDocument()
  })
})
