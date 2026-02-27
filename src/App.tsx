import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomeScreen } from './screens/HomeScreen'
import { AllTasksScreen } from './screens/AllTasksScreen'
import { AddTaskScreen } from './screens/AddTaskScreen'
import { TaskDetailScreen } from './screens/TaskDetailScreen'
import { SettingsScreen } from './screens/SettingsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/tasks" element={<AllTasksScreen />} />
          <Route path="/add" element={<AddTaskScreen />} />
          <Route path="/task/:id" element={<TaskDetailScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
