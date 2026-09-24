import { useState } from 'react'
import { 
  ConfigProvider,
  Button
} from 'antd'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ConfigProvider>
      <Button type="primary">Primary Button</Button>
    </ConfigProvider>
    </>
  )
}

export default App
