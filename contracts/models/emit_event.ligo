#include "../types/ovm_event_types.ligo"

function dry_tx(const placeholder:unit) : operation is 
begin skip end with transaction(unit, 0mutez, ( get_contract(source) : contract(unit) ));

function emit_event(
  const event_receiver_address: address;
  const topic: string;
  const params: event_params
) : operation is
begin
  const is_prod:bool = False; //TODO: From storage.is_prod

  const event: event_action = record
    topic = topic;
    params = params;
  end;

  const op: operation = if is_prod then
    transaction(event, 0mutez, ( get_contract(event_receiver_address) : contract(event_action) ));
  else dry_tx(unit);
end with op;
