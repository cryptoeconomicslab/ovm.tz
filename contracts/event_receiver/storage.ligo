#include "../types/ovm_event_types.ligo"

type event_receiver_storage is record
  ts: timestamp;
  events: topic_sorted_events;
end
