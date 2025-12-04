import { useWailsEvents } from './hooks/useWailsEvents'
import AppRoutes from './routes/AppRoutes'

function App() {
    useWailsEvents()

    return (<AppRoutes/>)
}

export default App
