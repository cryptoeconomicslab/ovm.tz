#include "./get_checkpoint_id.ligo"

function store_checkpoint(
  const s: ovm_storage;
  const token_type: address;
  const checkpoint: checkpoint
) : ovm_storage is
begin
  const deposit_storage : deposit_storage = 
  case s.deposit_storages[token_type] of
    Some(deposit_storage) -> deposit_storage
  | None -> ( failwith("No token type.") : deposit_storage )
  end;
  const checkpoint_id: bytes = get_checkpoint_id(checkpoint);

  deposit_storage.checkpoints[checkpoint_id] := checkpoint;
  s.deposit_storages[token_type] := deposit_storage;
end with s;