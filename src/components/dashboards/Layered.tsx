import { useStore } from "effector-react"
import { dashboards } from "../../Store"
const Layered = () => {
  const store = useStore(dashboards);
  return (
    <div>
      Layered
      <pre>{JSON.stringify(store)}</pre>
    </div>
  )
}

export default Layered
