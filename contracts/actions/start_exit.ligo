#include "../models/emit_event.ligo"

function start_exit_action (const s: ovm_storage; const start_exit_params: start_exit_params) : context is
begin
  skip;
end with ((nil : list(operation)), s)
