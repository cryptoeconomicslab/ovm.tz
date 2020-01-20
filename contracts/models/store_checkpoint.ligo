#include "./get_checkpoint_id.ligo"

function store_checkpoint(
  const s: ovm_storage;
  const token_type: address;
  const checkpoint: checkpoint
) : ovm_storage is
begin
  const storage_branch : storage_branch = get_force(token_type, s.branches);
  const checkpoint_id: bytes = get_checkpoint_id(checkpoint);

  storage_branch.checkpoints[checkpoint_id] := checkpoint;
  s.branches[token_type] := storage_branch;
end with s;