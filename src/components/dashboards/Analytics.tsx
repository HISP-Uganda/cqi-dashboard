import { useStore } from "effector-react"
import { dashboards } from "../../Store"

const Analytics = () => {
  const store = useStore(dashboards);
  return (
    <div>
      Analytics
      <pre>{JSON.stringify(store)}</pre>
    </div>
  )
}

export default Analytics
