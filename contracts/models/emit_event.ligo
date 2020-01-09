#include "../types/ovm_event_types.ligo"

function emit_event(
  const event_receiver_address: address;
  const topic: string;
  const params: event_params
) : operation is
begin
  const event_receiver : contract(event_action) = get_contract(event_receiver_address);
  const event: event_action = record
    topic = topic;
    params = params;
  end;  
  const op: operation = transaction(event, 0mutez, event_receiver);
end with op;
