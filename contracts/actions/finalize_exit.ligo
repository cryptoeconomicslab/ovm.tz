#include "../types/index.ligo"

type finalize_exit_params is record
  token_type: token_type;
  exit_property: property;
  deposited_range_id: nat;
end

function finalize_exit_action(
  const finalize_exit_params: finalize_exit_params;
  const s: ovm_storage
) : context is
begin skip end with ((nil : ops), s)
