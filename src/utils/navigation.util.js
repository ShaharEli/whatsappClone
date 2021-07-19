import React from 'react';

export const getActiveRouteState = state => {
  if (!state) return null;
  if (state.state) return getActiveRouteState(state.state);
  return 'index' in state
    ? getActiveRouteState(state.routes[state.index])
    : state;
};

export const navigationRef = React.createRef();
export const navigate = (to, params) =>
  navigationRef?.current?.navigate(to, params);

export const getRouteName = () =>
  navigationRef?.current &&
  getActiveRouteState(navigationRef.current.dangerouslyGetState()).name;
