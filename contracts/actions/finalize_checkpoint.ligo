#include "../types/index.ligo"
#include "../models/get_checkpoint_id.ligo"
#include "../utils/primitive_coder.ligo"

type finalize_checkpoint_params is record
  token_type: token_type;
  checkpoint_property: property;
end

function finalize_checkpoint_action(
  const finalize_checkpoint_params: finalize_checkpoint_params;
  const s: ovm_storage
) : context is
begin

  // TODO: check adjudication.isDecided(checkpoint)
  const checkpoint: checkpoint = record
    subrange = decode_range(get_force(0n, finalize_checkpoint_params.checkpoint_property.inputs));
    state_update = decode_property(get_force(1n, finalize_checkpoint_params.checkpoint_property.inputs));
  end;

  s := store_checkpoint(s, finalize_checkpoint_params.token_type, checkpoint);

  const checkpoint_finalized_event: event_params = CheckpointFinalizedEvent(
    (
      finalize_checkpoint_params.token_type,
      get_checkpoint_id(checkpoint),
      checkpoint
    )
  );

  s.events_storage := emit_event(s.events_storage, "CheckpointFinalized", checkpoint_finalized_event);
end with ((nil : ops), s)
