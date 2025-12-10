// utils/optimisticUpdates.js
export const createOptimisticHandlers = (entityConfig: {
  responseKey?: any
  addAction?: any
  updateAction?: any
  removeAction?: any
  getEntityFromState?: any
}) => {
  const { addAction, updateAction, removeAction, getEntityFromState } = entityConfig

  const handleCreate =
    (dispatch: (arg0: any) => void) =>
    async (data: any, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const tempId = `temp-${Date.now()}`
      const optimisticEntity = { ...data, id: tempId }

      dispatch(addAction(optimisticEntity))

      try {
        const { data: response } = await queryFulfilled
        dispatch(
          updateAction({
            findById: tempId,
            replaceWith: response[entityConfig.responseKey]
          })
        )
      } catch {
        dispatch(removeAction(tempId))
      }
    }

  const handleUpdate =
    (dispatch: (arg0: any) => void, getState: () => any) =>
    async (updateData: { [x: string]: any; id: any }, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const { id, ...updateFields } = updateData // Extract id separately
      const currentState = getState()
      const originalEntity = getEntityFromState(currentState, id)

      // Apply optimistic update - keep the original id
      dispatch(
        updateAction({
          ...originalEntity, // Original entity data
          ...updateFields, // New field updates (without id)
          id: id // Explicitly keep the same id
        })
      )

      try {
        const { data: response } = await queryFulfilled
        dispatch(
          updateAction({
            findById: id, // Use the id to find
            replaceWith: response[entityConfig.responseKey]
          })
        )
      } catch {
        if (originalEntity) {
          dispatch(
            updateAction({
              findById: id,
              replaceWith: originalEntity
            })
          )
        }
      }
    }

  const handleDelete =
    (dispatch: (arg0: any) => void, getState: () => any) =>
    async (deleteData: { id: any }, queryFulfilled: PromiseLike<{ data: any }> | { data: any }) => {
      const { id } = deleteData
      const currentState = getState()
      const originalEntity = getEntityFromState(currentState, id)

      if (!originalEntity) {
        return
      }

      // Apply optimistic delete
      dispatch(removeAction(id))

      try {
        await queryFulfilled
      } catch {
        if (originalEntity) {
          dispatch(
            updateAction({
              findById: id,
              replaceWith: originalEntity
            })
          )
        }
      }
    }

  return { handleCreate, handleUpdate, handleDelete }
}
