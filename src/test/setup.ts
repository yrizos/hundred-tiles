import { cleanup } from '@testing-library/react'
import { afterEach, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

afterEach(() => {
  cleanup()
})
