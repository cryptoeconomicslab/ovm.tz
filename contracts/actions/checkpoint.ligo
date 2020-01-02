#include "../models/emit_event.ligo"

function checkpoint_action (const s: ovm_storage; const checkpoint_params: checkpoint_params) : context is
begin
  skip;
end with ((nil : list(operation)), s)
