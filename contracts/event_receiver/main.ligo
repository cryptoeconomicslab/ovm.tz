#include "./store_event.ligo"
#include "./storage.ligo"

function main (
  const action: event_action;
  const s: event_receiver_storage
) : (list(operation) * event_receiver_storage) is
  block {
    skip
  } with
  ((nil : list(operation)), store_event(s, action.topic, action.params))
