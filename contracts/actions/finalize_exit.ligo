#include "../models/emit_event.ligo"

function finalize_exit_action (const s: ovm_storage; const finalize_exit_params: finalize_exit_params) : context is
begin
  skip;
end with ((nil : list(operation)), s)
