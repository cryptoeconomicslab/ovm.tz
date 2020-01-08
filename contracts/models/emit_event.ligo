#include "../types/ovm_event_types.ligo"

function emit_event(
  const topic: string;
  const params: event_params
) : operation is
begin
  const deposit_reciever : contract(event_action) = get_contract(source);
  const event: event_action = record
    topic = topic;
    params = params;
  end;  
  const op: operation = transaction(event, 0mutez, deposit_reciever);
end with op;
