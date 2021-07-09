export const getActiveRouteState = state => {
  if (!state) return null;
  if (state.state) return getActiveRouteState(state.state);
  return 'index' in state
    ? getActiveRouteState(state.routes[state.index])
    : state;
};
