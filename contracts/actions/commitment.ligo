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
  const submitted_event: event_params = SubmittedEvent((
    l2_block_number,
    root
  ));

  s.events_storage := emit_event(s.events_storage, "BlockSubmitted", submitted_event);
  s.commitment_storage := commitment_storage
end with ((nil : list(operation)), s)
