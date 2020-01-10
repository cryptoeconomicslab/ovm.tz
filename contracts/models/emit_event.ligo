#include "../types/index.ligo"

function emit_event(
  const s: events_storage;
  const topic: string;
  const params: event_params
) : events_storage is
begin
  const event: event = record
    block_height = 0n;
    data = params;
  end;
  // TODO: use level
  const level: timestamp = now;
  if (s.ts < level) then begin
    const topic_sorted_events: topic_sorted_events = map
      topic -> list event end;
    end;
    s.events := topic_sorted_events;
    s.ts := level;
  end else begin
    const topic_event_opt : option(list(event)) = s.events[(topic: string)];
    s.events[(topic)] := case topic_event_opt of 
        | None -> list event end
        | Some(events) -> cons(event, events)
    end;
  end
end with s;
