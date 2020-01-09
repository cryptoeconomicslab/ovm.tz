#include "../models/create_deposit_checkpoint.ligo"
#include "../models/extend_deposited_ranges.ligo"
#include "../models/emit_event.ligo"

function deposit_action (const deposit_params: deposit_params; const s: ovm_storage) : context is
begin
  // TODO: deposit_params.token_type isn't really working here
  // and only the tez is working here. custom token validation logic will be required later.
  if deposit_params.amount <= 0n
    then failwith("Insufficient fund");
  else skip;

  const storage_branch : storage_branch = get_force(deposit_params.token_type, s.branches);

  // send money to deposit contract
  const deposit_reciever : contract(unit) = get_contract(source);
  const op: operation = transaction(unit, amount, deposit_reciever);
  const ops: ops = list op end;

  const deposited_range : range = record
    start_ = storage_branch.total_deposited;
    end_ = storage_branch.total_deposited + deposit_params.amount;
  end;

  // create state_update
  const state_update: state_update = record
    property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);//TODO: Ownership predicate address
      inputs = map 0n -> "tz1OwnerN5GSez2ndXXeDX6LgUDvLzPLqgYV"; end;//TODO: sender address?
    end;
    range = deposited_range;
    plasma_block_number = s.current_block;
    deposit_address = deposit_params.token_type;
  end;

  s := create_deposit_checkpoint(s, deposit_params, state_update);
  s := extend_deposited_ranges(s, deposit_params);

  // Event
  
  const deposited_event: event_params = DepositedEvent(
    (
    deposit_params.token_type,
    deposit_params.amount
    )
  );

  ops := cons(emit_event(s.event_receiver_address, "Deposited", deposited_event), ops);
end with ((ops:ops), s)
