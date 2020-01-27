#include "../types/index.ligo"
#include "../types/ovm_event_types.ligo"
#include "../models/emit_event.ligo"

type submit_params is record
  block_number: nat;
  root: bytes;
end

function submit_action (const submit_params: submit_params; const s: ovm_storage) : context is
begin
  const commitment_storage: commitment_storage = s.commitment_storage;
  const l2_block_number: nat = submit_params.block_number;
  const root: bytes = submit_params.root;

  // Validation
  if source =/= commitment_storage.operator_address then failwith("source should be registered operator address") else skip;
  if l2_block_number =/= commitment_storage.current_block + 1n then failwith("block_number should be next block") else skip;


  // State Update
  commitment_storage.commitments[l2_block_number] := root;
  commitment_storage.current_block := l2_block_number;

  // Event
  // encode event params
  // please see https://github.com/cryptoeconomicslab/wakkanay/blob/f90e3fcfa0227c09d270f732ea9a03387d69456f/packages/contract/src/events/types/BlockSubmitted.ts#L9
  const submitted_event: event_params = list
    bytes_pack(l2_block_number);
    bytes_pack(root)
  end;

  s.events_storage := emit_event(s.events_storage, "BlockSubmitted", submitted_event);
  s.commitment_storage := commitment_storage
end with ((nil : list(operation)), s)
