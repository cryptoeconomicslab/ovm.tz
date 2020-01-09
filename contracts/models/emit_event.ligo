#include "../types/ovm_event_types.ligo"

function emit_event(
  const event_receiver_address: address;
  const topic: string;
  const params: event_params
) : operation is
begin
  const isDryRun:bool = True;
  const op: operation = if isDryRun then
    transaction(unit, 0mutez, ( get_contract(source) : contract(unit) ));
  else
    transaction(record
      topic = topic;
      params = params;
    end, 0mutez, ( get_contract(event_receiver_address) : contract(event_action) ));

end with op;
