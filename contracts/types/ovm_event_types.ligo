#include "ovm_primitive_types.ligo"

type event_params is
  | CheckpointFinalizedEvent of (address * bytes * checkpoint)
  | SubmittedEvent of (nat * string)

type event is record
  block_height: nat;
  data: event_params;
end

type topic is string;
type topic_sorted_events is map(topic, list(event));

type l2_block_number is nat;
type events is map(l2_block_number, topic_sorted_events);
