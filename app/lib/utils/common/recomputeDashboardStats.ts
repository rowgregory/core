import { recomputeAllStats } from '@/app/redux/features/dashboardSlice'
import { store } from '@/app/redux/store'

export const recomputeDashboardStats = ({ id, isAdmin }: { id: string | undefined; isAdmin: boolean | undefined }) => {
  const state = store.getState()
  store.dispatch(
    recomputeAllStats({
      userId: id,
      isAdmin: isAdmin,
      users: state.user.users,
      anchors: state.anchor.anchors,
      treasureMaps: state.treasureMap.treasureMaps,
      parleys: state.parley.parleys
    })
  )
}
