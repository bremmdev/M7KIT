import { render } from '@testing-library/react'
import { SkipLink } from './SkipLink'

describe('SkipLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SkipLink />)
    expect(baseElement).toBeTruthy()
  })
})
