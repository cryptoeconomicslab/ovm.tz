#include "../types/ovm_event_types.ligo"

function emit_event(const s: ovm_storage; const topic: string; const params: event_params) : ovm_storage is
begin
  const event: event = record
    block_height = 0n;//TODO:level
    data = params;
  end;

  const topic_sorted_events: topic_sorted_events = map
    topic -> list event end;
  end;

  // TODO: should create a event manager method because will override the other events
  s.events[s.current_block] := topic_sorted_events;
end with s;