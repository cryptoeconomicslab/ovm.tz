#include "./storage.ligo"
#include "../types/ovm_event_types.ligo"

function store_event(
  const s: event_receiver_storage;
  const topic: string;
  const params: event_params
) : event_receiver_storage is
begin
  const event: event = record
    block_height = 0n;
    data = params;
  end;
  if (s.ts < now) then begin
    const topic_sorted_events: topic_sorted_events = map
      topic -> list event end;
    end;
    s.events := topic_sorted_events
  end else begin
    s.events[(topic)] := cons(event, get_force((topic: string), s.events));
  end
end with s;
