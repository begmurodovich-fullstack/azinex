import { CategoryProvider } from '../context/CategoryProvider'
import { CurrencyProvider } from '../context/CurrencyProvider'
import { ExpenseProvider } from '../context/ExpenseProvider'
import { Layout } from './Layout'

export function AppShell() {
  return (
    <ExpenseProvider>
      <CategoryProvider>
        <CurrencyProvider>
          <Layout />
        </CurrencyProvider>
      </CategoryProvider>
    </ExpenseProvider>
  )
}
