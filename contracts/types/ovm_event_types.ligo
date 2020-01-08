type event_params is
  | DepositedEvent of (address * nat)
  | SubmittedEvent of (nat * string)

type event is record
  block_height: nat;
  data: event_params;
end

type topic is string;
type topic_sorted_events is map(topic, list(event));

type l2_block_number is nat;
type events is map(l2_block_number, topic_sorted_events);

type event_action is record
  topic: string;
  params: event_params;
end