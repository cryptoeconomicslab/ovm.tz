#include "../models/create_checkpoint.ligo"
#include "../models/extend_deposited_ranges.ligo"
#include "../models/emit_event.ligo"

function deposit_action (const s: ovm_storage; const deposit_params: deposit_params) : context is
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

  const extended_tuple: (ovm_storage * range) = extend_deposited_ranges(s, deposit_params);
  s := extended_tuple.0;
  const deposited_range: range = extended_tuple.1;

  // create state_update
  const state_update: state_update = record
    property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);//TODO: Ownership predicate address
      input = "tz1OwnerN5GSez2ndXXeDX6LgUDvLzPLqgYV";//TODO: sender address?
    end;
    range = deposited_range;
    plasma_block_number = s.current_block;
    deposit_address = deposit_params.token_type;
  end;

  s := create_checkpoint(s, deposit_params, state_update);

  // Event
  s := emit_event(s, "Deposited", "{token_type:" ^ deposit_params.token_type_string ^ ",amount:" ^ deposit_params.amount_string ^ "}");
end with ((ops:ops), s)
