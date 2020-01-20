#include "../types/index.ligo"

type claim_property_params is record
  claim: property;
end

function claim_property_action(
  const claim_property_params: claim_property_params;
  const s: ovm_storage
) : context is
begin skip end with ((nil : ops), s)
