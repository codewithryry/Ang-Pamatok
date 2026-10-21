import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  window.history.replaceState({}, '', '/')
})

describe('ANG PAMATOK application', () => {
  it('renders the public homepage without a runtime exception', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    expect(screen.getAllByRole('link', { name: 'ANG PAMATOK, tahanan' })).toHaveLength(2)
    expect(screen.getByRole('heading', { name: /Salamin ng katotohanan, ugat ng kamalayan/i })).toBeInTheDocument()
  })

  it('opens public category routes with the site header and footer', () => {
    window.history.replaceState({}, '', '/balita')
    render(<App />)

    expect(document.querySelector('.site-header')).toBeInTheDocument()
    expect(document.querySelector('.site-footer')).toBeInTheDocument()
  })

  it('opens the about page', () => {
    window.history.replaceState({}, '', '/about')
    render(<App />)

    expect(document.querySelector('.site-footer')).toBeInTheDocument()
  })

  it('keeps the profile, theme, and menu controls in the mobile header', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    const mobileHeader = document.querySelector('.masthead')

    expect(within(mobileHeader).getByRole('button', { name: 'Account options' })).toBeInTheDocument()
    expect(within(mobileHeader).getByRole('button', { name: 'Gawing madilim ang anyo' })).toBeInTheDocument()
    expect(within(mobileHeader).getByRole('button', { name: 'Buksan ang talaan' })).toBeInTheDocument()
  })
  it('shows Back to home on login and signup pages', () => {
    window.history.replaceState({}, '', '/login')
    render(<App />)
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')

    window.history.replaceState({}, '', '/register')
    cleanup()
    render(<App />)
    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/')
  })
  it('shows the search action inside the mobile menu', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Buksan ang talaan' }))
    const mobileMenu = document.querySelector('.mobile-menu')

    expect(within(mobileMenu).getByRole('button', { name: 'Maghanap ng mga akda...' })).toBeInTheDocument()
  })

  it('does not show the subscribe action in the mobile menu', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Buksan ang talaan' }))
    const mobileMenu = document.querySelector('.mobile-menu')

    expect(within(mobileMenu).queryByRole('button', { name: 'SUBSCRIBE' })).not.toBeInTheDocument()
  })

  it('opens and closes the account options menu', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Account options' }))
    const accountPanel = within(screen.getByText('Welcome to Ang Pamatok').closest('.account-menu__panel'))
    expect(accountPanel.getByText('Access your account')).toBeInTheDocument()
    expect(accountPanel.getByText('Create a new account')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Welcome to Ang Pamatok')).not.toBeInTheDocument()
  })

  it('keeps account links out of the footer', () => {
    window.history.replaceState({}, '', '/')
    render(<App />)

    const footer = within(screen.getByRole('contentinfo'))
    expect(footer.queryByRole('link', { name: /Log in|Sign up/ })).not.toBeInTheDocument()
  })
})
