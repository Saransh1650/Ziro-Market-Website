import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import SummaryBox from './SummaryBox'

const summary = 'Zomato listed in 2021 with no earnings at all.'

describe('SummaryBox', () => {
  it('hides summary content by default', () => {
    render(<SummaryBox summary={summary} />)
    expect(screen.queryByText(summary)).not.toBeInTheDocument()
  })

  it('shows summary content after toggle is switched on', async () => {
    render(<SummaryBox summary={summary} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByText(summary)).toBeInTheDocument()
  })

  it('hides summary again after toggling off', async () => {
    render(<SummaryBox summary={summary} />)
    await userEvent.click(screen.getByRole('checkbox'))
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByText(summary)).not.toBeInTheDocument()
  })
})
