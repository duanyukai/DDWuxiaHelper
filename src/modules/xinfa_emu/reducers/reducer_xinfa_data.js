import { SELECT_XINFA, HANDLE_ERROR } from "../actions/index";

export default function(state = {
  name: null,
  reinforce: [],
  skills: [],
  brkthruLevels: []
}, action) {
  if(action.error) {
    action.type = HANDLE_ERROR;
  }

  switch (action.type) {
    case SELECT_XINFA:
      if(!action.type)
        ;
      return action.payload;
    case HANDLE_ERROR:
      alert("获取失败，请刷新重试");
      return state;
  }
  return state;
}
